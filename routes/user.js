import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.status(201).json(user);
});

router.get('/', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export default router;
