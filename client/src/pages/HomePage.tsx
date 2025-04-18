import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>ShopSecure - XSS Vulnerability Lab</title>
        <meta name="description" content="Interactive eCommerce XSS vulnerability demonstration lab" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Hero />
        <FeaturedProducts />
      </div>
    </>
  );
}
