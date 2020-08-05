import { MongodbLogConfig } from './mongodb-log.config';
import { MongodbLogService } from './mongodb-log.service';
import { MongodbLogConnections } from './mongodb-log.connections';
import { DEFAULT_LOG_COLLECTION_NAME, MONGODB_LOG_CONFIG } from './constants';
import { MongodbLogError } from './mongodb-log.error';
import { Inject } from '@nestjs/common';

export class MongodbLogServiceFactory {
  static async create(
    @Inject(MONGODB_LOG_CONFIG) config: MongodbLogConfig,
    connections: MongodbLogConnections,
  ): Promise<MongodbLogService> {
    try {
      const connection = await connections.create(config.connectionString);
      return new MongodbLogService(
        connection,
        config.databaseName,
        config.logsCollectionName || DEFAULT_LOG_COLLECTION_NAME,
        config.additionalCollectionNames,
      );
    } catch (error) {
      MongodbLogError.print(error.message);
      throw error;
    }
  }
}
