# AGENTS.md

How an agent works in this repo: rules, the doc map, where things go, commands and traps. Read in full every session. No
state, progress, decisions or history here; each has its own home (see "Where things go").

## Hard rules

1. **Code is never committed before the owner says so.** A go to write it is not a go to commit it, except in vibe
   coding mode, which is that say-so. See "Commits".
2. **An open question is not a decision.** Something is decided when the owner says so. See
   `docs/dev/open-questions.md`.
3. **Written is not run.** A step still in `docs/dev/roadmap.md` is not done; its tags say how far it got. Check it
   before saying something works.
4. **Every fact has one owning file.** When two docs disagree, the owning file wins and the other is fixed. When a doc
   and the code disagree, the code wins, and say so.
5. **Agree on where a new file or folder goes before creating it,** for code and for `docs/vision/`. Show the tree it
   gives. Renames and moves too. In vibe mode, a file in a place the code map already has needs no stop; a new folder or
   a file outside the layout is agreed while the phase is settled, or stops the work. In `docs/dev/`, the agent's
   workspace, the agent places, moves and renames files itself, by "Where things go" and "How docs grow", and reports
   the tree it gives.

## Doc map

| Doc                                   | For                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `AGENTS.md`                           | How an agent works here (this file)                                              |
| `docs/vision/vision.md`               | Where the project is heading, and the questions to ask of a new idea             |
| `docs/dev/roadmap.md`                 | **Next**, the phases with each step's tag, what is not on the roadmap            |
| `docs/dev/design-decisions/README.md` | The decision template, the principles, every decision's title by area            |
| `docs/dev/open-questions.md`          | What is not decided, grouped by the phase (or part) that needs the answer        |
| `docs/dev/glossary/README.md`         | The project's terms by part; read the part you need before writing about the app |
| `docs/dev/code-map.md`                | Where the code lives and the path a run takes through it                         |
| `docs/dev/codebase-ideas.md`          | Ideas that are not a problem now, each opening with **Returns when:**            |
| `docs/dev/procedures/`                | How an occasional job is done, one file per job; "Starting a session" says when  |
| `docs/dev/levels.md`                  | The owner's level per area, which sets how much the agent explains; gitignored   |

`codebase-ideas.md` is read at a docs sweep, when the owner asks about an idea's subject, or when the owner says to;
otherwise name the idea and ask. The prototype is the north star for the look beside the vision: a screen's values come
from it until the screen is built, then live in `design-tokens.css`, where the owner tunes them; it stays the reference
for the look's intent and for screens not built yet, and goes once the finished app has been validated. A sketch, a
quick try of one look, holds nothing the docs need: the decision it serves holds every number it settles, and it is
deleted once the code it previews is built; `git log` keeps it.

`README.md` and `CONTRIBUTING.md`, when they exist, are for people outside the project.

Added when there is something to put in them, each opening with what it holds and what stays out, and moved into the doc
map once it exists:

- `docs/dev/sketches/`, when a look is worth trying before it is decided: a page or a drawing each, deleted once the
  code it previews is built.
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

Limits, checked with `wc -w` at the docs sweep and whenever a file looks long: ~4,000 words for a general doc (flagged
only), ~2,500 for a decisions file, ~1,000 for a glossary file (cut by letter range). Other docs and code comments point
at the collection, never at a part: a decision by its title, a term by its name. A split then changes only the index.

## Starting a session

Scaled to the task:

1. Always: this file, `docs/dev/roadmap.md` and `docs/dev/levels.md`. **Next** in the roadmap says what comes next, not
   the branch name.
2. Before a design opinion: `docs/vision/vision.md` (and for a look, `docs/vision/prototype.html`),
   `docs/dev/design-decisions/README.md` and the area files the opinion touches, and `docs/dev/open-questions.md`.
3. Before building or tuning the prototype, in any design pass: `docs/dev/procedures/prototype.md`.
4. In debug mode: `docs/dev/procedures/debugging.md`.
5. Before a release: `docs/dev/procedures/release.md`.
6. Before reading code: the code map.
7. On the owner's machine, the first edit of a session waits for the owner to confirm they have pulled.

## Where things go

