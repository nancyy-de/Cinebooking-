const { client } = require('./redisClient');
// simple lock using SET NX with expiry
async function acquireLock(key, ttlMs=5000){
  const lockKey = `lock:${key}`;
  const res = await client.set(lockKey, '1', { NX: true, PX: ttlMs });
  return res === 'OK';
}
async function releaseLock(key){
  const lockKey = `lock:${key}`;
  await client.del(lockKey);
}
module.exports = { acquireLock, releaseLock };
