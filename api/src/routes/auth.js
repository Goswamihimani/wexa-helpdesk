
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const router = express.Router();

const regSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin','agent','user']).optional()
});

router.post('/register', async (req,res,next)=>{
  try{
    const data = regSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if(exists) return res.status(400).json({ error: 'Email exists' });
    const password_hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, password_hash, role: data.role || 'user' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'change-me', { expiresIn:'2h' });
    res.json({ token });
  } catch(e){ next(e); }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/login', async (req,res,next)=>{
  try{
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'change-me', { expiresIn:'2h' });
    res.json({ token });
  } catch(e){ next(e); }
});

export default router;
