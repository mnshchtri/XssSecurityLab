import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Product } from "@shared/schema";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  
  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} - ShopSecure` : 'Product - ShopSecure'}</title>
        <meta name="description" content={product?.description || 'Product details'} />
      </Helmet>
      
      <div className="min-h-screen">
        <ProductDetail />
      </div>
    </>
  );
}
