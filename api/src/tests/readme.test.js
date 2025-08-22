import { strict as assert } from 'assert';
import fs from 'fs';
test('README exists with Quick Start', ()=>{
  const txt = fs.readFileSync('../../README.md','utf8');
  assert.ok(txt.includes('Quick Start'));
});
