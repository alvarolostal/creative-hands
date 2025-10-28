const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const categoriesRouter = require('../routes/categories');
const User = require('../models/User');
const Category = require('../models/Category');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';

  app = express();
  app.use(express.json());
  app.use('/api/categories', categoriesRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
});

test('GET /api/categories returns array', async () => {
  const res = await request(app).get('/api/categories');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.categories)).toBe(true);
});

test('admin can create, update and delete category', async () => {
  const admin = await User.create({ name: 'AdminCat', email: 'admincat@test.com', password: 'Admin123!', role: 'admin' });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

  const createRes = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Cat1' });
  expect(createRes.statusCode).toBe(201);
  const catId = createRes.body.category._id;

  const updateRes = await request(app).put(`/api/categories/${catId}`).set('Authorization', `Bearer ${token}`).send({ name: 'CatOne' });
  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.category.name).toBe('CatOne');

  const delRes = await request(app).delete(`/api/categories/${catId}`).set('Authorization', `Bearer ${token}`);
  expect(delRes.statusCode).toBe(200);
});

test('non-admin cannot create category', async () => {
  const user = await User.create({ name: 'UserCat', email: 'usercat@test.com', password: 'User123!', role: 'user' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

  const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Forbidden' });
  expect(res.statusCode).toBe(403);
});
