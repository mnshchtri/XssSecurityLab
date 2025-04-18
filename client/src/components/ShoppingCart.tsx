import { useState } from "react";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useSecurity } from "@/hooks/use-security";
import { CartItem } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShoppingCart() {
  const { cart, isLoading, updateQuantity, updateNote, removeItem, subtotal, isCartOpen, setCartOpen } = useCart();
  const { mode, sanitizeInput, addLog } = useSecurity();
  const [noteInput, setNoteInput] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  const handleAddNote = () => {
    if (selectedItemId !== null && noteInput.trim()) {
      updateNote(selectedItemId, noteInput);
      setNoteInput("");
      setSelectedItemId(null);
      
      // Check for potential XSS
      if (noteInput.includes('<script>') || noteInput.includes('onerror=') || noteInput.includes('javascript:')) {
        addLog(`[Alert] Potential DOM-based XSS detected in cart note`, "error");
      }
    }
  };
  
  const shippingCost = 599; // $5.99
  const totalCost = subtotal + shippingCost;
  
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white shadow-xl flex flex-col h-full">
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart ({cart.length} items)</h2>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={() => setCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* DOM-based XSS Warning */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-4 rounded vulnerability-indicator">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>DOM-based XSS Vulnerability</AlertTitle>
            <AlertDescription>
              <p>The cart note field below is vulnerable to DOM-based XSS. JavaScript directly inserts user input into the DOM without sanitization.</p>
              <p className="mt-1"><strong>Try entering:</strong> <code>&lt;script&gt;alert('DOM XSS')&lt;/script&gt;</code></p>
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex bg-white p-3 rounded-lg shadow border">
                  <Skeleton className="w-20 h-20 rounded" />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex bg-white p-3 rounded-lg shadow border">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-red-500 h-auto p-1"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-500 text-sm">Black</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <Button 
                          variant="ghost" 
                          className="px-2 text-gray-600 hover:bg-gray-100 h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 border-l border-r border-gray-300">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          className="px-2 text-gray-600 hover:bg-gray-100 h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                    
                    {/* Display notes for this item */}
                    {item.note && (
                      <div className="mt-2 text-sm">
                        <strong>Note:</strong>
                        {mode === "secure" ? (
                          <div className="bg-gray-50 p-2 mt-1 rounded">{sanitizeInput(item.note)}</div>
                        ) : (
                          <div 
                            className="bg-gray-50 p-2 mt-1 rounded"
                            dangerouslySetInnerHTML={{ __html: item.note }} 
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Edit note button */}
                    <Button 
                      variant="ghost" 
                      className="text-xs mt-2 h-7 px-2"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setNoteInput(item.note || "");
                      }}
                    >
                      {item.note ? "Edit Note" : "Add Note"}
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* DOM-based XSS Vector */}
              {selectedItemId !== null && (
                <div className="mt-6 vulnerability-indicator">
                  <label htmlFor="cartNote" className="block text-gray-700 mb-1">Add a note to your item:</label>
                  <Textarea
                    id="cartNote"
                    rows={2}
                    data-vulnerability="dom-xss"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button 
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={handleAddNote}
                    >
                      Save Note
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedItemId(null);
                        setNoteInput("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Notes Display Section */}
              {cart.some(item => item.note) && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">All Order Notes:</h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded min-h-[60px]">
                    {cart.filter(item => item.note).map(item => (
                      <div key={`note-${item.id}`} className="mb-2 pb-2 border-b border-gray-100 last:border-b-0">
                        <strong className="text-sm">{item.product.name}:</strong>
                        {mode === "secure" ? (
                          <div className="text-sm">{sanitizeInput(item.note || "")}</div>
                        ) : (
                          <div 
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: item.note || "" }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
              <Button className="bg-primary text-white" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex justify-between mb-4 font-bold">
              <span>Total</span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
            <Button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
