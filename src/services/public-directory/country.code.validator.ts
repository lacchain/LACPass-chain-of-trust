import { Service } from 'typedi';
// eslint-disable-next-line max-len
import { COUNTRY_CODES } from '../../constants/public-directory/public.directory.country.codes';
import { ErrorsMessages } from '../../constants/errorMessages';
import { BadRequestError } from 'routing-controllers';

@Service()
export class CountryCodeValidator {
  validate(countryCode: string) {
    if (!COUNTRY_CODES.has(countryCode)) {
      throw new BadRequestError(ErrorsMessages.INVALID_COUNTRY_CODE);
    }
    return true;
  }
}
