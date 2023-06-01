import { log4TSProvider } from '../../config';
import { PUBLIC_DIRECTORY_ABI } from '../../constants/lacchain/public.directory.abi';
import { Wallet, ethers } from 'ethers';
import { GasModelProvider, GasModelSigner } from '@lacchain/gas-model-provider';
import { Member } from 'src/interfaces/publc-directory/member';
import { Interface } from 'ethers/lib/utils';
import { LacchainLib } from '../lacchain/lacchain-ethers';
import { ITransaction } from 'src/interfaces/ethereum/transaction';

export class PublicDirectory {
  private publicDirectory: ethers.Contract;
  private readonly lacchainLib: LacchainLib;
  log = log4TSProvider.getLogger('PublicDirectoryService');
  constructor(
    publicDirectoryAddress: string,
    rpcUrl: string,
    nodeAddress: string
  ) {
    const provider = this.configureProvider(
      rpcUrl,
      Wallet.createRandom().privateKey,
      nodeAddress
    );
    this.publicDirectory = new ethers.Contract(
      publicDirectoryAddress,
      PUBLIC_DIRECTORY_ABI,
      provider
    );
    this.lacchainLib = new LacchainLib(nodeAddress, rpcUrl);
  }

  async addMember(member: Member, managerAddress: string): Promise<any> {
    const methodName = 'addMember';
    const methodSignature = [
      `function ${methodName}(tuple(string did, 
        string name, uint256 exp, bool expires, 
        address chainOfTrustAddress, bytes rawData) _member) external`
    ];
    const methodInterface = new Interface(methodSignature);
    const encodedData = methodInterface.encodeFunctionData(methodName, [
      member.did,
      member.name,
      member.exp,
      member.expires,
      member.chainOfTrustAddress,
      member.rawData
    ]);
    const tx: ITransaction = {
      from: managerAddress,
      to: this.publicDirectory.address,
      data: encodedData
    };
    return this.lacchainLib.signAndSend(tx);
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
