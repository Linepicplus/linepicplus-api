/**
 * Secure Upload Middleware
 * Enhanced security for file uploads
 */

import { Request, Response, NextFunction } from 'express';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs/promises';

/**
 * Validate file using magic bytes (not just MIME type)
 * For disk storage (multer disk)
 */
export async function validateFileType(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return next();
    }

    const buffer = await fs.readFile(req.file.path);
    const fileType = await fileTypeFromBuffer(buffer);

    // Check if file type matches expected image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      // Delete the uploaded file
      await fs.unlink(req.file.path).catch(() => {});
      
      return res.status(400).json({
        success: false,
        error: 'Invalid image file. Only JPEG, PNG, GIF, and WebP are allowed.',
      });
    }

    // Note: SVG files are already blocked by multer fileFilter
    // (SVG are text/XML files without binary magic bytes, so fileTypeFromBuffer won't detect them)

    next();
  } catch (error) {
    console.error('[Secure Upload] Error validating file:', error);
    
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    res.status(500).json({
      success: false,
      error: 'Error validating file',
    });
  }
}

/**
 * Validate image buffer using magic bytes
 * For memory storage (multer memory)
 */
export async function validateImageBuffer(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file || !req.file.buffer) {
      return next();
    }

    const fileType = await fileTypeFromBuffer(req.file.buffer);

    // Check if file type matches expected image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image file. Only JPEG, PNG, GIF, and WebP are allowed.',
      });
    }

    // Note: SVG files are already blocked by multer fileFilter
    // (SVG are text/XML files without binary magic bytes, so fileTypeFromBuffer won't detect them)

    next();
  } catch (error) {
    console.error('[Secure Upload] Error validating image buffer:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error validating image',
    });
  }
}


/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Only alphanumeric, dots, and hyphens
    .replace(/\.{2,}/g, '.') // No consecutive dots (path traversal)
    .replace(/^\.+/, '') // No leading dots
    .toLowerCase()
    .slice(0, 255); // Limit length
}

/**
 * Check file size
 */
export function validateFileSize(maxSize: number = 10 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    if (req.file.size > maxSize) {
      // Delete the file
      fs.unlink(req.file.path).catch(() => {});
      
      return res.status(413).json({
        success: false,
        error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
      });
    }

    next();
  };
}

/**
 * Log suspicious upload attempts
 */
export function logSuspiciousUploads(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return next();
  }

  const suspiciousPatterns = [
    /\.php/i,
    /\.exe/i,
    /\.sh/i,
    /\.bat/i,
    /\.cmd/i,
    /\.com/i,
    /\.pif/i,
    /\.scr/i,
    /\.vbs/i,
    /\.js$/i, // JavaScript files
    /\.jsp/i,
    /\.asp/i,
    /\.\./,  // Path traversal
  ];

  const filename = req.file.originalname.toLowerCase();
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(filename));

  if (isSuspicious) {
    console.warn('[SECURITY] Suspicious upload attempt:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // You could also:
    // - Send alert to monitoring system
    // - Block IP temporarily
    // - Increase rate limit strictness for this IP
  }

  next();
}