| When                                             | Update                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| A decision is made                               | its area's file in `design-decisions/`, present tense, **Built by** until built; index title |
| A question is answered                           | remove it from `open-questions.md`; the answer goes to its area's `design-decisions/` file   |
| A question comes up                              | `open-questions.md`, under the phase (or part) that needs it                                 |
| A concrete case is agreed                        | the **Cases** line of the decision it mainly checks                                          |
| A case becomes a test                            | remove it from its decision's **Cases**                                                      |
| Code for a roadmap step is written, tested, seen | a tag added to the step in the roadmap                                                       |
| A roadmap step is seen everywhere it must work   | remove it from the roadmap; trim each **Built by** it built                                  |
| A word is coined                                 | its part in `docs/dev/glossary/`, and its name in the index                                  |
| A file is added, moved or renamed                | the code map, in the same change                                                             |
| A look to try before deciding it                 | a page in `docs/dev/sketches/`; what it settles goes to its decision                         |
| An idea that is not a problem now                | `codebase-ideas.md`; if it touches what is built, `open-questions.md` instead                |
| How an occasional job is done                    | its file in `docs/dev/procedures/`                                                           |
| An investigation closes, and would cost to redo  | `docs/dev/archive/`; otherwise delete it                                                     |
| What was done, and what was run                  | the commit message                                                                           |

Docs say what is true now. A doc that tells its own story ("we used to…", "as of Tuesday") is rewritten to the present.
Cite a decision by its title, "in `design-decisions/`", not by line or file.

## Commits

- **Docs are the agent's to commit; code waits for the owner,** except in vibe mode (below). Docs not about code under
  review are committed when done, naming the files (`git commit -- <files>`), into the session's docs commit. Docs about
  code under review are staged and go in one commit with the code when the owner says commit.
- **Code** is anything that does something: source, config, build files. A comment or docstring the owner asked for
  counts as docs.
- **In vibe mode, code is committed per small batch** once `tidy` and `test` pass, docs about it in the same commit; the
  message carries what was built, why, and what was run.
- **One commit per batch.** Later changes in the same batch are amended into its commit. Amending anything else, such as
  an earlier batch's commit, waits for the owner's go-ahead. A pushed commit is never amended, except a session's docs
  commit (below). Check `git status -sb` before every amend.
- **Docs with no code are one commit per session.** A design session, a docs sweep or a rule change opens one docs
  commit; every later doc write in that session is amended into it and pushed with `git push --force-with-lease`, the
  message growing to cover the session, and the owner pulls with `git pull --rebase`. Docs about code still go with that
  code.
- **The message is the record:** what changed, why, and what was run to check it, or that nothing was run.
- **Cite an unmerged commit by its title,** since rebase merges change hashes.
- Each phase on a small branch off `main`, merged back by pull request with rebase.

## How to work with the owner

- **Four modes, switched by name.** Design decides what to build; learning builds it side by side so the owner
  understands it; vibe has the agent build what is settled while the owner reviews; debug finds why something is wrong
  before anything changes. The owner decides; the mode lasts until the owner names another ("learning mode for Phase 3",
  "back to design mode"), and when it is unclear which applies, ask. The docs are the agent's to write in every mode.
  - **Design mode:** questions, decisions, the vision, building and tuning the prototype; no code. A rethink of the
    design runs in it, and so does the design pass for a screen the prototype does not show. Spitball before verdicts,
    and before lists: one topic at a time as a conversation; say what you are thinking and ask one open question.
  - **Learning mode:** side by side, for a new framework or a part the owner wants to understand. The owner writes the
    parts they want to learn by doing, or steers or reviews what the agent writes; the agent does the rest, the tedious
    parts first (installs, config, moving code, removing files), explains the why, gives one step at a time and waits
    for the owner before the next, and reviews what the owner wrote. Nothing is committed unasked.
  - **Vibe mode:** the agent builds a whole phase, or the rest of one, once the owner starts it for that phase. First
    owner and agent settle everything the phase needs: its **Settle first**, its open questions, its cases, any new
    folder, and a check that the prototype shows every screen and state the phase builds. Then the agent builds the
    phase without stopping, tests first as always, in small batches, each committed as soon as `npm run tidy` and
    `npm test` pass; the owner reviews through git. A question that comes up and blocks nothing is collected and asked
    at the end, as one numbered list; one that would change what is built stops the work and is asked at once. **The
    prototype is the source of truth for the look:** every value, colour, size, time and behaviour of a screen is taken
    from it as tuned, through the decision that holds its numbers. Where the two disagree on a value, the prototype wins
    and the agent fixes the decision, since the owner owns the prototype and the agent the docs; where they disagree on
    behaviour or meaning, the agent asks. A screen or state the prototype does not show stops the work: it goes back to
    design mode to be drawn, and the agent does not invent a look. Each batch with a screen ends with a short list of
    what to check by eye in the running app. Afterwards the owner goes by look and feel, and tunes values in
    `design-tokens.css` or asks the agent for anything bigger. Vibe mode ends when the phase or step it was started for
    is built; the review that follows is learning mode, tuning included ("While tuning, just change the code"), until
    the owner names another mode.
  - **Debug mode:** for a bug the owner has seen. The agent hunts it: reproduces it before any code changes (a fault in
    a rule as a test seen to fail, a fault seen on screen by eye), finds the cause from evidence rather than guesses,
    then reports the cause, its evidence and the planned fix, and waits for the owner's go before changing code, every
    time. The fix changes only what the evidence points at, until the test passes or the screen looks right; the hunt's
    order and tools are in `docs/dev/procedures/debugging.md`. The fix is code: it is committed only after the owner has
    reviewed it and says so.
