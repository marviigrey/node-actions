// test.js

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from './server.js'; // Make sure server.js also uses export default

chai.use(chaiHttp);
const { expect } = chai;

describe('User API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a user', async () => {
    const res = await chai.request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('name', 'Test User');
  });

  it('should fetch all users', async () => {
    const res = await chai.request(app)
      .get('/api/users');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });
});
