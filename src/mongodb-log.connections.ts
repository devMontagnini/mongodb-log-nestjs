import { MongoClient, MongoError } from "mongodb";
import { OnApplicationShutdown } from "@nestjs/common";

export class MongodbLogConnections implements OnApplicationShutdown {

  private connections: MongoClient[] = [];

  async create(connectionString: string): Promise<MongoClient> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
          connectionString,
          { useUnifiedTopology: true },
          (error: MongoError, client: MongoClient) => {
            if (error) {
              reject(error);
            }
            this.connections.push(client);
            resolve(client);
          },
        );
    });
  }

  onApplicationShutdown() {
    this.connections?.forEach(c => c.close());
  }

}