/**
 * Upload Routes
 * POST /upload - Upload file
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { UploadService } from '../services/upload.service';
import { UploadResponse } from '../models/upload.model';
import { validateFileType, logSuspiciousUploads } from '../middleware/secure-upload.middleware';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: './tmp',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload file
 *     description: Upload an image file
 *     parameters:
 *       - in: query
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *         description: Timestamp (Unix format)
 *       - in: query
 *         name: fileid
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID in the batch
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file
 *       413:
 *         description: File too large
 */
router.post('/upload', 
  upload.single('file'), 
  logSuspiciousUploads,
  validateFileType,
  async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      const response: UploadResponse = {
        success: false,
        error: 'No file provided',
      };
      return res.status(400).json(response);
    }

    const timestamp = req.query.time as string;
    const fileId = parseInt(req.query.fileid as string);

    if (!timestamp || isNaN(fileId)) {
      const response: UploadResponse = {
        success: false,
        error: 'Missing required parameters: time and fileid',
      };
      return res.status(400).json(response);
    }

    const uploadedFile = await UploadService.saveFile(req.file, timestamp, fileId);

    const response: UploadResponse = {
      success: true,
      file_url: uploadedFile.url,
      file_id: uploadedFile.id,
    };

    res.json(response);
  } catch (error: any) {
    console.error('[Upload Route] Error:', error);
    
    const response: UploadResponse = {
      success: false,
      error: error.message || 'Internal server error',
    };

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json(response);
    }

    res.status(500).json(response);
  }
});

export default router;

