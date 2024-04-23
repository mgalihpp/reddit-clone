import request from 'supertest';

import app from '../../../src/app';

describe('test auth controller register', () => {
  test('test auth controller register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        name: 'testuser',
        email: 's8Y5A@example.com',
        password: 'testpassword',
      });
    expect(response.status).toBe(201);
  });
});

describe('test auth controller login', () => {
  test('test auth controller login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 's8Y5A@example.com',
        password: 'testpassword',
      });
    expect(response.status).toBe(200);
  });
});
