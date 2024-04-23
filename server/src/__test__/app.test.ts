import request from 'supertest';

import app from '../../src/app';

describe('test app.ts', () => {
  test('test app', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
