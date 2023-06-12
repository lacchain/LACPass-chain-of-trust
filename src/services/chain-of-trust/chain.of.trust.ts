import { Interface } from 'ethers/lib/utils';
import { CHAIN_OF_TRUST_ABI } from '../../constants/lacchain/chain.of.trust.abi';
import { LacchainBaseContract } from '@services/base.contract';
import { IEthereumTransactionResponse, ITransaction } from 'lacpass-identity';
import { ChainOfTrustMember } from 'src/interfaces/chain-of-trust/chain.of.trust';
import { Service } from 'typedi';
import { ethers } from 'ethers';
import { BadRequestError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';

@Service()
export class ChainOfTrust extends LacchainBaseContract {
  constructor(contractAddress: string, rpcUrl: string, nodeAddress: string) {
    super(
      contractAddress,
      rpcUrl,
      nodeAddress,
      CHAIN_OF_TRUST_ABI,
      'ChainOfTrustContractInterface'
    );
  }

  async owner(): Promise<string> {
    return this.contractInstance.owner();
  }

  async manager(gId: string): Promise<string> {
    return this.contractInstance.manager(gId);
  }

  async addOrUpdateMember(
    member: ChainOfTrustMember,
    managerAddress: string
  ): Promise<IEthereumTransactionResponse> {
    const methodName = 'addOrUpdateGroupMember';
    const methodSignature = [
      `function ${methodName}(address memberEntity, string did, uint256 period) external`
    ];
    const methodInterface = new Interface(methodSignature);
    const encodedData = methodInterface.encodeFunctionData(methodName, [
      member.memberEntity,
      member.did,
      member.period
    ]);
    const tx: ITransaction = {
      from: managerAddress,
      to: this.contractInstance.address,
      data: encodedData
    };
    const txResponse = await this.lacchainLib.signAndSend(tx);
    const receipt = await this.contractInstance.provider.getTransactionReceipt(
      txResponse.txHash
    );
    const iFace = new ethers.utils.Interface(CHAIN_OF_TRUST_ABI);
    for (const log of receipt.logs) {
      if (log.address == this.contractInstance.address) {
        const parsed = iFace.parseLog(log);
        if (parsed.name == 'GroupMemberChanged') {
          return txResponse;
        }
      }
    }
    // eslint-disable-next-line max-len
    // TODO: root manager cannot be transferred on contract deployment so transcations keeps failing
    throw new BadRequestError(
      ErrorsMessages.UNEXPECTED_RESPONSE_IN_SUCCESSFUL_TRANSACTION_ERROR
    ); // may happen if contract is updated where event structures are changed
  }
}
