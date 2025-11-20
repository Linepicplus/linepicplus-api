/**
 * Upload Service
 * Business logic for file uploads
 */

import { DatabaseService } from './database.service';
import { UploadedFile } from '../models/upload.model';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

export class UploadService {
  private static COLLECTION = 'uploads';
  private static uploadPath: string = './uploads';

  static setUploadPath(uploadPath: string): void {
    this.uploadPath = uploadPath;
  }

  static async ensureUploadDirectory(): Promise<void> {
    await fs.mkdir(this.uploadPath, { recursive: true });
  }

  static async saveFile(
    file: Express.Multer.File,
    timestamp: string,
    fileId: number
  ): Promise<UploadedFile> {
    const db = DatabaseService.getInstance();
    await this.ensureUploadDirectory();

    const fileExt = path.extname(file.originalname);
    const filename = `${timestamp}_${fileId}${fileExt}`;
    const filePath = path.join(this.uploadPath, filename);

    // Move file to uploads directory
    await fs.rename(file.path, filePath);

    const uploadedFile: Partial<UploadedFile> = {
      id: uuidv4(),
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath,
      url: `/uploads/${filename}`,
      timestamp,
      fileId,
    };

    return db.create<UploadedFile>(this.COLLECTION, uploadedFile);
  }

  static async getFileById(id: string): Promise<UploadedFile | null> {
    const db = DatabaseService.getInstance();
    return db.findById<UploadedFile>(this.COLLECTION, id);
  }

  static async getFilesByTimestamp(timestamp: string): Promise<UploadedFile[]> {
    const db = DatabaseService.getInstance();
    return db.findMany<UploadedFile>(this.COLLECTION, { timestamp });
  }

  static async deleteFile(id: string): Promise<boolean> {
    const db = DatabaseService.getInstance();
    const file = await this.getFileById(id);

    if (!file) {
      return false;
    }

    // Delete physical file
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('[UploadService] Failed to delete file:', error);
    }

    // Delete database record
    return db.deleteOne(this.COLLECTION, id);
  }
}

