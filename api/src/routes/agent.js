
import express from 'express';
import AgentSuggestion from '../models/AgentSuggestion.js';
import { triageTicket } from '../services/agentStub.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/triage', auth('agent'), async (req,res)=>{
  const ticketId = req.body?.ticketId;
  const result = await triageTicket(ticketId);
  res.json(result);
});

router.get('/suggestion/:ticketId', auth(), async (req,res)=>{
  const s = await AgentSuggestion.findOne({ ticketId: req.params.ticketId }).sort({ createdAt:-1 });
  res.json(s);
});

export default router;
