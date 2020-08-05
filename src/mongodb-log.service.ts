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

  async registerOn(collectionName: string, data: any): Promise<InsertOneWriteOpResult<any> | undefined> {
    const collection = this.additionalCollections[collectionName];
    if (!collection) {
      MongodbLogError.print(`Additional collection "${collectionName}" need to be set on module config.`);
      return;
    }
    return await this.register(collection, data);
  }

  private async register(colletion: Collection, data: any): Promise<InsertOneWriteOpResult<any>> {
    return await colletion.insertOne({ data, date: new Date() });
  }
}
