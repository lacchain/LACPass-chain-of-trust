import { Service } from 'typedi';
import { ChainOfTrustBase } from './chain.of.trust.base';
import {
  getNodeAddress,
  getRpcUrl,
  log4TSProvider,
  resolveChainOfTrustAddress
} from '../../config';
import { ManagerService } from '../manager';
import {
  ChainOfTrustMember,
  ChainOfTrustMemberDetails,
  IChainOfTrustMember
} from 'src/interfaces/chain-of-trust/chain.of.trust';
import { IManager } from 'src/interfaces/manager/manager';
import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IEthereumTransactionResponse } from 'src/interfaces/ethereum/transaction';
import { Logger } from 'typescript-logging-log4ts-style';

@Service()
export class ChainOfTrust {
  private readonly chainOfTrust: ChainOfTrustBase;
  private manager: ManagerService;
  protected log: Logger;
  constructor() {
    this.log = log4TSProvider.getLogger('ChainOfTrustService');
    const chainOfTrustAddress = resolveChainOfTrustAddress();
    const rpcUrl = getRpcUrl();
    const nodeAddress = getNodeAddress();
    this.chainOfTrust = new ChainOfTrustBase(
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
    const foundMember = await this.getMember(member.memberEntityAddress);
    if (foundMember.isValid) {
      this.log.info(
        'Member already exists, will expire in',
        new Date(foundMember.exp * 1000),
        ' updating anyways ...'
      );
    }
    return this.chainOfTrust.addOrUpdateMember(
      addOrUpdatemember,
      managerAddress
    );
  }

  async getMember(
    memberEntityManager: string
  ): Promise<ChainOfTrustMemberDetails> {
    return this.chainOfTrust.getMemberDetailsByEntityManager(
      memberEntityManager
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
