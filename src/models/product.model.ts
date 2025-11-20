/**
 * Product Model
 * Based on actual Linepicplus API structure
 */

export interface ProductImage {
  src: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  position: number;
  visible: boolean;
  variation: boolean;
  is_visible: number;
  is_variation: number;
  is_taxonomy: number;
  value: string;
}

// Product for list view (simple images array)
export interface ProductListItem {
  id: number;
  name: string;
  description: string;
  price: string;
  images: string[];
}

// Product for detail view (with attributes and image objects)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  sku: string;
  regular_price: string;
  attributes: ProductAttribute[];
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateDTO {
  id?: number;
  name: string;
  description?: string;
  price: string;
  sku?: string;
  regular_price?: string;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  featured?: number;
  status?: string;
}

