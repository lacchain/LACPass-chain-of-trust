import {
  JsonController,
  Post,
  BadRequestError,
  Body,
  Get,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '@constants/errorMessages';
import { NewOnchainDelegateDTO } from 'lacpass-identity';
import { ManagerService } from '@services/manager';
import { IManager } from 'src/interfaces/manager/manager';

@JsonController('/manager')
@Service()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  async createManager(
    @Body({ validate: true }) delegate: NewOnchainDelegateDTO
  ): Promise<any> {
    try {
      return this.managerService.createManager(delegate);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/:entityDid')
  async getManager(@Param('entityDid') entityDid: string): Promise<IManager> {
    try {
      return this.managerService.getManager(entityDid);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
