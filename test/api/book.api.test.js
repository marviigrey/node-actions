import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import Book from '../../src/models/Book.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Book API Endpoints', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Book.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await chai.request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          year: 2023
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.title).to.equal('Test Book');
    });

    it('should reject invalid book data', async () => {
      const res = await chai.request(app)
        .post('/api/books')
        .send({ title: 'Missing Fields' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /api/books', () => {
    before(async () => {
      // Seed test data
      await Book.create([
        { title: 'Book 1', author: 'Author 1', year: 2020 },
        { title: 'Book 2', author: 'Author 2', year: 2021 }
      ]);
    });

    it('should get all books', async () => {
      const res = await chai.request(app)
        .get('/api/books');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
    });

    it('should return books in correct format', async () => {
      const res = await chai.request(app)
        .get('/api/books');

      expect(res.body[0]).to.have.all.keys(
        '_id', 'title', 'author', 'year', 'createdAt', 'updatedAt', '__v'
      );
    });
  });
});