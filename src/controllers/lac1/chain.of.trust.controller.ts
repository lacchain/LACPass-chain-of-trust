import {
  JsonController,
  Post,
  Get,
  BadRequestError,
  InternalServerError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IManager } from 'src/interfaces/manager/manager';
import { ChainOfTrustMember } from '@dto/chain-of-trust/chainOfTrustDTO';
import { LacpassChainOfTrust } from '@services/chain-of-trust/lacpass.chain.of.trust';

@JsonController('/chain-of-trust')
@Service()
export class ChainOfTrustController {
  constructor(private readonly chainOfTrust: LacpassChainOfTrust) {}

  @Post('/add-or-update-member')
  async addOrUpdateMember(
    @Body({ validate: true }) chainOfTrustMember: ChainOfTrustMember
  ): Promise<any> {
    try {
      return this.chainOfTrust.addOrUpdateMember(chainOfTrustMember);
    } catch (error: any) {
      if (error.detail ?? error.message) {
        throw new BadRequestError(error.detail ?? error.message);
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Get('/get-manager')
  async getManager(): Promise<IManager> {
    try {
      return this.chainOfTrust.getManager();
    } catch (error: any) {
      if (error.detail ?? error.message) {
        throw new BadRequestError(error.detail ?? error.message);
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
