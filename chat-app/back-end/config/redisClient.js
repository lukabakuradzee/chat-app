const redis = require('redis');
const client = redis.createClient();
const User = require('../models/User')

const getUserProfile = async(userId) => {
  const cachedData = await client.get(`user:${userId}`);
  if(cachedData) {
    return JSON.parse(cachedData)
  }

  const userProfile = await User.findById(userId)
  await client.set(`user:${userId}`, JSON.stringify(userProfile), 'EX', 300)
  return userProfile;
}

