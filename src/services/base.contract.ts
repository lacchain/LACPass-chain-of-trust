import { log4TSProvider } from '@config';
import { GasModelProvider, GasModelSigner } from '@lacchain/gas-model-provider';
import { Wallet, ethers } from 'ethers';
import { LacchainLib } from 'lacpass-identity';
import { Service } from 'typedi';
import { Logger } from 'typescript-logging-log4ts-style';

@Service()
export abstract class LacchainBaseContract {
  protected contractInstance: ethers.Contract;
  protected readonly lacchainLib: LacchainLib;
  protected log: Logger;
  constructor(
    contractAddress: string,
    rpcUrl: string,
    nodeAddress: string,
    ABI: any,
    loggerName: string
  ) {
    this.log = log4TSProvider.getLogger(loggerName);
    const key = Wallet.createRandom().privateKey;
    const provider = this.configureProvider(rpcUrl, key, nodeAddress);
    this.contractInstance = new ethers.Contract(contractAddress, ABI, provider);
    this.lacchainLib = new LacchainLib(nodeAddress, rpcUrl);
  }

  private configureProvider(
    rpcUrl: string,
    privateKey: string,
    nodeAddress: string,
    expiration = Math.floor(Date.now() / 1000) + 86400 * 1080
  ): GasModelSigner {
    const provider = new GasModelProvider(rpcUrl);
    return new GasModelSigner(privateKey, provider, nodeAddress, expiration);
  }
}
