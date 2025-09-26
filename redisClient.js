const { createClient } = require('redis');
const url = process.env.REDIS_URL || 'redis://redis:6379';
const client = createClient({ url });
client.on('error', (err)=> console.error('Redis error', err));
async function connect(){ if(!client.isOpen) await client.connect(); }
module.exports = { client, connect };
