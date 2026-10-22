---
name: qior
description: >
  QIOR (pronounced "choir"): Question, Implications, Options, Recommendation.
  A format for putting decisions to a busy person so they can answer a whole
  stack in seconds, for example "1a 2a 3b", and for acting on the answers
  straight away. Use whenever you need a decision you can't make yourself,
  when you stack questions for someone, in "question time", or when the user
  says "QIOR", "choir", "ask me", "what do you need from me", or "stack the
  questions".
license: MIT
---

# QIOR

Put a decision to a person so they can make it in one reading. Then act on
the answer straight away.

The job has two halves:

1. **Arm them.** Give them the facts that decide the question, how you know
   each one, and nothing else.
2. **Respond efficiently.** Take the answer, say what you'll do, and do it.
   Don't explain it again or ask twice.

Every question has four parts, and option (a) is always your recommendation.
A reader who trusts your analysis can answer a whole stack with "all a".

## Before you ask

Ask only what you can't decide. For each candidate question, check:

- **Is it yours to decide?** If it's within what you've been trusted with,
  decide it, act, and report it as decided. Don't ask.
- **Can you recommend?** If not, it isn't ready. Find what's missing first,
  or ask for that missing fact instead.
- **Is it one decision?** Split questions joined by "and". Merge questions
  that can only be answered together.
- **Is it about wording?** Show the exact words in the question, for a yes or
  a rewrite. Don't ask who will word it, or when.
- **Does another question decide it?** Ask that one first, or write "skip if
  1 is (b)".

## The four parts

**Q, the question.** One sentence that ends in a question mark and can be
answered by picking an option. Name the thing in plain words, not by a ticket
number. If the reader needs context, give one line of it, first.

**I, the implications.** The facts that decide it, in at most three short
bullets:

- what changes, and for whom;
- what it costs or risks, as a number where you have one;
- whether it's reversible, and what work waits on the answer.

Pick the facts that could change the answer. Leave out true facts that
wouldn't.

**O, the options.** Two to four, lettered. **(a) is always your
recommendation.** Each option is one line: what happens if it's chosen, and
what it costs. Include "wait" or "do nothing" when that's a real choice.
Never offer two options that are the same thing in different words.

**R, the recommendation.** "Recommend (a)," and one line with the reason: the
fact that tips it.

Then, when it matters, **Until you answer:** what holds, what continues, and
what happens by default if no answer comes. Never default to anything that
can't be undone.

## Arm the reader

The reader decides from what you show them. Show them what they'd want if
they had time to check it themselves.

- **Say how you know.** Each fact that carries the decision is one of three
  kinds, and the reader must be able to tell which:
  - **checked:** you measured it, ran it or read it yourself, so name the
    source;
  - **reported:** someone else's figure, with a link and the date you read
    it;
  - **estimated:** your own assumption or arithmetic, labelled as an
    estimate.

  Never let an estimate read like a measurement.
- **Say what you don't know.** "Unknown" is a fact. "Couldn't check" is not
  the same as zero.
- **Show the number.** "189 characters, and results cut at 155" beats "too
  long". Give units, and the date for anything that changes.
- **Give the strongest fact against (a)**, in one line, when there is one.
  The reader can then overrule you knowing what they're overruling, and when
  they agree they can trust (a).
- **Say what (a) is best at** when the options trade off: speed, cost, risk
  or reach. The cheapest option to try is not the one most likely to work.
- **Link to the detail.** Don't paste it.

## Write it to be read once

The reader may be on a phone between other things. Every line has to earn
its place.

- **Lead with the point.** The question comes first, then why it matters.
- **Use plain words.** "The sign-up page", not "the onboarding surface".
- **One idea per sentence.** Keep sentences short.
- **Every line adds a fact.** Cut openers, restatements and padding such as
  "it's worth noting", "importantly" or "as mentioned".
- **Hedge once, specifically.** Not "this might possibly help". Write "This
  should help. Friday's test will show it."
