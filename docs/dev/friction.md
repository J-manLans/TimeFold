# Friction

Snags in how owner and agent work: a rule or doc that made the agent guess, re-read or redo work, or a job that is
tedious each time. Written by the agent as they happen, one entry each: what happened, what it cost, and the rule or doc
involved. Problems in the app go to `open-questions.md`, ideas for the code to `codebase-ideas.md`.

At the docs sweep the agent reports the entries as counts by kind, each kind with its proposed fix ("3 of …; I'd …"),
and the owner answers by number. An entry then leaves: its fix goes into the rule or doc it names, into
`AGENT_DOCS_STARTER.md` when the snag is in the starter's setup, or it is dropped as a one-off.

## Entries

### A fix to where a field opens never asked what it edits (2026-11-23)

In Phase 3 the owner said a divided entry's right break tag opened its field on the left one. The fix moved the field to
the clicked tag and left it on the whole break, as "Editing an entry on its line" said ("the entry's one break"), though
a save makes an entry per part, each with its own break (`edit.ts`). The field then showed the sum under a part's tag,
and "+ paus" sat on the first part only. The owner found it himself the same day; the agent in a later session read the
same sum as intended too. Cost: a decision rewritten, a roadmap step, and a fix built twice. Rule involved: "Mention
what is surprising; do not fix it unasked", in `AGENTS.md`, which only works when the agent looks past the symptom. A
fix to where or how a control shows could also check what it changes against what is saved, and say so when a decision
and the code disagree on the data's shape.
