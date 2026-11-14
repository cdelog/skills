# Question packet

Supply UTF-8 JSON. The renderer uses only Node built-ins. See
[packet.schema.json](packet.schema.json) for the machine-readable format.

```json
{
  "id": "dashboard-round-1",
  "revision": 1,
  "title": "Dashboard decisions",
  "questions": [{
    "id": "1",
    "kind": "question",
    "question": "Which layout should the dashboard use?",
    "implications": "Your choice sets the layout users see when they open the dashboard.",
    "options": ["Compact list", "Spacious cards"],
    "recommended": true
  }]
}
```

`id`, `revision`, `title`, and `questions` are required. Revisions are positive
integers. Use a packet ID that is unique within the project. Keep question IDs
stable, using positive numbers as strings or Q followed by a positive number,
such as `"1"` or `"Q123"`. A packet holds one to twenty questions.

`question` is one sentence ending in a question mark. `implications` is a
single string of one or two sentences describing what the answer influences
and how. Sentence quality is the agent's responsibility; structural validation
does not judge the writing.

`options` contains two to four nonempty strings. They are displayed in order,
lettered A to D. The first option has priority. Set `recommended: true` only
when A is your recommendation. Omit it when you have none. An optional
`considerB` string is allowed only with two options and no recommendation.
It appears within option B as a reason to consider it.

An optional `origin` string is retained in the JSON answer for routing.
It is not shown as introductory text in the sheet. Omit it unless it helps
the receiving agent identify the conversation.

## Picture comparisons

Set `kind` to `comparison` and supply exactly two images:

```json
"images": [
  {"path": "screenshots/list.png", "alt": "Compact list layout"},
  {"path": "screenshots/cards.png", "alt": "Spacious card layout"}
]
```

Paths resolve relative to the JSON file. Use PNG, JPEG, or WebP files under
5 MiB each. The renderer embeds the bytes into the output HTML. You may
instead supply `src` with a base64 data URL for one of those formats.
External image URLs and SVG are not accepted. Regular `question` items
have no images.

The viewer displays the two pictures together and enlarges a clicked image
near its original vertical position. The user can select an option, select
it again to deselect, add a note, write a custom answer, ask a question, or
defer. Selecting an option hides the alternate controls and preserves notes.

## Command interface

```sh
node "<skill-root>/scripts/qior.mjs" render questions.json --out decisions.html
node "<skill-root>/scripts/qior.mjs" validate questions.json
node "<skill-root>/scripts/qior.mjs" viewer --out viewer.html
```

The CLI works from any current directory. Output paths resolve relative to
that directory. Parent output directories are created as needed. It checks
the packet and loads the supplied images before writing output. Errors go
to stderr and exit with status 1. Success writes one JSON result to stdout.

## Answer interface

The user pastes the sheet's plain text or JSON output into the conversation.
The default plain text puts all responses on one line, using their original
IDs and semicolons between responses:

```text
Q1: a; Q2: b | Comment: "Keep it crisp."; Q3: Answer: "Use another layout."; Q4: Decide later; Q5: Question: "Does this work offline?"; Q6: Unanswered
```

Option text, packet metadata, and closing instructions are omitted from the
plain text. Free text is quoted, with quotes and line breaks escaped as in
JSON, so comments cannot be confused with another response. Notes on unanswered
questions are labeled `Draft comment` to keep them distinct from decisions.
The receiving agent uses the question IDs in the originating conversation.

JSON output retains the full record, including option text, when needed.
It uses `format: "qior.answers.v1"`, `packetId`, `revision`, and
`responses`. Each response has a question `id`, its question text, and a type:

- `option`: `option` is a lowercase letter and `decision` is the option text.
- `custom`: `decision` is the user's text.
- `clarify`: `questionForAgent` is a follow-up, not a decision.
- `defer`: the user will decide later.
- `unanswered`: no answer was supplied.

Optional reasons are retained in `note`. Notes on unanswered questions are
draft context, not decisions. An empty custom answer or clarification blocks
copying until it is completed or cleared.

Save progress downloads a `qior.session.v1` JSON file containing the packet,
embedded pictures, and response state. Load it into a viewer to resume.
The page uses no browser storage and does not overwrite its original file.
Nothing is sent automatically.
