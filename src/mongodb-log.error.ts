export class MongodbLogError {
  static print(message: string): void {
    console.log('\x1b[31m%s\x1b[0m: ', '[MongodbLogModule] Error', message);
  }
}
