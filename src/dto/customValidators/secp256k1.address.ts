import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { isAddress } from 'ethers/lib/utils';

@ValidatorConstraint({ name: 'secp256k1AddressValidator', async: false })
export class Secp256k1AddressValidator implements ValidatorConstraintInterface {
  validate(text: string, _args: ValidationArguments) {
    return isAddress(text);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Passed argument is not an Address';
  }
}
