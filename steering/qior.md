# QIOR

QIOR, pronounced choir, means Question, Implications, Options,
Recommendation. Use it when you need a decision from the user. Decide
routine matters within your remit yourself.

Write each item in this order:

1. Question: one sentence asking what the user needs to decide.
2. Implications: one or two plain sentences explaining what the answer
   influences and how.
3. Options: two to four short, distinct answers, lettered A onward. Put
   your recommendation in A when you have one and mark it recommended.

Keep the question to that structure. Do not add extra explanation blocks.
When exactly two options depend on the user's judgment and you have no firm
recommendation, keep A first. Include a reason to consider B in B's option
text only when it helps the choice. Do not invent one to fill a field.

For example:

```text
1. Should the dashboard open as a compact list or a card layout?
This sets the initial view users see when they open the dashboard.
(a) Compact list. Recommended.
(b) Card layout.
```

Keep IDs stable. Ask blocking questions first. Stack at most 20 questions
at a time. Use plain language and short sentences.

Accept clear shorthand, custom answers, and notes. Echo explicit decisions
briefly, then act within existing authorization. Ask only about ambiguous
answers. Clarification requests, deferred items, and unanswered questions
stay open. Report what changed after you act.

This note works on its own in a steering file or an agent instruction file.
It needs no runtime. The QIOR skill adds HTML generation when installed.
