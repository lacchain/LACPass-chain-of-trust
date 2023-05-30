import { INewOnchainDelegate } from 'lacpass-identity';

export interface IManagerService {
  createManager(newOnchainDelegate: INewOnchainDelegate): Promise<IManager>;
  getManager(entityDid: string): Promise<IManager>;
  renewManagerAuthorization(): Promise<any>;
  removeManager(entityDid: string): Promise<any>;
}

export interface IManager {
  entityDid: string;
  managerDid: string;
  managerAddress: string;
}
