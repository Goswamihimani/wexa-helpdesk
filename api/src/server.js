
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, limit: 100 });
app.use(['/api/auth','/api/kb','/api/tickets','/api/agent','/api/config'], limiter);

app.get('/healthz', (req,res)=>res.json({ ok:true }));
app.get('/readyz', (req,res)=>res.json({ ready:true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk';
await mongoose.connect(MONGO_URI);

import './models/User.js';
import './models/Article.js';
import './models/Ticket.js';
import './models/AgentSuggestion.js';
import './models/AuditLog.js';
import './models/Config.js';

import authRouter from './routes/auth.js';
import kbRouter from './routes/kb.js';
import ticketsRouter from './routes/tickets.js';
import agentRouter from './routes/agent.js';
import configRouter from './routes/config.js';
import auditRouter from './routes/audit.js';

app.use('/api/auth', authRouter);
app.use('/api/kb', kbRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/config', configRouter);
app.use('/api', auditRouter);

app.use((err, req, res, next) => {
  console.error('[ERR]', err.message);
  res.status(err.status || 500).json({ error: 'Something went wrong.' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
