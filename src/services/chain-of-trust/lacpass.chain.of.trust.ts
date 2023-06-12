import { Service } from 'typedi';
import { ChainOfTrust } from './chain.of.trust';
import {
  getNodeAddress,
  getRpcUrl,
  resolveChainOfTrustAddress
} from '../../config';
import { ManagerService } from '../manager';
import {
  ChainOfTrustMember,
  IChainOfTrustMember
} from 'src/interfaces/chain-of-trust/chain.of.trust';
import { IManager } from 'src/interfaces/manager/manager';
import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IEthereumTransactionResponse } from 'src/interfaces/ethereum/transaction';

@Service()
export class LacpassChainOfTrust {
  private readonly chainOfTrust: ChainOfTrust;
  private manager: ManagerService;
  constructor() {
    const chainOfTrustAddress = resolveChainOfTrustAddress();
    const rpcUrl = getRpcUrl();
    const nodeAddress = getNodeAddress();
    this.chainOfTrust = new ChainOfTrust(
      chainOfTrustAddress,
      rpcUrl,
      nodeAddress
    );
    this.manager = new ManagerService();
  }
  async addOrUpdateMember(
    member: IChainOfTrustMember
  ): Promise<IEthereumTransactionResponse> {
    const addOrUpdatemember: ChainOfTrustMember = {
      memberEntity: member.memberEntityAddress,
      did: member.entityDid,
      period: member.validDays * 86400
    };
    const managerAddress = (await this.getManager()).managerAddress;
    return this.chainOfTrust.addOrUpdateMember(
      addOrUpdatemember,
      managerAddress
    );
  }
  async getManager(): Promise<IManager> {
    const gId = '1';
    const rootManager = await this.chainOfTrust.manager(gId);
    try {
      const found = await this.manager.findManager(rootManager);
      if (found) {
        return found;
      }
    } catch (error: any) {
      if (error.detail ?? error.message) {
        throw new BadRequestError(ErrorsMessages.MANAGER_PRIVILEGE_ERROR);
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
    throw new BadRequestError(ErrorsMessages.MANAGER_PRIVILEGE_ERROR);
  }
}
