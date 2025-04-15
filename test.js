import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from './app.js';
import User from './models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
    });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should create a user', async () => {
    const res = await chai.request(app).post('/api/users').send({ name: 'Alice' });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('name', 'Alice');
  });

  it('should fetch all users', async () => {
    await new User({ name: 'Bob' }).save();
    const res = await chai.request(app).get('/api/users');
    expect(res).to.have.status(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].name).to.equal('Bob');
  });
});
