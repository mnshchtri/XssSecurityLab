import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecurity } from "@/hooks/use-security";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SearchResultsProps {
  query: string;
}

interface SearchResponse {
  products: Product[];
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { mode, sanitizeInput, addLog } = useSecurity();
  
  const { data, isLoading } = useQuery<SearchResponse>({
    queryKey: [`/api/search?q=${query}`],
    enabled: !!query,
  });
  
  // Log potential XSS attempts
  if (query.includes('<script>') || query.includes('onerror=') || query.includes('javascript:')) {
    addLog(`[Alert] Potential Reflected XSS detected in search query: "${query}"`, "error");
  }

  return (
    <section className="container mx-auto px-4 py-4">
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Reflected XSS Vulnerability</AlertTitle>
        <AlertDescription>
          <p>This search function is vulnerable to Reflected XSS attacks. Your search term is displayed directly in the page without proper sanitization.</p>
          <p className="mt-1"><strong>Try searching for:</strong> <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
        </AlertDescription>
      </Alert>
      
      {/* Show search term - vulnerable to XSS */}
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: {" "}
        {mode === "secure" ? (
          <span>{sanitizeInput(query)}</span>
        ) : (
          <span 
            data-vulnerability="reflected-xss"
            dangerouslySetInnerHTML={{ __html: query }}
          />
        )}
      </h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300">
              <Skeleton className="w-full h-48 rounded-t-lg" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-9 w-1/3 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.products && data.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No products found matching your search.</p>
        </div>
      )}
    </section>
  );
}
