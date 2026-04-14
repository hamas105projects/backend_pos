import { Request, Response } from 'express';

import { productService } from '../services/productService';
import { successResponse, errorResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter';

export const productController = {
  // Create product
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, category } = req.body;
      const urlpathImage = (req.file as any)?.path || undefined;
      
      const product = await productService.createProduct({
        name,
        description,
        price,
        category,
        urlpathImage,
      });
      
      createdResponse(res, product, 'Product created successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Get all products
  async getAllProducts(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1')) || 1);
      const limit = Math.max(1, parseInt(String(req.query.limit || '10')) || 10);
      const getQueryString = (queryValue: any): string => {
        if (!queryValue) return '';
        if (Array.isArray(queryValue)) return String(queryValue[0] || '');
        return String(queryValue);
      };
      const category = getQueryString(req.query.category);
      const search = getQueryString(req.query.search);
      const minPriceStr = getQueryString(req.query.minPrice);
      const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
      const maxPriceStr = getQueryString(req.query.maxPrice);
      const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
      
      const result = await productService.getAllProducts(
        page, limit, category, search, minPrice, maxPrice
      );
      
      paginatedResponse(res, result.products, result.pagination, 'Products retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
  
  // Get product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const productId = parseInt(String(req.params.id));
      if (isNaN(productId)) {
        return errorResponse(res, 'Invalid product ID', 400);
      }
      const product = await productService.getProductById(productId);
      successResponse(res, product, 'Product retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  },
  
  // Update product
  async updateProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(String(req.params.id));
      if (isNaN(productId)) {
        return errorResponse(res, 'Invalid product ID', 400);
      }
      const { name, description, price, category } = req.body;
      
      const updateData: any = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price) updateData.price = price;
      if (category) updateData.category = category;
      if (req.file) updateData.urlpathImage = (req.file as any).path;
      
      const product = await productService.updateProduct(productId, updateData);
      successResponse(res, product, 'Product updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Delete product
  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(String(req.params.id));
      if (isNaN(productId)) {
        return errorResponse(res, 'Invalid product ID', 400);
      }
      const product = await productService.deleteProduct(productId);
      successResponse(res, product, 'Product deleted successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Get products by category
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const getQueryString = (queryValue: any): string => {
        if (!queryValue) return '';
        if (Array.isArray(queryValue)) return String(queryValue[0] || '');
        return String(queryValue);
      };
      const category = getQueryString(req.params.category);
      const page = Math.max(1, parseInt(String(req.query.page || '1')) || 1);
      const limit = Math.max(1, parseInt(String(req.query.limit || '10')) || 10);
      
      const result = await productService.getProductsByCategory(category, page, limit);
      paginatedResponse(res, result.products, result.pagination, 'Products retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
};