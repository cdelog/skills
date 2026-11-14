---
name: qior
description: >
  QIOR, pronounced choir: Question, Implications, Options, Recommendation.
  Prepare decisions the user needs to make, generate portable HTML question
  sheets from JSON with the bundled Node renderer, and act on pasted answers.
  Use when the user asks for QIOR, a decision sheet, a stack of questions,
  or a side by side picture comparison. Also use when several decisions need
  the user's judgment. Keep routine decisions within the agent's remit.
license: MIT
---
# QIOR

Prepare the decision so the user can answer it in one reading. The agent
writes question JSON and runs the bundled renderer. The renderer owns the
HTML, layout, and interaction code.

## Shape each question

- Ask only for judgment or information you cannot supply within your remit.
- Question: one sentence asking what the user needs to decide.
- Implications: one or two plain sentences explaining what the answer
  influences and how.
- Options: two to four short, distinct answers. Put A first. When you have a
  recommendation, put it in A and set `recommended` to `true`.
- When exactly two options need the user's judgment and you have no firm
  recommendation, leave `recommended` false or absent. An optional
  `considerB` can explain a real reason to choose B. Omit it otherwise.

That is the whole question: question, implications, then options. Keep the
language direct. Do not add extra explanation blocks to fill space.

Keep question IDs stable across the conversation. Put blocking questions
first. Use at most 20 questions per sheet and increment its revision when
you change the questions, options, or pictures.

## Generate the sheet

Requires Node.js 22 or later on the machine generating the file. The person
answering only needs a browser. No npm install, server, API key, or account
is needed for generation.

Resolve `<skill-root>` to the folder containing this `SKILL.md`. Read
[the packet format](references/packet-format.md) when preparing JSON.
The [JSON schema](references/packet.schema.json) describes the input fields.
Use [the example packet](examples/questions.json) as a starting point.

Write the packet to a JSON file and run:

```sh
node "<skill-root>/scripts/qior.mjs" render questions.json --out decisions.html
```

The command prints a JSON result with the output path and byte count.
Use that path to attach or link the HTML file in the current conversation.
For ordinary question sheets, supply content through JSON and leave the
bundled template, CSS, and JavaScript alone.

For picture comparisons, set `kind` to `comparison` and supply two PNG,
JPEG, or WebP paths with descriptions. The renderer embeds the pictures.
Paths resolve relative to the packet JSON, so the generated HTML travels
as a single file. Use clear pictures that show the actual choice.

If generation is unavailable, say why and give the same questions directly
in the conversation. If the user already has the reusable viewer, they can
load the packet JSON there instead. Generate that viewer with:

```sh
node "<skill-root>/scripts/qior.mjs" viewer --out viewer.html
```

## Respond to the answers

The user copies plain text or JSON from the sheet and sends it back in the
originating conversation. Creating or opening a sheet supplies no answers.

- Match the packet ID, revision, and question IDs before using a response.
  If it is from an older revision, reconcile the changed questions before
  acting on those answers. Continue with answers whose meaning is clear.
- Echo each explicit decision briefly and act within existing authorization.
  Record it in the project's existing decision log when there is one.
- A custom answer is the user's decision as written. Preserve their notes.
- Clarification requests, deferred items, and unanswered items stay open.
  Answer a clarification in the conversation and update the sheet if needed.
- Accept clear conversational replies, including `1a 2b`, as well as the
  sheet's exported output. Clarify only the ambiguous part of an answer.
- Report what changed after applying the decision. A preference about a
  picture does not grant unrelated publishing or deployment permission.

## Text format

When the user prefers text, use the same structure without a renderer:

```text
1. Should the dashboard open as a compact list or a card layout?
This sets the initial view users see when they open the dashboard.
(a) Compact list. Recommended.
(b) Card layout.
```

No recommendation is required when the choice depends on the user's taste.
For a two option choice, a real reason to consider B can go in B's option
text. Keep A first.
