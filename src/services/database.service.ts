/**
 * Database Service
 * Factory pattern for database initialization
 */

import { IDatabase } from '../interfaces/i-database';
import { FileDatabase } from '../interfaces/i-filedb';
import { MongoDBDatabase } from '../interfaces/i-mongodb';

export class DatabaseService {
  private static instance: IDatabase;

  static async initialize(type: 'filedb' | 'mongodb' = 'filedb', options?: any): Promise<IDatabase> {
    if (this.instance) {
      return this.instance;
    }

    switch (type) {
      case 'filedb':
        this.instance = new FileDatabase(options?.path || './data');
        break;
      case 'mongodb':
        this.instance = new MongoDBDatabase();
        break;
      default:
        throw new Error(`Unknown database type: ${type}`);
    }

    await this.instance.connect();
    return this.instance;
  }

  static getInstance(): IDatabase {
    if (!this.instance) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
    }
  }
}

