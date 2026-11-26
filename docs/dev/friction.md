# Friction

Snags in how owner and agent work: a rule or doc that made the agent guess, re-read or redo work, or a job that is
tedious each time. Written by the agent as they happen, one entry each: what happened, what it cost, and the rule or doc
involved. Problems in the app go to `open-questions.md`, ideas for the code to `codebase-ideas.md`.

At the docs sweep the agent reports the entries as counts by kind, each kind with its proposed fix ("3 of …; I'd …"),
and the owner answers by number. An entry then leaves: its fix goes into the rule or doc it names, into
`starters/AGENT_DOCS_STARTER.md` when the snag is in the starter's setup, or it is dropped as a one-off.

## Entries

- **A commit chained after a failed docs edit (2026-11-26).** Twice in Phase 4 a scripted docs edit failed on a line
  break, and the commit after it still ran, so a pushed commit's message named docs it did not hold; a follow-up commit
  put them in. Cost: two extra commits. Doc: "Commits" in `AGENTS.md`. Since then the edit and the commit run as one
  chain that stops at the first failure.
