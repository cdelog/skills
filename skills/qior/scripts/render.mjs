import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {validatePacket} from './logic.mjs';

export function safeJSON(data) {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, c => '\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
}

export async function bundle(input, baseDir = process.cwd()) {
  const raw = structuredClone(input);
  for (const q of raw?.questions || []) {
    for (const img of q.images || []) {
      if (img.path && img.src) throw Error('Supply either an image path or an embedded image, not both.');
      if (img.path) {
        const mime = {'.png':'png','.jpg':'jpeg','.jpeg':'jpeg','.webp':'webp'}[extname(img.path).toLowerCase()];
        if (!mime) throw Error('Use a PNG, JPEG, or WebP image path.');
        const bytes = await readFile(resolve(baseDir,img.path));
        if (bytes.length > 5*1024*1024) throw Error('Each picture must be under 5 MiB.');
        img.src = `data:image/${mime};base64,${bytes.toString('base64')}`;
        delete img.path;
      }
    }
  }
  const packet = raw === null ? null : validatePacket(raw);
  const [template, style, logic, app] = await Promise.all(['../assets/template.html','../assets/style.css','./logic.mjs','../assets/app.js'].map(f => readFile(new URL(f,import.meta.url),'utf8')));
  return template.replace('%%STYLE%%',()=>style).replace('%%DATA%%',()=>safeJSON(packet)).replace('%%LOGIC%%',()=>logic.replace(/^export /gm,'')).replace('%%APP%%',()=>app);
}
