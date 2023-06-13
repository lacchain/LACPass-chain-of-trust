import { DidValidator } from '@dto/customValidators/did';
import { Secp256k1AddressValidator } from '../customValidators/secp256k1.address';
import { IsInt, IsString, Min, Validate } from 'class-validator';

export interface ChainOfTrustMember {
  memberEntity: string;
  did: string;
  period: number;
}

export class ChainOfTrustMember {
  @IsString()
  @Validate(Secp256k1AddressValidator, {
    message: 'memberEntityAddress must be a valid address'
  })
  memberEntityAddress!: string;
  @IsString()
  @Validate(DidValidator, {
    message: 'entityDid is not a supported DID (Decentralized identifier)'
  })
  entityDid!: string;
  @IsInt()
  @Min(1)
  validDays!: number;
}
