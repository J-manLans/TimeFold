# Profiles: counting

The ceiling the profiles without a balance share, the pay estimate, and how settings change from a date. What a profile
is has its own file beside this one. Each decision follows the template in `../README.md`, and is cited by its title.

## The other profiles share a ceiling (2026-11-14)

**Built by:** Profiles, for the full-time slider.

**Decision:** janitor work is the only profile with expected hours, and so the only balance. All other profiles together
share one ceiling: the rest of full time. Full time is a setting, entered as a week (38 h 15 min), and the ceiling is
not set but follows from it. Full time and janitor's expected hours are set together, as a week, with one slider that
splits full time between them (30 h | 8 h 15 min); how it looks is settled with the look and feel. Both are set in
quarter hours: a week that is not, such as 38 h 16 min, is refused, the field staying open with "Ange veckan i steg om
15 minuter" until it is fixed or Esc drops it. Janitor's hours are never more than full time, on any day: a full time or
a split saved from a date that would make them so on that day or any later one, a change already saved for a later date
included, is refused, its date left open with the reason ("Vaktmästare har 30h. Minska fördelningen först.", or for the
split "Heltid är bara 28h från 1 juli 2026."), since saving one value never changes another ("The menu has tabs, with
every value locked behind "Ändra""); lowering full time below janitor's hours takes the split first, then full time,
from the same date. A full time equal to janitor's hours leaves a ceiling of 0. The counting stays per weekday, each
weekday owing a fifth of the week: a 38 h 15 min week is 7 h 39 min a weekday, janitor's 30 h is 6 h, and the ceiling
grows by the rest, 1 h 39 min, on each weekday of its period, so janitor work and the ceiling together make exactly full
time. Hours in the other profiles count the same whenever they are worked: night or day, weekday or weekend. The
ceiling's period is the month ("The app's month is the calendar month"), and the month the app is first started in has
its whole ceiling, whatever day that is. Hours over a month's ceiling carry into the next month, which starts with them
already used; hours left unused do not carry, and the next month starts from zero. Hours of the other work already
worked in a month before its profile is in the app are written in as hand-written entries on their days, like any
forgotten entry ("A forgotten entry is written in the gap where it belongs"); nothing asks for them as a sum. The
ceiling is never owed: working under it costs nothing, and the janitor balance has no cap either. The front page shows
how much of it is used on the ceiling wheel, beside the flex bar ("The ceiling wheel"). It never blocks a click.

**Why:** the owner's other work comes on top of the janitor job, within what full time and the law allow, and the
balance between the two may shift. Deriving the ceiling means one change moves both, and they cannot disagree. Showing
what is left of an allowance reads more easily than a total of all hours against full time. These hours are additions,
not a balance: what matters is seeing when the owner works too much, which is a reason to talk with the boss about the
split between janitor and other work; carrying the excess keeps that visible. The school counts working time in weeks,
so the owner types the numbers on his contract and the app does the dividing. A quarter hour a week is 3 min a weekday,
so every day counts in whole minutes; it is also a step a slider can be dragged to, and real contracts come in quarters,
so a week that is not one is a typo.

**Rejected:** expected hours for the other profiles (such as 2 a day): every day without that work would put the owner
in minus. The ceiling's amount as a setting of its own: it could be left behind when janitor hours change. Counting the
ceiling per calendar day: a month would allow more than full time, which is a weekday measure. Full time and the split
entered per day: the owner would divide by five in his head each time. Steps of 5 min a week: a slider of hundreds of
positions cannot be dragged to a round number. A week that does not divide into whole minutes rounded per day: the
setting and the counting would disagree, unseen. Each new profile asking how much of the month's ceiling it has already
used: a question useless every time but the first month, and hours with no days, which the wheel, the report and any
count by day could not place. Janitor's hours cut to a lower full time, both saved together: saving one value would
change another. A split refused only against today's full time: a full time dated back could slip under a split starting
later.

**Revisit if:** another profile gets hours of its own to work, or the limits apply to all hours together in a way the
ceiling does not show.

**Cases:**

- Heltid 38:15: 7 h 39 min a weekday. Split 30 h | 8 h 15 min: janitor owes 6 h a weekday, and the ceiling grows by 1 h
  39 min each weekday.
- Heltid 38:16, or 38:10, then Enter: refused with "Ange veckan i steg om 15 minuter", the field still open.
- The split's slider moves 15 min a week per step.
- From full time 38 h 15 min and a split of 30 h | 8 h 15 min, both since 1 January:
  - Heltid 28 h from today: refused, "Vaktmästare har 30h. Minska fördelningen först."
  - The split lowered to 25 h from 1 December, then Heltid 28 h from 1 December: both saved, 25 h | 3 h from 1 December.
    The other way round, Heltid first: refused.
  - The split 25 h from 1 December, then Heltid 28 h from 1 November: refused, janitor still has 30 h in November.
  - Heltid 30 h: saved, the ceiling 0.
  - Heltid raised: never refused.
- Full time 40 h and a split of 30 h, with a split of 35 h saved from 1 January: Heltid 32 h from 1 December is refused,
  "Vaktmästare har 35h från 1 januari 2027. Minska fördelningen först."; December fits, January does not.
- Heltid 28 h until 31 August and 38 h 15 min from 1 September, a split of 25 h: the split moved to 30 h from 1 July is
  refused, "Heltid är bara 28h från 1 juli 2026."; from 1 September it is saved.

## A pay estimate per profile (2026-11-14)

**Built by:** Profiles, for pay set in the menu.

**Decision:** each profile may have a monthly salary or a rate per hour, settings that change from a date ("Settings
change from a date"). A salary counts once per month whatever the hours; janitor work has one (such as 2 000 €), since
its hours move the balance, not the pay. A rate counts the profile's hours that month. A profile with neither is left
out. The estimate is the month's salaries plus its hours times rates ("The app's month is the calendar month"), shown as
one number with no label under the ceiling wheel ("The main screen has a controls side and a dashboard"), before tax
while "Efter skatt", one global checkbox in Profiler, unchecked by default, is unchecked, and after tax when it is
checked, so seeing the pay after tax is a choice made on purpose: the estimate less "Skatt och avgifter", one global
percentage beside it, 25% by default, standing for everything a payslip takes off, the tax card's withholding and the
employee's contributions together (1 − net ÷ gross on one payslip), saved at once with no date or history, since only
the current month's estimate is shown; the tax card's extra percentage above its yearly income limit is left out. It is
updated when an entry stops or an added break changes a stopped entry, like the figures. It is for the owner only, and
stays out of the report to the boss.

**Why:** the owner wants a rough idea of what the month is worth as it builds up, and pay can rise over time. The
janitor job is salaried with flexible hours, so its pay is the base the other work sits on. It need not match payroll,
so no salary rules are needed. One percentage read off a payslip comes closer to the pay than the tax card's alone,
which leaves the contributions (about 9%) out, and changing it when a new tax card comes is one field.

**Rejected:** matching payroll: salary rules change, and the app would be wrong whenever they do. A rate on janitor
hours: working more or less there changes the balance, not the pay. A "Före skatt" box checked by default: ticked to
show the plain number, it read backwards. The tax card's percentage alone: the estimate would sit about 9% high. The tax
rules, or the extra percentage above the income limit: the estimate is rough by design. The percentage changing from a
date: no past estimate is shown, so no history is read.

**Revisit if:** the estimate is used for anything that has to be exact.

**Cases:**

- Rate 20 €/h, an entry of 3 h stopped: the estimate grows by 60 €; 30 min then cut from it: it falls by 10 €.
- An estimate of 2 400 €, "Efter skatt" checked with 25%: 1 800 €; the percentage set to 27,5: 1 740 €; unchecked again:
  2 400 €.
- "Skatt och avgifter" given 100, or left empty, then Enter: refused, the field red and still open.

## Settings change from a date (2026-11-14)

**Built by:** Profiles.

**Decision:** settings that counting depends on, such as janitor's expected hours and full time, are changed in a small
settings menu. Each change takes effect from a date, today unless the owner picks another, which may be in the past.
Every day is counted with the settings in force on it, so past days keep the settings they were worked under.

**Why:** the owner's work may shift toward the other profiles. A change that rewrote the past would alter balances
already settled with the boss; a contract change often starts on a date before the app is updated.

**Rejected:** one current value per setting: changing it would recount every past day.

**Revisit if:** a setting ever needs to change the past on purpose.

**Cases:**

- Janitor set from 30 h to 25 h a week (6 h to 5 h a weekday) from 1 September: an August weekday with 6 h worked adds
  0; a September one adds +1.
- The same change entered on 10 September, dated 1 September: 1–9 September are recounted against 5.
