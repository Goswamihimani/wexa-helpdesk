import { strict as assert } from 'assert';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Config from '../models/Config.js';

test('user schema defaults role=user', ()=>{
  const u = new User({ name:'X', email:'x@example.com', password_hash:'p' });
  assert.equal(u.role, 'user');
});

test('config defaults', ()=>{
  const c = new Config({});
  assert.equal(c.autoCloseEnabled, true);
  assert.ok(c.confidenceThreshold >= 0 && c.confidenceThreshold <= 1);
});
