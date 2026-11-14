import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cp, mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const exec = promisify(execFile);
const source = fileURLToPath(new URL('../skills/qior/',import.meta.url));

test('a copied skill renders pictures and a viewer from a different working directory',async()=>{
  const workspace = await mkdtemp(join(tmpdir(),'qior-install-'));
  try {
    const installed = join(workspace,'installed skill');
    await cp(source,installed,{recursive:true});
    const cli = join(installed,'scripts','qior.mjs');
    const run = args => exec(process.execPath,[cli,...args],{cwd:workspace});
    const input = join(installed,'examples','questions.json');
    const generated = JSON.parse((await run(['render',input,'--out','reports/decisions.html'])).stdout);
    assert.equal(generated.questions,2);
    const html = await readFile(generated.path,'utf8');
    const packet = JSON.parse(html.match(/id="packet-data">([\s\S]*?)<\/script>/)[1]);
    assert.equal(packet.questions[1].images.length,2);
    assert.ok(packet.questions[1].images.every(img=>img.src.startsWith('data:image/png;base64,')&&!img.path));
    assert.ok(!html.includes(installed));
    assert.match(html,/connect-src 'none'/);
    const valid = JSON.parse((await run(['validate',input])).stdout);
    assert.equal(valid.valid,true);
    const viewer = JSON.parse((await run(['viewer','--out','reports/viewer.html'])).stdout);
    assert.equal(viewer.questions,0);
    assert.match(await readFile(viewer.path,'utf8'),/id="packet-data">null<\/script>/);
    const bad = join(workspace,'invalid.json');
    await writeFile(bad,'{"id":"incomplete"}');
    await assert.rejects(()=>run(['render',bad,'--out','bad.html']),error=>error.code===1&&/QIOR:/.test(error.stderr));
    await assert.rejects(()=>run(['render',input,'--out',input]),error=>error.code===1&&/overwrite/.test(error.stderr));
    await assert.rejects(()=>run(['viewer','--out','a.html','extra']),error=>error.code===1);
  } finally {
    assert.ok(resolve(workspace).startsWith(resolve(tmpdir())+sep+'qior-install-'));
    await rm(workspace,{recursive:true,force:true});
  }
});
