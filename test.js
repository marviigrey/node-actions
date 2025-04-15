import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import app from './app.js'; // only import app, NOT server.js

describe('User API', () => {
  before(async () => {
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
  });

  it('should fetch all users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
