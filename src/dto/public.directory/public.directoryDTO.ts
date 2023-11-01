import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';

export class Base1IdentificationDataValidator {
  @IsString()
  id!: string;
  @IsString()
  legalName!: string;
  @IsOptional()
  @IsString()
  legalPersonIdentifier?: string;
  @IsOptional()
  @IsString()
  legalAddress?: string;
  @IsOptional()
  @IsString()
  VATRegistration?: string;
  @IsOptional()
  @IsString()
  taxReference?: string;
  @IsOptional()
  @IsString()
  LEI?: string;
  @IsOptional()
  @IsString()
  EORI?: string;
  @IsOptional()
  @IsString()
  SEED?: string;
  @IsOptional()
  @IsString()
  SIC?: string;
  @IsOptional()
  @IsString()
  domainName?: string;
}

export class Base2IdentificationDataValidator extends Base1IdentificationDataValidator {
  @IsString()
  countryCode!: string; // TODO: urn:iso:std:iso:3166
  @IsString()
  url!: string;
}

export class BaseTypeMemberDataValidator {
  @IsString()
  version!: string;
  @IsString()
  type!: string;
}

export class Type1MemberDataValidator extends BaseTypeMemberDataValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base1IdentificationDataValidator)
  identificationData!: Base1IdentificationDataValidator;
}

export class Type2MemberDataValidator extends BaseTypeMemberDataValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base2IdentificationDataValidator)
  identificationData!: Base2IdentificationDataValidator;
  @IsString()
  certificateAuthority!: string;
}

export class Type3MemberDataValidator extends BaseTypeMemberDataValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base2IdentificationDataValidator)
  identificationData!: Base2IdentificationDataValidator;
}

export class Base1PublicDirectoryMemberValidator {
  @Min(1)
  @IsPositive({
    // eslint-disable-next-line max-len
    message:
      'Valid days must be a positive number, only mandatory when "expires" is true',
    context: {
      developerNote:
        // eslint-disable-next-line max-len
        'Represents the number of days in which the member is considered valid on the public directory'
    }
  })
  @ValidateIf(o => o.expires === true)
  validDays?: number;

  @IsBoolean({
    // eslint-disable-next-line max-len
    message: `If false, indicates whether the member is always valid on the public directory\n
    otherwise "validaDays must be specified"`,
    context: {
      developerNote:
        // eslint-disable-next-line max-len
        'Represents the number of days in which the member is considered valid on the public directory'
    }
  })
  expires!: boolean;
  @IsString()
  @IsOptional()
  chainOfTrustAddress?: string;
}

export class PublicDirectoryType1MemberDTO extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base1IdentificationDataValidator)
  identificationData!: Base1IdentificationDataValidator;
}
export class PublicDirectoryType2MemberDTO extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base2IdentificationDataValidator)
  identificationData!: Base2IdentificationDataValidator;
}

export class PublicDirectoryType3MemberDTO extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Base2IdentificationDataValidator)
  identificationData!: Base2IdentificationDataValidator;
}

// eslint-disable-next-line max-len
export class PublicDirectoryType1MemberValidator extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Type1MemberDataValidator)
  memberData!: Type1MemberDataValidator;
}

// eslint-disable-next-line max-len
export class PublicDirectoryType2MemberValidator extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Type2MemberDataValidator)
  memberData!: Type2MemberDataValidator;
}

// eslint-disable-next-line max-len
export class PublicDirectoryType3MemberValidator extends Base1PublicDirectoryMemberValidator {
  @ValidateNested()
  @IsDefined()
  @Type(() => Type3MemberDataValidator)
  memberData!: Type3MemberDataValidator;
}
