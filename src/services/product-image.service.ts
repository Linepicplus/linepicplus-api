/**
 * Product Image Service
 * Handles product image uploads and management
 */

import fs from 'fs/promises';
import path from 'path';

export class ProductImageService {
  private static UPLOAD_DIR = 'uploads/products';

  /**
   * Save uploaded image for a product
   */
  static async saveImage(productId: number, file: Express.Multer.File): Promise<string> {
    // Create product directory
    const productDir = path.join(this.UPLOAD_DIR, String(productId));
    await fs.mkdir(productDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}${ext}`;
    const filepath = path.join(productDir, filename);

    // Write file
    await fs.writeFile(filepath, file.buffer);

    // Return URL
    return `/${filepath}`;
  }

  /**
   * Delete image file
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Remove leading slash
      const filepath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Get all images for a product
   */
  static async getProductImages(productId: number): Promise<string[]> {
    try {
      const productDir = path.join(this.UPLOAD_DIR, String(productId));
      const files = await fs.readdir(productDir);
      return files.map(file => `/${productDir}/${file}`);
    } catch (error) {
      return [];
    }
  }

  /**
   * Delete all images for a product
   */
  static async deleteProductImages(productId: number): Promise<void> {
    try {
      const productDir = path.join(this.UPLOAD_DIR, String(productId));
      await fs.rm(productDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting product images:', error);
    }
  }
}

