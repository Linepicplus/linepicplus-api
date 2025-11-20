/**
 * File-based Database Interface
 * This is a simple JSON file-based database for development and small deployments
 */

import { IDatabase, QueryOptions } from './i-database';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileDatabase implements IDatabase {
  private dbPath: string;
  private connected: boolean = false;
  private cache: Map<string, any[]> = new Map();

  constructor(dbPath: string = './data') {
    this.dbPath = dbPath;
  }

  async connect(): Promise<void> {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dbPath, { recursive: true });
      this.connected = true;
      console.log(`[FileDB] Connected to file database at: ${this.dbPath}`);
    } catch (error) {
      console.error('[FileDB] Failed to connect:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.cache.clear();
    this.connected = false;
    console.log('[FileDB] Disconnected from file database');
  }

  isConnected(): boolean {
    return this.connected;
  }

  private getCollectionPath(collection: string): string {
    return path.join(this.dbPath, `${collection}.json`);
  }

  private async readCollection<T>(collection: string): Promise<T[]> {
    const filePath = this.getCollectionPath(collection);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  private async writeCollection<T>(collection: string, data: T[]): Promise<void> {
    const filePath = this.getCollectionPath(collection);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    this.cache.set(collection, data);
  }

  private matchesQuery(item: any, query: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(query)) {
      if (item[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private applyOptions<T>(items: T[], options?: QueryOptions): T[] {
    let result = [...items];

    // Apply sorting
    if (options?.sort) {
      const sortEntries = Object.entries(options.sort);
      result.sort((a: any, b: any) => {
        for (const [field, order] of sortEntries) {
          if (a[field] < b[field]) return order === 1 ? -1 : 1;
          if (a[field] > b[field]) return order === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply skip
    if (options?.skip) {
      result = result.slice(options.skip);
    }

    // Apply limit
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    // Apply field selection
    if (options?.select && options.select.length > 0) {
      result = result.map((item: any) => {
        const selected: any = {};
        for (const field of options.select!) {
          selected[field] = item[field];
        }
        return selected;
      });
    }

    return result;
  }

  async findOne<T>(collection: string, query: Record<string, any>): Promise<T | null> {
    const items = await this.readCollection<T>(collection);
    const found = items.find((item: any) => this.matchesQuery(item, query));
    return found || null;
  }

  async findMany<T>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T[]> {
    const items = await this.readCollection<T>(collection);
    const filtered = items.filter((item: any) => this.matchesQuery(item, query));
    return this.applyOptions(filtered, options);
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    return this.findOne<T>(collection, { id });
  }

  async create<T>(collection: string, data: Partial<T>): Promise<T> {
    const items = await this.readCollection<T>(collection);
    
    // Generate ID if not provided
    const newItem: any = {
      id: (data as any).id || uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    await this.writeCollection(collection, items);
    
    return newItem;
  }

  async updateOne<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.readCollection<T>(collection);
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedItem: any = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    await this.writeCollection(collection, items);
    
    return updatedItem;
  }

  async updateMany(collection: string, query: Record<string, any>, data: Record<string, any>): Promise<number> {
    const items = await this.readCollection(collection);
    let count = 0;

    const updatedItems = items.map((item: any) => {
      if (this.matchesQuery(item, query)) {
        count++;
        return {
          ...item,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    await this.writeCollection(collection, updatedItems);
    return count;
  }

  async deleteOne(collection: string, id: string): Promise<boolean> {
    const items = await this.readCollection(collection);
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    await this.writeCollection(collection, items);
    
    return true;
  }

  async deleteMany(collection: string, query: Record<string, any>): Promise<number> {
    const items = await this.readCollection(collection);
    const filteredItems = items.filter((item: any) => !this.matchesQuery(item, query));
    const deletedCount = items.length - filteredItems.length;

    await this.writeCollection(collection, filteredItems);
    
    return deletedCount;
  }

  async count(collection: string, query: Record<string, any>): Promise<number> {
    const items = await this.readCollection(collection);
    return items.filter((item: any) => this.matchesQuery(item, query)).length;
  }

  async clear(collection: string): Promise<void> {
    await this.writeCollection(collection, []);
  }
}

