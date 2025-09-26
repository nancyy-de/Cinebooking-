// Minimal seed script for backend
const mongoose = require('mongoose');
const Movie = require('../src/models/Movie');
const Show = require('../src/models/Show');

async function run(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinebook');
  await Movie.deleteMany({}); await Show.deleteMany({});
  const m = await Movie.create({ title: 'Demo Movie', description: 'A starter demo film', durationMin: 120 });
  const s = await Show.create({ movieId: m._id, screenName: 'Screen 1', startAt: new Date(Date.now()+3600*1000), price: 120, seats: {} });
  console.log('Seeded', m._id, s._id);
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
