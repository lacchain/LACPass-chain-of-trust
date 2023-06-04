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

export class IdentificationDataValidator {
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

export class MemberDataValidator {
  @IsString()
  version!: string;
  @ValidateNested()
  @IsDefined()
  @Type(() => IdentificationDataValidator)
  identificationData!: IdentificationDataValidator;
  @IsString()
  certificateAuthority!: string;
}

export class PublicDirectoryMemberValidator {
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
  @IsOptional()
  @IsString()
  chainOfTrustAddress?: string;
  @ValidateNested()
  @IsDefined()
  @Type(() => MemberDataValidator)
  memberData!: MemberDataValidator;
}

export class PublicDirectoryMemberDTO {
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
  @IsOptional()
  @IsString()
  chainOfTrustAddress?: string;
  @ValidateNested()
  @IsDefined()
  @Type(() => IdentificationDataValidator)
  identificationData!: IdentificationDataValidator;
}
