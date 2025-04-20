import { Link } from "wouter";
import { Terminal, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSecurity } from "@/hooks/use-security";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const { toggleConsole } = useSecurity();

  return (
    <footer className={`bg-gray-800 text-white py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopSecure</h3>
            <p className="text-gray-400">An educational e-commerce platform demonstrating XSS vulnerabilities in a controlled environment.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">XSS Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">What is XSS?</a></li>
              <li><a href="#" className="hover:text-white">Vulnerability Types</a></li>
              <li><a href="#" className="hover:text-white">Prevention Techniques</a></li>
              <li><a href="#" className="hover:text-white">OWASP Top 10</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <Button 
              className="bg-primary text-white w-full mb-2 hover:bg-blue-600"
              onClick={toggleConsole}
            >
              <Terminal className="h-4 w-4 mr-2" /> Open Security Console
            </Button>
            <Button className="bg-gray-700 text-white w-full hover:bg-gray-600">
              <Wrench className="h-4 w-4 mr-2" /> Toggle XSS Toolkit
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>This is an educational project. Do not use these techniques on real websites.</p>
          <p className="mt-2">© 2023 ShopSecure XSS Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
