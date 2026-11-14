import {test} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {join} from 'node:path';

test('capture the synthetic example for the README',async({page})=>{
  const root=fileURLToPath(new URL('../',import.meta.url));
  const destination=join(root,'docs','screenshots');
  const report=join(root,'output','decisions.html');
  await mkdir(destination,{recursive:true});
  execFileSync(process.execPath,[join(root,'skills','qior','scripts','qior.mjs'),'render',join(root,'skills','qior','examples','questions.json'),'--out',report]);
  await page.goto(pathToFileURL(report).href);
  await page.evaluate(()=>Promise.all(Array.from(document.querySelectorAll('.pictures img'),img=>img.decode())));
  await page.locator('[data-id="1"] [data-option="a"]').click();
  await page.locator('#note-1').fill('Keep the reply in the same conversation.');
  await page.locator('[data-id="1"]').screenshot({path:join(destination,'choose-an-answer.png')});

  await page.locator('[data-id="2"] [data-option="b"]').click();
  await page.locator('#note-2').fill('Use the colored header to separate decisions.');
  await page.locator('[data-id="2"]').screenshot({path:join(destination,'compare-pictures.png')});

  await page.locator('#output').evaluate(element=>{
    element.style.height='auto';
    element.style.height=`${element.scrollHeight+4}px`;
  });
  await page.locator('#handoff').screenshot({path:join(destination,'copy-decisions.png')});
});
