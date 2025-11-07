import Redis from 'ioredis';

let redisClient = null;

const connectRedis = () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        console.error('❌ Redis reconnect on error:', err.message);
        return true;
      }
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });

    redisClient.on('close', () => {
      console.warn('⚠️  Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await redisClient.quit();
      console.log('🔌 Redis connection closed through app termination');
    });

    return redisClient;
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error.message);
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export { connectRedis, getRedisClient };
