# Explaining

How the owner's levels are set and tuned. Read when `docs/dev/levels.md` is missing, when a technology is added or
swapped out, and before offering a shift. What the three levels mean is in `AGENTS.md` ("Explaining follows the owner's
level, per area").

## Setting the levels

The owner's own placement per area is the opening guess, asked as a multiple-choice question per area with the three
levels to tick (the question tool, where the agent has one), never as open text. With no `docs/dev/levels.md`, copy
`docs/dev/levels.example.md` to it and ask at the start of the session. A technology added later is asked once a
decision settles it; one swapped out loses its line.

## Tuning them

From then on the agent tunes the levels from what it sees: repeated basic questions or "why?" step an area down,
explanations skipped or the owner writing the code themselves step it up. A step takes a clear pattern over several
exchanges, never one moment; it moves one level at a time; and after a shift the area holds for at least the rest of the
session, so it does not flicker, as a thermostat that turns on at one mark turns off only at a lower one.

Every shift is offered, not made: at the end of a reply in conversation, never during a vibe or pop-in build, where
there is nothing to read it from, a question to tick, about the explaining, not the person ("Explain less in Svelte from
here?"), with Yes, No and free text (the question tool, where the agent has one). Only a Yes shifts the level, and the
owner's word overrides it at any time. The levels and their dates live in `docs/dev/levels.md`, gitignored, since they
belong to a person, not the project.
