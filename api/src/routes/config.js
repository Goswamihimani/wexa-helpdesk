
import express from 'express';
import Config from '../models/Config.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.get('/config', auth('admin'), async (req,res)=>{
  const cfg = await Config.findOne() || await Config.create({});
  res.json(cfg);
});

router.put('/config', auth('admin'), async (req,res)=>{
  const update = req.body || {};
  const cfg = await Config.findOne();
  const doc = cfg ? await Config.findByIdAndUpdate(cfg._id, update, { new: true }) : await Config.create(update);
  res.json(doc);
});

export default router;
