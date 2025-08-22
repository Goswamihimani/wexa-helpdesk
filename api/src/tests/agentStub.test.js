import { strict as assert } from 'assert';
import { classify, draft } from '../services/agentStub.js';

const kb = [
  { _id: 'a1', title: 'How to update payment method' },
  { _id: 'a2', title: 'Troubleshooting 500 errors' },
  { _id: 'a3', title: 'Tracking your shipment' },
];

test('classify billing', ()=>{
  const { predictedCategory, confidence } = classify('I want a refund for invoice 123');
  assert.equal(predictedCategory, 'billing');
  assert.ok(confidence >= 0.5);
});

test('draft cites KB ids', ()=>{
  const out = draft('refund please', kb.slice(0,2));
  assert.ok(out.draftReply.includes('[1]'));
  assert.ok(out.citations.length === 2);
});
