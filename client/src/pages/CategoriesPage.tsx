import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Get unique categories from products
  const categoriesSet = new Set(allProducts.map(product => product.category));
  const categories = Array.from(categoriesSet);
  
  // Default to first category or "Electronics" if no products
  const defaultCategory = categories.length > 0 ? categories[0] : "Electronics";
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Filter products by active category
  const filteredProducts = allProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Product Categories - ShopSecure</title>
        <meta name="description" content="Browse products by category at ShopSecure" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
        
        {isLoading ? (
          <div>
            <Skeleton className="h-10 w-full max-w-md mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-8 w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Tabs 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <div className="border-b mb-8">
              <TabsList className="w-full justify-start">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="px-4 py-2">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-lg text-gray-500">No products found in this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
}
