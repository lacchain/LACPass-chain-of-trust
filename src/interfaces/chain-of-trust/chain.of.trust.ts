export interface ChainOfTrustMember {
  memberEntity: string;
  did: string;
  period: number;
}

export interface IChainOfTrustMember {
  memberEntityAddress: string;
  entityDid: string;
  validDays: number;
}

export interface ChainOfTrustMemberDetails {
  iat: number;
  exp: number;
  gId: number;
  trustedBy: string;
  did: string;
  isValid: boolean;
  isRoot: boolean;
}
