#!/usr/bin/env node
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {parseArgs} from 'node:util';
import {bundle} from './render.mjs';

const help = `QIOR, portable decision sheets. Requires Node.js 22 or later.

  node qior.mjs render packet.json --out decisions.html
  node qior.mjs validate packet.json
  node qior.mjs viewer --out viewer.html

Paths to pictures resolve relative to packet.json.
Output paths resolve relative to the current directory.
Success writes a JSON result to stdout. Errors go to stderr with exit code 1.
No server, network access, npm install, or API key is required.`;

try {
  const {values, positionals} = parseArgs({allowPositionals:true, options:{out:{type:'string'},help:{type:'boolean',short:'h'}}});
  if (values.help || !positionals.length) {
    console.log(help);
  } else {
    const [command, source, ...extra] = positionals;
    if (!['render','validate','viewer'].includes(command)) throw Error(`Unknown command: ${command}. Use --help.`);
    if (extra.length || (command === 'viewer' && source)) throw Error('Unexpected positional arguments. Use --help.');
    if (command !== 'viewer' && !source) throw Error('Supply a question JSON file.');
    if (command === 'validate' && values.out) throw Error('validate does not write an output file.');
    if (command !== 'validate' && !values.out) throw Error('Supply --out with the destination HTML file.');
    const inputPath = source ? resolve(source) : null;
    const outputPath = values.out ? resolve(values.out) : null;
    if (inputPath === outputPath) throw Error('The output must not overwrite the input JSON file.');
    const input = inputPath ? JSON.parse(await readFile(inputPath,'utf8')) : null;
    if (command !== 'viewer' && input === null) throw Error('Supply a question packet. Use viewer to create a blank viewer.');
    const html = await bundle(input,inputPath ? dirname(inputPath) : process.cwd());
    if (command === 'validate') {
      console.log(JSON.stringify({valid:true,packetId:input.id,revision:input.revision,questions:input.questions.length}));
    } else {
      await mkdir(dirname(outputPath),{recursive:true});
      await writeFile(outputPath,html);
      console.log(JSON.stringify({path:outputPath,bytes:Buffer.byteLength(html),questions:input?.questions.length || 0}));
    }
  }
} catch(error) {
  console.error(`QIOR: ${error.message}`);
  process.exitCode = 1;
}
