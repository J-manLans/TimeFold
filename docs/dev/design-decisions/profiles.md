# Profiles

What a profile is, the ceiling the profiles without a balance share, the pay estimate, and how settings change. Each
decision follows the template in `README.md`, and is cited by its title.

## Profiles label the hours (2026-11-14)

**Built by:** Profiles; entries carry a profile from Clocking.

**Decision:** every entry belongs to one profile (such as janitor work or the development group). Switching is done as
in "One start/stop button and a profile list". A day can mix profiles, and the owner adds profiles as new kinds of work
come up. Profiles are isolated: each counts its own days and hours, and work in one never changes another. A profile
holds: a short name (what is tapped when switching); optional expected hours, and only a profile with them has a
balance; a base and an over colour ("Each profile carries its colours", in `design-decisions/`); active or archived (an
archived profile leaves the switch list but keeps its hours in the history and reports); a pay category, a label only,
so reports can group hours by how they are paid; and an optional monthly salary or rate per hour for the pay estimate
("A pay estimate per profile"). Reports show hours per profile. Where the work is done is not recorded: the owner works
from wherever suits, and a place matters to the app only if it is paid differently, when it is a profile of its own.
**Why:** the owner's work is paid differently depending on the task and where it is done. Keeping profiles apart
means a Saturday of development group work cannot touch the janitor balance, with no special rule for it.
**Rejected:** the app calculating pay as payroll does: salary rules belong to payroll, and would make the app wrong
whenever they change; the pay estimate is a rough figure for the owner only. A yes/no "counts toward the balance"
setting per profile, with one shared balance: it let work in one profile change another's balance. A "reported to" field
on each profile: the owner does not need it. A place mark on entries, such as "from home", beside the profile: where the
work is done has no bearing on the counts.
**Revisit if:** the owner needs the app's figures to match payroll.

## The other profiles share a ceiling (2026-11-14)

**Built by:** Profiles.

**Decision:** janitor work is the only profile with expected hours, and so the only balance. All other profiles together
share one ceiling: the rest of full time. Full time is a setting (8 h a day), and the ceiling is not set but follows
from it: on each weekday, full time minus janitor's expected hours (8 − 6 = 2 h), added up over the weekdays of its
period, so janitor work and the ceiling together make exactly full time. Hours in the other profiles count the same
whenever they are worked: night or day, weekday or weekend. Full time and janitor's expected hours are set together with
one slider that splits full time between them (6 | 2); how it looks is settled with the look and feel. The ceiling's
period is the month ("A month starts on a set day"). Hours over a month's ceiling carry into the next month, which
starts with them already used; hours left unused do not carry, and the next month starts from zero. The ceiling is never
owed: working under it costs nothing, and the janitor balance has no cap either. The front page shows how much of it is
used on the ceiling wheel, beside the balance bar ("The ceiling wheel"). It never blocks a click.
**Why:** the owner's other work comes on top of the janitor job, within what full time and the law allow, and the
balance between the two may shift. Deriving the ceiling means one change moves both, and they cannot disagree. Showing
what is left of an allowance reads more easily than a total of all hours against full time. These hours are additions,
not a balance: what matters is seeing when the owner works too much, which is a reason to talk with the boss about the
split between janitor and other work; carrying the excess keeps that visible.
**Rejected:** expected hours for the other profiles (such as 2 a day): every day without that work would put the
owner in minus. The ceiling's amount as a setting of its own: it could be left behind when janitor hours change.
Counting the ceiling per calendar day: a month would allow more than full time, which is a weekday measure.
**Revisit if:** another profile gets hours of its own to work, or the limits apply to all hours together in a way
the ceiling does not show.
**Cases:**
- Janitor 6, full time 8, a month with 21 weekdays: the ceiling is 42 h.
- The slider moved to 5 | 3 from the 15th, 10 weekdays before it and 11 from it: 10 × 2 + 11 × 3 = 53 h.
- Two hours of development group work on a Sunday: 2 h of the ceiling used.
- March ceiling 42 h, 30 h worked: April starts at 0 used.
- March ceiling 42 h, 46 h worked: April starts at 4 h used.

## A pay estimate per profile (2026-11-14)

**Built by:** Profiles.

**Decision:** each profile may have a monthly salary or a rate per hour, settings that change from a date ("Settings
change from a date"). A salary counts once per month whatever the hours; janitor work has one (such as 1 700 €), since
its hours move the balance, not the pay. A rate counts the profile's hours that month. A profile with neither is left
out. The estimate is the month's salaries plus its hours times rates ("A month starts on a set day"), shown as one
number with no label under the ceiling wheel ("The main screen has a control side and a figures side"), and updated
when an entry stops or an added break changes a stopped entry, like the figures. It is for the owner only, and stays
out of the report to the boss.
**Why:** the owner wants a rough idea of what the month is worth as it builds up, and pay can rise over time. The
janitor job is salaried with flexible hours, so its pay is the base the other work sits on. It need not match
payroll, so no salary rules are needed.
**Rejected:** matching payroll: salary rules change, and the app would be wrong whenever they do. A rate on janitor
hours: working more or less there changes the balance, not the pay.
**Revisit if:** the estimate is used for anything that has to be exact.
**Cases:**
- Janitor salary 1 700 €, nothing else this month: the estimate is 1 700 €.
- Then 10 h of development at 26 €/h: 1 960 €.
- An 8 h janitor day: the estimate does not change.
- Rate 20 €/h, an entry of 3 h stopped: the estimate grows by 60 €; 30 min then cut from it: it falls by 10 €.
- Rate raised from 20 to 22 from 1 March: February's hours stay at 20.

## Settings change from a date (2026-11-14)

**Built by:** Profiles.

**Decision:** settings that counting depends on, such as janitor's expected hours and full time, are changed in a
small settings menu. Each change takes effect from a date, today unless the owner picks another, which may be in the
past. Every day is counted with the settings in force on it, so past days keep the settings they were worked under.
**Why:** the owner's work may shift toward the other profiles. A change that rewrote the past would alter balances
already settled with the boss; a contract change often starts on a date before the app is updated.
**Rejected:** one current value per setting: changing it would recount every past day.
**Revisit if:** a setting ever needs to change the past on purpose.
**Cases:**
- Janitor set from 6 to 5 from 1 September: an August weekday with 6 h worked adds 0; a September one adds +1.
- The same change entered on 10 September, dated 1 September: 1–9 September are recounted against 5.
