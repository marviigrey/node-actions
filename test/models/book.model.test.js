import { expect } from 'chai';
import mongoose from 'mongoose';
import Book from '../../src/models/Book.js';

describe('Book Model', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterEach(async () => {
    await Book.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should save a book with valid fields', async () => {
    const bookData = {
      title: 'Valid Book',
      author: 'Valid Author',
      year: 2023
    };

    const book = new Book(bookData);
    const savedBook = await book.save();

    expect(savedBook._id).to.exist;
    expect(savedBook.title).to.equal(bookData.title);
  });

  it('should require title field', async () => {
    const book = new Book({
      author: 'No Title',
      year: 2023
    });

    try {
      await book.save();
      throw new Error('Should have failed');
    } catch (err) {
      expect(err.errors.title).to.exist;
    }
  });

  it('should validate year is a number', async () => {
    const book = new Book({
      title: 'Invalid Year',
      author: 'Test',
      year: 'not-a-number'
    });

    try {
      await book.validate();
      throw new Error('Should have failed');
    } catch (err) {
      expect(err.errors.year).to.exist;
    }
  });
});