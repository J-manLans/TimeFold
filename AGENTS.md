# AGENTS.md

How an agent works in this repo: rules, the doc map, where things go, commands and traps. Read in full every session. No
state, progress, decisions or history here; each has its own home (see "Where things go").

## Hard rules

1. **Code is never committed before the owner says so.** A go to write it is not a go to commit it, except in vibe and
   pop-in mode, which are that say-so. See "Commits".
2. **An open question is not a decision.** Something is decided when the owner says so. See
   `docs/dev/open-questions.md`.
3. **Written is not run.** A step still in `docs/dev/roadmap.md` is not done; its tags say how far it got. Check it
   before saying something works.
4. **Every fact has one owning file.** When two docs disagree, the owning file wins and the other is fixed. When a doc
   and the code disagree, the code wins, and say so.
5. **Agree on where a new file or folder goes before creating it,** for code and for `docs/vision/`. Show the tree it
   gives. Renames and moves too. In vibe and pop-in mode, a file in a place the code map already has needs no stop; a
   new folder or a file outside the layout is agreed while the phase is settled, or stops the work. In `docs/dev/`, the
   agent's workspace, the agent places, moves and renames files itself, by "Where things go" and "How docs grow", and
   reports the tree it gives.

## Doc map

| Doc                                   | For                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `AGENTS.md`                           | How an agent works here (this file)                                                                          |
| `docs/vision/vision.md`               | Where the project is heading, and the questions to ask of a new idea                                         |
| `docs/dev/roadmap.md`                 | **Next**, the phases with each step's tag, what is not on the roadmap                                        |
| `docs/dev/design-decisions/README.md` | The decision template, the principles, every decision's title by area                                        |
| `docs/dev/open-questions.md`          | What is not decided, grouped by the phase (or part) that needs the answer                                    |
| `docs/dev/glossary/README.md`         | The project's terms by part; read the part you need before writing about the app                             |
| `docs/dev/code-map.md`                | Where the code lives and the path a run takes through it                                                     |
| `docs/dev/codebase-ideas.md`          | Ideas that are not a problem now, each opening with **Returns when:**                                        |
| `docs/dev/friction.md`                | Snags in how we work, noted as they happen, cleared at the docs sweep                                        |
| `docs/dev/noticed-away.md`            | What the owner noticed away from the computer, to deal with when back at it                                  |
| `docs/dev/procedures/`                | The steps of an occasional job, a mode or a routine, a file each; "Starting a session" says when             |
| `docs/dev/levels.md`                  | The owner's level per area, which sets how much the agent explains, and what they were told once; gitignored |
| `docs/dev/sketches/`                  | A look tried before it is decided, a page each; deleted once the code it previews is built                   |

`codebase-ideas.md` is read at a docs sweep, when the owner asks about an idea's subject, or when the owner says to;
otherwise name the idea and ask. The prototype is the north star for the look beside the vision: a screen's values come
from it until the screen is built, then live in `design-tokens.css`, where the owner tunes them; it stays the reference
for the look's intent and for screens not built yet, and goes once the finished app has been validated. A sketch, a
quick try of one look, holds nothing the docs need: the decision it serves holds every number it settles, and it is
deleted once the code it previews is built; `git log` keeps it.

`README.md` and `CONTRIBUTING.md`, when they exist, are for people outside the project.

Added when there is something to put in them, each opening with what it holds and what stays out, and moved into the doc
map once it exists:

- `docs/dev/archive/`, when an investigation closes or an idea is dropped, and both are true: it is likely to come up
  again, and reaching the conclusion cost something. Each entry says what it was, why it ended, and what would change
  the verdict. Otherwise delete it and let `git log` keep it.

## How docs grow

1. **One file.** Every collection (decisions, terms, ideas, the roadmap) starts as a single file.
2. **A folder with a `README.md` index,** when a file is read every session and has grown past what a session should pay
   for. The README keeps what every session needs and says who reads what; the bodies move into files beside it.
