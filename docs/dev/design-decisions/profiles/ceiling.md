# Profiles: the ceiling

The ceiling the profiles without a balance share, and its trend over the months. What a profile is, and pay and
settings, have their own files beside this one. Each decision follows the template in `../README.md`, and is cited by
its title.

## The other profiles share a ceiling (2026-11-26)

**Built by:** Profiles, for the full-time slider and each month counted on its own.

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
its whole ceiling, whatever day that is. Each month counts only its own hours: nothing over or under a month's ceiling
carries into the next, which starts from zero; how the months add up is the ceiling's trend ("The ceiling's trend").
Hours of the other work already worked in a month before its profile is in the app are written in as hand-written
entries on their days, like any forgotten entry ("A forgotten entry is written in the gap where it belongs"); nothing
asks for them as a sum. The ceiling is never owed: working under it costs nothing, and the janitor balance has no cap
either. The front page shows how much of it is used on the ceiling wheel, beside the flex bar ("The ceiling wheel"). It
never blocks a click.

**Why:** the owner's other work comes on top of the janitor job, within what full time and the law allow, and the
balance between the two may shift. Deriving the ceiling means one change moves both, and they cannot disagree. Showing
what is left of an allowance reads more easily than a total of all hours against full time. These hours are additions,
not a balance: what matters is seeing when the owner works too much, which is a reason to talk with the boss about the
split between janitor and other work; the ceiling's trend keeps that visible, while each month's wheel shows only that
month, so a wheel half full on 30 March means half of March's room is used, with nothing from the months before mixed
in. The school counts working time in weeks, so the owner types the numbers on his contract and the app does the
dividing. A quarter hour a week is 3 min a weekday, so every day counts in whole minutes; it is also a step a slider can
be dragged to, and real contracts come in quarters, so a week that is not one is a typo.

**Rejected:** expected hours for the other profiles (such as 2 a day): every day without that work would put the owner
in minus. The ceiling's amount as a setting of its own: it could be left behind when janitor hours change. Counting the
ceiling per calendar day: a month would allow more than full time, which is a weekday measure. Full time and the split
entered per day: the owner would divide by five in his head each time. Steps of 5 min a week: a slider of hundreds of
positions cannot be dragged to a round number. A week that does not divide into whole minutes rounded per day: the
setting and the counting would disagree, unseen. Each new profile asking how much of the month's ceiling it has already
used: a question useless every time but the first month, and hours with no days, which the wheel, the report and any
count by day could not place. Janitor's hours cut to a lower full time, both saved together: saving one value would
change another. A split refused only against today's full time: a full time dated back could slip under a split starting
later. Hours over the ceiling carried into the next month: a month would open with hours not worked in it, beside an
estimate counting only that month, and the same hours would read as over or not depending on the order of the months,
since unused hours did not carry. A carry both ways: an under month would give the next one extra room, as if unused
hours were owed, and hide an over month behind a quiet one; it would make the ceiling a second balance.

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

## The ceiling's trend (2026-11-26)

**Built by:** Profiles.

**Decision:** the ceiling's trend is the sum, over finished months, of each month's hours over or under its ceiling
(hours used less the ceiling), counted from the month the ceiling last changed, a change to full time or the split, the
ceiling following from both ("The other profiles share a ceiling"); with no change yet, from the first month in the app.
A change takes effect in the month its date falls in: that month is the trend's first, counted as its wheel counts it,
under the ceiling in force on each of its days. The month under way never counts, so the trend changes only when a month
ends, never day by day. It shows on the main screen as a quiet number beside the pay estimate under the wheel, with no
label, in the estimate's colour, written as the balance is: signed hours and minutes, "+7:30", "−3:45", and "0:00" at
zero or after a change. It shows whatever profile is on screen, as the wheel does. The report shows it beside the
month's wheel, up to and including that month, with where it starts ("sedan 1 aug"). It is never owed and moves nothing
else: over says the other work needs more room than the split gives it, under says there is room for more.

**Why:** the talk with the boss is about the split, so the trend starts again when the split changes and says whether
the split in force fits: after an adjustment, months that stay near 0:00 say it does. Counting from the start would keep
an old excess forever, so a split put right would hardly show. Both directions matter: over says the owner is needed
more, under that he can take on more. Finished months only, since a month under way is always under its ceiling at
first. The month the change falls in starts the trend, so a change on any date needs no rule of its own; changes usually
start on a month's first day ("Settings change from a date").

**Rejected:** the trend since the first month in the app: an old excess outweighs every month after an adjustment. The
school year, from 1 August: a cut on a date when nothing about the work changes. Months in a row over the ceiling as the
sign: +1 h and +20 h would read the same, and under would not show. The trend shown in the app with where it starts: the
number alone is enough on screen; the report says it for the boss.

**Cases:**

- Ceiling unchanged since January; January +10:00, February −3:00, March +0:30: on 1 April the trend reads +7:30; on 15
  April still +7:30.
- The trend at +40:00, the split changed from 1 May: on 1 May it reads 0:00; May +0:15 over: on 1 June +0:15.
- The split changed from 15 May: May is the trend's first month, counted under both ceilings as its wheel is.
- The trend at 0:00: it shows "0:00".
- A rate or salary changed: the trend does not start again.
- The report for March, the ceiling changed from 1 January: the trend through March, "sedan 1 jan".
