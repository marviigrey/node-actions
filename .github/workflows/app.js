import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';

const app = express();
const isTest = process.env.NODE_ENV === 'test';

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

if (!isTest) {
  mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
  }).then(() => {
    console.log("MongoDB connected");
  }).catch(err => {
    console.error("MongoDB connection error:", err);
  });
}

export default app;
