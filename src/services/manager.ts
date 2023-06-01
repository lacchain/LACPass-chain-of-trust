import {
  IManager,
  IManagerService,
  INewManager
} from 'src/interfaces/manager/manager';
import { Service } from 'typedi';
import { DidServiceLac1 } from './external/did-lac/did.service';
import { INewAccountIdAttribute } from 'lacpass-identity';
import { getRepository } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { ErrorsMessages } from '../constants/errorMessages';
import { EntityMapper } from '../clients/mapper/entityMapper.service';

@Service()
export class ManagerService implements IManagerService {
  private readonly managerRepository = getRepository<Manager>(Manager);
  private didServiceLac1: DidServiceLac1;
  constructor() {
    this.didServiceLac1 = new DidServiceLac1();
  }
  async removeManager(_entityDid: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async getManager(entityDid: string): Promise<IManager> {
    const manager = await this.managerRepository.findOne(undefined, {
      where: {
        entityDid: entityDid
      }
    });
    if (!manager) {
      throw new NotFoundError(ErrorsMessages.MANAGER_DOES_NOT_EXIST);
    }
    return {
      entityDid: manager.entityDid,
      managerDid: manager.managerDid,
      managerAddress: manager.managerAddress
    } as IManager;
  }
  renewManagerAuthorization(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async createManager(managerRequest: INewManager): Promise<IManager> {
    const existManager = await this.managerRepository.findOne(undefined, {
      where: {
        entityDid: managerRequest.did
      }
    });
    if (existManager) {
      const message = ErrorsMessages.MANAGER_ALREADY_EXISTIS;
      throw new BadRequestError(message);
    }

    return this.addManagerAsAttribute(managerRequest);
  }

  async addManagerAsAttribute(managerRequest: INewManager): Promise<IManager> {
    const newAccountIdAttribute: INewAccountIdAttribute = {
      did: managerRequest.did,
      validDays: managerRequest.validDays,
      relation: 'dele'
    };
    const newManager =
      await this.didServiceLac1.addNewEthereumAccountIdAttribute(
        newAccountIdAttribute
      );
    const managerToSave: IManager = {
      entityDid: newAccountIdAttribute.did,
      managerDid: newManager.delegateDid,
      managerAddress: newManager.delegateAddress
    };
    const manager = EntityMapper.mapTo(Manager, managerToSave);
    await this.managerRepository.insert(manager);
    return managerToSave;
  }
}
