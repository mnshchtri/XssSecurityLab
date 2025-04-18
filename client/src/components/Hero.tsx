import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">XSS Vulnerability Lab</h1>
            <p className="text-lg mb-6">This interactive e-commerce site demonstrates various types of Cross-Site Scripting (XSS) vulnerabilities in a controlled environment.</p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                Explore Vulnerabilities
              </Button>
              <Button variant="outline" className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
              <div className="text-sm font-mono mb-2 text-gray-200">XSS Vulnerability Types:</div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-start">
                  <span className="text-amber-300 mr-2">➤</span>
                  <div>
                    <span className="font-semibold">Reflected XSS</span>
                    <p className="text-sm text-gray-200">Try the search bar above</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-300 mr-2">➤</span>
                  <div>
                    <span className="font-semibold">Stored XSS</span>
                    <p className="text-sm text-gray-200">Try the product review section</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-300 mr-2">➤</span>
                  <div>
                    <span className="font-semibold">DOM-based XSS</span>
                    <p className="text-sm text-gray-200">Try editing items in the shopping cart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
