import { Service } from 'typedi';
import { PublicDirectory } from './public.directory';
import {
  Member,
  PublicDirectoryMember
} from 'src/interfaces/publc-directory/member';
import { encode } from 'cbor';
import { ethers } from 'ethers';
import {
  getNodeAddress,
  getRpcUrl,
  resolvePublicDirectoryAddress
} from '../../config';
import { ManagerService } from '../manager';
import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';
import { X509Certificate } from 'crypto';
import { IEthereumTransactionResponse } from 'src/interfaces/ethereum/transaction';
// eslint-disable-next-line max-len
import { PublicDirectoryMemberValidator } from '../../dto/public.directory/public.directoryDTO';

import { IdentityValidator } from './laccpass.identity.structure';
import { IManager } from 'src/interfaces/manager/manager';

@Service()
export class LacPassPublicDirectory {
  publicDirectory: PublicDirectory;
  manager: ManagerService;
  identityValidator: IdentityValidator;
  constructor() {
    this.publicDirectory = new PublicDirectory(
      resolvePublicDirectoryAddress(),
      getRpcUrl(),
      getNodeAddress()
    );
    this.manager = new ManagerService();
    this.identityValidator = new IdentityValidator();
  }

  async rawAddMember(formData: any, caCert: Express.Multer.File): Promise<any> {
    if (!formData?.data) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    if (Object.keys(formData?.data).length === 0) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    const publicDirectoryMember = JSON.parse(
      formData.data
    ) as PublicDirectoryMemberValidator;
    const x509CA = new X509Certificate(caCert.buffer);
    this._validatex509Cert(x509CA);
    if (!publicDirectoryMember.memberData) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    publicDirectoryMember.memberData.certificateAuthority =
      x509CA.raw.toString('base64');
    await this._validate(publicDirectoryMember);
    return this.addMember(publicDirectoryMember);
  }
  private _validatex509Cert(x509CA: X509Certificate) {
    if (!x509CA.ca) {
      throw new BadRequestError(ErrorsMessages.NOT_CA_CERTIFICATE_ERROR);
    }
    const validTo = x509CA.validTo;
    const futureTime = Math.floor(new Date(validTo).getTime() / 1000);
    const delta = futureTime - Math.floor(Date.now() / 1000);
    if (delta < 0) {
      throw new BadRequestError(ErrorsMessages.X509_EXPIRED_CERTIFICATE);
    }
  }
  private async _validate(
    publicDirectoryMemberV: PublicDirectoryMemberValidator
  ) {
    await this.identityValidator.validatePublicDirectoryMember(
      publicDirectoryMemberV
    );
    await this.identityValidator.validateMemberData(
      publicDirectoryMemberV.memberData
    );
    await this.identityValidator.validateIdentificationData(
      publicDirectoryMemberV.memberData.identificationData
    );
  }

  async addMember(
    publicDirectoryMember: PublicDirectoryMember
  ): Promise<IEthereumTransactionResponse> {
    let { expires, validDays } = publicDirectoryMember;
    if (!validDays) {
      validDays = 0;
    }
    let exp = 0;
    if (expires) {
      exp = Math.floor(Date.now() / 1000) + 86400 * validDays;
    }
    const { memberData, chainOfTrustAddress } = publicDirectoryMember;
    const { id } = memberData?.identificationData;
    const rawData = encode(memberData);
    const chainOfTrustAddressToSet = chainOfTrustAddress
      ? chainOfTrustAddress
      : ethers.constants.AddressZero;
    const member: Member = {
      did: id,
      exp,
      expires,
      chainOfTrustAddress: chainOfTrustAddressToSet,
      rawData
    };
    const managerAddress = (await this.getManager()).managerAddress;
    return this.publicDirectory.addMember(member, managerAddress);
  }

  async getOwner(): Promise<string> {
    return this.publicDirectory.owner();
  }

  async getManager(): Promise<IManager> {
    const owner = await this.publicDirectory.owner();
    try {
      const found = await this.manager.findManager(owner);
      if (found) {
        return found;
      }
    } catch (error: any) {
      if (error.detail ?? error.message) {
        throw new BadRequestError(
          ErrorsMessages.PUBLIC_DIRECTORY_PRIVILEGE_ERROR
        );
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
    throw new BadRequestError(ErrorsMessages.PUBLIC_DIRECTORY_PRIVILEGE_ERROR);
  }
}
