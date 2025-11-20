/**
 * Product Service
 * Business logic for products
 */

import { DatabaseService } from './database.service';
import { Product, ProductListItem, ProductCreateDTO, ProductQueryParams } from '../models/product.model';
import { PaginationResult } from '../interfaces/i-database';

export class ProductService {
  private static COLLECTION = 'products';

  static async getProducts(params: ProductQueryParams): Promise<PaginationResult<ProductListItem>> {
    const db = DatabaseService.getInstance();
    
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const skip = (page - 1) * perPage;

    // Get all products
    let products = await db.findMany<Product>(this.COLLECTION, {});

    // Filter by search if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range if provided
    if (params.min_price !== undefined) {
      const minPrice = params.min_price / 1.20; // Remove TVA
      products = products.filter(p => parseFloat(p.price) >= minPrice);
    }

    if (params.max_price !== undefined) {
      const maxPrice = params.max_price / 1.20; // Remove TVA
      products = products.filter(p => parseFloat(p.price) <= maxPrice);
    }

    const total = products.length;
    const totalPages = Math.ceil(total / perPage);

    // Apply pagination
    const paginatedProducts = products.slice(skip, skip + perPage);

    // Convert to list format (simple image array)
    const listItems: ProductListItem[] = paginatedProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      images: p.images.map(img => img.src),
    }));

    return {
      data: listItems,
      total,
      page,
      perPage,
      totalPages,
    };
  }

  static async getProductById(id: number): Promise<Product | null> {
    const db = DatabaseService.getInstance();
    const products = await db.findMany<Product>(this.COLLECTION, {});
    return products.find(p => p.id === id) || null;
  }

  static async createProduct(data: ProductCreateDTO): Promise<Product> {
    const db = DatabaseService.getInstance();
    
    // Generate next ID
    const allProducts = await db.findMany<Product>(this.COLLECTION, {});
    const maxId = allProducts.reduce((max, p) => Math.max(max, p.id), 0);
    
    const product: Product = {
      id: data.id || maxId + 1,
      name: data.name,
      description: data.description || '',
      price: data.price,
      sku: data.sku || '',
      regular_price: data.regular_price || data.price,
      attributes: data.attributes || [],
      images: data.images || [],
    };

    return db.create<Product>(this.COLLECTION, product);
  }

  static async updateProduct(id: number, data: Partial<ProductCreateDTO>): Promise<Product | null> {
    const db = DatabaseService.getInstance();
    const products = await db.findMany<Product>(this.COLLECTION, {});
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return null;
    }

    const updated = {
      ...product,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update in DB (we need to find by internal id)
    const allProducts = await db.findMany<any>(this.COLLECTION, {});
    const dbProduct = allProducts.find(p => p.id === id);
    if (dbProduct) {
      return db.updateOne<Product>(this.COLLECTION, dbProduct.id, updated);
    }

    return null;
  }

  static async deleteProduct(id: number): Promise<boolean> {
    const db = DatabaseService.getInstance();
    const products = await db.findMany<any>(this.COLLECTION, {});
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return false;
    }

    return db.deleteOne(this.COLLECTION, product.id);
  }
}

