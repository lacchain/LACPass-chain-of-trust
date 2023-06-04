import { Service } from 'typedi';
import { DidLac1Service } from 'lacpass-identity';
import { BadRequestError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';

@Service()
export class DidValidator {
  private lac1Service: DidLac1Service;
  constructor() {
    this.lac1Service = new DidLac1Service();
  }
  validate(did: string) {
    try {
      this.lac1Service.decodeDid(did);
    } catch (err) {
      throw new BadRequestError(ErrorsMessages.UNSUPPORTED_DID_METHOD_ERROR);
    }
    return true;
  }
}
