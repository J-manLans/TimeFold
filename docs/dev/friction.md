# Friction

Snags in how owner and agent work: a rule or doc that made the agent guess, re-read or redo work, or a job that is
tedious each time. Written by the agent as they happen, one entry each: what happened, what it cost, and the rule or doc
involved. Problems in the app go to `open-questions.md`, ideas for the code to `codebase-ideas.md`.

At the docs sweep the agent reports the entries as counts by kind, each kind with its proposed fix ("3 of …; I'd …"),
and the owner answers by number. An entry then leaves: its fix goes into the rule or doc it names, into
`AGENT_DOCS_STARTER.md` when the snag is in the starter's setup, or it is dropped as a one-off.

## Entries

- **A finished phase's steps are hard to find.** A phase leaves the roadmap once done, steps and all, so "what was in
  Phase 1?" took four searches through `git log` and old copies of the roadmap. Involves "Where things go" (a step seen
  everywhere leaves the roadmap).
- **Two rules cover pulling at the start.** "Starting a session" waits for the owner to confirm they have pulled; "The
  branch may have moved since the last look" has the agent fetch and compare itself. The agent fetched, found the branch
  one commit behind, and pulled without asking, unsure which rule governs.
