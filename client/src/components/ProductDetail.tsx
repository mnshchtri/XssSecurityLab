import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, Review } from "@shared/schema";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Star, StarHalf, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useSecurity } from "@/hooks/use-security";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const { addToCart } = useCart();
  const { mode, sanitizeInput, addLog } = useSecurity();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [reviewForm, setReviewForm] = useState({
    username: "",
    title: "",
    content: "",
    rating: 5
  });
  
  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });
  
  // Fetch product reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !isNaN(productId),
  });
  
  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: Partial<Review>) => {
      const res = await apiRequest("POST", "/api/reviews", reviewData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      setReviewForm({
        username: "",
        title: "",
        content: "",
        rating: 5
      });
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully!",
      });
      
      // Check for potential XSS
      const { username, title, content } = reviewForm;
      if (username.includes('<') || title.includes('<') || content.includes('<')) {
        addLog(`[Alert] Potential Stored XSS detected in review submission`, "error");
      }
    },
    onError: () => {
      toast({
        title: "Failed to submit review",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    createReviewMutation.mutate({
      productId,
      userId: user.id,
      username: reviewForm.username || user.username,
      title: reviewForm.title,
      content: reviewForm.content,
      rating: reviewForm.rating
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };
  
  const colors = [
    { name: "Black", value: "black", class: "bg-black" },
    { name: "White", value: "white", class: "bg-white border border-gray-300" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" }
  ];
  
  // Function to render star ratings
  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400 h-4 w-4" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-amber-400 h-4 w-4" />);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-amber-400 h-4 w-4 stroke-current fill-transparent" />);
    }
    
    return stars;
  };
  
  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Product not found</AlertTitle>
          <AlertDescription>
            The product you are looking for does not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Product Image</p>
              <p className="text-sm text-gray-500 mt-1">Product image will be displayed here</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              <Heart className="h-4 w-4 mr-2" /> Add to Wishlist
            </Button>
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2">
            {renderRating(product.rating)}
            <span className="text-gray-600">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="space-y-2">
            <p className="font-medium">Color</p>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    selectedColor === color.value ? "ring-2 ring-offset-2 ring-gray-800" : ""
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Active Noise Cancellation</li>
              <li>30-hour Battery Life</li>
              <li>Bluetooth 5.0 Connectivity</li>
              <li>Built-in Microphone</li>
              <li>Foldable Design</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <Tabs defaultValue="description" className="border-t border-gray-200 px-6 py-4">
        <TabsList className="border-b">
          <TabsTrigger value="description" className="px-4 py-2 font-medium">Description</TabsTrigger>
          <TabsTrigger value="specifications" className="px-4 py-2 font-medium">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" className="px-4 py-2 font-medium relative">
            Reviews
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {reviews.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="py-4">
          <p className="text-gray-700 mb-4">
            Our Premium Wireless Headphones deliver an exceptional audio experience with deep bass and crystal-clear highs. 
            The active noise cancellation technology blocks out ambient noise, allowing you to focus on your music or calls.
          </p>
          <p className="text-gray-700">
            With a comfortable over-ear design and premium materials, these headphones are perfect for long listening sessions. 
            The 30-hour battery life ensures you can enjoy your music all day, and the quick-charge feature gives you 5 hours of 
            playback from just 10 minutes of charging.
          </p>
        </TabsContent>
        
        <TabsContent value="specifications" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Technical Specifications</h3>
              <table className="w-full text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Driver Size</td>
                    <td className="py-2">40mm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Frequency Response</td>
                    <td className="py-2">20Hz - 20kHz</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Impedance</td>
                    <td className="py-2">32 Ohm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Battery Life</td>
                    <td className="py-2">30 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Charging Time</td>
                    <td className="py-2">2 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold mb-2">In the Box</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li className="py-1">Wireless Headphones</li>
                <li className="py-1">USB-C Charging Cable</li>
                <li className="py-1">3.5mm Audio Cable</li>
                <li className="py-1">Carrying Case</li>
                <li className="py-1">User Manual</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="py-4">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          
          {/* Vulnerable Review Form - Stored XSS Vector */}
          <div className="mb-6 bg-gray-50 p-4 rounded vulnerability-indicator">
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Stored XSS Vulnerability</AlertTitle>
              <AlertDescription>
                <p>This review form is vulnerable to Stored XSS attacks. User input is stored in the database and displayed without proper sanitization.</p>
                <p className="mt-1"><strong>Try submitting:</strong> <code>&lt;img src="x" onerror="alert('Stored XSS')"&gt;</code> in any field</p>
              </AlertDescription>
            </Alert>
            
            <h4 className="font-medium mb-3">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} data-vulnerability="stored-xss">
              <div className="mb-3">
                <label htmlFor="reviewName" className="block text-gray-700 mb-1">Your Name</label>
                <Input
                  type="text"
                  id="reviewName"
                  name="username"
                  value={reviewForm.username}
                  onChange={handleInputChange}
                  placeholder={user ? user.username : ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reviewRating" className="block text-gray-700 mb-1">Rating</label>
                <div className="flex text-gray-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer h-5 w-5 ${
                        star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="reviewTitle" className="block text-gray-700 mb-1">Review Title</label>
                <Input
                  type="text"
                  id="reviewTitle"
                  name="title"
                  value={reviewForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reviewContent" className="block text-gray-700 mb-1">Review</label>
                <Textarea
                  id="reviewContent"
                  name="content"
                  value={reviewForm.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={createReviewMutation.isPending}
              >
                {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
          
          {/* Existing Reviews */}
          <div className="space-y-4" id="reviewsList" data-vulnerability="stored-xss">
            {isLoadingReviews ? (
              Array(2).fill(0).map((_, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{review.username}</span>
                      <div className="flex">
                        {renderRating(review.rating)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
                  </div>
                  
                  {/* Use dangerouslySetInnerHTML or sanitized HTML based on security mode */}
                  {mode === "secure" ? (
                    <>
                      <h4 className="font-medium mb-2">{sanitizeInput(review.title)}</h4>
                      <p className="text-gray-700">{sanitizeInput(review.content)}</p>
                    </>
                  ) : (
                    <>
                      <h4 
                        className="font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: review.title }}
                      />
                      <p 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      />
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
