export interface Member {
  did: string;
  name: string;
  exp: number;
  expires: boolean;
  chainOfTrustAddress: string;
  rawData: Uint8Array;
}
