import { strict as assert } from 'assert';
import { withTrace } from '../utils/trace.js';

test('withTrace attaches traceId', async ()=>{
  const res = await withTrace('T123', async (ctx)=>{
    return ctx.traceId;
  });
  assert.ok(res.startsWith('trace-'));
});
