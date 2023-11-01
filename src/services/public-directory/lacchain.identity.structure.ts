import { DidValidator } from '../did/did.validator';
import {
  Type2MemberDataValidator,
  PublicDirectoryType2MemberValidator,
  Base2IdentificationDataValidator,
  PublicDirectoryType1MemberValidator,
  Type1MemberDataValidator,
  Base1IdentificationDataValidator,
  PublicDirectoryType3MemberValidator,
  Type3MemberDataValidator
} from '../../dto/public.directory/public.directoryDTO';
import { validateOrReject } from 'class-validator';
import { BadRequestError } from 'routing-controllers';
import { CountryCodeValidator } from './country.code.validator';

export class IdentityValidator {
  private didValidator: DidValidator;
  private countryCodeValidator: CountryCodeValidator;
  constructor() {
    this.didValidator = new DidValidator();
    this.countryCodeValidator = new CountryCodeValidator();
  }
  async validateType1PublicDirectoryMember(
    publicDirectoryMemberV: PublicDirectoryType1MemberValidator
  ) {
    const v = new PublicDirectoryType1MemberValidator();
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

  async validateType2PublicDirectoryMember(
    publicDirectoryMemberV: PublicDirectoryType2MemberValidator
  ) {
    const v = new PublicDirectoryType2MemberValidator();
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

  async validateType3PublicDirectoryMember(
    publicDirectoryMemberV: PublicDirectoryType3MemberValidator
  ) {
    const v = new PublicDirectoryType3MemberValidator();
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

  async validateType1MemberData(memberData: Type1MemberDataValidator) {
    const v = new Type1MemberDataValidator();
    v.type = memberData.type;
    v.identificationData = memberData.identificationData;
    v.version = memberData.version;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }

  async validateType2MemberData(memberData: Type2MemberDataValidator) {
    const v = new Type2MemberDataValidator();
    v.type = memberData.type;
    v.certificateAuthority = memberData.certificateAuthority;
    v.version = memberData.version;
    v.identificationData = memberData.identificationData;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }

  async validateType3MemberData(memberData: Type3MemberDataValidator) {
    const v = new Type3MemberDataValidator();
    v.type = memberData.type;
    v.version = memberData.version;
    v.identificationData = memberData.identificationData;
    try {
      await validateOrReject(v);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }

  async validateBase1IdentificationData(
    identificationData: Base1IdentificationDataValidator
  ) {
    this.didValidator.validate(identificationData.id);
    const v = new Base1IdentificationDataValidator();
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

  async validateBase2IdentificationData(
    identificationData: Base2IdentificationDataValidator
  ) {
    this.didValidator.validate(identificationData.id);
    const v = new Base2IdentificationDataValidator();
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
    v.countryCode = identificationData.countryCode;
    v.url = identificationData.url;
    try {
      await validateOrReject(v);
      this.countryCodeValidator.validate(identificationData.countryCode);
    } catch (err: any) {
      throw new BadRequestError(err);
    }
  }
}
