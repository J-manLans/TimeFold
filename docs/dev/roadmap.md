# Roadmap

What comes next, the state of what is built, Phase 0, and the parts still to be ordered into phases. Read every
session. Nothing done stays here: a finished step is removed, and what was done goes in the commit message. **Next**
says what comes next, not the branch name.

## Next

Phase 0: the agent questions the owner, one topic at a time, as a conversation. No code before it is done.

## State

"Has it run" is *written* (never run) or *run* (executed by a script, a person or the system). Written is not run.

| Part | State | Has it run |
|---|---|---|
| _none yet_ | | |

## Phase 0: Questioning

**Produces:** the owner's answers, written where they belong: decisions in `design-decisions/`, new questions in
`open-questions.md`, new terms in the glossary; and at the end, the settled vision.
**Settle first:** nothing; this phase is the settling.

1. The agent and owner spitball one topic at a time, starting with what everything else depends on: the owner's work
   day and the device, then the data (what one entry holds, errands, corrections, what the report needs), then stack,
   storage, look and feel.
2. Once a topic is talked through, its answers go into the docs as one batch, and the agent asks what they raised.
3. A sketch of the main screen, agreed with the owner.
4. Once the direction is clear, the agent writes `vision.md` from the drafts in `design-draft.md` and what was
   learned, and the owner agrees it. Until then the drafts stay as written, and batches do not add to them.
5. Before Phase 0 ends, owner and agent agree the roadmap: the parts below ordered into phases, each with
   **Produces**, **Settle first**, its steps and **Done when**.

**Done when:** every question that shapes the stack or the stored data is answered, the main screen, the vision and
the roadmap are agreed, and the owner has nothing more to tell for now. Questions local to one feature may stay under
their phase.

## Parts, not yet in order

What the app is made of, from the decisions so far. They have no order, steps or **Done when** until the roadmap is
agreed at the end of Phase 0. A part is added when a decision has none to build it.

- **Clocking.** The project set up, the record file with its safe save and daily copies, the start/stop button,
  stored entries, the balance and the balance bar, the first start with the opening balance, and the question for
  a running entry from an earlier day.
- **Breaks and flex days.** Added breaks taken off the day's total and fixed from the main screen; flex days for a
  day or a range, taken off the balance.
- **Profiles.** Profiles the owner sets up, the profile list beside the start button, hours per profile, the
  ceiling shared by the profiles without a balance and its opening hours, the ceiling wheel, settings from a date,
  and the pay estimate.
- **Corrections.** Entries edited on their line (moved, lengthened, shortened, split by a gap), deleted or written
  by hand.
- **Reports.** A period's report, with hours per profile, that the owner sends to the boss as it is.
- **Handover.** Export and import of the whole record between the two machines, and import as a first start.

## Not on this roadmap

- More than one user, accounts, or sync between machines beyond the handover file.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay as payroll does, overtime rules or invoicing: the app counts hours per profile and shows a rough pay
  estimate; real pay is worked out outside it.
