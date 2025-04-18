import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { Product } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Function to render star ratings
  const renderRating = (rating: number) => {
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
  
  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <Card className="overflow-hidden product-card transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400">
            {renderRating(product.rating)}
          </div>
          <span className="text-gray-600 text-sm ml-2">({product.reviewCount})</span>
        </div>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
          <Button 
            className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
