# Profiles

What a profile is, the ceiling the profiles without a balance share, the pay estimate, and how settings change. Each
decision follows the template in `README.md`, and is cited by its title.

## Profiles label the hours (2026-11-14)

**Built by:** Profiles; entries carry a profile from Clocking.

**Decision:** every entry belongs to one profile (such as janitor work, the development group, work from home).
Switching is done as in "One start/stop button and a profile list". A day can mix profiles, and the owner adds
profiles as new kinds of work come up. Profiles are isolated: each counts its own days and hours, and work in one
never changes another. A profile holds: a short name (what is tapped when switching); optional expected hours, and
only a profile with them has a balance; a colour or icon; active or archived (an archived profile leaves the switch
list but keeps its hours in the history and reports); a pay category, a label only, so reports can group hours by how
they are paid; and an optional rate for the pay estimate ("A pay estimate per profile"). Reports show hours per
profile.
**Why:** the owner's work is paid differently depending on the task and where it is done. Keeping profiles apart
means a Saturday of development group work cannot touch the janitor balance, with no special rule for it.
**Rejected:** the app calculating pay as payroll does: salary rules belong to payroll, and would make the app wrong
whenever they change; the pay estimate is a rough figure for the owner only. A yes/no "counts toward the balance"
setting per profile, with one shared balance: it let work in one profile change another's balance. A "reported to"
field on each profile: the owner does not need it.
**Revisit if:** the owner needs the app's figures to match payroll.

## The other profiles share a ceiling (2026-11-14)

**Built by:** Profiles.

**Decision:** janitor work is the only profile with expected hours, and so the only balance. All other profiles
together share one ceiling: the rest of full time. Full time is a setting (8 h a day), and the ceiling is not set but
follows from it: on each weekday, full time minus janitor's expected hours (8 − 6 = 2 h), added up over the weekdays
of its period, so janitor work and the ceiling together make exactly full time. Hours in the other profiles count the
same whenever they are worked: night or day, weekday or weekend. Full time and janitor's expected hours are set
together with one slider that splits full time between them (6 | 2); how it looks is settled with the look and feel.
The ceiling's period is the calendar month. Hours over a month's ceiling carry into the next month, which starts with
them already used; hours left unused do not carry, and the next month starts from zero. The ceiling is never owed:
working under it costs nothing, and the janitor balance has no cap either. The front page shows how much of it is used
on the ceiling wheel, beside the balance bar ("The ceiling wheel"). It never blocks a click.
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

## The ceiling wheel (2026-11-14)

**Built by:** Profiles.

**Decision:** the ceiling shows as a ring, the ceiling wheel, with the month's used hours as a number in its centre. A
full ring is the month's ceiling. Two colours are settings: the base colour and the over colour. Used hours fill the
ring clockwise from 12 o'clock in the base colour; the unused rest is the base colour mixed 70% toward the background,
in OKLab. When that leaves it within 0.15 lightness of the base, as black on a dark background or white on a light one,
the unused rest sits 0.15 past the background instead, on the side away from the base, in the base's hue at 30% of its
chroma, if that lands between lightness 0.05 and 0.98. Hours over the ceiling are in the over colour: a second lap from
12 o'clock, drawn over the base colour on the same ring. That lap is what carries into the next month, where those hours
show in the base colour. From 90% of the ceiling the centre number takes the over colour; the ring keeps its colours.
The over colour starts as a suggestion worked out from the base colour, and a new base colour brings a new suggestion;
the owner may pick another. The suggestion, in OKLCH: the base's hue turned 55° toward red (hue 29°), stopping at red,
going down through yellow for hues up to 170° and up through violet above; a grey base (chroma under 0.04) turns to red.
The turned hue is taken at the lightness where it is most vivid (the most chroma sRGB allows, sought between lightness
0.2 and 0.98), and as vivid as sRGB allows at that lightness, but at least 0.15 lighter or darker than the base: lighter
only when the hue turned at least 10°, its most vivid lightness is at least 0.15 above the base and the base is at most
0.75, or when darker would fall under 0.3.
**Why:** one base colour keeps the ring one family, and turning toward red reads as "too much" in any family. Where two
colours meet edge to edge the eye parts them by lightness, and two strong colours of equal lightness flicker, hence the
gap; the unused rest keeps it from the base too, framing a base that is close to the background. No formula suits every
base (near black, greys), so the suggestion can be overridden, and the owner sees the result at once. The number warns
in the colour that is coming.
**Rejected:** the over colour always red: a red base would hide it. An amber number at 90%: the over colour says the
same and needs no third colour. Turning 30°: blue, cyan, yellow and pink stayed too close to their base. Always
darker: green went olive and orange brown. The rule's numbers as settings: they could undo the contrast; they are
tuned once, by eye, on a sketch. A fixed set of colours with chosen over colours: it limits the base, while
the suggestion with an override covers the corners. The excess as a thinner second ring inside: two rings to read for
one figure. Shrinking the ring so the used and the excess share it: a full ring would stop meaning the ceiling.
**Revisit if:** a month goes more than a whole ceiling over, which one lap cannot show; or the suggestion is often
overridden.
**Cases:**
- Ceiling 42 h, 21 h used: half the ring in the base colour, half dimmed; the number in the base colour.
- Ceiling 42 h, 38 h used: the number in the over colour (90% is 37.8 h); the ring has no over lap.
- Ceiling 42 h, 46 h used: the ring full, with the over colour over 4/42 of it from 12 o'clock; the next month starts
  with 4 h in the base colour.
- Suggestions: orange `#f28c28` gives red `#e80003`; green `#3aa655` gives golden yellow `#fcd000`; purple `#8e5bd6`
  gives deep magenta `#940056`; blue `#3b7be0` gives deep violet `#7d00a5`; cyan `#1fb5c4` gives blue `#0064fc`;
  yellow `#e8c22a` gives red-orange `#fd5300`; pink `#e35d9c` gives crimson `#c50001`; red `#d93a3a` gives dark red
  `#9e0001`; grey `#8a8a8a` gives dark red `#b40001`; black and white give red `#ff0a0a`.
- Black on a dark background: the unused rest is a dark grey, lighter than the background. White on a light
  background: a light grey, darker than the background. Orange on either: mixed toward the background as usual.
- Base changed from orange to blue after picking an over colour: the over colour returns to the suggestion for blue.

## A pay estimate per profile (2026-11-14)

**Built by:** Profiles.

**Decision:** each profile may have a rate per hour, a setting that changes from a date ("Settings change from a
date"). A profile without one is left out of the estimate. The main screen can show the estimate: a total of hours
times rate, updated when an entry stops or an added break changes a stopped entry, like the bars. It is for the owner
only, and stays out of the report to the boss.
**Why:** the owner wants a rough idea of what the work is worth as it builds up, and pay can rise over time. It need
not match payroll, so no salary rules are needed.
**Rejected:** matching payroll: salary rules change, and the app would be wrong whenever they do.
**Revisit if:** the estimate is used for anything that has to be exact.
**Cases:**
- Rate 20 €/h, an entry of 3 h stopped: the estimate grows by 60 €.
- 30 min cut from that entry on its line: the estimate falls by 10 €.
- A profile with no rate: its hours add nothing to the estimate.
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
