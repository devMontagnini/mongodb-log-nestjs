import { Module, Global, DynamicModule } from '@nestjs/common';
import { MONGODB_LOG_SERVICE_TOKEN, MONGODB_LOG_CONFIG } from './constants';
import { MongodbLogConfig } from './mongodb-log.config';
import { MongodbLogServiceFactory } from './mongodb-log-service.factory';
import { MongodbLogConnections } from './mongodb-log.connections';
import { MongodbLogConfigAsync } from './mongodb-log.config.async';

@Global()
@Module({
  providers: [
    {
      provide: MONGODB_LOG_CONFIG,
      useValue: null,
    },
    MongodbLogConnections,
    {
      provide: MONGODB_LOG_SERVICE_TOKEN,
      useFactory: MongodbLogServiceFactory.create,
      inject: [MONGODB_LOG_CONFIG, MongodbLogConnections],
    },
  ],
  exports: [MongodbLogConnections, MONGODB_LOG_SERVICE_TOKEN],
})
export class MongodbLogHostModule {
  static forRoot(config: MongodbLogConfig): DynamicModule {
    return {
      module: MongodbLogHostModule,
      providers: [
        {
          provide: MONGODB_LOG_CONFIG,
          useValue: config,
        },
      ],
    };
  }

  static forRootAsync(config: MongodbLogConfigAsync): DynamicModule {
    return {
      module: MongodbLogHostModule,
      imports: config.imports,
      providers: [
        {
          provide: MONGODB_LOG_CONFIG,
          useFactory: config.useFactory,
          inject: config.inject,
        },
      ],
    };
  }
}
