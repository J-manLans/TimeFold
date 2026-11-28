# Time: flex days

How a day off is marked: the calendar, what a marked day costs, and how it counts on the screen and in the report. Each
decision follows the template in `../README.md`, and is cited by its title.

## A flex day can be marked ahead, and the screen counts it at once (2026-11-20)

**Decision:** a flex day ("A day owes its expected hours only when work started on it") is marked in the calendar under
"Flexledig" in the menu's **Tid** tab ("The menu has tabs, with every value locked behind "Ändra""), always open there.
It shows one month, the weeks starting on Monday, with ‹ and › to the months either side; away from today's month, the
month's name wakes up, the pointer and an underline showing on it when hovered, and a click on it brings the calendar
back to today's month, while on today's month it is plain text; the days are outlined squares packed close with a small
gap, and a marked day is filled in the base colour of the profile with the balance ("Each profile carries its colours").
One click on a weekday, today or ahead, marks it, and a click on a marked day unmarks it, giving its hours back; the
balance follows at once, with no range and no confirm. Weekends are greyed out and cannot be clicked, since they owe no
hours, and so is a day janitor work started on, padlock or not: it is charged its hours already, so marking it would
change nothing; a flex day marked ahead and then worked keeps its fill, greyed, padlock or not. So is a day before the
record's first day, where the janitor's expected hours begin (the day it was started fresh, or the day an imported
record starts), padlock or not: those days are inside the opening balance and owe nothing, so a flex day there would
take nothing off. Nothing marks the first day itself: the edge where the grey ends shows it. Today stays open until work
starts on it. Days gone by are greyed out and locked too, a past flex day keeping its fill, greyed; a small padlock
beside the month name unlocks them, to mark a day off that was forgotten or unmark one, and asks no reason; opened, it
shows the past flex days not worked in full colour again, while a worked one stays greyed. It locks again when the owner
leaves the tab or closes the menu, and stays open while paging months. To the calendar's right, every marked day from
today on is listed, a line per month: the short month name, then the days as numbers in the text colour, each jumping
the calendar to its month; a month's days wrap under its first day, and a year gets its own bold line where the list
crosses into it. Each line is a day square's height with the days' gap, so it sits level with a week; in the narrow
window the list sits under the calendar. The calendar is the one place flex days are seen: "Visa alla" lists entries
only. The balance on the main screen counts every marked day at once, ahead ones included, so the flex bar shows the
balance as planned: with a day marked ahead and too little balance to cover it, the bar goes minus, and the minus is the
time still to work before that day. If the day comes and the balance is still short, nothing special happens: the
balance carries the minus as any other. A day costs the expected hours in force on its own date ("Settings change from a
date"), so a later change to them changes what a marked day ahead costs. Work recorded on a flex day adds to it as
usual, so a flex day that is worked counts as any workday, and needs no unmarking. The report counts only days up to its
own end: the month's last day, or today for the current month; a flex day ahead is not in it until the month it falls in
("The report lists the days the balance moved"). Both are one count with two end dates; the screen's simply runs to the
last marked day.

**Why:** the owner plans days off weeks or months ahead; with the hours taken at once, the flex bar always shows the
planned truth, and the minus says how much is left to work for it with no other figure. In the owner's Excel a day off
is a typed zero day on the day itself; marking ahead replaces both the zero day and the sum in the head. Counting the
report only to its end keeps each report true to what happened in its month. A click with the flex bar beside it makes
the change and its result one glance, and a second click is the undo. Five clicks are a week, and skip the weekend by
themselves. A worked day is locked because the count already charges it, so a click there would show nothing happening;
a day before the first day is locked for the same reason, since it owes nothing. Locking the past keeps a stray click
from changing history, and the padlock makes changing it a choice, which is intention enough. The list finds a day
months ahead without paging. The name is where the eye is on noticing it has wandered, and it wakes only when it has
something to do, so it is never a dead button. The padlock tells a day off taken from a flex day worked: opened, the one
lights up and the other stays greyed, with no second shape to learn.

**Rejected:** a range of days: a second way to pick, which would charge the weekend. An "OK" confirming the picks, with
picked days in a neon border: a step with nothing to protect, since the bar shows a mistake at once. Days ahead as
"Flexledig" rows at the top of "Visa alla": flex days in two places, and "Visa alla" holds entries. A forgotten day off
fixed among the corrections: the same split. Past days always open: a stray click would change history. A reason for a
day marked through the padlock. The listed days in the neon, or the years in the base colour: the neon means what is
happening now, and the base marks a flex day. A third bar on the main screen for the hours still needed before a day
off: the flex bar's minus already says it, and the main screen stays as it is. Taking the hours only on the day: the bar
would show a balance that is already spent. The report taking the screen's balance: a month's report would carry days
off not yet taken, maybe more than a year ahead. A line in the report naming days off ahead: the boss reads what
happened, not plans. Adding planned hours back for the report: one count with two end dates gives the same figures with
nothing to keep in step. A circle for a flex day, turning to a plain square once worked: the padlock already tells the
two apart. An "Idag" button appearing beside the arrows away from today's month: one more thing coming and going in the
head, beside the padlock. The month's name opening a month and year picker: paging and the list reach any month, and the
way back is what is missing. A button listing past flex days beside the list ahead: paging the calendar back shows them,
and each month's report lists its own.

**Revisit if:** the boss asks to see days off ahead, or planned days pile up so far ahead that the bar stops being read
as today's balance.
