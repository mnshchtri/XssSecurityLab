import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertReviewSchema, insertCartItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  // Set up auth routes
  setupAuth(app);

  // ===== Product Routes =====
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });
  
  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });
    
    const product = await storage.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    res.json(product);
  });
  
  // Get products by category
  app.get("/api/categories/:category", async (req, res) => {
    const category = req.params.category;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  });
  
  // Search products - Vulnerable to Reflected XSS
  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string || "";
    const products = await storage.searchProducts(query);
    res.json({ products, query });
  });
  
  // ===== Review Routes =====
  
  // Get reviews by product ID
  app.get("/api/products/:id/reviews", async (req, res) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) return res.status(400).json({ message: "Invalid product ID" });
    
    const reviews = await storage.getReviewsByProductId(productId);
    res.json(reviews);
  });
  
  // Create review - Vulnerable to Stored XSS
  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        username: req.body.username || req.user.username
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error });
    }
  });
  
  // ===== Cart Routes =====
  
  // Get user's cart
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    const cartItems = await storage.getCartItemsByUserId(req.user.id);
    
    // Get product details for each cart item
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return {
          ...item,
          product
        };
      })
    );
    
    res.json(itemsWithDetails);
  });
  
  // Add item to cart
  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const cartItem = await storage.addCartItem(cartItemData);
      
      const product = await storage.getProductById(cartItem.productId);
      res.status(201).json({
        ...cartItem,
        product
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid cart data", error });
    }
  });
  
  // Update cart item quantity
  app.patch("/api/cart/:id/quantity", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    const id = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity);
    
    if (isNaN(id) || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid data" });
    }
    
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    
    const updatedItem = await storage.updateCartItem(id, quantity);
    const product = await storage.getProductById(updatedItem!.productId);
    
    res.json({
      ...updatedItem,
      product
    });
  });
  
  // Update cart item note - Vulnerable to DOM-based XSS
  app.patch("/api/cart/:id/note", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    const id = parseInt(req.params.id);
    const note = req.body.note;
    
    if (isNaN(id) || typeof note !== 'string') {
      return res.status(400).json({ message: "Invalid data" });
    }
    
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    
    const updatedItem = await storage.updateCartItemNote(id, note);
    const product = await storage.getProductById(updatedItem!.productId);
    
    res.json({
      ...updatedItem,
      product
    });
  });
  
  // Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid cart item ID" });
    
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    
    await storage.removeCartItem(id);
    res.status(204).send();
  });

  return server;
}
