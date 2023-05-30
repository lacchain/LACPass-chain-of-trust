import {
  DID_LAC1,
  IDENTITY_MANAGER_BASE_URL,
  IS_DEPENDENT_SERVICE,
  log4TSProvider
} from '../../../config';
import { ErrorsMessages } from '../../../constants/errorMessages';
import {
  DidLacService,
  DidType,
  INewOnchainDelegate,
  INewOnchainDelegateResponse
} from 'lacpass-identity';
import { InternalServerError } from 'routing-controllers';
import { Service } from 'typedi';
import fetch from 'node-fetch';

@Service()
export class DidServiceLac1 {
  public createDid: () => Promise<DidType>;
  public createNewOnchainDelegate: (
    newOnchainDelegate: INewOnchainDelegate
  ) => Promise<INewOnchainDelegateResponse>;
  log = log4TSProvider.getLogger('IdentityManagerService');

  private didService: DidLacService | null;

  constructor() {
    if (IS_DEPENDENT_SERVICE !== 'true') {
      this.log.info('Configuring identity-manager library usage');
      this.createDid = this.createDidByLib;
      this.createNewOnchainDelegate = this.createNewOnchainDelegateByLib;

      // setting imported did service
      const S = require('lacpass-identity').DidLac1Service;
      this.didService = new S();
    } else {
      this.log.info('Configuring identity-manager external service connection');
      this.createNewOnchainDelegate =
        this.createNewOnchainDelegateByExternalService;
      this.createDid = this.createDidByExternalService;

      // setting did service to null since connections will be made by way
      // of http connections rather than using imported libraries
      this.didService = null;
    }
  }

  private async createDidByLib(): Promise<DidType> {
    return (await this.didService?.createDid()) as DidType;
  }

  private async createDidByExternalService(): Promise<DidType> {
    const result = await fetch(`${IDENTITY_MANAGER_BASE_URL}${DID_LAC1}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(ErrorsMessages.CREATE_DID_ERROR);
    }
    return (await result.json()) as DidType;
  }

  private async createNewOnchainDelegateByLib(
    newOnchainDelegate: INewOnchainDelegate
  ): Promise<INewOnchainDelegateResponse> {
    return (await this.didService?.createNewOnchainDelegate(
      newOnchainDelegate
    )) as INewOnchainDelegateResponse;
  }

  private async createNewOnchainDelegateByExternalService(
    newOnchainDelegate: INewOnchainDelegate
  ): Promise<INewOnchainDelegateResponse> {
    const result = await fetch(`${IDENTITY_MANAGER_BASE_URL}${DID_LAC1}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOnchainDelegate)
    });
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(
        ErrorsMessages.CREATE_NEW_ONCHAIN_DELEGATE_ERROR
      );
    }
    return (await result.json()) as INewOnchainDelegateResponse;
  }
}
