import { createClient } from 'redis';

// Mock Redis client for development if Redis server is not running
class MockRedisClient {
  private cache = new Map<string, { value: string; expiresAt: number }>();

  async connect() {
    console.log('Using Mock Redis Client');
  }

  async get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async setEx(key: string, seconds: number, value: string) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + seconds * 1000,
    });
  }
}

// In production, configure standard Redis URL
const redisUrl = process.env.REDIS_URL;

export const redisClient = redisUrl 
  ? createClient({ url: redisUrl }) 
  : new MockRedisClient() as unknown as ReturnType<typeof createClient>;

if (redisUrl) {
  (redisClient as any).on('error', (err: any) => console.log('Redis Client Error', err));
  (redisClient as any).connect().catch(console.error);
}
