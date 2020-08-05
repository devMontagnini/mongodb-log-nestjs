import { Module, DynamicModule } from '@nestjs/common';
import { MongodbLogService } from './mongodb-log.service';
import { MONGODB_LOG_SERVICE_TOKEN, MONGODB_LOG_CONFIG } from './constants';
import { MongodbLogHostModule } from './mongodb-log-host-module';
import { MongodbLogConfig } from './mongodb-log.config';
import { MongodbLogServiceFactory } from './mongodb-log-service.factory';
import { MongodbLogConnections } from './mongodb-log.connections';
import { MongodbLogConfigAsync } from './mongodb-log.config.async';

@Module({
  providers: [
    {
      provide: MongodbLogService,
      useExisting: MONGODB_LOG_SERVICE_TOKEN,
    },
  ],
  exports: [MongodbLogService],
})
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

  private static buildRoot(config?: MongodbLogConfig | MongodbLogConfigAsync): DynamicModule {
    const moduleMetadata: DynamicModule = {
      module: MongodbLogModule,
    };

    if (!config) {
      return {
        ...moduleMetadata,
        imports: [MongodbLogHostModule],
      };
    }

    const isAsyncConfig = 'useFactory' in config;
    return {
      ...moduleMetadata,
      imports: isAsyncConfig
        ? [MongodbLogHostModule.forRootAsync(config as MongodbLogConfigAsync)]
        : [MongodbLogHostModule.forRoot(config as MongodbLogConfig)],
    };
  }

  private static buildFeature(config: MongodbLogConfig | MongodbLogConfigAsync): DynamicModule {
    const moduleMetadata: DynamicModule = {
      module: MongodbLogModule,
      providers: [
        {
          provide: MongodbLogService,
          useFactory: MongodbLogServiceFactory.create,
          inject: [MONGODB_LOG_CONFIG, MongodbLogConnections],
        },
      ],
    };

    const isAsyncConfig = 'useFactory' in config;
    if (isAsyncConfig) {
      const asyncConfig = config as MongodbLogConfigAsync;
      moduleMetadata.imports = asyncConfig.imports;
      moduleMetadata.providers.push({
        provide: MONGODB_LOG_CONFIG,
        useFactory: asyncConfig.useFactory,
        inject: asyncConfig.inject,
      });
      return moduleMetadata;
    }

    const syncConfig = config as MongodbLogConfig;
    moduleMetadata.providers.push({
      provide: MONGODB_LOG_CONFIG,
      useValue: syncConfig,
    });
    return moduleMetadata;
  }
}
