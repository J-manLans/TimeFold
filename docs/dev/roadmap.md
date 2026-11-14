# Roadmap

What comes next, the state of each part, and the phases. Read every session. Nothing done stays here: a finished step
is removed, and what was done goes in the commit message. **Next** says what comes next, not the branch name.

## Next

Phase 0: the agent questions the owner, one topic at a time, as a conversation. No code before it is done.

## State

"Has it run" is *written* (never run) or *run* (executed by a script, a person or the system). Written is not run.

| Part | State | Has it run |
|---|---|---|
| _none yet_ | | |

## Phases

0. **Questioning.** The agent asks, the owner answers and tells more. No code.
1. **Clock in and out.** The click, stored entries, today's total and the balance.
2. **Errands and flex days.** Time away taken off the day's total, and whole days taken out of the balance.
3. **Profiles.** Switching profile in one action, and hours counted per profile.
4. **Correcting the record.** Manual entries and editing.
5. **Reports.** A period's hours, ready to send to the boss.

### Phase 0: Questioning

**Produces:** the owner's answers, written where they belong: decisions in `design-decisions.md`, new questions in
`open-questions.md`, new terms in the glossary; and at the end, the settled vision.
**Settle first:** nothing; this phase is the settling.

1. The agent and owner spitball one topic at a time, starting with what everything else depends on: the owner's work
   day and the device, then the data (what one entry holds, errands, corrections, what the report needs), then stack,
   storage, look and feel.
2. Once a topic is talked through, its answers go into the docs as one batch, and the agent asks what they raised.
3. A sketch of the main screen, agreed with the owner.
4. Once the direction is clear, the agent writes `vision.md` from the drafts in `design-draft.md` and what was
   learned, and the owner agrees it. Until then the drafts stay as written, and batches do not add to them.

**Done when:** every question that shapes the stack or the stored data is answered, the main screen and the vision
are agreed, and the owner has nothing more to tell for now. Questions local to one feature may stay under their
phase.

### Phase 1: Clock in and out

**Produces:** an app that starts and stops an entry with one click and shows today's total and the balance.
**Settle first:** under "Phase 1": A forgotten stop; Entries across midnight.

1. Set up the project: `.gitignore` entries, the commands table in `AGENTS.md`.
2. Store entries in the chosen storage, each with a profile (one default profile until Phase 3).
3. The start/stop control, showing whether work is running.
4. Today's total, and the balance.
5. Tests for the totals.

**Done when:** a day of real clicking gives the right total, and the data is still there after a restart.

### Phase 2: Errands and flex days

**Produces:** errands recorded during the day and taken off the day's total; flex days marked for a day or a range,
taken off the balance.
**Settle first:** under "Phase 2": Is lunch an errand.

**Done when:** a day with errands gives the right total, and a week of flex days gives the right balance.

### Phase 3: Profiles

**Produces:** profiles the owner sets up, a one-action switch between them (ending one entry and starting the
next), hours shown per profile, and the ceiling shared by the profiles without a balance, with how much of it is
used.
**Settle first:** under "Phase 3": Working time limits. It does not block the build: the answers are settings.

**Done when:** a day split between two profiles gives the right janitor balance, the right hours per profile and
the right use of the ceiling.

### Phase 4: Correcting the record

**Produces:** entries and errands written by hand, and clicked ones edited or deleted.
**Settle first:** nothing; what it needs is settled in Phase 0.

**Done when:** any day can be made to match what really happened.

### Phase 5: Reports

**Produces:** a report of a chosen period, with hours per profile, that the owner can send to the boss as it is.
**Settle first:** nothing; what it needs is settled in Phase 0.

**Done when:** the owner has sent a real report.

## Not on this roadmap

- More than one user, accounts, or sync between machines beyond the handover file.
- Tracking tasks finer than profiles: no projects, task lists or clients.
- Calculating pay, overtime rules or invoicing: the app counts hours per profile; pay is worked out outside it.