- **No hype and no flattery.** No "great question", "robust", "seamless",
  "game-changing" or "critical" unless something is actually on fire.
- **Use simple punctuation.** Use periods and commas. Avoid dashes, long
  semicolon chains and brackets inside brackets.
- **In the questions you send, bold only the markers:** the question number
  and "Recommend". A bold sentence in every bullet means nothing stands out.

## The template

```
**1. <Question?>**
- <implication, and how you know it>
- <implication>
  - (a) <option>: <what happens, what it costs>
  - (b) <option>: <what happens, what it costs>
**Recommend (a):** <the fact that tips it>.
Until you answer: <what holds>.
```

## Stacking questions

- **Number them once,** and keep the numbers for the whole conversation. If
  the project keeps decision numbers (Q123), use them, so each answer can be
  recorded against its question.
- **Order by what waits on them.** Questions that block other work come
  first, then the costly or irreversible, then the quick ones. Keep related
  questions together.
- **Up to 20 per stack.** Hold the rest for the next round, and say how many
  are held. A long stack stays fast when:
  - it's grouped under short headings (for example "Product", "Legal",
    "Hiring"), with the blocking questions first;
  - every question follows the template, so the eye learns where (a) sits;
  - the quick yes-or-no questions sit together, so they can be answered as a
    run ("8 to 14: all a").
- **Each question fits on a phone screen.**
- **End with the answer key:** "Reply like: 1a 2a 3b, or 'all a'."

## Respond efficiently

Once the answers come in, the reader's part is done. Yours starts.

- **Accept any shorthand:** "1a 2b", "all a", "3: hold", or free text. Free
  text that changes an option becomes the decision as written.
- **Echo each decision in one line, then act on it in the same reply.** For
  example, "1: (a), shortening the sentence now." Don't restate the options,
  thank them, or ask "are you sure?".
- **Record each decision** where the project keeps decisions.
- **If one answer is unclear,** ask about that one only, in one line, with
  your best reading of it as (a). Act on all the others meanwhile.
- **If they correct your reading,** take the correction, undo what you did
  on the wrong reading, and say in one line what you undid.
- **A "why?" asks for detail. It isn't a no.** Answer it in a few lines,
  then put the question again as it stood.
- **An unanswered question stays open.** Carry it into the next stack,
  marked "asked before" with the date.
- **Report back when it's done:** one line per answer, saying what happened.

## Check before you send

- Every question ends with a question mark, and a letter can answer it.
- (a) is the recommendation, every time.
- Each implication is a fact that could change the answer, and every
  estimate says it's an estimate.
- Where a strong fact against (a) exists, it's shown.
- Nothing in the stack is yours to decide.
- No question needs scrolling on a phone.
- The answer key is the last line.

## Anti-patterns

- "What do you think?" with no options.
- The recommendation hidden in (b), or missing.
- Asking permission for something already decided, or within your own remit.
- Asking who will word something later, instead of showing the words now.
- Implications that restate the question.
- An estimate presented as a measurement, or a guess presented as a fact.
- Facts that all point one way when a strong fact against exists.
- A wall of context before the question.
- Options that differ only in wording.
- Re-asking a question that has been answered.
- More than 20 questions at once, or a long stack with no grouping.

## Example

**1. Should the site description drop its last clause to fit in search
results?**
- The sentence is 189 characters (checked), and search results cut
  descriptions at about 155 (reported by most SEO guides). Every page ends
  "...for any Java release from", without the range.
- It's copy only, and one deploy reverts it.
  - (a) Use the 148-character version, plus a test that keeps it under 155.
  - (b) Keep the long sentence and accept the cut.

**Recommend (a):** the range is the fact the sentence exists to carry.

Until you answer: the pull request waits, and nothing else depends on it.

Reply like: 1a.

Then, after "1a":

> 1: (a). The 148-character description and its length test are in the pull
> request, ready to merge.
