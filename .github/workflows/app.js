// app.js
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from './models/User.js';

const app = express();
app.use(bodyParser.json());

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export default app;
