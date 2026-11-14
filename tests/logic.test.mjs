import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validatePacket, buildReceipt, receiptText, restoreSession} from '../skills/qior/scripts/logic.mjs';
import {bundle, safeJSON} from '../skills/qior/scripts/render.mjs';
const q = {id:'Q123',kind:'question',question:'Use this option?',implications:'This decides which approach the agent implements.',options:['First','Second'],recommended:true};
const raw = {id:'sample',revision:1,title:'Decisions',questions:[q,{...q,id:'Q124'}]};
const p = validatePacket(raw);
test('packet IDs and answer IDs remain explicit',()=>assert.equal(buildReceipt(p,{}).packetId,'sample'));
test('unanswered, clarification, and deferral cannot become decisions',()=>{
  const receipt=buildReceipt(p,{Q123:{type:'clarify',note:'What does this cost?'}});
  assert.equal(receipt.responses[0].type,'clarify');assert.equal(receipt.responses[1].type,'unanswered');
  assert.ok(!receipt.responses[0].decision);assert.match(receiptText(p,{Q123:{type:'defer'}}),/DEFERRED. No decision/);
});
test('custom decisions and option rationale survive plain text and JSON',()=>{
  const a={Q123:{type:'custom',note:'Use a third approach.'},Q124:{type:'option',value:'b',note:'Less work.'}};
  assert.match(receiptText(p,a),/Use a third approach/);assert.equal(buildReceipt(p,a).responses[1].decision,'Second');
});
test('incomplete custom and clarification responses block export',()=>{
  assert.throws(()=>buildReceipt(p,{Q123:{type:'clarify',note:''}}));
  assert.throws(()=>buildReceipt(p,{Q123:{type:'custom',note:' '}}));
});
test('saved session restores response state and incomplete drafts',()=>{
  const restored=restoreSession({format:'qior.session.v1',packet:p,answers:{Q123:{type:'clarify',note:''}}});
  assert.equal(restored.answers.Q123.type,'clarify');assert.equal(restored.packet.revision,1);
});
test('external images and duplicate IDs are rejected',()=>{
  assert.throws(()=>validatePacket({...raw,questions:[q,q]}));
  assert.throws(()=>validatePacket({...raw,questions:[{...q,kind:'comparison',images:[{src:'https://example.com/a.png',alt:'A'},{src:'data:image/svg+xml;base64,abcd',alt:'B'}]}]}));
});
test('question strings cannot terminate the embedded data block',async()=>{
  const attack='</script><script>globalThis.injected=true</script>';
  const html=await bundle({...raw,title:attack});
  assert.ok(!html.includes(attack));assert.match(html,/\\u003c\/script/);
  assert.equal(JSON.parse(safeJSON({text:attack})).text,attack);
});
test('bundle has no network dependencies or browser storage',async()=>{
  const html=await bundle(raw);
  assert.match(html,/connect-src 'none'/);assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/.test(html));
  assert.ok(!/%%[A-Z]+%%/.test(html));
  assert.ok(!/<(?:script|link)[^>]+(?:src|href)=/i.test(html));
});
test('only an explicit blank build produces an empty viewer',async()=>{
  await assert.rejects(()=>bundle({}));
  await assert.rejects(()=>bundle({...raw,questions:[]}));
  assert.match(await bundle(null),/<script type="application\/json" id="packet-data">null<\/script>/);
});
test('implications are plain text and the question needs no extra explanation fields',()=>{
  assert.equal(p.questions[0].implications,'This decides which approach the agent implements.');
  assert.equal(p.questions[0].recommended,true);
  assert.ok(!Object.hasOwn(p.questions[0],'considerB'));
  assert.throws(()=>validatePacket({...raw,questions:[{...q,implications:[]}]}));
});
test('the optional reason for B is restricted to two choices without a recommendation',()=>{
  const comparison={...q,recommended:false,considerB:'it saves one manual step.'};
  assert.equal(validatePacket({...raw,questions:[comparison]}).questions[0].considerB,comparison.considerB);
  assert.throws(()=>validatePacket({...raw,questions:[{...comparison,recommended:true}]}));
  assert.throws(()=>validatePacket({...raw,questions:[{...comparison,options:['One','Two','Three']}]}));
  assert.throws(()=>validatePacket({...raw,questions:[{...q,recommended:'yes'}]}));
});
