import {
  DID_LAC1,
  IDENTITY_MANAGER_BASE_URL,
  IS_COT_DEPENDENT_SERVICE,
  log4TSProvider,
  DID_LAC1_ADD_NEW_ETHEREUM_ACCOUNT_ATTRIBUTE
} from '../../../config';
import { ErrorsMessages } from '../../../constants/errorMessages';
import {
  DidLacService,
  DidType,
  INewAccountIdAttribute,
  INewDelegateResponse
} from 'lacpass-identity';
import { InternalServerError } from 'routing-controllers';
import { Service } from 'typedi';
import fetch from 'node-fetch';

@Service()
export class DidServiceLac1 {
  public createDid: () => Promise<DidType>;
  public addNewEthereumAccountIdAttribute: (
    newAccountIdAttribute: INewAccountIdAttribute
  ) => Promise<INewDelegateResponse>;
  log = log4TSProvider.getLogger('IdentityManagerService');

  private didService: DidLacService | null;

  constructor() {
    if (IS_COT_DEPENDENT_SERVICE !== 'true') {
      this.log.info('Configuring library usage');
      this.createDid = this.createDidByLib;
      this.addNewEthereumAccountIdAttribute =
        this.addNewEthereumAccountIdAttributeByLib;

      // setting imported did service
      const S = require('lacpass-identity').DidLac1Service;
      this.didService = new S();
    } else {
      this.log.info('Configuring external service connection');
      this.addNewEthereumAccountIdAttribute =
        this.addNewEthereumAccountIdAttributeByExternalService;
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

  private async addNewEthereumAccountIdAttributeByLib(
    newAccountIdAttribute: INewAccountIdAttribute
  ): Promise<INewDelegateResponse> {
    return (await this.didService?.addNewEthereumAccountIdAttribute(
      newAccountIdAttribute
    )) as INewDelegateResponse;
  }

  private async addNewEthereumAccountIdAttributeByExternalService(
    newAccountIdAttribute: INewAccountIdAttribute
  ): Promise<INewDelegateResponse> {
    const result = await fetch(
      `${IDENTITY_MANAGER_BASE_URL}${DID_LAC1_ADD_NEW_ETHEREUM_ACCOUNT_ATTRIBUTE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccountIdAttribute)
      }
    );
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(ErrorsMessages.CREATE_NEW_DELEGATE_ERROR);
    }
    return (await result.json()) as INewDelegateResponse;
  }
}
