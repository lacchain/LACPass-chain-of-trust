import { Service } from 'typedi';
import { PublicDirectoryBase } from './public.directory.base';
import {
  Member,
  Type1PublicDirectoryMember,
  Type2PublicDirectoryMember
} from 'src/interfaces/publc-directory/member';
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
import {
  PublicDirectoryType2MemberDTO,
  Type2MemberDataValidator,
  PublicDirectoryType2MemberValidator,
  Type1MemberDataValidator,
  PublicDirectoryType1MemberDTO,
  PublicDirectoryType1MemberValidator
} from '../../dto/public.directory/public.directoryDTO';

import { IdentityValidator } from './lacchain.identity.structure';
import { IManager } from 'src/interfaces/manager/manager';
import { toUtf8Bytes } from 'ethers/lib/utils';

@Service()
export class LacchainPublicDirectory {
  publicDirectory: PublicDirectoryBase;
  private manager: ManagerService;
  private identityValidator: IdentityValidator;
  private memberDataType1EncodingVersion = '1.0.0';
  private memberDataType1Name = 'Type-1';
  private memberDataType2EncodingVersion = '1.0.0';
  private memberDataType2Name = 'Type-2';
  constructor() {
    this.publicDirectory = new PublicDirectoryBase(
      resolvePublicDirectoryAddress(),
      getRpcUrl(),
      getNodeAddress()
    );
    this.manager = new ManagerService();
    this.identityValidator = new IdentityValidator();
  }

  async addType1Member(type1Data: PublicDirectoryType1MemberDTO): Promise<any> {
    const memberData = new Type1MemberDataValidator();
    memberData.identificationData = type1Data.identificationData;
    const publicDirectoryMember = new PublicDirectoryType1MemberValidator();
    publicDirectoryMember.validDays = type1Data.validDays;
    publicDirectoryMember.expires = type1Data.expires;
    publicDirectoryMember.chainOfTrustAddress = type1Data.chainOfTrustAddress;
    publicDirectoryMember.memberData = memberData;

    if (!publicDirectoryMember.memberData) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    await this._type1ValidateAndFillAdditionalParams(publicDirectoryMember);
    return this.addMember(publicDirectoryMember);

    // return { Ok: true };
  }

  async rawAddType2Member(
    formData: any,
    caCert: Express.Multer.File
  ): Promise<any> {
    if (!formData?.data) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    if (Object.keys(formData?.data).length === 0) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    const addMemberDto = JSON.parse(
      formData.data
    ) as PublicDirectoryType2MemberDTO;
    const memberData = new Type2MemberDataValidator();
    memberData.identificationData = addMemberDto.identificationData;
    const publicDirectoryMember = new PublicDirectoryType2MemberValidator();
    publicDirectoryMember.validDays = addMemberDto.validDays;
    publicDirectoryMember.expires = addMemberDto.expires;
    publicDirectoryMember.chainOfTrustAddress =
      addMemberDto.chainOfTrustAddress;
    publicDirectoryMember.memberData = memberData;
    const x509CA = new X509Certificate(caCert.buffer);
    this._validatex509Cert(x509CA);

    if (!publicDirectoryMember.memberData) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    publicDirectoryMember.memberData.certificateAuthority =
      x509CA.raw.toString('base64');
    await this._type2ValidateAndFillAdditionalParams(publicDirectoryMember);
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

  private async _type1ValidateAndFillAdditionalParams(
    publicDirectoryMemberV: PublicDirectoryType1MemberValidator
  ) {
    if (publicDirectoryMemberV.memberData) {
      publicDirectoryMemberV.memberData.version =
        this.memberDataType1EncodingVersion;
      publicDirectoryMemberV.memberData.type = this.memberDataType1Name;
    }
    await this.identityValidator.validateType1PublicDirectoryMember(
      publicDirectoryMemberV
    );
    await this.identityValidator.validateType1MemberData(
      publicDirectoryMemberV.memberData
    );
    await this.identityValidator.validateBase1IdentificationData(
      publicDirectoryMemberV.memberData.identificationData
    );
  }

  private async _type2ValidateAndFillAdditionalParams(
    publicDirectoryMemberV: PublicDirectoryType2MemberValidator
  ) {
    if (publicDirectoryMemberV.memberData) {
      publicDirectoryMemberV.memberData.version =
        this.memberDataType2EncodingVersion;
      publicDirectoryMemberV.memberData.type = this.memberDataType2Name;
    }
    await this.identityValidator.validateType2PublicDirectoryMember(
      publicDirectoryMemberV
    );
    await this.identityValidator.validateType2MemberData(
      publicDirectoryMemberV.memberData
    );
    await this.identityValidator.validateBase2IdentificationData(
      publicDirectoryMemberV.memberData.identificationData
    );
  }

  async addMember(
    publicDirectoryMember:
      | Type1PublicDirectoryMember
      | Type2PublicDirectoryMember
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
    console.log(JSON.stringify(memberData));
    const rawData = toUtf8Bytes(JSON.stringify(memberData));
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
        throw new BadRequestError(ErrorsMessages.MANAGER_PRIVILEGE_ERROR);
      }
      throw new InternalServerError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
    throw new BadRequestError(ErrorsMessages.MANAGER_PRIVILEGE_ERROR);
  }
}
