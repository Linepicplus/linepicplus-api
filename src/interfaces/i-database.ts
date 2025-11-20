/**
 * Generic Database Interface
 * This interface defines the contract for all database implementations
 */

export interface IDatabase {
  // Connection & Initialization
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Generic CRUD operations
  findOne<T>(collection: string, query: Record<string, any>): Promise<T | null>;
  findMany<T>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  findById<T>(collection: string, id: string): Promise<T | null>;
  
  create<T>(collection: string, data: Partial<T>): Promise<T>;
  
  updateOne<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
  updateMany(collection: string, query: Record<string, any>, data: Record<string, any>): Promise<number>;
  
  deleteOne(collection: string, id: string): Promise<boolean>;
  deleteMany(collection: string, query: Record<string, any>): Promise<number>;
  
  count(collection: string, query: Record<string, any>): Promise<number>;
  
  // Utility
  clear(collection: string): Promise<void>;
}

export interface QueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>; // 1 for ascending, -1 for descending
  select?: string[]; // fields to include
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

