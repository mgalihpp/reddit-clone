import request from 'supertest';

import app from '../../src/app';

const token = null;

describe('test app.ts', () => {
  test('test app', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

// auth test

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

// user test

describe('test user controller getUser', () => {
  test('test user controller getUser', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});

describe('test update user', () => {
  test('test update user', async () => {
    const response = await request(app)
      .put('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testuser',
        username: 'testuser',
      });
    expect(response.status).toBe(200);
  });
});

// post test

describe('test post controller getPost', () => {
  test('test post controller getPost', async () => {
    const response = await request(app)
      .get('/api/posts')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });
});

describe('test post controller getPostsByFollowedCommunity', () => {
  test('test post controller getPostsByFollowedCommunity', async () => {
    const response = await request(app)
      .get('/api/posts/followed')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });
});

describe('test post controller getPostbyCriteria', () => {
  test('test post controller getPostbyCriteria', async () => {
    const response = await request(app)
      .get('/api/posts/criteria?limit=2&page=2')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });
});

describe('test post controller getpostbyid', () => {
  test('test post controller getpostbyid', async () => {
    const response = await request(app)
      .get('/api/posts/1')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });
});

describe('test post controller createPost', () => {
  test('test post controller createPost', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'testtitle',
        content: 'testcontent',
      });
    expect(response.status).toBe(201);
  });
});
