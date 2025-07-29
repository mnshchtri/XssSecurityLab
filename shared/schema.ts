import { pgTable, text, serial, integer, boolean, timestamp, decimal, primaryKey, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email").unique(),
  bio: text("bio"),
  isAdmin: boolean("is_admin").default(false),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  usernameIdx: index("username_idx").on(table.username),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.category),
}));

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().transform((val) => parseFloat(val)).pipe(z.number().positive()),
  imageUrl: z.string().url(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
});

// Review Schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  userId: integer("user_id").notNull().references(() => users.id),
  username: text("username").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  productIdx: index("product_idx").on(table.productId),
  userIdx: index("user_idx").on(table.userId),
}));

export const insertReviewSchema = createInsertSchema(reviews).pick({
  productId: true,
  userId: true,
  username: true,
  title: true,
  content: true,
  rating: true,
}).extend({
  rating: z.number().int().min(1).max(5),
});

// Cart Schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  note: text("note"),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userProductIdx: index("user_product_idx").on(table.userId, table.productId),
}));

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
  note: true,
}).extend({
  quantity: z.number().int().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
