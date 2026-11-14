# AGENTS.md

How an agent works in this repo: rules, the doc map, where things go, commands and traps. Read in full every session.
No state, progress, decisions or history here; each has its own home (see "Where things go").

## Hard rules

1. **Code is never committed before the owner says so.** A go to write it is not a go to commit it. See "Commits".
2. **An open question is not a decision.** Something is decided when the owner says so. See
   `docs/dev/open-questions.md`.
3. **Written is not run.** Check the state table in `docs/dev/roadmap.md` before saying something works.
4. **Every fact has one owning file.** When two docs disagree, the owning file wins and the other is fixed. When a doc
   and the code disagree, the code wins, and say so.
5. **Agree on where a new file or folder goes before creating it.** Show the tree it gives. Renames and moves too.

## Doc map

| Doc | For |
|---|---|
| `AGENTS.md` | How an agent works here (this file) |
| `docs/vision.md` | Where the project is heading, and the questions to ask of a new idea; written at the end of Phase 0 |
| `docs/dev/roadmap.md` | **Next**, the state table, the phases, what is not on the roadmap |
| `docs/dev/design-decisions.md` | The decision template, the principles, and every decision by area |
| `docs/dev/open-questions.md` | What is not decided, grouped by the phase that needs the answer |
| `docs/dev/glossary.md` | The project's terms; read before writing about the app |
| `docs/dev/design-draft.md` | The owner's first draft of the app, emptied into the files above as it is talked through |

`README.md` and `CONTRIBUTING.md`, when they exist, are for people outside the project.

Added when there is something to put in them, each opening with what it holds and what stays out:

- `docs/dev/code-map.md`, when the code has more than a few files: where the code lives and the path a run takes
  through it. It names files and what to look for in them, not what the code says, and gives the command that prints
  the tree instead of keeping one.
- `docs/dev/codebase-ideas.md`, with the first idea that is not a problem now: one entry per idea, each opening with
  **Returns when:** (the phase, feature or code that would make it matter). Read at a docs sweep, when the owner asks
  about its subject, or when the owner says to; otherwise name the idea and ask.
- `docs/dev/procedures/`, when a job is done a second time: one file per job only some sessions need, and a line
  here saying when to read it.
- `docs/dev/archive/`, when an investigation closes or an idea is dropped, and both are true: it is likely to come up
  again, and reaching the conclusion cost something. Each entry says what it was, why it ended, and what would change
  the verdict. Otherwise delete it and let `git log` keep it.

## How docs grow

1. **One file.** Every collection (decisions, terms, ideas, the roadmap) starts as a single file.
2. **A folder with a `README.md` index,** when a file is read every session and has grown past what a session should
   pay for. The README keeps what every session needs and says who reads what; the bodies move into files beside it.
3. **A part splits again** when it passes its limit: by topic into a file beside it, or into a folder of its own when
   no cut is clean. The docs sweep proposes the cut; it is made once the owner agrees.

Limits, checked with `wc -w` at the sweep: ~4,000 words for a general doc (flagged only), ~2,500 for a decisions
file, ~1,000 for a glossary file (cut by letter range). Other docs and code comments point at the collection, never
at a part: a decision by its title, a term by its name. A split then changes only the index.

## Starting a session

Scaled to the task:

1. Always: this file and `docs/dev/roadmap.md`. **Next** in the roadmap says what comes next, not the branch name.
2. Before a design opinion: `docs/vision.md` (until it is written, `docs/dev/design-draft.md`),
   `docs/dev/design-decisions.md` and `docs/dev/open-questions.md`.
3. Before reading code: the code map, once it exists.
4. On the owner's machine, the first edit of a session waits for the owner to confirm they have pulled.

## Where things go

