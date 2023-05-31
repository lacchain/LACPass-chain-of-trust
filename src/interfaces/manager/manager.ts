import { INewAccountIdAttribute } from 'lacpass-identity';

export interface IManagerService {
  createManager(
    newAccountIdAttribute: INewAccountIdAttribute
  ): Promise<IManager>;
  getManager(entityDid: string): Promise<IManager>;
  renewManagerAuthorization(): Promise<any>;
  removeManager(entityDid: string): Promise<any>;
}

export interface INewManager {
  did: string;
  validDays: number;
}

export interface IManager {
  entityDid: string;
  managerDid: string;
  managerAddress: string;
}
