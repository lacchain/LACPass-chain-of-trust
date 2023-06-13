import { ChainOfTrustController } from './lac1/chain.of.trust.controller';
import { DidLac1Controller } from './lac1/did.controller';
import { ManagerController } from './lac1/manager.controller';
import { PublicDirectoryController } from './lac1/public.directory.controller';

export const controllers = [
  DidLac1Controller,
  ManagerController,
  PublicDirectoryController,
  ChainOfTrustController
];
