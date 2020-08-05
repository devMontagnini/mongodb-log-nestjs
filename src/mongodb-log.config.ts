export interface MongodbLogConfig {
  databaseName: string;
  connectionString: string;
  logsCollectionName?: string;
  additionalCollectionNames?: string[];
}
