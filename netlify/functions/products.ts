import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';

const handler: Handler = async (event) => {
  const { path, httpMethod, queryStringParameters } = event;

  // /products or /products/:id or /categories/:category or /search
  if (httpMethod === 'GET') {
    // /products/:id
    const productIdMatch = path.match(/\/products\/(\d+)$/);
    if (productIdMatch) {
      const id = parseInt(productIdMatch[1]);
      const product = await storage.getProductById(id);
      if (!product) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Product not found' }) };
      }
      return { statusCode: 200, body: JSON.stringify(product), headers: { 'Content-Type': 'application/json' } };
    }
    // /categories/:category
    const categoryMatch = path.match(/\/categories\/([^/]+)$/);
    if (categoryMatch) {
      const category = decodeURIComponent(categoryMatch[1]);
      const products = await storage.getProductsByCategory(category);
      return { statusCode: 200, body: JSON.stringify(products), headers: { 'Content-Type': 'application/json' } };
    }
    // /search
    if (path.endsWith('/search')) {
      const query = queryStringParameters?.q || '';
      const products = await storage.searchProducts(query);
      return { statusCode: 200, body: JSON.stringify({ products, query }), headers: { 'Content-Type': 'application/json' } };
    }
    // /products (all)
    if (path.endsWith('/products')) {
      const products = await storage.getProducts();
      return { statusCode: 200, body: JSON.stringify(products), headers: { 'Content-Type': 'application/json' } };
    }
  }

  return { statusCode: 404, body: 'Not found' };
};

export { handler }; 