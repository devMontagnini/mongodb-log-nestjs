import { Injectable } from '@nestjs/common';
import { MongoClient, Collection, InsertOneWriteOpResult } from 'mongodb';
import { MongodbLogError } from './mongodb-log.error';

@Injectable()
export class MongodbLogService {
  private logColletion: Collection;
  private additionalCollections: { [name: string]: Collection } = {};

  constructor(
    private readonly client: MongoClient,
    private readonly databaseName: string,
    private readonly logsCollectionName: string,
    private readonly additionalCollectionNames?: string[],
  ) {
    const database = this.client.db(this.databaseName);
    this.logColletion = database.collection(this.logsCollectionName);
    this.additionalCollectionNames?.forEach((name) => {
      this.additionalCollections[name] = database.collection(name);
    });
  }

  async registerLog(log: any): Promise<InsertOneWriteOpResult<any>> {
    return await this.register(this.logColletion, log);
  }

  async registerOn(collectionName: string, log: any): Promise<InsertOneWriteOpResult<any> | undefined> {
    const collection = this.additionalCollections[collectionName];
    if (!collection) {
      MongodbLogError.print(`Collection "${collectionName}" need to be set on .forRoot or .ferFeature method.`);
      return;
    }
    return await this.register(collection, log);
  }

  private async register(colletion: Collection, log: any): Promise<InsertOneWriteOpResult<any>> {
    return await colletion.insertOne({ log,  date: new Date() });
  }
}
