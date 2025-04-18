import React, { createContext, ReactNode, useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, InsertCartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CartItemWithProduct = CartItem & {
  product: Product;
};

interface CartContextType {
  cart: CartItemWithProduct[];
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNote: (id: number, note: string) => void;
  removeItem: (id: number) => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { data: cart = [], isLoading, refetch } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    refetchOnWindowFocus: false,
  });
  
  const addToCartMutation = useMutation({
    mutationFn: async (cartItem: InsertCartItem) => {
      const res = await apiRequest("POST", "/api/cart", cartItem);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add item",
        description: "There was an error adding the item to your cart",
        variant: "destructive",
      });
    },
  });
  
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PATCH", `/api/cart/${id}/quantity`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Failed to update quantity",
        description: "There was an error updating the item quantity",
        variant: "destructive",
      });
    },
  });
  
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: number; note: string }) => {
      const res = await apiRequest("PATCH", `/api/cart/${id}/note`, { note });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Note updated",
        description: "Item note has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update note",
        description: "There was an error updating the item note",
        variant: "destructive",
      });
    },
  });
  
  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Failed to remove item",
        description: "There was an error removing the item from your cart",
        variant: "destructive",
      });
    },
  });
  
  const addToCart = (productId: number, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity, userId: 0 });
    setIsCartOpen(true);
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    updateQuantityMutation.mutate({ id, quantity });
  };
  
  const updateNote = (id: number, note: string) => {
    updateNoteMutation.mutate({ id, note });
  };
  
  const removeItem = (id: number) => {
    removeItemMutation.mutate(id);
  };
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 
    0
  );
  
  const setCartOpen = (open: boolean) => {
    setIsCartOpen(open);
    // Refetch cart when opening
    if (open) {
      refetch();
    }
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        updateNote,
        removeItem,
        totalItems,
        subtotal,
        isCartOpen,
        setCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
