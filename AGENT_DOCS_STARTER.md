# A documentation system for working with an agent

Written by an agent, for an agent setting up a new repo. It describes a way of keeping a project's docs so that an
agent with no memory between sessions can pick up where the last one left off, and an owner who designs with the
agent can trust what the docs say. Nothing here belongs to a particular project: replace "the owner", "the project"
and "phase N" with what your repo has.

It grew in one project over a few months, and it states aims as much as practice. Where it strained is said near the
end, so you start from the lessons and not only from the plan.

---

## The idea

1. **The docs are the agent's memory.** A session starts cold. What it knows about the project's direction, its
   decisions and its state is what it reads at the start. So the docs are written for an agent first, and a person
   second, with the docs for outside readers (`README.md`, `CONTRIBUTING.md`) kept apart.
2. **Every fact has one owning file.** A decision lives in one place, a term in one place, the state of a part in
   one place. Another file that needs the fact points there by name. When two docs disagree, the owning file wins
   and the other is fixed. When a doc and the code disagree, the code wins, and the agent says so.
3. **Small indexes are always read; bodies are opened on demand.** Each large collection (decisions, terms, ideas,
   the roadmap) has an index small enough to read every session, and the bodies are read only when the work needs
   them. Reading cost is the budget the whole structure is built around.
4. **Each kind of fact has a home, set by one table.** "Where things go" in `AGENTS.md` says, for every event (a
   decision made, a question raised, a step finished, a file moved), which file is updated. An agent never has to
   guess where to write.
5. **History is in git, not in the docs.** Docs say what is true now. What was done, when, and what was run to check
   it, goes in the commit message. A doc that tells its own story ("we used to…", "as of Tuesday") is rewritten to
   the present.

## The tree

```
AGENTS.md                        how an agent works here: rules, doc map, where things go, commands, traps
README.md, CONTRIBUTING.md       for people outside the project
docs/
├── vision.md                    where the project is heading, and the questions to ask of a new idea
└── dev/
    ├── roadmap/
    │   ├── README.md            Next, the state table, the list of phases, what is not on the roadmap
    │   └── phase-N-<name>.md    one file per phase: what it produces, what to settle first, steps, done when
    ├── design-decisions.md      the principles, and an index of every decision by title
    ├── decisions/
    │   ├── <area>.md            the decisions of one area, in full
    │   └── <area>/              an area that outgrew one file and could not be cut cleanly by topic
    ├── open-questions.md        what is not decided, grouped by the phase that needs the answer
    ├── glossary/
    │   ├── README.md            every term, and the area file it is in
    │   ├── <area>.md            the terms of one area
    │   └── two-senses.md        words used in two senses, or not settled
    ├── codebase-ideas/
    │   ├── README.md            the index: each idea and when it returns
    │   └── <idea>.md            one idea per file
    ├── code-map.md              where the code lives, and the path a run takes through it
    ├── procedures/
    │   └── <job>.md             how to do a job only some sessions need
    └── archive/
        ├── README.md            the index, and what is worth keeping
        └── <topic>.md           closed investigations, dropped ideas worth not suggesting again
```

