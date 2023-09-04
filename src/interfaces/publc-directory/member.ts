export interface Type1PublicDirectoryMember {
  validDays?: number;
  expires: boolean;
  chainOfTrustAddress?: string;
  memberData: Type1MemberData;
}
export interface Type2PublicDirectoryMember {
  validDays?: number;
  expires: boolean;
  chainOfTrustAddress?: string;
  memberData: Type2MemberData;
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
export interface Base1IdentificationData {
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

export interface Base2IdentificationData extends Base1IdentificationData {
  countryCode: string; // TODO: urn:iso:std:iso:3166
  url: string;
}

export interface Type1MemberData {
  version: string;
  type: string;
  identificationData: Base1IdentificationData;
}

export interface Type2MemberData {
  version: string;
  type: string;
  identificationData: Base2IdentificationData;
  certificateAuthority: string;
}
