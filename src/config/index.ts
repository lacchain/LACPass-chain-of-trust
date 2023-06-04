import { PUBLIC_DIRECTORY } from '../constants/lacchain/public.directory.address';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import { isAddress } from 'ethers/lib/utils';
import { LogLevel } from 'typescript-logging';
import { Log4TSProvider } from 'typescript-logging-log4ts-style';

config({ path: `.env.${process.env.ENV || 'dev'}` });

export const log4TSProvider = Log4TSProvider.createProvider(
  'Log4ProviderChainOfTrust' + randomUUID(),
  {
    level: LogLevel.Debug,
    groups: [
      {
        expression: new RegExp('.+')
      }
    ]
  }
);

const log = log4TSProvider.getLogger('config');

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const PRODUCTION_ENV = process.env.ENV === 'prod';
export const DEV_ENV = process.env.ENV === 'dev';
export const TESTING_ENV = process.env.ENV === 'test';
export const CI_ENV = process.env.ENV === 'ci';
export const JWT_SECRET_DEFAULT = 'some-secret-string-default';

export const getChainId = (): string => {
  if (!process.env.CHAIN_ID) {
    console.error('==> Please set CHAIN_ID in your .env');
    process.exit(1);
  }
  return process.env.CHAIN_ID;
};

export const getRpcUrl = (): string => {
  if (!process.env.NODE_RPC_URL) {
    console.error('==> Please set RPC_URL in your .env');
    process.exit(1);
  }
  return process.env.NODE_RPC_URL;
};

export const getNodeAddress = (): string => {
  if (!process.env.NODE_ADDRESS) {
    console.error('==> Please set NODE_ADDRESS in your .env');
    process.exit(1);
  }
  return process.env.NODE_ADDRESS;
};

export const CHAIN_ID = getChainId();

export const resolvePublicDirectoryAddress = (
  publicDirectoryAddress = process.env.PUBLIC_DIRECTORY_CONTRACT_ADDRESS
): string => {
  if (publicDirectoryAddress) {
    if (!isAddress(publicDirectoryAddress)) {
      log.error(
        'Specified PUBLIC_DIRECTORY_CONTRACT_ADDRESS',
        PUBLIC_DIRECTORY_CONTRACT_ADDRESS,
        'is not a valid address ... exiting'
      );
      process.exit(1); // exiting since this is a critical error
    }
    // TODO: validate just by making a call to contract to validate that's a correct one
    // could just verify against the desired version
    log.info(
      'Returning custom public directory address',
      publicDirectoryAddress
    );
    return publicDirectoryAddress;
  }
  const wellKnownPublicDirectoryAddress = PUBLIC_DIRECTORY.get(CHAIN_ID);
  if (!wellKnownPublicDirectoryAddress) {
    log.error(
      'Could not find well-known public directory address for chain',
      CHAIN_ID
    );
    process.exit(1); // exiting since this is a critical error
  }
  log.info(
    'Returning default public directory address',
    wellKnownPublicDirectoryAddress
  );
  return wellKnownPublicDirectoryAddress;
};

export const PUBLIC_DIRECTORY_CONTRACT_ADDRESS =
  resolvePublicDirectoryAddress();

export const {
  ENV,
  PORT,
  TYPEORM_PORT,
  TYPEORM_HOST,
  TYPEORM_TYPE,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_MIGRATIONS_RUN,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  JWT_SECRET,
  ACCESS_TOKEN_LIFE,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS,
  AWS_ID,
  AWS_SECRET,
  AWS_REGION,
  AWS_S3_BUCKETNAME,
  AWS_SES_API_VERSION,
  DOCS_ENABLED,
  SENDGRID_API_USER,
  SENDGRID_API_KEY,
  IS_COT_DEPENDENT_SERVICE,
  IDENTITY_MANAGER_BASE_URL,
  DID_LAC1,
  DID_LAC1_ADD_NEW_ETHEREUM_ACCOUNT_ATTRIBUTE,
  KEY_MANAGER_BASE_URL,
  SECP256K1_KEY,
  SECP256K1_SIGN_ETHEREUM_TRANSACTION,
  SECP256K1_SIGN_LACCHAIN_TRANSACTION
} = process.env;
