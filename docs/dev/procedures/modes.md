# The modes

How design, learning, vibe and pop-in mode run. Read the mode's part as it starts. What the modes are, and the owner's
say over them, is in `AGENTS.md`; how commits are made in them is under "Commits" there; debug mode's hunt is in
`debugging.md`.

## Design mode

Questions, decisions, the vision, building and tuning the prototype; no code. A rethink of the design runs in it, and so
does the design pass for a screen the prototype does not show. Spitball before verdicts, and before lists: one topic at
a time as a conversation; say what you are thinking and ask one open question. A phase's design pass opens with what is
left of its **Settle first** as a numbered list of headings, the quickest decision first, so the owner can pick by their
energy. Each new part's design pass also asks, before it is decided, whether the part could stand alone in a setup and
how hard that would be ("The app for the whole school", in `codebase-ideas.md`).

## Learning mode

Side by side, for a new framework or a part the owner wants to understand. The owner writes the parts they want to learn
by doing, or steers or reviews what the agent writes; the agent does the rest, the tedious parts first (installs,
config, moving code, removing files), explains the why, gives one step at a time and waits for the owner before the
next, and reviews what the owner wrote. Nothing is committed unasked.

## Vibe mode

The agent builds a whole phase, or the rest of one, once the owner starts it for that phase. First owner and agent
settle everything the phase needs: its **Settle first**, its open questions, its cases, any new folder, and a check that
the prototype shows every screen and state the phase builds. Then the agent builds the phase without stopping, tests
first as always, in small batches, each committed as soon as `npm run tidy` and `npm test` pass; the owner reviews
through git. A question that comes up and blocks nothing is collected and asked at the end, as one numbered list; one
that would change what is built stops the work and is asked at once.

**The prototype is the source of truth for the look:** every value, colour, size, time and behaviour of a screen is
taken from it as tuned, through the decision that holds its numbers. Where the two disagree on a value, the prototype
wins and the agent fixes the decision, since the owner owns the prototype and the agent the docs; where they disagree on
behaviour or meaning, the agent asks. A screen or state the prototype does not show stops the work: it goes back to
design mode to be drawn, and the agent does not invent a look.

Each batch with a screen ends with a short list of what to check by eye in the running app. Afterwards the owner goes by
look and feel, and tunes a part's steps in its component or a scale in `design-tokens.css`, or asks the agent for
anything bigger. Vibe mode ends when the phase or step it was started for is built; the review that follows is learning
mode, tuning included ("While tuning, just change the code", in `AGENTS.md`), until the owner names another mode.

## Pop-in mode

Vibe mode with features held back for the owner to write, started by the owner by name for a phase. The agent mentions
it once, as the first vibe phase the owner works in is about to start: that it exists, how it works in short, and that
they can start it before any vibe phase; it notes the mention under **Told once** in `levels.md` and never brings it up
again.

At the end of the phase's design pass, when the owner asks, the agent lists the features the phase builds, and the owner
picks as many as they want. The agent then builds, as in vibe mode, everything that does not depend on a picked feature,
and stops where something does. For each picked feature it writes the skeleton: the files, the function and method
signatures, each with a short `TODO` comment of its steps (pseudocode where it is complex), what it reads and who calls
it; and it lists the files and their method names for the owner. The agent writes the feature's tests first, as its
spec, unless the owner says when starting the mode that they write them; then the tests get the same skeletons and go on
the list. The agent never asks about the tests.

When the owner says a feature is done, the agent reviews it as in learning mode, commits it as its own commit once
`tidy` and `test` pass, and builds what waited on it. Everything else, the end included, is as in vibe mode.
