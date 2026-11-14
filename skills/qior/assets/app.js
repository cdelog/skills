'use strict';
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let packet = null;
let answers = Object.create(null);
let zoomSource = null;
const message = text => {$('#status').textContent = text;};

function positionImagePreview() {
  if (!zoomSource || !$('#zoom').open) return;
  const preview = $('#zoom');
  const anchor = zoomSource.getBoundingClientRect();
  preview.style.maxHeight = `${Math.max(120, innerHeight - 32)}px`;
  $('#zoom-image').style.maxHeight = `${Math.max(80, innerHeight - 120)}px`;
  const height = preview.getBoundingClientRect().height;
  const centeredTop = anchor.top + anchor.height / 2 - height / 2;
  const top = Math.max(16, Math.min(centeredTop, innerHeight - height - 16));
  preview.style.top = `${scrollY + top}px`;
}

function setPacket(next, restored = Object.create(null)) {
  packet = validatePacket(next);
  answers = restored;
  $('#title').textContent = packet.title;
  document.title = `QIOR · ${packet.title}`;
  $('#loader').open = false;
  render();
}

function render() {
  $('#questions').innerHTML = packet.questions.map(q => {
    const a = answers[q.id] || {};
    const selected = a.type === 'option' ? `Option ${a.value}` : ({custom:'Custom answer',clarify:'Clarification',defer:'Deferred'}[a.type] || 'Unanswered');
    return `<article class="question" data-id="${esc(q.id)}">
      <div class="question-head"><span class="eyebrow">${esc(q.id)} / ${q.kind === 'comparison' ? 'Picture comparison' : 'Question'}</span><span class="answer-status">${selected}</span></div>
      <h2>${esc(q.question)}</h2>
      <p class="implications">${esc(q.implications)}</p>
      ${q.images.length ? `<div class="pictures">${q.images.map((img,i)=>`<figure><button class="image-button" data-zoom="${i}" aria-label="Enlarge picture ${i ? 'B' : 'A'}"><img src="${esc(img.src)}" alt="${esc(img.alt)}"></button><figcaption>${i?'B':'A'} · ${esc(img.alt)}</figcaption></figure>`).join('')}</div>` : ''}
      <div class="options">${q.options.map((option,i)=>{
        const letter=String.fromCharCode(97+i);
        return `<button class="option" data-option="${letter}" aria-pressed="${a.type === 'option' && a.value === letter}"><span class="letter">${letter}</span><span>${esc(option)}${i===0 && q.recommended ? '<span class="recommend-tag">Recommended</span>' : ''}${i===1 && q.considerB ? `<span class="consider-b">Consider (b) because ${esc(q.considerB)}</span>` : ''}</span></button>`;
      }).join('')}</div>
      ${a.type === 'option' ? '' : `<div class="actions">${[['custom','Custom answer'],['clarify','Ask a question'],['defer','Decide later']].map(([type,label])=>`<button class="special" data-type="${type}" aria-pressed="${a.type===type}">${label}</button>`).join('')}<button class="special clear" data-clear="true" aria-label="Clear response for ${esc(q.id)}">Clear</button></div>`}
      <label class="note-label" for="note-${esc(q.id)}">${a.type==='clarify'?'What do you need the agent to explain?':a.type==='custom'?'Your decision':'Optional note'}</label>
      <textarea class="note" id="note-${esc(q.id)}" placeholder="${a.type==='clarify'?'Ask your follow-up here':a.type==='custom'?'Write the answer you want the agent to use':'Add context if it will change what the agent does'}">${esc(a.note||'')}</textarea>
    </article>`;
  }).join('');
  updateOutput();
}

function updateOutput() {
  const decided = packet.questions.filter(q => ['option','custom'].includes(answers[q.id]?.type) && (answers[q.id]?.type !== 'custom' || answers[q.id].note?.trim())).length;
  $('#progress').textContent = `${decided} of ${packet.questions.length} decisions answered`;
  $('#save-session').disabled = false;
  try {
    $('#output').value = $('#output-format').value === 'json' ? JSON.stringify(buildReceipt(packet, answers),null,2) : receiptText(packet, answers);
    for (const id of ['copy','select-output','download']) $('#'+id).disabled = false;
  } catch(e) {
    $('#output').value = e.message;
    for (const id of ['copy','select-output','download']) $('#'+id).disabled = true;
  }
}

