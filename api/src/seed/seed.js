
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Article from '../models/Article.js';
import Ticket from '../models/Ticket.js';
import Config from '../models/Config.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk';

async function main(){
  await mongoose.connect(MONGO_URI);
  await Promise.all([User.deleteMany({}), Article.deleteMany({}), Ticket.deleteMany({}), Config.deleteMany({})]);

  const [admin, agent, user] = await Promise.all([
    User.create({ name:'Admin', email:'admin@acme.com', password_hash: await bcrypt.hash('password',10), role:'admin' }),
    User.create({ name:'Agent', email:'agent@acme.com', password_hash: await bcrypt.hash('password',10), role:'agent' }),
    User.create({ name:'User', email:'user@acme.com', password_hash: await bcrypt.hash('password',10), role:'user' }),
  ]);

  await Config.create({ autoCloseEnabled: true, confidenceThreshold: 0.78, slaHours: 24 });

  await Article.insertMany([
    { title:'How to update payment method', body:'Steps to update your payment method...', tags:['billing','payments'], status:'published' },
    { title:'Troubleshooting 500 errors', body:'Common 500 error causes and fixes...', tags:['tech','errors'], status:'published' },
    { title:'Tracking your shipment', body:'Find your tracking number and follow...', tags:['shipping','delivery'], status:'published' },
  ]);

  await Ticket.insertMany([
    { title:'Refund for double charge', description:'I was charged twice for order #1234. Need refund invoice.', category:'other', createdBy: user._id },
    { title:'App shows 500 on login', description:'Getting 500 error on login; stack points to auth module.', category:'other', createdBy: user._id },
    { title:'Where is my package?', description:'Shipment delayed 5 days, no tracking update.', category:'other', createdBy: user._id },
  ]);

  console.log('Seeded. Users: admin@acme.com / agent@acme.com / user@acme.com (password: password)');
  process.exit(0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
