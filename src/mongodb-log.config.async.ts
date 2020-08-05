import { ModuleMetadata, FactoryProvider } from "@nestjs/common/interfaces";
import { MongodbLogConfig } from "./mongodb-log.config";

export interface MongodbLogConfigAsync extends 
  Pick<ModuleMetadata, 'imports'>, 
  Pick<FactoryProvider, 'inject'> {
  useFactory: (...args: any[]) => Promise<MongodbLogConfig> | MongodbLogConfig
}