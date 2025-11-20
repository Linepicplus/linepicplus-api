/**
 * Admin Model
 * For admin user authentication
 */

export interface Admin {
  id: string;
  email: string;
  password: string; // Hashed password
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminCreateDTO {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'super_admin';
}

export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