3. **A part splits again** when it passes its limit: into a folder with its name, holding the pieces cut by topic. The
   folder has no index of its own; the collection's README groups the pieces under the folder's name and still lists
   every title. The agent makes the cut as soon as it notices a file past its limit, at a docs sweep or in passing,
   without asking, and reports the new files and their sizes. A file near its limit is not mentioned. It is a structural
   fix, the agent's to make.

Limits, checked with `wc -w` at the docs sweep and whenever a file looks long: ~3,000 words for `AGENTS.md`, past which
the agent looks for steps that have a clear moment to read them, one "Starting a session" can name, and moves those to
`procedures/` by "Where things go", without asking; if none fit, it flags the size at the docs sweep and the file
stands, since a pointer with no moment to read it only splits what is read together; ~4,000 for a general doc (flagged
only), ~2,500 for a decisions file, ~1,000 for a glossary file (cut by letter range). Other docs and code comments point
at the collection, never at a part: a decision by its title, a term by its name. A split then changes only the index.

## Starting a session

Scaled to the task:

1. Always: this file, `docs/dev/roadmap.md` and `docs/dev/levels.md`. **Next** in the roadmap says what comes next, not
   the branch name.
2. Before a design opinion: `docs/vision/vision.md` (and for a look, `docs/vision/prototype.html`),
   `docs/dev/design-decisions/README.md` and the area files the opinion touches, and `docs/dev/open-questions.md`.
3. Before building or tuning the prototype, in any design pass: `docs/dev/procedures/prototype.md`.
4. As a mode starts: its part of `docs/dev/procedures/modes.md`.
5. In debug mode: `docs/dev/procedures/debugging.md`.
6. Before a release: `docs/dev/procedures/release.md`.
7. At a docs sweep: `docs/dev/procedures/docs-sweep.md`.
8. With no `docs/dev/levels.md`, a technology added or swapped, or a level shift to offer:
   `docs/dev/procedures/explaining.md`.
9. Before reading code: the code map.

## Where things go

| When                                             | Update                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| A decision is made                               | its area's file in `design-decisions/`, present tense, **Built by** until built; index title     |
| A question is answered                           | remove it from `open-questions.md`; the answer goes to its area's `design-decisions/` file       |
| A question comes up                              | `open-questions.md`, under the phase (or part) that needs it                                     |
| A concrete case is agreed, and its test waits    | the **Cases** line of the decision it mainly checks; written now, it goes straight into the test |
| A case becomes a test                            | remove it from its decision's **Cases**                                                          |
| Code for a roadmap step is written, tested, seen | a tag added to the step in the roadmap                                                           |
| A roadmap step is seen everywhere it must work   | remove it from the roadmap; trim each **Built by** it built                                      |
| A phase is done                                  | its line under **Done** in the roadmap: its name, what it produced, its release                  |
| A word is coined                                 | its part in `docs/dev/glossary/`, and its name in the index                                      |
| A file is added, moved or renamed                | the code map, in the same change                                                                 |
| A look to try before deciding it                 | a page in `docs/dev/sketches/`; what it settles goes to its decision                             |
| An idea that is not a problem now                | `codebase-ideas.md`; if it touches what is built, `open-questions.md` instead                    |
| The steps of an occasional job, mode or routine  | its file in `procedures/`; here only what it is, when it applies and the file to read            |
| A rule or doc makes the agent guess or redo work | `friction.md`, as it happens                                                                     |
| An investigation closes, and would cost to redo  | `docs/dev/archive/`; otherwise delete it                                                         |
| What was done, and what was run                  | the commit message                                                                               |

Docs say what is true now. A doc that tells its own story ("we used to…", "as of Tuesday") is rewritten to the present.
Cite a decision by its title, "in `design-decisions/`", not by line or file.

## Commits

- **Docs are the agent's to commit; code waits for the owner,** except in vibe and pop-in mode (below). Docs not about
  code under review are committed when done, naming the files (`git commit -- <files>`), into the session's docs commit.
  Docs about code under review are staged and go in one commit with the code when the owner says commit. Work that is
  docs and code together waits whole: none of its docs is committed on its own, since the owner amends the code into the
  last commit when the two belong together.
