
import express from 'express';
import { z } from 'zod';
import Ticket from '../models/Ticket.js';
import AuditLog from '../models/AuditLog.js';
import { auth } from '../middleware/auth.js';
import { triageTicket } from '../services/agentStub.js';

const router = express.Router();

router.get('/', auth(), async (req,res)=>{
  const status = req.query.status;
  const my = req.query.my === 'true';
  const query = {};
  if(status) query.status = status;
  if(my) query.createdBy = req.user.id;
  const docs = await Ticket.find(query).sort({ updatedAt:-1 });
  res.json(docs);
});

router.get('/:id', auth(), async (req,res)=>{
  const doc = await Ticket.findById(req.params.id);
  res.json(doc);
});

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  category: z.enum(['billing','tech','shipping','other']).optional(),
  attachments: z.array(z.string()).optional()
});

router.post('/', auth(), async (req,res,next)=>{
  try{
    const data = schema.parse(req.body);
    const ticket = await Ticket.create({ ...data, createdBy: req.user.id });
    await AuditLog.create({ ticketId: ticket._id, traceId: 'pending', actor:'user', action:'TICKET_CREATED', meta:{ createdBy: req.user.id } });
    triageTicket(ticket._id).catch(err=>console.error('triage failed', err.message));
    res.status(201).json(ticket);
  } catch(e){ next(e); }
});

router.post('/:id/reply', auth('agent'), async (req,res)=>{
  const body = (req.body?.body || '').toString();
  await AuditLog.create({ ticketId: req.params.id, traceId: 'n/a', actor:'agent', action:'REPLY_SENT', meta:{ body } });
  await Ticket.findByIdAndUpdate(req.params.id, { status:'resolved' });
  res.json({ ok:true });
});

router.post('/:id/assign', auth('agent'), async (req,res)=>{
  const assignee = req.body?.assignee;
  await Ticket.findByIdAndUpdate(req.params.id, { assignee });
  await AuditLog.create({ ticketId: req.params.id, traceId: 'n/a', actor:'agent', action:'ASSIGNED_TO', meta:{ assignee } });
  res.json({ ok:true });
});

export default router;
