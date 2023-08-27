import { log4TSProvider } from '../../config';
import { PUBLIC_DIRECTORY_ABI } from '../../constants/lacchain/public.directory.abi';
import { Wallet, ethers } from 'ethers';
import { GasModelProvider, GasModelSigner } from '@lacchain/gas-model-provider';
import { Member } from 'src/interfaces/publc-directory/member';
import { Interface } from 'ethers/lib/utils';
import { LacchainLib } from '../lacchain/lacchain-ethers';
import {
  IEthereumTransactionResponse,
  ITransaction
} from 'src/interfaces/ethereum/transaction';
import { BadRequestError } from 'routing-controllers';
import { ErrorsMessages } from '@constants/errorMessages';

export class PublicDirectoryBase {
  private publicDirectory: ethers.Contract;
  private readonly lacchainLib: LacchainLib;
  log = log4TSProvider.getLogger('PublicDirectoryBaseInterface');
  constructor(
    publicDirectoryAddress: string,
    rpcUrl: string,
    nodeAddress: string
  ) {
    const key = Wallet.createRandom().privateKey;
    const provider = this.configureProvider(rpcUrl, key, nodeAddress);
    this.publicDirectory = new ethers.Contract(
      publicDirectoryAddress,
      PUBLIC_DIRECTORY_ABI,
      provider
    );
    this.lacchainLib = new LacchainLib(nodeAddress, rpcUrl);
  }

  async owner(): Promise<string> {
    return this.publicDirectory.owner();
  }

  async addMember(
    member: Member,
    managerAddress: string
  ): Promise<IEthereumTransactionResponse> {
    const methodName = 'addMember';
    const methodSignature = [
      `function ${methodName}(tuple(string did, 
        uint256 exp, bool expires,
        address chainOfTrustAddress,bytes rawData) member) external`
    ];
    const methodInterface = new Interface(methodSignature);
    const encodedData = methodInterface.encodeFunctionData(methodName, [
      [
        member.did,
        member.exp,
        member.expires,
        member.chainOfTrustAddress,
        member.rawData
      ]
    ]);
    const tx: ITransaction = {
      from: managerAddress,
      to: this.publicDirectory.address,
      data: encodedData
    };
    const txResponse = await this.lacchainLib.signAndSend(tx);
    const receipt = await this.publicDirectory.provider.getTransactionReceipt(
      txResponse.txHash
    );
    const iFace = new ethers.utils.Interface(PUBLIC_DIRECTORY_ABI);
    for (const log of receipt.logs) {
      if (log.address == this.publicDirectory.address) {
        const parsed = iFace.parseLog(log);
        if (parsed.name == 'MemberChanged') {
          return txResponse;
        }
      }
    }
    throw new BadRequestError(
      ErrorsMessages.UNEXPECTED_RESPONSE_IN_SUCCESSFUL_TRANSACTION_ERROR
    ); // may happen if contract is updated where event structures are changed
  }

  private configureProvider(
    rpcUrl: string,
    privateKey: string,
    nodeAddress: string,
    expiration = Math.floor(Date.now() / 1000) + 86400 * 1080
  ): GasModelSigner {
    const provider = new GasModelProvider(rpcUrl);
    return new GasModelSigner(privateKey, provider, nodeAddress, expiration);
  }
}
