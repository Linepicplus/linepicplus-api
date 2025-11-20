/**
 * Upload Model
 * For file uploads
 */

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  timestamp: string;
  fileId: number;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  file_url?: string;
  file_id?: string;
  error?: string;
  message?: string;
}

