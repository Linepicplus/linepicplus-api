/**
 * Admin Service
 * Business logic for admin authentication
 */

import { DatabaseService } from './database.service';
import { Admin, AdminCreateDTO, AdminLoginDTO, AdminSession } from '../models/admin.model';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class AdminService {
  private static COLLECTION = 'admins';

  private static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static async createAdmin(data: AdminCreateDTO): Promise<Admin> {
    const db = DatabaseService.getInstance();

    // Check if email already exists
    const existing = await db.findOne<Admin>(this.COLLECTION, { email: data.email });
    if (existing) {
      throw new Error('Admin with this email already exists');
    }

    const admin: Partial<Admin> = {
      id: uuidv4(),
      email: data.email,
      password: this.hashPassword(data.password),
      name: data.name,
      role: data.role || 'admin',
    };

    return db.create<Admin>(this.COLLECTION, admin);
  }

  static async login(data: AdminLoginDTO): Promise<AdminSession | null> {
    const db = DatabaseService.getInstance();

    const admin = await db.findOne<Admin>(this.COLLECTION, { 
      email: data.email 
    });

    if (!admin) {
      return null;
    }

    const hashedPassword = this.hashPassword(data.password);
    if (admin.password !== hashedPassword) {
      return null;
    }

    // Update last login
    await db.updateOne<Admin>(this.COLLECTION, admin.id, {
      lastLogin: new Date().toISOString(),
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  }

  static async getAdminById(id: string): Promise<Admin | null> {
    const db = DatabaseService.getInstance();
    return db.findById<Admin>(this.COLLECTION, id);
  }

  static async getAllAdmins(): Promise<Admin[]> {
    const db = DatabaseService.getInstance();
    return db.findMany<Admin>(this.COLLECTION, {});
  }

  static async deleteAdmin(id: string): Promise<boolean> {
    const db = DatabaseService.getInstance();
    return db.deleteOne(this.COLLECTION, id);
  }
}