Start smaller than this: every folder above began as a single file (see "How a doc grows" and "Starting a new
repo"). The rest of this guide is written for the grown form. In a young repo, read each folder as the one file it
still is: "its area's file in `decisions/`" is that area's section of `design-decisions.md`, "the roadmap's
`README.md`" is `roadmap.md`, and "the index" is the file itself.

## Each file: what it holds, and what stays out

Every file in `docs/dev/` opens with two or three lines: what it is for, and what stays out of it. An agent reads that
before adding to the file. It is the cheapest guard against a doc slowly becoming a second copy of another.

**`AGENTS.md`.** Read in full every session, so it is the most expensive file in the repo and is kept to rules, not
content. It holds:

- *Hard rules:* the few things whose breaking costs the owner something, each pointing at its section.
- *The doc map:* a table of every doc and what it is for.
- *Starting a session:* what to read, in order, scaled to the task.
- *Where things go:* the table from event to file.
- *Commits:* who commits what, and what a message carries.
- *How to work with the owner:* the working style (see below).
- *Commands, and what each kind of change runs:* tests, type checks, lint, probes.
- *Verify before asserting:* the mistakes that cost a wrong conclusion once, as one-line warnings.
- *Traps:* short warnings about the code. The detail lives in the owning file; the trap stays here only as a pointer.

No state, no progress, no decisions, no history. Those have homes of their own.

**`vision.md`.** The project's north star: where it is heading, settled with the owner once the direction is clear,
and changed rarely after. It ends with a short list of questions to ask of any new idea, which settles most small
calls without asking the owner to explain the vision again. It holds no state: nothing about how things are today,
what to build next or how far the project has come, and no details of how things work, which are decisions. A
vision that holds state or details goes stale with every change, and stops being something to steer by. Read it
before a design opinion, not every session.

**The roadmap.** `README.md` holds three things read every session:

- **Next:** one line saying what comes next. It can name work the owner has put ahead of the phases; it, not the
  branch name, says what is next.
- **The state table:** each part of the project, its state (written, a stub, legacy) and whether it has run. "Has it
  run" is one of *written* (never run), *run* (executed by a script, a person or the system) or whatever stronger
  level the project has, such as *learned* or *in production*. "Written is not run" is the warning this column exists
  for: an agent checks it before saying something works.
- **The phases,** in order, one line each, linking to the phase files.

And a short "Not on this roadmap" list, for what is known and deliberately left out.

A phase file holds **Produces:** (one line), **Settle first:** (the open questions it needs answered, by title), the
steps in order, and **Done when:**. Nothing done stays: a finished step is removed, a finished phase's file and line
go, and what was done goes in the commit message. A session reads the phase file only when it works on that phase.

**Decisions.** `design-decisions.md` holds the entry template, the principles most decisions follow, and an index of
every decision by title, grouped by area with a link to the area's file. The decisions themselves are in
`decisions/`, one file per area, each in the template:

```
## Title (date last settled)

**Built by:** only while some of it is not built: the phase that builds it, and which part when the rest is built,
or "nothing on the roadmap yet" and what it waits on. The line goes when it is built.

**Decision:** what is true.
**Why:** the reason.
**Rejected:** alternatives worth not suggesting again, each with its reason.
**Revisit if:** the condition that would reopen it.
**Cases:** only while some are not yet tests: concrete examples, given this, expect that. Each case leaves when its
test is written.
```

Decisions are written in the present tense. When one changes, the entry is rewritten to say what is true now; a
reversal that still matters becomes a rejected alternative. **Built by** exists because a present-tense decision
written before its code reads as a description of the code. It was the gap most likely to give a wrong answer, and an
entry without the line is taken as built.

**Rejected** is the part that pays off most. An agent will suggest the elegant alternative that was turned down for
a reason it cannot see. One line under Rejected stops it.

**Cases** keeps the concrete examples agreed in talk until their phase is built, so the tests do not start from
scratch. They sit under the decision they check, not under a module, since the modules do not exist yet, and they
change with it. A case that checks two decisions goes under the one it mainly checks and names the other by title.

**Open questions.** What is not decided yet, grouped under the phase that needs the answer, so the phase's "Settle
first" can point at them. Each entry is what is known and the options, with the date raised, and "See:" pointing at
the decisions it touches. When a question is answered it leaves, and the answer goes to its area's decision file. A
question half answered stays with what is left of it. Not treating an open question as decided is one of the rules an
agent most needs.

**Glossary.** One file per area, and a `README.md` that names every term and the file it is in. Use its terms, and
add a term when it is coined. `two-senses.md` lists the words used in two senses or not yet settled: the traps of
every area, read before writing in any of them. Reasons stay out (they are decisions), and so does state.

**Codebase ideas.** Ideas worth returning to that are not problems now: new features, mechanics, tools. One file each,
opening with **Returns when:**, the phase, feature or piece of code that would make it matter. The index repeats
"Returns when", so work that reaches that point finds what waits on it. An idea file is opened at a docs sweep, when
the owner asks about its subject, or when the owner says to open it; otherwise the agent names the idea from the index
and asks. An idea that is built moves to decisions; one that is dropped is deleted, or archived if it would cost to
rethink.

Keep this folder for *new* things. An idea that touches what is already built, or must be decided before a release,
belongs in `open-questions.md` under its phase, condensed. Idea files are read only at a sweep, so an idea parked there
is hidden from exactly the design sessions that would decide it.

**Code map.** Where the code lives and the path a run, a request or a step takes through it, written for agents. It
names files and what to look for in them, not what the code says, so it goes stale only when a file moves. It does
not keep a file tree; it gives the command that prints one. It is updated in the same change that moves a file.

**Procedures.** How to do a job only some sessions need: writing tests, the test sweep, checking that a refactor kept
behaviour, the docs sweep, running an old version. `AGENTS.md` says when to read each, and an agent reads it before
starting that job.

**Archive.** Closed investigations and dropped ideas, kept only when both are true: it is likely to come up again,
and reaching the conclusion cost something (runs, debugging, a long design talk). Otherwise delete it and let `git
log` keep it. Each entry says what it was, why it ended, and what would have to change for the verdict to change.
Its index lists every entry, so the index alone says whether something was tried.

## The rules that tie it together

**Where things go.** The heart of `AGENTS.md`. A table from event to file, along these lines:

| When | Update |
|---|---|
| A decision is made | its area's file in `decisions/`, in the present tense, and its title in the index |
| A question is answered | remove it from `open-questions.md`; the answer goes to its area's decision file |
| A question comes up | `open-questions.md`, under the phase that needs it |
| A concrete case is agreed | the **Cases** line of the decision it mainly checks |
| A case becomes a test | remove it from its decision's **Cases** |
| A roadmap step is done | remove it from its phase file, update the state table, and remove or shorten the **Built by** of each decision it built |
| Code is first run | the "has it run" cell in the state table |
| A word is coined | its area's glossary file, and its name in the index |
| A file is added, moved or renamed | `code-map.md`, in the same change |
| An idea that is not a problem now | a new file in `codebase-ideas/`, and its line in the index |
| How an occasional job is done | its file in `procedures/` |
| An investigation closes, and would cost to redo | `archive/`; otherwise delete it |
| What was done, and what was run | the commit message |

**Starting a session.** Scaled to the task, so a small task does not pay for a design session:

1. Always: `AGENTS.md` (loaded automatically, given the `CLAUDE.md` in "Starting a new repo") and the roadmap's
   `README.md`. A phase file only when working on it.
2. Before a design opinion: the vision, the decisions index, the area's decision files in full, `open-questions.md`,
   and the archive index, so a dropped idea is not offered again. Looking up what one decision says reads only that
   decision's file, found through the index.
3. Before reading code, the code map. Before writing code, the code style guide and the testing procedure.

**Cite by title, through the index.** A decision is cited by its title, "in `design-decisions.md`", not by its file's
path, and the same goes for comments in code. Why it holds up when files split is in "How a doc grows". It costs one
lookup per citation, and is worth it.

**How a doc grows.** Every collection starts as one file and grows by the same steps, so an agent can tell what to
do with a doc that has got too big without a rule for each one:

1. **One file.** The decisions, the terms, the ideas, the roadmap: each starts as a single file with a short
   opening that says what it holds.
2. **A folder with a `README.md` index.** When a file is read every session and has grown past what a session should
   pay for, it becomes a folder. Its `README.md` keeps what every session needs (an index of names, the next step, the
   rules for adding to it) and the bodies move into files beside it, one per area, item or phase. The index is read
   always; a body is opened when the work needs it. The README also says who reads what: which parts are read every
   session, which only before a design opinion, and which only at a sweep.
3. **A part splits again.** A body that passes its size limit (below) is cut. The docs sweep proposes the cut and
   makes it once the owner agrees. A part that is a topic of its own becomes a file beside it. Where no cut by topic
   is clean, the part becomes a folder with its name, cut by sub-topic inside; the index keeps one line for it, and
   "read it in full" means reading the folder.

Through all three, other docs point at the collection, never at a part: a decision by its title through the index, a
term by its name, an area by its folder. A split then changes the index and nothing else, and no pointer goes stale.
The same holds for `AGENTS.md`: what only some sessions need moves out to a procedure, and `AGENTS.md` keeps one line
saying when to read it, so the file every session reads stays small.

**Size limits.** Set a limit per kind of file and check it with `wc -w` at the docs sweep: around 4,000 words for a
general doc, flagged only; around 2,500 for a decisions file; around 1,000 for a glossary area file. Past its limit, a
file splits as in step 3 of "How a doc grows". The one exception is a glossary area: it is cut by letter range at the
term counts, so the parts stay even, and only the index changes.

**The docs sweep.** A pass at the end of a session that ties the docs back together. When the owner signals the
session is ending, the agent offers it once. The signal is rarely "we're done": it is a "see you tomorrow", an "I
need to think about this", or a question about where things stand. It checks, in order:

1. The roadmap and open questions against what was done, and each **Built by** line: one naming a phase whose file is
   gone is stale.
2. Decisions from the session missing from their files or the index.
3. New terms for the glossary, and that its index names every term.
4. Anything in the wrong file, by the "where things go" table. A status fact outside the state table is one.
5. Sizes, against the limits above.
6. The idea files, the one time they are read unasked: built ideas move to decisions, dropped ones go, and the index
   matches the folder.
7. Line width, or whatever mechanical check the repo has.

It says what changed and flags borderline calls instead of guessing: whether something is a decision or still open,
an idea or a problem, is the owner's to say.

## Commits

- **Docs are the agent's to commit; code waits for the owner.** The owner reviews code in the list of unstaged
  changes, so the agent keeps docs out of that list. Docs not about the code under review are committed when done,
  naming the files (`git commit -- <files>`), so nothing staged goes with them. Docs about code under review are
  staged and wait, and go in one commit with the code when the owner says commit.
- **Code is never committed before the owner says so.** A go to write it is not a go to commit it. Code is anything
  that does something: source, config, build files. A comment or docstring the owner asked for counts as docs.
- **One commit per batch.** Work is committed in the same batches it is written in (see "Write to the docs in
  batches"). A later change in the same batch is amended into its commit; amending anything else, such as an earlier
  batch's commit, waits for the owner's go-ahead. A batch's commit is then what the owner has seen, with or without a
  remote, and the history shows each batch. A pushed commit is never amended, since that rewrites shared history.
  Check `git status -sb` before every amend, since the owner may have pushed in the meantime.
- **The message is the record.** What changed, why, and what was run to check it, or that nothing was run. The
  progress notes a doc would otherwise carry belong here, in the commit that made them true.
- **Cite an unmerged commit by its title.** If the project merges with rebase, every hash on a branch changes when
  it lands.

## How the agent works with the owner

These shaped the docs as much as the files did:

- **Design together, the agent writes, the owner reviews.** A design is talked through and the owner decides. Then
  the agent writes the code and the docs that go with it.
- **Spitball before verdicts.** Open with what the code does and one question; reason step by step together. When a
  choice is open, give a lean, labelled as a lean, with its reason. A restated option is not a decision: something is
  decided when the owner says so.
- **Argue for the owner's hunch.** When the owner says something feels off, make the case for the hunch before
  defending the proposal. Fluent reasoning is not experience.
- **Agree on where a new file or folder goes before creating it.** Show the tree it gives. The owner reads the
  structure to picture the design. Renames and moves too.
- **Make the work reviewable.** List each file touched and what changed in it, what was run and what was only read,
  and anything written against code that does not exist yet.
- **Write to the docs in batches.** Not after every answer: an update per message buries the conversation in file
  lists and churns the same lines. The agent judges the batch: a topic talked through, a decision made, a session
  ending, or the owner asking. What is said but not yet written must not be lost, so a long session writes before
  context runs short.
- **Mention what is surprising; do not fix it unasked.**
- **Docstrings say what a thing is and does,** and read correctly when the work is finished: no "for now", no "until
  phase N". Work still to do goes in a searchable `# TODO` or `# NOTE`, with a tag when several belong together.
- **Pull first.** On the owner's machine, the first edit of a session waits for the owner to confirm they have
  pulled.

## What it costs, and where it strained

Tested by giving fresh sessions of several models five questions about the code and asking each to work as
`AGENTS.md` says and report where the docs strained. All answered correctly. What they found:

- **The session start is the main cost.** Before the start was scaled to the task, a fresh session read about fifteen
  files before touching a question. Splitting the big files into index plus bodies cut most of it; scaling the
  reading to the task (above) cut more. Watch this number.
- **Decisions ahead of the code read as the code.** Present tense is right for a decision, wrong as a description of
  code not yet written. **Built by** fixed it; add it from day one.
- **Ideas parked in the ideas folder were hidden from design work.** Anything that touches what is built goes to open
  questions instead.
- **A roadmap line that relies on the branch name misleads.** Say in the roadmap that **Next** decides, not the
  branch.
- **Rules written for one case clash in another.** "The test sweep ends every change" was right for a single file and
  absurd for a rename. Write what each kind of change runs as a table, one row per kind.
- **The machinery grows.** Word limits, split rules, sweeps and reading rules each make sense, but each is something
  a fresh session must read and obey before working. Add a rule only when its absence has cost something.

And the honest part: the docs state aims. In practice the owner skims reviews when tired, the docs are as much the
agent's workplace as the owner's reference, and some rules (tests written first from the owner's rules) are a shared
burden still being learned. Write the rules anyway; they say what good looks like.

## Starting a new repo

Day one, start with git, since the commit messages carry the project's history from the first change:

1. `git init`, with `main` as the default branch (`git init -b main`).
2. A `.gitignore` for the language, and for generated output (a folder such as `output/` for runs, logs and
   diagrams), so nothing generated is ever committed by accident.
3. The files below, then a first commit, which the owner makes or approves, since it holds the hard rules.
4. Once there is a remote: each phase is worked on a small branch off `main` and merged back through a pull request.
   Merging with rebase keeps `main` a straight line, which is why unmerged commits are cited by title.

Then create only:

- `AGENTS.md`, with the hard rules, the doc map, "where things go", the session start and the commit rules.
- A `CLAUDE.md` holding the one line `@AGENTS.md`, if the agent is Claude Code: it reads `CLAUDE.md` at the start of
  a session, not `AGENTS.md`. Other tools have their own file name; check which one yours loads.
- `docs/vision.md`, a first draft from the owner's opening idea: where the project is heading and the questions to
  ask of a new idea. It is left alone during the questioning (below) and settled once the direction is clear.
- `docs/dev/roadmap.md`: **Next**, the state table and the first phases, as one file.
- `docs/dev/design-decisions.md`: the template, and decisions as they are made, in one file.
- `docs/dev/open-questions.md`.

Add the others when there is something to put in them: the glossary with the first coined word, the code map when the
code has more than a few files, procedures when a job is done a second time, the archive when something closed cost to
learn. Split a file only as "How a doc grows" says, not before.

### From the idea to the first phase: onboarding the agent

The agent starts a project knowing nothing about it, and the owner knows most of it without having said it. The first
sessions close that gap, in this order:

1. **The owner opens with the overarching idea.** Told once, in their own words: what it is, who it is for, what it
   must do. Not a spec; the owner should not have to think of everything up front.
2. **The agent writes the first docs from it.** The vision, the first decisions (only what the owner actually said),
   a rough roadmap, and every open question the idea raises. This is a first start, not a design. It shows the owner
   what the agent understood, and gives the questions a place to live.
3. **Then a discussion, in which the agent is onboarded.** This is the roadmap's first phase, Phase 0, and no code is
   written until it is done. The agent asks; the owner answers and tells more. Questions the owner never thought to
   raise are the point of it.

How the discussion runs:

- **One topic at a time,** in order of what everything else depends on (who uses it, where, on what), then the data
  (what one record holds, how it is corrected, what leaves the system), then the stack, storage, look and feel, and
  last how code is written and tested: tests first or not, who supplies the cases, what is checked by hand.
- **How the owner likes to talk is theirs.** A conversation or a list, how they answer, how much at once: learn it
  early and write it in `AGENTS.md`'s working style. It belongs to the owner, not to this guide.
- **The docs are written in batches,** once a topic is talked through: answers become decisions, new terms go to the
  glossary, and what the answers raise becomes new open questions.
- **The vision waits until the direction is clear.** It is not built on with each batch: the details live in the
  decisions, and a vision that repeats them must change with every one. Near the end of the questioning, the agent
  rewrites it once from what was learned, the owner agrees it, and from then on it changes rarely.
- **Settle early what is hard to change later.** A question filed under a later phase that shapes the stored data or
  the stack is asked now. Only questions local to one feature wait for their phase's **Settle first**.
- **Done when** every question that shapes the stack or the stored data is answered, a sketch of the main screen (or
  its equivalent) and the settled vision are agreed, and the owner has nothing more to tell for now.

### Before this guide is removed

This guide is read once, when the repo is set up, and then removed. Every rule a later session needs must by then
live in the repo itself, or it is lost. Carry each over:

| Rule | Where it lives in the new repo |
|---|---|
| What each file holds and what stays out | that file's opening lines |
| The decision template; why **Built by** and **Rejected** matter | the opening of `design-decisions.md` |
| The shape of a phase; **Next**; "written is not run" | the opening of the roadmap |
| The shape of an open question; answered questions leave | the opening of `open-questions.md` |
| Hard rules, doc map, where things go, session start, commits, working style | `AGENTS.md` |
| How a doc grows, size limits, cite by title | `AGENTS.md`, short; a procedure once it outgrows a few lines |
| The docs sweep | `AGENTS.md`, short; `procedures/docs-sweep.md` once it outgrows a few lines |
| What the glossary, code map, ideas, procedures and archive hold, and when each is made | the doc map's "added when" line in `AGENTS.md`, then each file's opening lines once it exists |
| The questioning phase | the roadmap's Phase 0 |

Then check: could a fresh session that never saw this guide follow every rule above from the repo alone? If so,
remove the guide in its own commit.
