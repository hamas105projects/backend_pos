import { prisma } from '../config/database';
import { Category } from '../constants/enum';
import fs from 'fs';
import path from 'path';

export const productService = {
  // Create product
  async createProduct(productData: {
    name: string;
    description?: string;
    price: number;
    category: string;
    urlpathImage?: string;
  }) {
    const { name, description, price, category, urlpathImage } = productData;
    
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        category: category as any,
        urlpathImage: urlpathImage || null,
      },
    });
    
    return product;
  },
  
  // Get all products
  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      deletedAt: null,
    };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  
  // Get product by ID
  async getProductById(productId: number) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      include: {
        transactionItems: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },
  
  // Update product
  async updateProduct(productId: number, updateData: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    urlpathImage?: string;
  }) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { ...updateData, category: updateData.category as any },
    });
    
    return product;
  },
  
  // Delete product (soft delete)
  async deleteProduct(productId: number) {
    // Check if product has transactions
    const hasTransactions = await prisma.transactionItem.findFirst({
      where: { productId },
    });
    
    if (hasTransactions) {
      // Soft delete if has transactions
      const product = await prisma.product.update({
        where: { id: productId },
        data: { deletedAt: new Date() },
      });
      return product;
    } else {
      // Hard delete if no transactions
      const product = await prisma.product.delete({
        where: { id: productId },
      });
      return product;
    }
  },
  
  // Update product image
  async updateProductImage(productId: number, imagePath: string) {
    // Get old image to delete
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { urlpathImage: true },
    });
    
    // Delete old image file if exists
    if (oldProduct?.urlpathImage) {
      const oldImagePath = path.join(process.cwd(), oldProduct.urlpathImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: { urlpathImage: imagePath },
    });
    
    return product;
  },
  
  // Get products by category
  async getProductsByCategory(category: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where = {
      category: category as any,
      deletedAt: null,
    };
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};