import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '@constants/errorMessages';
import { DidServiceLac1 } from '@services/external/did-lac/did.service';

@JsonController('/did/lac1')
@Service()
export class DidLac1Controller {
  constructor(private readonly didServiceLac1: DidServiceLac1) {}

  @Post()
  async createDidLac1(): Promise<any> {
    try {
      return this.didServiceLac1.createDid();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
