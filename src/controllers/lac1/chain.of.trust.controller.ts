import {
  JsonController,
  Post,
  Get,
  BadRequestError,
  InternalServerError,
  Body,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IManager } from 'src/interfaces/manager/manager';
import { ChainOfTrustMember } from '@dto/chain-of-trust/chainOfTrustDTO';
import { ChainOfTrust } from '@services/chain-of-trust/chain.of.trust';

@JsonController('/chain-of-trust')
@Service()
export class ChainOfTrustController {
  constructor(private readonly chainOfTrust: ChainOfTrust) {}

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
  @Get('/get-member/:memberEntityManagerAddress')
  async getMember(
    @Param('memberEntityManagerAddress') memberEntityManagerAddress: string
  ): Promise<any> {
    try {
      return this.chainOfTrust.getMember(memberEntityManagerAddress);
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
