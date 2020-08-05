import { Module, DynamicModule } from '@nestjs/common';
import { MongodbLogService } from './mongodb-log.service';
import { MONGODB_LOG_SERVICE_TOKEN, MONGODB_LOG_CONFIG } from './constants';
import { MongodbLogHostModule } from './mongodb-log-host-module';
import { MongodbLogConfig } from './mongodb-log.config';
import { MongodbLogServiceFactory } from './mongodb-log-service.factory';
import { MongodbLogConnections } from './mongodb-log.connections';
import { MongodbLogError } from './mongodb-log.error';
import { MongodbLogConfigAsync } from './mongodb-log.config.async';

@Module({ })
export class MongodbLogModule {

  static forRoot(config?: MongodbLogConfig): DynamicModule {
    return MongodbLogModule.buildRoot(config);
  }

  static forRootAsync(config?: MongodbLogConfigAsync): DynamicModule {
    return MongodbLogModule.buildRoot(config);
  }

  static forFeature(config: MongodbLogConfig): DynamicModule {
    return MongodbLogModule.buildFeature(config);
  }

  static forFeatureAsync(config: MongodbLogConfigAsync): DynamicModule {
    return MongodbLogModule.buildFeature(config);
  }

  private static buildFeature(config: MongodbLogConfig | MongodbLogConfigAsync): DynamicModule {
    const moduleMetadata: DynamicModule = {
      module: MongodbLogModule,
      exports: [MongodbLogService],
      providers: [{
        provide: MongodbLogService,
        useFactory: MongodbLogServiceFactory.create,
        inject: [
          MONGODB_LOG_CONFIG,
          MongodbLogConnections
        ]
      }],
    };

    const syncConfig = (config as MongodbLogConfig);
    if(syncConfig.connectionString) {
      moduleMetadata.providers.push({
        provide: MONGODB_LOG_CONFIG,
        useValue: syncConfig,
      });
      return moduleMetadata;
    }

    const asyncConfig = (config as MongodbLogConfigAsync);
    if(asyncConfig.useFactory) {
      moduleMetadata.imports = asyncConfig.imports;
      moduleMetadata.providers.unshift({
        provide: MONGODB_LOG_CONFIG,
        useFactory: asyncConfig.useFactory,
        inject: asyncConfig.inject,
      });
      return moduleMetadata;
    }

    const errorMessage = 'Error on feature module build. Verify your forFeature or forFeatureAsync params method.';
    MongodbLogError.print(errorMessage);
    throw Error(errorMessage);
  }

  private static buildRoot(config?: MongodbLogConfig | MongodbLogConfigAsync): DynamicModule {
    if(!config) {
      return {
        module: MongodbLogModule,
        imports: [MongodbLogHostModule],
      };
    }

    const moduleMetadata: DynamicModule = {
      module: MongodbLogModule,
      exports: [MongodbLogService],
      providers: [{
        provide: MongodbLogService,
        useExisting: MONGODB_LOG_SERVICE_TOKEN,
      }],
    };

    const syncConfig = (config as MongodbLogConfig);
    if (syncConfig?.connectionString) {
      return {
        ...moduleMetadata,
        imports: [MongodbLogHostModule.forRoot(syncConfig)]
      }
    }

    const asyncConfig = (config as MongodbLogConfigAsync);
    if (asyncConfig?.useFactory) {
      return {
        ...moduleMetadata,
        imports: [MongodbLogHostModule.forRootAsync(asyncConfig)]
      }
    }

    const errorMessage = 'Error on root module build. Verify your forRoot or forRootAsync params method.';
    MongodbLogError.print(errorMessage);
    throw Error(errorMessage);
  }

}
