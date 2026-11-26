# Profiles: pay and settings

The pay estimate, and how settings change from a date. What a profile is, and the ceiling, have their own files beside
this one. Each decision follows the template in `../README.md`, and is cited by its title.

## A pay estimate per profile (2026-11-14)

**Decision:** the profile with the balance has a monthly salary and every other profile a rate per hour, its pay kind,
with no choice between them; each is a setting that changes from a date ("Settings change from a date"). A salary counts
once per month whatever the hours; janitor work has one (such as 2 000 €), since its hours move the balance, not the
pay. A rate counts the profile's hours that month. A profile with neither is left out. The estimate is the month's
salaries plus its hours times rates ("The app's month is the calendar month"), shown as one number with no label under
the ceiling wheel ("The main screen has a controls side and a dashboard"), before tax while "Efter skatt", one global
checkbox in Profiler, unchecked by default, is unchecked, and after tax when it is checked, so seeing the pay after tax
is a choice made on purpose: the estimate less "Skatt och avgifter", one global percentage beside it, 25% by default,
standing for everything a payslip takes off, the tax card's withholding and the employee's contributions together (1 −
net ÷ gross on one payslip), saved at once with no date or history, since only the current month's estimate is shown;
the tax card's extra percentage above its yearly income limit is left out. It is updated when an entry stops or an added
break changes a stopped entry, like the figures. It is for the owner only, and stays out of the report to the boss.

**Why:** the owner wants a rough idea of what the month is worth as it builds up, and pay can rise over time. The
janitor job is salaried with flexible hours, so its pay is the base the other work sits on. It need not match payroll,
so no salary rules are needed. One percentage read off a payslip comes closer to the pay than the tax card's alone,
which leaves the contributions (about 9%) out, and changing it when a new tax card comes is one field.

**Rejected:** A choice of salary or rate on every profile: every profile but janitor's is paid by the hour, as far ahead
as can be seen. Matching payroll: salary rules change, and the app would be wrong whenever they do. A rate on janitor
hours: working more or less there changes the balance, not the pay. A "Före skatt" box checked by default: ticked to
show the plain number, it read backwards. The tax card's percentage alone: the estimate would sit about 9% high. The tax
rules, or the extra percentage above the income limit: the estimate is rough by design. The percentage changing from a
date: no past estimate is shown, so no history is read.

**Revisit if:** the estimate is used for anything that has to be exact.

**Cases:**

- Rate 20 €/h, an entry of 3 h stopped: the estimate grows by 60 €; 30 min then cut from it: it falls by 10 €.
- "Skatt och avgifter" given 100, or left empty, then Enter: refused, the field red and still open.

## Settings change from a date (2026-11-26)

**Decision:** settings that counting depends on, such as janitor's expected hours and full time, are changed in a small
settings menu. Each change takes effect from a date the owner may move to any day, in the past too. Every one opens on
the first day of next month, since changes to them, full time, the split and pay alike, are usually agreed from a
month's start. Every day is counted with the settings in force on it, so past days keep the settings they were worked
under.

**Why:** the owner's work may shift toward the other profiles. A change that rewrote the past would alter balances
already settled with the boss; a contract change often starts on a date before the app is updated.

**Rejected:** one current value per setting: changing it would recount every past day.

**Revisit if:** a setting ever needs to change the past on purpose.

**Cases:**

- Janitor set from 30 h to 25 h a week (6 h to 5 h a weekday) from 1 September: an August weekday with 6 h worked adds
  0; a September one adds +1.
- The same change entered on 10 September, dated 1 September: 1–9 September are recounted against 5.
