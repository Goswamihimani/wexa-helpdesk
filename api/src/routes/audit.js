
import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.get('/tickets/:id/audit', auth(), async (req,res)=>{
  const items = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });
  res.json(items);
});

export default router;