- **Code** is anything that does something: source, config, build files. A comment or docstring the owner asked for
  counts as docs.
- **In vibe and pop-in mode, code is committed per small batch** once `tidy` and `test` pass, docs about it in the same
  commit; the message carries what was built, why, and what was run.
- **One commit per batch.** Later changes in the same batch are amended into its commit. Amending anything else, such as
  an earlier batch's commit, waits for the owner's go-ahead. A pushed commit is never amended, except a session's docs
  commit (below). Check `git status -sb` before every amend.
- **Docs with no code are one commit per session.** A design session, a docs sweep or a rule change opens one docs
  commit; every later doc write in that session is amended into it and pushed with `git push --force-with-lease`, the
  message growing to cover the session, unless a code commit has landed since; then later docs open a new one, and the
  owner pulls with `git pull --rebase`. Docs about code still go with that code.
- **The message is the record:** what changed, why, and what was run to check it, or that nothing was run.
- **Cite an unmerged commit by its title,** since rebase merges change hashes.
- Each phase on a small branch off `main`, merged back by pull request with rebase.

## How to work with the owner

- **Five modes, switched by name.** The owner decides; the mode lasts until the owner names another ("learning mode for
  Phase 3", "back to design mode"), and when it is unclear which applies, ask. The docs are the agent's to write in
  every mode.
  - **Design mode:** questions, decisions, the vision and the prototype; no code.
  - **Learning mode:** side by side, one step at a time, for a part the owner wants to understand; nothing committed
    unasked.
  - **Vibe mode:** the agent builds a settled phase in small committed batches while the owner reviews through git.
  - **Pop-in mode:** vibe mode with features held back for the owner to write.
  - **Debug mode:** for a bug the owner has seen: reproduced and its cause found from evidence before any code changes,
    the fix waiting for the owner's go and committed only once reviewed.

  How each runs: `docs/dev/procedures/modes.md`, the mode's part, read as it starts; debug mode's hunt is in
  `docs/dev/procedures/debugging.md`.

- **Explaining follows the owner's level, per area.** Three levels: **Noob** (the agent leads with the big picture of
  each piece, what it is for and how it fits, without talking down; a metaphor only where it is truly on point, never
  one per concept; detail when asked; points out its own guesses), **Tinkerer** (explains when asked and points out the
  bigger choices) and **Wizard** (brief; leans labelled, as always). The mode decides that the agent explains, the level
  how deep: learning mode in a Noob area goes slower and deeper than in a Tinkerer one. In vibe mode the level shapes
  each batch's summary of what was built and why, and never stops the work. When a piece spans areas, the level of the
  area being explained applies, not the lowest. The list that makes the work reviewable is the same at every level. The
  levels live in `docs/dev/levels.md`, gitignored; how they are set, tuned and offered is in
  `docs/dev/procedures/explaining.md`.
- **A lean is labelled as a lean.** In any mode, when a choice is open, give a lean with its reason. A restated option
  is not a decision.
- **An idea that comes back opens with a verdict:** bad, okay or good, as it stands, before anything else, so the owner
  knows whether to rethink it or only read what is added. The owner's own ideas too.
- **Argue for the owner's hunch** before defending the proposal.
- **Make the work reviewable.** List each file touched and what changed, what was run and what was only read, and
  anything written against code that does not exist yet.
- **Number what the owner must answer.** Once a topic is talked through, the concrete questions, borderline calls and
  choices left are a numbered list, never bullets, so the owner can reply "1. yes, 2. no". Numbering restarts with each
  message. In a doc, a list whose numbers must last, such as the owner's faults, writes each number in bold on a bullet:
  the formatter renumbers a numbered list when an item leaves.
- **Write on the owner's go.** While a topic is talked through, nothing is written: no code, no prototype, no docs. The
  agreed changes are held, and on the owner's go they are written in one batch, each file listed. The one exception:
  before context runs short, write what is agreed so nothing said is lost, and say so.
