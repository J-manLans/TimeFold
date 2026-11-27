# Friction

Snags in how owner and agent work: a rule or doc that made the agent guess, re-read or redo work, or a job that is
tedious each time. Written by the agent as they happen, one entry each: what happened, what it cost, and the rule or doc
involved. Problems in the app go to `open-questions.md`, ideas for the code to `codebase-ideas.md`.

At the docs sweep the agent reports the entries as counts by kind, each kind with its proposed fix ("3 of …; I'd …"),
and the owner answers by number. An entry then leaves: its fix goes into the rule or doc it names, into
`starters/AGENT_DOCS_STARTER.md` when the snag is in the starter's setup, or it is dropped as a one-off.

## Entries

- **Built in the app before the prototype (2026-11-27).** In the fields' design pass the owner named a set of values to
  try, and the agent put it straight into the app, though a new look is drawn in the prototype first. Cost: several
  rounds of fixes in the app, and the prototype aligned after. Rule: the prototype's place in "How to work with the
  owner"; the owner chose to keep going in the app.
- **A global class met local class names (2026-11-27).** Making `.field` global gave two wrappers and two tag fields,
  already carrying a class named `field`, the boxed look. Cost: two broken looks and a round of fixes. Fixed already: a
  warning in "Verify before asserting".
- **A symptom fixed in one place, not the rule for all (2026-11-27).** The dashboard's scrollbar was hidden alone, so
  the page's showed next; "opens at the size of what it replaces" was written three times, once per field. Cost: the
  owner saw things break again and again. Rule: "A fix says the rule it restores", which names the rule but not its
  reach; the fix may be to state where else the rule must hold before writing it.
