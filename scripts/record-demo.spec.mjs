import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {join} from 'node:path';

// Captures lossless frames of answering the demo packet, with a visible pointer, into
// output/demo-frames/. frames.txt lists them with their durations for ffmpeg's concat input.
// The README gives the command that turns them into docs/screenshots/demo.gif. Chromium only.
test('record the demo walkthrough',async({browser})=>{
  test.setTimeout(120_000);
  const root=fileURLToPath(new URL('../',import.meta.url));
  const report=join(root,'output','demo.html');
  const frameDir=join(root,'output','demo-frames');
  await rm(frameDir,{recursive:true,force:true});
  await mkdir(frameDir,{recursive:true});
  execFileSync(process.execPath,[join(root,'skills','qior','scripts','qior.mjs'),'render',join(root,'docs','demo','questions.json'),'--out',report]);
  const viewport={width:820,height:620};
  const context=await browser.newContext({viewport,permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  await page.addInitScript(()=>addEventListener('DOMContentLoaded',()=>{
    // Headless recordings show no mouse, so draw one. A popover sits in the top layer, above the picture dialog.
    const pointer=document.createElement('div');
    pointer.popover='manual';
    pointer.style.cssText='position:fixed;inset:auto;left:0;top:0;margin:0;padding:0;border:0;background:none;overflow:visible;pointer-events:none;transform:translate(-50px,-50px)';
    pointer.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" style="display:block"><path d="M3 2l16 9.5-7.2 1.6L8.3 20z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.append(pointer);
    pointer.showPopover();
    addEventListener('mousemove',e=>{pointer.style.transform=`translate(${e.clientX-3}px,${e.clientY-2}px)`;},true);
    addEventListener('mousedown',()=>{
      const ring=document.createElement('span');
      ring.style.cssText='position:absolute;left:-11px;top:-11px;width:28px;height:28px;border-radius:50%;border:3px solid #3b82f6';
      pointer.append(ring);
      ring.animate([{transform:'scale(.4)',opacity:1},{transform:'scale(1.4)',opacity:0}],{duration:450}).onfinish=()=>ring.remove();
    },true);
    new MutationObserver(()=>{pointer.hidePopover();pointer.showPopover();}).observe(document.body,{subtree:true,attributeFilter:['open']});
  }));
  await page.goto(pathToFileURL(report).href);
  await page.evaluate(()=>Promise.all(Array.from(document.querySelectorAll('.pictures img'),img=>img.decode())));

  let at={x:viewport.width/2,y:viewport.height-60};
  const glide=async(x,y,ms=550)=>{
    const from=at,steps=Math.round(ms/16);
    for(let i=1;i<=steps;i++){
      const t=i/steps,e=t<.5?2*t*t:1-(-2*t+2)**2/2;
      await page.mouse.move(from.x+(x-from.x)*e,from.y+(y-from.y)*e);
      await page.waitForTimeout(16);
    }
    at={x,y};
  };
  const show=async(selector,offset=24)=>{
    await page.evaluate(([s,o])=>scrollTo({top:document.querySelector(s).getBoundingClientRect().top+scrollY-o,behavior:'smooth'}),[selector,offset]);
    await page.waitForTimeout(750);
  };
  const click=async(locator,pause=450)=>{
    const box=await locator.boundingBox();
    await glide(box.x+Math.min(box.width/2,150),box.y+box.height/2);
    await page.mouse.down();await page.mouse.up();
    await page.waitForTimeout(pause);
  };

  await page.mouse.move(at.x,at.y);
  // Chromium sends a frame on each repaint. Writing each frame's duration keeps the real pacing.
  const frames=[];
  const cdp=await context.newCDPSession(page);
  cdp.on('Page.screencastFrame',({data,metadata,sessionId})=>{
    frames.push({data,time:metadata.timestamp});
    cdp.send('Page.screencastFrameAck',{sessionId}).catch(()=>{});
  });
  await cdp.send('Page.startScreencast',{format:'png'});
  await page.waitForTimeout(1300);
  await show('[data-id="1"]',90);
  await click(page.locator('[data-id="1"] [data-option="a"]'),700);

  await show('[data-id="2"]');
  await click(page.locator('[data-id="2"] [data-zoom="1"]'),1400);
  await click(page.locator('#close-zoom'),500);
  await click(page.locator('[data-id="2"] [data-option="b"]'),400);
  await click(page.locator('#note-2'),200);
  await page.locator('#note-2').pressSequentially('Streaks are the reason to open it.',{delay:45});
  await page.waitForTimeout(600);

  await show('[data-id="3"]',90);
  await click(page.locator('[data-id="3"] [data-option="a"]'),500);
  await show('[data-id="4"]',90);
  await click(page.locator('[data-id="4"] [data-option="b"]'),700);

  await show('#handoff',60);
  await click(page.getByRole('button',{name:'Copy answers'}),2800);
  await expect(page.locator('#status')).toHaveText(/^Copied/);
  await cdp.send('Page.stopScreencast');
  await context.close();

  const list=['ffconcat version 1.0'];
  for(const [i,frame] of frames.entries()){
    const name=`${String(i).padStart(4,'0')}.png`;
    await writeFile(join(frameDir,name),Buffer.from(frame.data,'base64'));
    const next=frames[i+1]?.time??frame.time+2;
    list.push(`file ${name}`,`duration ${(next-frame.time).toFixed(3)}`);
  }
  list.push(`file ${String(frames.length-1).padStart(4,'0')}.png`); // concat ignores the last duration otherwise
  await writeFile(join(frameDir,'frames.txt'),`${list.join('\n')}\n`);
  expect(frames.length).toBeGreaterThan(50);
});
