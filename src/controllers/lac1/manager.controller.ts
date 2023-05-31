import {
  JsonController,
  Post,
  BadRequestError,
  Body,
  Get,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import { ManagerService } from '../../services/manager';
import { IManager } from 'src/interfaces/manager/manager';
import { NewManagerDto } from '../../dto/lac1/managerDTO';

@JsonController('/manager')
@Service()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  async createManager(
    @Body({ validate: true }) newManager: NewManagerDto
  ): Promise<any> {
    try {
      return this.managerService.createManager(newManager);
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
