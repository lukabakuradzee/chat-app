const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

console.log('Redis URL: ', redisUrl);

const redisClient = createClient({
  url: redisUrl,
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis is connected');
  } catch (error) {
    console.error('Error connecting to Redis', error);
  }
})();

redisClient.on('error', (error) => {
  console.log('Redis error: ', error);
});

module.exports = redisClient;
