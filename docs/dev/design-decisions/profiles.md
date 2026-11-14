# Profiles

What a profile is, and the ceiling the profiles without a balance share. Each decision follows the template in
`README.md`, and is cited by its title.

## Profiles label the hours (2026-11-14)

**Built by:** Profiles; entries carry a profile from Clocking.

**Decision:** every entry belongs to one profile (such as janitor work, the development group, work from home).
Switching is done as in "One start/stop button and a profile list". A day can mix profiles, and the
owner adds profiles as new kinds of work come up. Profiles are isolated: each counts its own days and hours, and work
in one never changes another. A profile holds: a short name (what is tapped when switching); optional expected
hours, and only a profile with them has a balance; a colour or icon; active or archived (an archived profile leaves
the switch list but keeps its hours in the history and reports); and a pay category, a label only, so reports can
group hours by how they are paid. Reports show hours per profile.
**Why:** the owner's work is paid differently depending on the task and where it is done. Keeping profiles apart
means a Saturday of development group work cannot touch the janitor balance, with no special rule for it.
**Rejected:** the app calculating pay from a rate per profile: salary rules belong to payroll, and would make the app
wrong whenever they change. A yes/no "counts toward the balance" setting per profile, with one shared balance: it
let work in one profile change another's balance. A "reported to" field on each profile: the owner does not need it.
**Revisit if:** the owner needs the app to show money.

## The other profiles share a ceiling (2026-11-14)

**Built by:** Profiles; the figures wait on "Working time limits", in `open-questions.md`.

**Decision:** janitor work is the only profile with expected hours, and so the only balance. All other profiles
together share one ceiling: the hours up to full time, such as full time minus the janitor's 6. The ceiling is never
owed: working under it costs nothing. It has an amount and a period, both settings, and the front page shows how
much of it is used beside the balance, warning when it nears the ceiling. It never blocks a click.
**Why:** the owner's other work comes on top of the janitor job, within what full time and the law allow. Showing
what is left of an allowance reads more easily than a total of all hours against full time.
**Rejected:** expected hours for the other profiles (such as 2 a day): every day without that work would put the
owner in minus. A fixed daily ceiling chosen by the app: the period comes with the limit, from the contract or law.
**Revisit if:** another profile gets hours of its own to work, or the limits apply to all hours together in a way
the ceiling does not show.
