export function validatePacket(input) {
  const requireText = (value, label) => {
    if (typeof value !== 'string' || !value.trim()) throw Error(`${label} must be text.`);
    return value.trim();
  };
  if (!input || typeof input !== 'object') throw Error('Supply a question packet.');
  const packet = {
    id: requireText(input.id, 'Packet ID'),
    revision: input.revision,
    title: requireText(input.title, 'Title'),
    origin: typeof input.origin === 'string' ? input.origin : '',
    questions: []
  };
  if (!Number.isSafeInteger(packet.revision) || packet.revision < 1) throw Error('Revision must be a positive integer.');
  if (!Array.isArray(input.questions) || !input.questions.length || input.questions.length > 20) throw Error('Supply 1–20 questions.');
  const seen = new Set();
  packet.questions = input.questions.map(q => {
    const id = String(q.id);
    if (!/^(?:Q)?[1-9]\d*$/i.test(id) || seen.has(id.toUpperCase())) throw Error('Use unique question IDs such as 1 or Q123.');
    seen.add(id.toUpperCase());
    if (!['question', 'comparison'].includes(q.kind)) throw Error(`Question ${id}: invalid kind.`);
    const question = requireText(q.question, 'Question');
    if (!question.endsWith('?')) throw Error(`Question ${id} must end with ?`);
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) throw Error(`Question ${id} needs 2–4 options.`);
    const options = q.options.map(o => requireText(o, 'Option'));
    const implications = requireText(q.implications, 'Implications');
    if (q.recommended !== undefined && typeof q.recommended !== 'boolean') throw Error('recommended must be true or false when supplied.');
    const recommended = q.recommended === true;
    const considerB = q.considerB == null || q.considerB === '' ? '' : requireText(q.considerB, 'Reason to consider B');
    if (considerB && (options.length !== 2 || recommended)) throw Error('A reason to consider B is only available for two options with no recommendation.');
    const images = q.images === undefined ? [] : q.images;
    if (!Array.isArray(images) || (q.kind === 'comparison' && images.length !== 2) || (q.kind === 'question' && images.length)) throw Error(`Question ${id}: comparisons need exactly two images.`);
    for (const img of images) {
      requireText(img.alt, 'Image description');
      if (typeof img.src !== 'string' || !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(img.src)) throw Error('Embed PNG, JPEG, or WebP images. External URLs and SVG are not accepted.');
    }
    return {id, kind:q.kind, question, implications, options, recommended, ...(considerB ? {considerB} : {}),
      images:images.map(img=>({src:img.src,alt:img.alt}))};
  });
  return packet;
}

export function answerRecords(packet, answers) {
  return packet.questions.map(q => {
    const a = answers[q.id] || {};
    const note = typeof a.note === 'string' ? a.note.trim() : '';
    let type = a.type || 'unanswered';
    if (!['option','custom','clarify','defer','unanswered'].includes(type)) throw Error(`Invalid response for ${q.id}.`);
    if ((type === 'custom' || type === 'clarify') && !note) throw Error(`${q.id}: enter your ${type === 'clarify' ? 'clarification question' : 'custom answer'}.`);
    const record = {id:q.id, question:q.question, type};
    if (type === 'option') {
      const value = a.value;
      if (!/^[a-d]$/.test(value) || !q.options[value.charCodeAt(0)-97]) throw Error(`Invalid option for ${q.id}.`);
      record.option = value;
      record.decision = q.options[value.charCodeAt(0)-97];
    }
    if (note) record[type === 'custom' ? 'decision' : type === 'clarify' ? 'questionForAgent' : 'note'] = note;
    return record;
  });
}

export function buildReceipt(packet, answers) {
  return {format:'qior.answers.v1', packetId:packet.id, revision:packet.revision, origin:packet.origin, responses:answerRecords(packet, answers)};
}

export function receiptText(packet, answers) {
  const lines = [];
  for (const a of answerRecords(packet, answers)) {
    const prefix = `${a.id}: `;
    let response;
    if (a.type === 'option') response = a.option;
    if (a.type === 'custom') response = `Answer: ${JSON.stringify(a.decision)}`;
    if (a.type === 'clarify') response = `Question: ${JSON.stringify(a.questionForAgent)}`;
    if (a.type === 'defer') response = 'Decide later';
    if (a.type === 'unanswered') response = 'Unanswered';
    if (a.note) response += ` | ${a.type === 'unanswered' ? 'Draft comment' : 'Comment'}: ${JSON.stringify(a.note)}`;
    lines.push(prefix + response);
  }
  return lines.join('; ');
}

export function restoreSession(session) {
  if (session?.format !== 'qior.session.v1') throw Error('Choose a QIOR saved session.');
  const packet = validatePacket(session.packet);
  const answers = Object.create(null);
  for (const q of packet.questions) {
    const a = session.answers?.[q.id];
    if (a) answers[q.id] = {type:a.type || '', value:a.value || '', note:typeof a.note === 'string' ? a.note : ''};
  }
  // Preserve incomplete clarification drafts while validating every completed answer.
  answerRecords(packet, Object.fromEntries(Object.entries(answers).map(([id,a]) => [id, ['custom','clarify'].includes(a.type) && !a.note.trim() ? {...a,type:''} : a])));
  return {packet, answers};
}
