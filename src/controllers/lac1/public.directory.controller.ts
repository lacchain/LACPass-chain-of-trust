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
import { LacchainPublicDirectory } from '../../services/public-directory/lacchain.public.directory';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IManager } from 'src/interfaces/manager/manager';
import { PublicDirectoryType1MemberDTO } from '@dto/public.directory/public.directoryDTO';

@JsonController('/public-directory')
@Service()
export class PublicDirectoryController {
  constructor(private readonly publicDirectory: LacchainPublicDirectory) {}

  /**
   * Type1 member add all base identification data
   * @param {PublicDirectoryType1MemberDTO} data
   * @example - POST
   {
      "validDays": 1000,
      "expires": true,
      "identificationData": {
      "id": "did:lac1:1iT5QGEpfYcG6....2yfGHwM48pNDHJoqF92NGzzpo",
      "legalName": "Racsel - American Electronic Health Cooperation Network",
      "domainName": "racsel.org"
    }
    }
   */
  @Post('/add-type1-member')
  async addType1Member(
    @Body({ validate: true }) data: PublicDirectoryType1MemberDTO
  ): Promise<any> {
    try {
      return this.publicDirectory.addType1Member(data);
    } catch (error: any) {
      if (error.detail ?? error.message) {
        throw new BadRequestError(error.detail ?? error.message);
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * In addition to the base params as defined by type1; type 2 also
   * requires an x509 Certificate.
   * @param {any} data
   * @param {Express.Multer.File} caCert - Certificate Authority file
   */
  @Post('/add-type2-member')
  async addType2Member(
    @Body({ validate: true }) data: any,
    @UploadedFile('caCert') caCert: Express.Multer.File
  ): Promise<any> {
    try {
      return this.publicDirectory.rawAddType2Member(data, caCert);
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
