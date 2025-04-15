import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  const saved = await user.save();
  res.status(201).json(saved);
});

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
