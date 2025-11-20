/**
 * Seed Script
 * Populate database with sample data
 */

import dotenv from 'dotenv';
import { DatabaseService } from '../src/services/database.service';
import { ProductService } from '../src/services/product.service';
import { CouponService } from '../src/services/coupon.service';

dotenv.config();

async function seedData() {
  try {
    console.log('🌱 Seeding database...');

    // Initialize database
    const dbType = (process.env.DB_TYPE || 'filedb') as 'filedb' | 'mongodb';
    const dbPath = process.env.FILE_DB_PATH || './data';
    await DatabaseService.initialize(dbType, { path: dbPath });

    // Seed products
    console.log('📦 Creating sample products...');
    
    const products = [
      {
        id: 50696,
        name: 'T-shirt Troll Face',
        description: '<span id="productTitle" class="a-size-large product-title-word-break">Le troll d\'internet</span>\r\n\r\nALPIDEX T-Shirts Hommes Noir / Blanc à Col Rond, Taille S M L XL Avec Logo Avant au centre (21cmx21cm).',
        price: '33.33333333',
        sku: '',
        regular_price: '33.33333333',
        attributes: [
          {
            id: 0,
            name: 'Size',
            options: ['S', 'M', 'L', 'XL'],
            position: 0,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'S | M | L | XL',
          },
          {
            id: 0,
            name: 'Color',
            options: ['Blanc', 'Noir'],
            position: 1,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'Blanc | Noir',
          },
        ],
        images: [
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1726046211409.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1726046202598.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1726046215699.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1726046220706.png' },
        ],
      },
      {
        id: 50027,
        name: 'T-shirt Ton TikTok c\'est que des pelleteuses!',
        description: '<span id="productTitle" class="a-size-large product-title-word-break">Ton TikTok c\'est que des pelleteuses!</span>\r\n\r\nRéférence à une vidéo Youtube d\'amixem.\r\n\r\nALPIDEX T-Shirts Hommes Noir / Blanc à Col Rond, Taille S M L XL Avec Logo Avant au centre (31.68cm x 23cm).',
        price: '33.33333333',
        sku: '',
        regular_price: '33.33333333',
        attributes: [
          {
            id: 0,
            name: 'Size',
            options: ['S', 'M', 'L', 'XL'],
            position: 0,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'S | M | L | XL',
          },
          {
            id: 0,
            name: 'Color',
            options: ['Noir', 'Blanc'],
            position: 1,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'Noir | Blanc',
          },
        ],
        images: [
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725461089395.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725460986507.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725461094485.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725460991512.png' },
        ],
      },
      {
        id: 49934,
        name: 'T-shirt Squelette - 287',
        description: '<span id="productTitle" class="a-size-large product-title-word-break">ALPIDEX T-Shirts Hommes Noir / Blanc à Col Rond, Taille S M L XL Avec Logo Avant au centre (23.cm x 22.86cm).</span>',
        price: '33.33333333',
        sku: '',
        regular_price: '33.33333333',
        attributes: [
          {
            id: 0,
            name: 'Size',
            options: ['S', 'M', 'L', 'XL'],
            position: 0,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'S | M | L | XL',
          },
          {
            id: 0,
            name: 'Color',
            options: ['Noir', 'Blanc'],
            position: 1,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'Noir | Blanc',
          },
        ],
        images: [
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725363470251.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725363411995.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725363482240.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725363494487.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725363499501.png' },
        ],
      },
      {
        id: 49901,
        name: 'T-shirt Motivation',
        description: '<span id="productTitle" class="a-size-large product-title-word-break">ALPIDEX T-Shirts Hommes Noir / Blanc à Col Rond, Taille S M L XL Avec Logo Avant (25.92cm x 13.77cm).</span>',
        price: '33.33333333',
        sku: '',
        regular_price: '33.33333333',
        attributes: [
          {
            id: 0,
            name: 'Size',
            options: ['S', 'M', 'L', 'XL'],
            position: 0,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'S | M | L | XL',
          },
          {
            id: 0,
            name: 'Color',
            options: ['Noir', 'Blanc'],
            position: 1,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'Noir | Blanc',
          },
        ],
        images: [
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725361515518.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725361486523.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725361498836.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/09/1725361527521.png' },
        ],
      },
      {
        id: 47717,
        name: 'T-shirt Safari Zone',
        description: '<span id="productTitle" class="a-size-large product-title-word-break">ALPIDEX T-Shirts Hommes Noir / Blanc à Col Rond, Taille S M L XL Avec Logo Avant (25.92cm 18.89cm).</span>',
        price: '33.33333333',
        sku: '',
        regular_price: '33.33333333',
        attributes: [
          {
            id: 0,
            name: 'Size',
            options: ['S', 'M', 'L', 'XL'],
            position: 0,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'S | M | L | XL',
          },
          {
            id: 0,
            name: 'Color',
            options: ['Noir', 'Blanc'],
            position: 1,
            visible: true,
            variation: true,
            is_visible: 1,
            is_variation: 1,
            is_taxonomy: 0,
            value: 'Noir | Blanc',
          },
        ],
        images: [
          { src: 'https://linepicplus.com/wp-content/uploads/2024/08/1723275090171.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/08/1723275083773.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/08/1723275103867.png' },
          { src: 'https://linepicplus.com/wp-content/uploads/2024/08/1723275114030.png' },
        ],
      },
    ];

    for (const product of products) {
      await ProductService.createProduct(product);
      console.log(`  ✅ Created: ${product.name}`);
    }

    // Seed coupons
    console.log('🎟️  Creating sample coupons...');
    
    const coupons = [
      {
        code: 'WELCOME10',
        amount: '10',
        type: 'percent' as const,
        description: 'Code promo de bienvenue - 10% de réduction',
        usage_limit: 100,
      },
      {
        code: 'NOEL2024',
        amount: '5',
        type: 'fixed_cart' as const,
        description: 'Code promo de Noël - 5€ de réduction',
        date_expires: '2024-12-31T23:59:59.000Z',
        minimum_amount: '30',
      },
    ];

    for (const coupon of coupons) {
      await CouponService.createCoupon(coupon);
      console.log(`  ✅ Created: ${coupon.code}`);
    }

    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');

    await DatabaseService.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData();

