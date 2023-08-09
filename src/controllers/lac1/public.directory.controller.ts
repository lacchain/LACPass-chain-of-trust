import {
  JsonController,
  Post,
  Get,
  BadRequestError,
  InternalServerError,
  UploadedFile,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
// eslint-disable-next-line max-len
import { LacPassPublicDirectory } from '../../services/public-directory/lacpass.public.directory';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IManager } from 'src/interfaces/manager/manager';

@JsonController('/public-directory')
@Service()
export class PublicDirectoryController {
  constructor(private readonly publicDirectory: LacPassPublicDirectory) {}

  @Post('/add-member')
  async addMember(
    @Body({ validate: true }) data: any,
    @UploadedFile('caCert') caCert: Express.Multer.File
  ): Promise<any> {
    try {
      return this.publicDirectory.rawAddMember(data, caCert);
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
      return this.publicDirectory.getManager();
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
