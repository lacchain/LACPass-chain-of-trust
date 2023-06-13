import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { DidLac1Service } from 'lacpass-identity';

@ValidatorConstraint({ name: 'didValidator', async: false })
export class DidValidator implements ValidatorConstraintInterface {
  private didLac1Service: DidLac1Service;
  constructor() {
    this.didLac1Service = new DidLac1Service();
  }
  validate(text: string, _args: ValidationArguments) {
    try {
      this._validateFromDidPoolImplementations(text);
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Passed param is not a supported Did';
  }

  private _validateFromDidPoolImplementations(did: string) {
    this.didLac1Service.decodeDid(did); // just supporting one at the moment
  }
}
