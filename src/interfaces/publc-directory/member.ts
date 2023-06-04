export interface PublicDirectoryMember {
  validDays?: number;
  expires: boolean;
  chainOfTrustAddress?: string;
  memberData: MemberData;
}

export interface Member {
  did: string;
  exp: number;
  expires: boolean;
  chainOfTrustAddress: string;
  rawData: Uint8Array;
}

// eslint-disable-next-line max-len
// EBSI: https://ec.europa.eu/digital-building-blocks/code/projects/EBSI/repos/json-schema/browse/schemas/ebsi-vid/legal-entity/2022-11/schema.json
// eslint-disable-next-line max-len
// https://ec.europa.eu/digital-building-blocks/code/projects/EBSI/repos/json-schema/browse/schemas/ebsi-vid/legal-entity/2022-11/examples/organizationVerifiableAttestation_example.json
export interface IdentificationData {
  id: string;
  legalName: string;
  legalPersonIdentifier?: string;
  legalAddress?: string;
  VATRegistration?: string;
  taxReference?: string;
  LEI?: string;
  EORI?: string;
  SEED?: string;
  SIC?: string;
  domainName?: string;
}

export interface MemberData {
  version: string;
  identificationData: IdentificationData;
  certificateAuthority: string;
}
