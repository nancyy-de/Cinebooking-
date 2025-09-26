const request = require('supertest');
const app = require('../testutils/app'); // simple app wrapper for tests

describe('basic routes', ()=>{
  test('GET /api/movies', async ()=>{
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(200);
  });
});