- **While tuning, just change the code.** When the owner fine-tunes how something looks or feels, on a sketch, the
  prototype or in the app, the code holds the values meanwhile and the conversation the reasons, so no decision edits or
  commits between tweaks. Write the batch when the owner settles it ("that feels good", "keep it"), before switching
  topic, at a break, or when the conversation is getting long.
- **A chime when code is done.** After any task that changes code or the prototype, and whenever vibe or pop-in work
  stops for a question, play `paplay /usr/share/sounds/freedesktop/stereo/complete.oga`, so the owner hears it away from
  the screen. Docs alone play none.
- **Mention what is surprising; do not fix it unasked.**
- **A fix says the rule it restores.** Before writing a fix, state in one sentence, in the app's terms, what should be
  true ("the edit fades only while the pointer rests on the list"), and check that the code would read as that sentence.
  Then search for every other place the sentence must hold, such as each copy of the same look or each element of the
  same kind, and fix the rule there too, or write it once where they all share it. If the fix needs an "except when…",
  or it is the second fix for the same problem, stop: undo the last attempt, ask what the behaviour is for, and look for
  a sentence with no exceptions. The owner's words describe what he saw, not the fix.
- **Docstrings say what a thing is and does,** and read correctly when the work is finished: no "for now", no "until
  phase N". Work still to do goes in a searchable `# TODO` or `# NOTE`.
- **The docs sweep:** when the owner signals the session is ending ("see you tomorrow", "I need to think about this", a
  question about where things stand), offer it once. Its checks and report: `docs/dev/procedures/docs-sweep.md`.
- **Add a rule only when its absence has cost something.**

## Commands, and what each kind of change runs

| Change                                         | Run                                         |
| ---------------------------------------------- | ------------------------------------------- |
| Docs only                                      | `npx prettier --write` on the changed files |
| The interface (`src/`, `tests/`, their config) | `npm run tidy`, then `npm test`             |
| The Rust half (`src-tauri/`)                   | `npm run tidy`                              |
| Before a commit with code                      | `npm run tidy` and `npm test`, both passing |

`tidy` is safe to run at any time: it formats, applies only fixes that cannot change behaviour, and fails on anything
left. Save open files first.

## Verify before asserting

Each mistake that once cost a wrong conclusion gets a one-line warning here.

- **A changed decision touches every file that restates it.** After one, search the docs for its old words before
  calling the batch done.
- **A look's values come from its decision and the prototype,** never from a draft in the chat: check the decision's
  numbers and **Cases** before writing a colour, size or time into code.
- **A claim goes into a commit message only after it was run.** Run the check first, then write what it showed.
- **The branch may have moved since the last look.** Other sessions push to it too: fetch and compare with GitHub before
  the first edit after a pause, judged by the clock, and before every commit and push.
- **A global class meets every element that carries its name,** first class or not: search `class=".*\bname\b` before it
  lands.
- **A selector prefix adds weight where a media query adds none:** a media query turned into a prefix such as
  `:root[data-stacked]` wraps it in `:where()`, or it outranks the states it used to yield to.
- **A docs edit and its commit run as one chain that stops at the first failure,** so a commit never names docs it does
  not hold.

## Traps

A short pointer per trap; the detail lives in the owning file.

- **The dev window loses its layout** and the terminal says `failed to load virtual css module`: "Known traps" in
  `docs/dev/procedures/debugging.md`.
- **The built app's theme follows only the desktop** while dev works: "Known traps" in
  `docs/dev/procedures/debugging.md`.
- **A fade leaves its last frame on screen on Linux** until a resize: "Known traps" in
  `docs/dev/procedures/debugging.md`.
- **The window's least size lands smaller on Linux** than `tauri.conf.json` sets: "Known traps" in
  `docs/dev/procedures/debugging.md`.
- **A prototype glitch seen only in VS Code's built-in browser:** check it in Firefox first; "Known traps" in
  `docs/dev/procedures/debugging.md`.
