// test/user.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Users API', () => {
  before((done) => {
    mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, () => done());
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create a new user', (done) => {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      chai.request(app)
        .post('/api/users')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('name').eql('Test User');
          res.body.should.have.property('email').eql('test@example.com');
          done();
        });
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      await User.create({ name: 'User One', email: 'one@example.com' });

      const res = await chai.request(app).get('/api/users');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.be.eql(1);
    });
  });
});
