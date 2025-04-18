import { users, type User, type InsertUser, products, type Product, type InsertProduct, reviews, type Review, type InsertReview, cartItems, type CartItem, type InsertCartItem } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  currentUserId: number;
  currentProductId: number;
  currentReviewId: number;
  currentCartItemId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentReviewId = 1;
    this.currentCartItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
    
    // Set up memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Review methods
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    
    // Update product rating and review count
    const product = this.products.get(insertReview.productId);
    if (product) {
      const productReviews = await this.getReviewsByProductId(product.id);
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round(totalRating / productReviews.length);
      
      product.rating = averageRating;
      product.reviewCount = productReviews.length;
      this.products.set(product.id, product);
    }
    
    return review;
  }
  
  // Cart methods
  async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getCartItemById(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if product already in cart
    const existingItems = await this.getCartItemsByUserId(insertCartItem.userId);
    const existingItem = existingItems.find(item => item.productId === insertCartItem.productId);
    
    if (existingItem) {
      // Update quantity if product already in cart
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new cart item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = {
        ...insertCartItem,
        id,
        createdAt: new Date()
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }
  
  async updateCartItemNote(id: number, note: string): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.note = note;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Initialize with sample products
  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Wireless Headphones",
        description: "Premium wireless headphones with noise cancellation",
        price: 12999, // stored in cents
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "Electronics",
        rating: 4,
        reviewCount: 128
      },
      {
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitoring",
        price: 8999,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
        category: "Electronics",
        rating: 4,
        reviewCount: 94
      },
      {
        name: "Bluetooth Speaker",
        description: "Waterproof portable speaker with 24-hour battery",
        price: 7999,
        imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
        category: "Electronics",
        rating: 5,
        reviewCount: 156
      },
      {
        name: "Laptop Backpack",
        description: "Anti-theft design with USB charging port",
        price: 5999,
        imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
        category: "Accessories",
        rating: 3,
        reviewCount: 73
      },
      {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with customizable switches",
        price: 9999,
        imageUrl: "https://images.unsplash.com/photo-1595044778792-9c2fc2d79fa5",
        category: "Electronics",
        rating: 4,
        reviewCount: 112
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with long battery life",
        price: 3999,
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
        category: "Electronics",
        rating: 4,
        reviewCount: 89
      },
      {
        name: "USB-C Hub",
        description: "Multiport adapter with HDMI, USB-A, and SD card slots",
        price: 4999,
        imageUrl: "https://images.unsplash.com/photo-1636031452966-08f28ccfb151",
        category: "Electronics",
        rating: 4,
        reviewCount: 63
      },
      {
        name: "Phone Stand",
        description: "Adjustable aluminum phone stand for desk or bedside",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07",
        category: "Accessories",
        rating: 5,
        reviewCount: 42
      }
    ];
    
    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, {
        ...product,
        id,
        createdAt: new Date()
      });
    });
    
    // Add sample reviews for the first product
    const sampleReviews: InsertReview[] = [
      {
        productId: 1,
        userId: 0,
        username: "John D.",
        title: "Amazing sound quality!",
        content: "These headphones exceeded my expectations. The sound is crystal clear and the noise cancellation works perfectly, even in noisy environments.",
        rating: 5
      },
      {
        productId: 1,
        userId: 0,
        username: "Sarah M.",
        title: "Comfortable but a bit heavy",
        content: "The sound quality is excellent, but I find them a bit heavy for extended wear. Battery life is impressive though!",
        rating: 4
      }
    ];
    
    sampleReviews.forEach(review => {
      const id = this.currentReviewId++;
      this.reviews.set(id, {
        ...review,
        id,
        createdAt: new Date()
      });
    });
  }
}

export const storage = new MemStorage();
