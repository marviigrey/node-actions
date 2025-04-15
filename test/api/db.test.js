import { expect } from 'chai';
import mongoose from 'mongoose';

describe('Database Connection', () => {
  it('should connect to MongoDB', async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      expect(mongoose.connection.readyState).to.equal(1); // 1 means connected
    } finally {
      await mongoose.disconnect();
    }
  });

  it('should handle connection errors', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://invalid:connection@localhost:27017/test';

    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 1000 // Fail fast
      });
      throw new Error('Should have failed');
    } catch (err) {
      expect(err).to.be.instanceOf(mongoose.Error);
    } finally {
      process.env.MONGODB_URI = originalUri;
    }
  });
});