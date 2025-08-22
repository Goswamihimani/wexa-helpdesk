
import express from 'express';
import { z } from 'zod';
import Article from '../models/Article.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req,res)=>{
  const q = (req.query.query||'').toString();
  if(q){
    const docs = await Article.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" }}).limit(10);
    return res.json(docs);
  }
  const all = await Article.find().sort({ updatedAt: -1 });
  res.json(all);
});

const schema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft','published']).default('draft')
});

router.post('/', auth('admin'), async (req,res,next)=>{
  try{
    const data = schema.parse(req.body);
    const doc = await Article.create(data);
    res.status(201).json(doc);
  } catch(e){ next(e); }
});

router.put('/:id', auth('admin'), async (req,res,next)=>{
  try{
    const data = schema.partial().parse(req.body);
    const doc = await Article.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(doc);
  } catch(e){ next(e); }
});

router.delete('/:id', auth('admin'), async (req,res)=>{
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

export default router;
