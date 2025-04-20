import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import AuthPage from "@/pages/AuthPage";
import SearchPage from "@/pages/SearchPage";
import ProductsPage from "@/pages/ProductsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import AboutPage from "@/pages/AboutPage";
import ProfilePage from "@/pages/ProfilePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SecurityConsole from "@/components/SecurityConsole";
import { AuthProvider } from "@/hooks/use-auth";
import { SecurityProvider } from "@/hooks/use-security";
import { CartProvider } from "@/hooks/use-cart";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/about" component={AboutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/orders" component={() => <div>Orders Page</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecurityProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <div className="max-w-7xl mx-auto">
                    <Router />
                  </div>
                </main>
                <Footer className="mt-auto" />
                <ShoppingCart />
                <SecurityConsole />
                <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
              </div>
              <Toaster />
            </CartProvider>
          </SecurityProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