- **Explaining follows the owner's level, per area.** Three levels: **Noob** (the agent leads with the big picture of
  each piece, what it is for and how it fits, without talking down; a metaphor only where it is truly on point, never
  one per concept; detail when asked; points out its own guesses), **Tinkerer** (explains when asked and points out the
  bigger choices) and **Wizard** (brief; leans labelled, as always). The mode decides that the agent explains, the level
  how deep: learning mode in a Noob area goes slower and deeper than in a Tinkerer one. In vibe mode the level shapes
  each batch's summary of what was built and why, and never stops the work. When a piece spans areas, the level of the
  area being explained applies, not the lowest. The list that makes the work reviewable is the same at every level. The
  owner's own placement per area is the opening guess, asked as a multiple-choice question per area with the three
  levels to tick (the question tool, where the agent has one), never as open text. A technology added later is asked
  once a decision settles it; one swapped out loses its line. With no `docs/dev/levels.md`, copy
  `docs/dev/levels.example.md` to it and ask at the start of the session. From then on the agent tunes it from what it
  sees: repeated basic questions or "why?" step an area down, explanations skipped or the owner writing the code
  themselves step it up. A step takes a clear pattern over several exchanges, never one moment; it moves one level at a
  time; and after a shift the area holds for at least the rest of the session, so it does not flicker, as a thermostat
  that turns on at one mark turns off only at a lower one. Every shift is offered, not made: at the end of a reply in
  conversation, never during a vibe build, where there is nothing to read it from, a question to tick, about the
  explaining, not the person ("Explain less in Svelte from here?"), with Yes, No and free text (the question tool, where
  the agent has one). Only a Yes shifts the level, and the owner's word overrides it at any time. The levels and their
  dates live in `docs/dev/levels.md`, gitignored, since they belong to a person, not the project.
- **A lean is labelled as a lean.** In any mode, when a choice is open, give a lean with its reason. A restated option
  is not a decision.
- **An idea that comes back opens with a verdict:** bad, okay or good, as it stands, before anything else, so the owner
  knows whether to rethink it or only read what is added. The owner's own ideas too.
- **Argue for the owner's hunch** before defending the proposal.
- **Make the work reviewable.** List each file touched and what changed, what was run and what was only read, and
  anything written against code that does not exist yet.
- **Number what the owner must answer.** Once a topic is talked through, the concrete questions, borderline calls and
  choices left are a numbered list, never bullets, so the owner can reply "1. yes, 2. no". Numbering restarts with each
  message.
- **Write to the docs in batches,** not after every answer. Judge the batch: a topic talked through, a decision made, a
  session ending, or the owner asking. Write before context runs short, so nothing said is lost.
- **While tuning, just change the code.** When the owner fine-tunes how something looks or feels, on a sketch, the
  prototype or in the app, the code holds the values meanwhile and the conversation the reasons, so no decision edits or
  commits between tweaks. Write the batch when the owner settles it ("that feels good", "keep it"), before switching
  topic, at a break, or when the conversation is getting long.
- **Mention what is surprising; do not fix it unasked.**
- **Docstrings say what a thing is and does,** and read correctly when the work is finished: no "for now", no "until
  phase N". Work still to do goes in a searchable `# TODO` or `# NOTE`.
- **The docs sweep:** when the owner signals the session is ending ("see you tomorrow", "I need to think about this", a
  question about where things stand), offer it once. Check, in order: the roadmap and open questions against what was
  done, and each **Built by** (one naming a finished phase or part is stale); decisions from the session missing from
  their file; new terms; anything in the wrong file by "Where things go"; sizes, by "How docs grow"; the ideas (built
  ones move to decisions, dropped ones go). Report only what needs the owner, flagging borderline calls (decision or
  still open, idea or problem) instead of guessing; what changed is in the commit message, and what was checked and
  found fine is left out. The same goes for any report on docs.
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

## Traps

A short pointer per trap; the detail lives in the owning file.

- **The dev window loses its layout** and the terminal says `failed to load virtual css module`: "Known traps" in
  `docs/dev/procedures/debugging.md`.
- **The built app's theme follows only the desktop** while dev works: "Known traps" in
  `docs/dev/procedures/debugging.md`.
