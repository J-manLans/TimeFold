# Scope: first start

How the app starts with no record, through the onboarding or from a file, and with one it cannot read. Each decision
follows the template in `../README.md`, and is cited by its title.

## A first install starts fresh or imports (2026-11-14)

**Built by:** Handover, for importing.

**Decision:** an app with no data asks once how to start, in the menu's panel ("The main screen has a controls side and
a dashboard") grown open over the controls side in a locked stage: no ×, and no click outside or Esc closes it. While
the prompts show, the panel is solid, in the frost's tint made opaque. The dashboard stays sharp beside it, empty at
first. One centred prompt shows at a time, and each step fades out before the next fades in, 0.1 s each, so the two
never show together; the two buttons leave at once, with no fade. First, two buttons in "Starta jobb"'s style, its
height and font, each as wide as its words: **"Starta nytt"**, and **"Importera"**, greyed out until Handover yet still
showing its tip, "från fil", on hover and keyboard focus.

**Starta nytt** makes the first profile at once, the one with the balance (janitor work), in its default colours ("Each
profile carries its colours"), and then asks two things, with no fields: a lone blinking caret, the browser's own, under
each prompt.

1. **"Nuvarande flextimmar?"** The balance as it stood at the end of the day before the first day in the app, typed in
   the dashboard's display font and read as in "Entering a length of time" (`45` is minutes, `12:30` hours and minutes),
   with two additions: a sign in front, `+` or `-`, no sign meaning plus as Excel writes it; and up to three digits of
   hours. Only digits, `:`, `+` and `-` are taken, in that shape, the minutes at most 59, and Enter moves on only for a
   whole length. How it is read shows just under it, sign included ("−12h 30min"). The number wears where it stands: the
   base colour at 0 or below, the neon in plus. On Enter the dashboard's number and bar count to it, as at a stop.
2. **"Profilnamn?"** The first profile's name, typed in the colour the balance decided; Enter moves on only when it is
   not empty.

Esc goes back a step, the answer kept; back from the balance to the two buttons, the dashboard counts back to 0. After
the name, the app comes into focus in steps, and the screen takes no input until the last: the panel's text fades away;
the panel turns to frost, its blur switched on at once behind the still solid tint and only the tint fading, so the
buttons emerge already blurred; the panel shrinks into the menu button, as the menu closes, and the buttons sharpen; the
pointer light sweeps once across the button block, arcing down from above its middle on the left to below it on the
right, small at its edges and largest at its middle, and shrinks to nothing; and as it leaves, the profile's letter
fades in on the profile button, slower than the interface's other fades. Every time in it is a knob in the prototype.
The balance is kept in the record as an opening figure dated the first day, apart from the entries: the handover carries
it, the reports show it ("brought over: +12:30"), a correction can change it, and the balance counts from it. The fresh
start asks nothing about the ceiling: hours of the other work already worked that month are written in as hand-written
entries ("The other profiles share a ceiling"). From then on the app records every entry with its day. **Importera**
reads a handover file instead, as in "Handover between machines", and asks nothing more: the file brings the profiles
with their colours, the settings and the opening figures; the theme starts following the system. The owner switches to
the app with Phase 1's release, on a day not yet worked: before the first click, the balance is read off the Excel file
and typed in. The Excel file is kept as a backup until the app is finished; its history before the switch stays in it
and is not brought in.

**Why:** the Excel history is not needed by anything the app does, and the boss has not asked for it; parsing the file's
layout would cost much for it. Figures as of the end of the day before mean the app counts every day from its first, so
none is counted twice or missed. Asking at first start keeps a second machine from getting opening figures of its own.
The menu's panel is where the profile's settings will live, so the first start is the first use of it, and its frost
keeps the dashboard in view, where the balance lands as it is typed. One prompt at a time is calm, and leaves the screen
still enough that each answer shows where it goes. A solid panel keeps the frost from being blurred again under the
blinking caret and the buttons' states, which drew seams across it, and costs WebKitGTK nothing. The balance comes first
because it decides the letter's colour, so the name and the letter appear once, in their final colour; the letter
arriving last, on a still screen, is the moment the app becomes the owner's, and the light sweeping across the buttons
just before it says the app is ready, once, at its one ceremony. A real input with nothing of a field showing keeps
typing, pasting and editing as they always work. "Från fil" says what the import reads without tying it to a machine,
and as a tip it leaves the two buttons alike; a file that is not a record is named as such, so a mistaken pick costs a
message. The dashboard taking the balance on Enter shows it arriving as every balance does.

**Rejected:** importing the past days from the Excel file: far more work for history no one reads. The opening figures
as settings: settings here change from a date and apply forward, and a setting typed on one machine could be left out of
the other. The opening figures as entries: an opening has an amount, not a start and a stop, and every part that reads
entries (the counting, the recent list, editing, the undo, the report) would have to skip it. Switching in the middle of
a worked day: it happens once, and a fresh day needs nothing built. A page of its own, or a form: the app would appear
only after it, and a form asks everything at once. A slider for the balance: an exact figure from Excel cannot be hit by
dragging. A default name: it invites Enter without a thought. The letter appearing under the frost as the name is typed:
blurred, where it could arrive crisp. The name first: the letter would change colour once the balance came. "Importera"
with no hint: it reads as importing the Excel file. "(från fil)" under the button: a third thing on a screen of two. The
dashboard following each keystroke: a half-typed number would swing the bar. The panel frosted while the prompts show:
seams across the blur. The blur growing with the tint: the buttons showed sharp, then blurred. The letter before the
light sweep: the light would pass over the moment instead of leading to it. The light sweep at every start: something
seen every day. "Importera från min andra dator": long, and tied to a machine.

**Revisit if:** the boss or payroll asks for days from before the app.

**Cases:**

- First install on Monday, Excel balance +12:30 at Friday's close: the balance starts at +12:30; 7 h worked on Monday
  makes it +13:30.
- `-3:00` typed: the number in the base colour, the bar to the left, the name and then the letter in the base colour.
  `12:30` with no sign: all in the neon.
- `12:30` typed: "12h 30min" under it. `5`: "5min". `-105:00`: "−105h".
- `12:` and Enter: nothing happens; the caret waits. A letter typed into the balance: it does not appear. Enter on an
  empty name: nothing happens.
- Esc on the name: back to the balance, `-3:00` still there; Esc there: back to the two buttons.
- `-3:00` and Enter: the dashboard counts to −3:00 as at a stop; Esc back to the two buttons: it counts back to 0.
- The pointer on the greyed-out "Importera": the tip says "från fil".
- The name entered: the text fades, the panel turns to frost with the buttons blurred behind it, shrinks into the menu
  button, the light sweeps across the buttons, and the letter fades in as the light leaves; nothing can be pressed until
  it has.
- Stilla ("Motion can be switched off in the app"): no light sweep; the letter follows the panel's closing.
- Second machine, first start: "Importera" brings the whole record, opening figures and profile colours included, and
  asks nothing more.

## A record that cannot be read offers the newest copy (2026-11-17)

**Built by:** Handover, for importing.

**Decision:** when the record cannot be read at start ("The record is one JSON file"), the app opens on the menu's panel
locked over the controls side, as at the first start ("A first install starts fresh or imports"), solid, with no way
out, one centred block of words, buttons and a quiet note in the panel. It says **"Programmet kunde ej startas."**, then
"Din data är korrupt. Dashboarden till höger visar senaste bra kopian, från tisdag 17 november" ("ovanför" in a narrow
window, where the dashboard is on top), and offers **"Använd kopian"**, with "Importera" greyed out until Handover with
its tip, "från fil", and the note "Inget ändras förrän du väljer." The dashboard beside it shows the copy as it would
be, its balance, wheel and recent entries, under a label in the dashboard's label style, "KOPIA · TIS 17 NOV", which
breathes between its quiet colour and the colour of where the profile on screen stands in the copy ("Each profile
carries its colours") for as long as the screen shows. "Använd kopian" saves the copy as the record, and the panel
closes as the menu closes, the screen ready at once: a repair, not a welcome, so it has none of the onboarding's ending.
Closing the app instead changes nothing; the broken file stays as it was, to be put right by hand.

With no copy yet, which can only happen in the first session, since a copy is made at every start: "Din data är korrupt,
och appen hann aldrig spara någon kopia, men det hände tidigt: ladda bara om filen du importerade, eller starta om och
fyll i för hand om något försvann." It offers **"Starta nytt"**, which runs the onboarding from its balance, and
"Importera", with the note "Den skadade filen ersätts när du är klar."

A record from a newer version of the app is not broken: "Din fil kommer från en nyare version", that this version cannot
open it, and **"Hämta senaste"**, which opens the repo's releases page ("The app reaches each machine as an installer
from a GitHub release") and closes the app so the installer can replace it; the note says so beforehand: "Appen stängs
när du klickar på knappen, så att du kan installera om." No copy is offered and the dashboard stays empty.

The words and the note wrap at one width, their lines balanced.

**Why:** the dashboard is where the owner reads a record, so it is where a copy is best judged before taking it; the
locked panel puts all the attention on it, and the two screens that start the app share one form. The newest copy is
offered alone because it is both certainly readable (copies are made only from a file that has just passed the check)
and the one that loses least: each older copy loses another day. What lies in the file, not its shape, cannot be judged
by the app, so this screen is only for a file it cannot read. Saying that the program could not start, and that the
dashboard shows the last good copy, tells the owner what happened and what they see; the label's breathing keeps saying
"this is a copy" while the panel is read. With no copy, the damage is early and small, and the words say so. Closing on
"Hämta senaste" is the step the installer needs next, and the file is untouched, so this screen simply returns until the
app is updated.

**Rejected:** a popup centred on the controls side: the controls stay in view around it, dimmed, where the panel leaves
only the dashboard. Stepping back through older copies: a broken shape never reaches the copies, and each step back
loses a day; recovering from wrong contents is another problem. A "No thanks" button: closing the app already declines,
changing nothing. A flash across the whole dashboard, or one pulse of the label: gone before the panel is read; the
owner did not see at once that the whole dashboard was the copy. A glow on the label: its colour changing says it with
the app's own colours. The label breathing into the neon always: it shows where the copy stands, so it follows the
balance, as the letter does. "Din fil gick inte att läsa": the program not starting is what the owner meets. Advice to
start, stop and edit an entry to put back what is lost: editing comes in Corrections, where writing a forgotten entry is
simpler. "Importera" after "Hämta senaste": the updated app reads the file itself. Fading the app out as it closes: the
note says it will close, and the browser opens anyway.

**Revisit if:** a broken file turns out to be common, which would point at a cause worth fixing instead.

**Cases:**

- `record.json` edited by hand into invalid JSON, a copy from Tuesday 17 November: the dashboard shows Tuesday's copy
  under "KOPIA · TIS 17 NOV", breathing into the neon if the copy's balance is in plus, the base if not; "Använd kopian"
  saves it and the app opens on it.
- The same in a narrow window: the words say "Dashboarden ovanför".
- The same, the app closed instead: the broken file is unchanged at the next start.
- A broken file and no copies: the words say it happened early; "Starta nytt" runs the onboarding from its balance.
- A record of a newer version: "Hämta senaste" opens the releases page and closes the app; no copy is offered, the
  dashboard is empty, and the next start shows the same screen until the app is updated.
