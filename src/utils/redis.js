// const redis = require('redis');
// const bluebird = require('bluebird');
// require('dotenv').config();

// const { REDIS_URI } = require('../configs');

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

// const redisClient = redis.createClient(REDIS_URI);
// redisClient.on('error', (err) => {
//   console.error('REDIS_ERROR: ', err);
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// module.exports = redisClient;
