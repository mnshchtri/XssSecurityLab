import { users, type User, type InsertUser, products, type Product, type InsertProduct, reviews, type Review, type InsertReview, cartItems, type CartItem, type InsertCartItem } from "@shared/schema";
import { db } from './db';
import { eq, and, ilike } from 'drizzle-orm';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Review methods
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart methods
  getCartItemsByUserId(userId: number): Promise<CartItem[]>;
  getCartItemById(id: number): Promise<CartItem | undefined>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  updateCartItemNote(id: number, note: string): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
}

class NeonStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }
  async getProductById(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  async searchProducts(query: string): Promise<Product[]> {
    return db.select().from(products).where(
      ilike(products.name, `%${query}%`)
    );
  }

  // Review methods
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId));
  }
  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  // Cart methods
  async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }
  async getCartItemById(id: number): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return result[0];
  }
  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(cartItem).returning();
    return result[0];
  }
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return result[0];
  }
  async updateCartItemNote(id: number, note: string): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ note }).where(eq(cartItems.id, id)).returning();
    return result[0];
  }
  async removeCartItem(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }
}

export const storage = new NeonStorage();