| When | Update |
|---|---|
| A decision is made | `docs/dev/design-decisions.md`, under its area, in the present tense, with **Built by** until built |
| A question is answered | remove it from `open-questions.md`; the answer goes to `design-decisions.md` |
| A question comes up | `open-questions.md`, under the phase that needs it |
| A concrete case is agreed | the **Cases** line of the decision it mainly checks |
| A case becomes a test | remove it from its decision's **Cases** |
| A roadmap step is done | remove it from the roadmap, update the state table, remove or shorten each **Built by** it built |
| Code is first run | the "has it run" cell in the state table |
| A word is coined | `docs/dev/glossary.md` |
| A file is added, moved or renamed | the code map, in the same change (once it exists) |
| An idea that is not a problem now | `docs/dev/codebase-ideas.md`; if it touches what is built, `open-questions.md` instead |
| How an occasional job is done | its file in `docs/dev/procedures/` |
| An investigation closes, and would cost to redo | `docs/dev/archive/`; otherwise delete it |
| What was done, and what was run | the commit message |

Docs say what is true now. A doc that tells its own story ("we used to…", "as of Tuesday") is rewritten to the
present. Cite a decision by its title, "in `design-decisions.md`", not by line or path.

## Commits

- **Docs are the agent's to commit; code waits for the owner.** Docs not about code under review are committed when
  done, naming the files (`git commit -- <files>`). Docs about code under review are staged and go in one commit with
  the code when the owner says commit.
- **Code** is anything that does something: source, config, build files. A comment or docstring the owner asked for
  counts as docs.
- **One commit per batch.** Later changes in the same batch are amended into its commit. Amending anything else,
  such as an earlier batch's commit, waits for the owner's go-ahead. A pushed commit is never amended. Check
  `git status -sb` before every amend.
- **The message is the record:** what changed, why, and what was run to check it, or that nothing was run.
- **Cite an unmerged commit by its title,** since rebase merges change hashes.
- Once there is a remote: each phase on a small branch off `main`, merged back by pull request with rebase.

## How to work with the owner

- **Design together, the agent writes, the owner reviews.** The owner decides; the agent writes the code and docs.
- **Spitball before verdicts, and before lists.** Take one topic at a time as a conversation: say what you are
  thinking and ask one open question. When a choice is open, give a lean, labelled as a lean, with its reason. A
  restated option is not a decision.
- **Argue for the owner's hunch** before defending the proposal.
- **Make the work reviewable.** List each file touched and what changed, what was run and what was only read, and
  anything written against code that does not exist yet.
- **Number what the owner must answer.** Once a topic is talked through, the concrete questions, borderline calls
  and choices left are a numbered list, never bullets, so the owner can reply "1. yes, 2. no". Numbering restarts
  with each message.
- **Write to the docs in batches,** not after every answer. Judge the batch: a topic talked through, a decision
  made, a session ending, or the owner asking. Write before context runs short, so nothing said is lost.
- **Mention what is surprising; do not fix it unasked.**
- **Docstrings say what a thing is and does,** and read correctly when the work is finished: no "for now", no
  "until phase N". Work still to do goes in a searchable `# TODO` or `# NOTE`.
- **The docs sweep:** when the owner signals the session is ending ("see you tomorrow", "I need to think about this",
  a question about where things stand), offer it once. Check, in order: the roadmap and open questions against what
  was done, and each **Built by** (one naming a finished phase is stale); decisions from the session missing from
  their file; new terms; anything in the wrong file by "Where things go"; sizes, by "How docs grow"; the ideas (built
  ones move to decisions, dropped ones go). Say what changed, and flag borderline calls (decision or still open, idea
  or problem) instead of guessing.
- **Add a rule only when its absence has cost something.**

## Commands, and what each kind of change runs

| Change | Run |
|---|---|
| Docs only | nothing |

Rows are added when the project has tests, type checks, lint or probes.

## Verify before asserting

Each mistake that once cost a wrong conclusion gets a one-line warning here.

- **A changed decision touches every file that restates it.** After one, search the docs for its old words before
  calling the batch done.

## Traps

- None yet. A short pointer per trap; the detail lives in the owning file.
