import { DidValidator } from '../did/did.validator';
import {
  IdentificationDataValidator,
  MemberDataValidator,
  PublicDirectoryMemberValidator
} from '../../dto/public.directory/public.directoryDTO';
import { validateOrReject } from 'class-validator';
import { BadRequestError } from 'routing-controllers';

export class IdentityValidator {
  private didValidator: DidValidator;
  constructor() {
    this.didValidator = new DidValidator();
  }
  async validatePublicDirectoryMember(
    publicDirectoryMemberV: PublicDirectoryMemberValidator
  ) {
    const v = new PublicDirectoryMemberValidator();
    v.validDays = publicDirectoryMemberV.validDays;
    v.expires = publicDirectoryMemberV.expires;
    v.chainOfTrustAddress = publicDirectoryMemberV.chainOfTrustAddress;
    v.memberData = publicDirectoryMemberV.memberData;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }

  async validateMemberData(memberData: MemberDataValidator) {
    const v = new MemberDataValidator();
    v.certificateAuthority = memberData.certificateAuthority;
    v.identificationData = memberData.identificationData;
    v.version = memberData.version;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }

  async validateIdentificationData(
    identificationData: IdentificationDataValidator
  ) {
    this.didValidator.validate(identificationData.id);
    const v = new IdentificationDataValidator();
    v.id = identificationData.id;
    v.legalName = identificationData.legalName;
    v.legalPersonIdentifier = identificationData.legalPersonIdentifier;
    v.legalAddress = identificationData.legalAddress;
    v.VATRegistration = identificationData.VATRegistration;
    v.taxReference = identificationData.taxReference;
    v.LEI = identificationData.LEI;
    v.EORI = identificationData.EORI;
    v.SEED = identificationData.SEED;
    v.SIC = identificationData.SIC;
    v.domainName = identificationData.domainName;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }
}
