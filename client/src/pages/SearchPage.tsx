import { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  const [location] = useLocation();
  
  // Parse the search query from URL
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const query = searchParams.get("q") || "";
  
  // Set page title with search query
  useEffect(() => {
    document.title = `Search: ${query} - ShopSecure`;
  }, [query]);

  return (
    <>
      <Helmet>
        <title>Search: {query} - ShopSecure</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Helmet>
      
      <div className="min-h-screen py-8">
        <SearchResults query={query} />
      </div>
    </>
  );
}
