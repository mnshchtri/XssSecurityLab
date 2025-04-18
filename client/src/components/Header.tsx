import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Search, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSecurity } from "@/hooks/use-security";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "wouter";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleMode } = useSecurity();
  const { user, logoutMutation } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="text-primary h-6 w-6 mr-2" />
              <span className="text-xl font-bold text-gray-800">ShopSecure</span>
            </Link>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">XSS Lab</span>
          </div>

          {/* Security Controls */}
          <div className="hidden md:flex items-center space-x-4 bg-gray-100 p-2 rounded">
            <span className="text-sm font-medium">Security Mode:</span>
            <div className="inline-flex items-center space-x-2 vulnerability-indicator">
              <span className="text-sm text-red-600">Vulnerable</span>
              <Switch
                id="securityToggle" 
                checked={mode === "secure"}
                onCheckedChange={toggleMode}
              />
              <span className="text-sm text-green-600">Secure</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-primary">Products</Link>
            <Link href="/categories" className="text-gray-600 hover:text-primary">Categories</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">About</Link>
            
            {/* Search Bar - Reflected XSS Vector */}
            <form onSubmit={handleSearch} className="relative vulnerability-indicator">
              <Input
                type="text"
                id="searchBar"
                placeholder="Search products..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-vulnerability="reflected-xss"
              />
              <Button type="submit" variant="ghost" className="absolute right-2 top-2 p-0 h-auto">
                <Search className="h-4 w-4 text-gray-400" />
              </Button>
            </form>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">{user.username}</span>
                </Button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button 
                    onClick={() => logoutMutation.mutate()} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-600 hover:text-primary">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              className="relative text-gray-600 hover:text-primary"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              className="md:hidden text-gray-600" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="block md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative vulnerability-indicator">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-vulnerability="reflected-xss"
          />
          <Button type="submit" variant="ghost" className="absolute right-2 top-2 p-0 h-auto">
            <Search className="h-4 w-4 text-gray-400" />
          </Button>
        </form>
      </div>

      {/* Mobile Menu */}
      <div className={`px-4 pb-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="text-gray-600 hover:text-primary py-2 border-b border-gray-200">Home</Link>
          <Link href="/products" className="text-gray-600 hover:text-primary py-2 border-b border-gray-200">Products</Link>
          <Link href="/categories" className="text-gray-600 hover:text-primary py-2 border-b border-gray-200">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-primary py-2 border-b border-gray-200">About</Link>
          <div className="py-2 flex items-center justify-between">
            <span className="text-sm font-medium">Security Mode:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-red-600">Vulnerable</span>
              <Switch
                id="mobileSecurity" 
                checked={mode === "secure"}
                onCheckedChange={toggleMode}
              />
              <span className="text-sm text-green-600">Secure</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
