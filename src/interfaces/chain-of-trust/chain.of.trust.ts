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
