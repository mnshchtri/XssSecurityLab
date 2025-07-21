import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';
import { insertReviewSchema } from '../../shared/schema';

const handler: Handler = async (event) => {
  const { path, httpMethod } = event;

  // GET /products/:id/reviews
  const reviewsMatch = path.match(/\/products\/(\d+)\/reviews$/);
  if (httpMethod === 'GET' && reviewsMatch) {
    const productId = parseInt(reviewsMatch[1]);
    if (isNaN(productId)) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid product ID' }) };
    }
    const reviews = await storage.getReviewsByProductId(productId);
    return { statusCode: 200, body: JSON.stringify(reviews), headers: { 'Content-Type': 'application/json' } };
  }

  // POST /reviews
  if (httpMethod === 'POST' && path.endsWith('/reviews')) {
    try {
      const body = JSON.parse(event.body || '{}');
      // Skipping authentication for now
      const reviewData = insertReviewSchema.parse({
        ...body,
        userId: 0, // mock user
        username: body.username || 'Anonymous'
      });
      const review = await storage.createReview(reviewData);
      return { statusCode: 201, body: JSON.stringify(review), headers: { 'Content-Type': 'application/json' } };
    } catch (error) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid review data', error }) };
    }
  }

  return { statusCode: 404, body: 'Not found' };
};

export { handler }; 