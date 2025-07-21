import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';
import { insertCartItemSchema } from '../../shared/schema';

const handler: Handler = async (event) => {
  const { path, httpMethod } = event;
  // Skipping authentication for now, using userId = 0
  const userId = 0;

  // GET /cart
  if (httpMethod === 'GET' && path.endsWith('/cart')) {
    const cartItems = await storage.getCartItemsByUserId(userId);
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return { ...item, product };
      })
    );
    return { statusCode: 200, body: JSON.stringify(itemsWithDetails), headers: { 'Content-Type': 'application/json' } };
  }

  // POST /cart
  if (httpMethod === 'POST' && path.endsWith('/cart')) {
    try {
      const body = JSON.parse(event.body || '{}');
      const cartItemData = insertCartItemSchema.parse({ ...body, userId });
      const cartItem = await storage.addCartItem(cartItemData);
      const product = await storage.getProductById(cartItem.productId);
      return { statusCode: 201, body: JSON.stringify({ ...cartItem, product }), headers: { 'Content-Type': 'application/json' } };
    } catch (error) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid cart data', error }) };
    }
  }

  // PATCH /cart/:id/quantity
  const quantityMatch = path.match(/\/cart\/(\d+)\/quantity$/);
  if (httpMethod === 'PATCH' && quantityMatch) {
    const id = parseInt(quantityMatch[1]);
    const body = JSON.parse(event.body || '{}');
    const quantity = parseInt(body.quantity);
    if (isNaN(id) || isNaN(quantity) || quantity < 1) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid data' }) };
    }
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return { statusCode: 404, body: JSON.stringify({ message: 'Cart item not found' }) };
    const updatedItem = await storage.updateCartItem(id, quantity);
    const product = await storage.getProductById(updatedItem!.productId);
    return { statusCode: 200, body: JSON.stringify({ ...updatedItem, product }), headers: { 'Content-Type': 'application/json' } };
  }

  // PATCH /cart/:id/note
  const noteMatch = path.match(/\/cart\/(\d+)\/note$/);
  if (httpMethod === 'PATCH' && noteMatch) {
    const id = parseInt(noteMatch[1]);
    const body = JSON.parse(event.body || '{}');
    const note = body.note;
    if (isNaN(id) || typeof note !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid data' }) };
    }
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return { statusCode: 404, body: JSON.stringify({ message: 'Cart item not found' }) };
    const updatedItem = await storage.updateCartItemNote(id, note);
    const product = await storage.getProductById(updatedItem!.productId);
    return { statusCode: 200, body: JSON.stringify({ ...updatedItem, product }), headers: { 'Content-Type': 'application/json' } };
  }

  // DELETE /cart/:id
  const deleteMatch = path.match(/\/cart\/(\d+)$/);
  if (httpMethod === 'DELETE' && deleteMatch) {
    const id = parseInt(deleteMatch[1]);
    if (isNaN(id)) return { statusCode: 400, body: JSON.stringify({ message: 'Invalid cart item ID' }) };
    const cartItem = await storage.getCartItemById(id);
    if (!cartItem) return { statusCode: 404, body: JSON.stringify({ message: 'Cart item not found' }) };
    await storage.removeCartItem(id);
    return { statusCode: 204, body: '' };
  }

  return { statusCode: 404, body: 'Not found' };
};

export { handler }; 