$('#questions').addEventListener('click', e => {
  const button = e.target.closest('button');
  const card = button?.closest('[data-id]');
  if (!card) return;
  const id = card.dataset.id;
  if (button.dataset.zoom !== undefined) {
    const img = packet.questions.find(q=>q.id===id).images[Number(button.dataset.zoom)];
    const pageX = scrollX;
    const pageY = scrollY;
    zoomSource = button;
    $('#zoom').style.top = `${pageY + button.getBoundingClientRect().top}px`;
    $('#zoom-image').src = img.src;
    $('#zoom-image').alt = img.alt;
    $('#zoom').showModal();
    scrollTo(pageX, pageY);
    positionImagePreview();
    return;
  }
  const a = answers[id] || {note:''};
  if (button.dataset.option) answers[id] = a.type === 'option' && a.value === button.dataset.option
    ? {...a, type:'', value:''}
    : {...a, type:'option', value:button.dataset.option};
  if (button.dataset.type) answers[id] = {...a, type:button.dataset.type, value:''};
  if (button.dataset.clear) delete answers[id];
  render();
  const target = document.querySelector(`[data-id="${id}"]`);
  if (['custom','clarify'].includes(button.dataset.type)) target.querySelector('.note').focus();
  else target.querySelector(button.dataset.option ? `[data-option="${button.dataset.option}"]` : button.dataset.type ? `[data-type="${button.dataset.type}"]` : '[data-clear]').focus({preventScroll:true});
});
$('#questions').addEventListener('input', e => {
  if (!e.target.matches('.note')) return;
  const id = e.target.closest('[data-id]').dataset.id;
  answers[id] = {...(answers[id]||{}),note:e.target.value};
  updateOutput();
});
$('#close-zoom').onclick = () => $('#zoom').close();
$('#zoom-image').onload = positionImagePreview;
$('#zoom').addEventListener('close', () => {zoomSource = null;});
window.addEventListener('resize', positionImagePreview);
$('#output-format').onchange = () => {if(packet) updateOutput();};

function loadValue(value) {
  if (value?.format === 'qior.session.v1') {
    const session = restoreSession(value);
    setPacket(session.packet, session.answers);
    message('Saved progress restored.');
  } else {setPacket(value);message('Questions loaded locally.');}
}
$('#load-json').onclick = () => {try {loadValue(JSON.parse($('#input-json').value));} catch(e) {message(e.message);}};
$('#load-file').onchange = async e => {
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 25*1024*1024) throw Error('Use a JSON file smaller than 25 MiB.');
    loadValue(JSON.parse(await f.text()));
  } catch(e) {message(e.message);} finally {e.target.value='';}
};

function download(content, suffix, type) {
  const url = URL.createObjectURL(new Blob([content],{type}));
  const a = document.createElement('a');
  a.href = url;
  a.download = packet.id.replace(/[^a-z0-9_-]/gi,'_') + suffix;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
$('#save-session').onclick = () => {
  if (!packet) return;
  download(JSON.stringify({format:'qior.session.v1',packet,answers},null,2),'-progress.json','application/json');
  message('Saved progress includes the questions, pictures, and current responses. Load it into this viewer to resume.');
};
$('#download').onclick = () => {
  download($('#output').value, $('#output-format').value === 'json' ? '-answers.json' : '-answers.txt', $('#output-format').value === 'json' ? 'application/json' : 'text/plain');
};
$('#select-output').onclick = () => {$('#output').focus();$('#output').select();$('#output').setSelectionRange(0,$('#output').value.length);message('Text selected. Use Copy, then paste it into the originating conversation.');};
$('#copy').onclick = async () => {
  try {
    if (!navigator.clipboard?.writeText) throw Error('Clipboard API unavailable');
    await navigator.clipboard.writeText($('#output').value);
    message('Copied. Paste these answers into the originating conversation.');
  } catch {
    $('#output').focus();$('#output').select();$('#output').setSelectionRange(0,$('#output').value.length);
    message('Automatic copying is blocked here. The text is selected. Use your device’s Copy command or Download answers.');
  }
};
try {
  const embedded = JSON.parse($('#packet-data').textContent);
  if (embedded) setPacket(embedded);
  else $('#loader').open = true;
} catch(e) {message(e.message);$('#loader').open=true;}
