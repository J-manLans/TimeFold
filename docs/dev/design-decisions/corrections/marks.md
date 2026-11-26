# Corrections: marks and reasons

How an entry remembers that it was set by hand, and why. Each decision follows the template in `../README.md`, and is
cited by its title.

## Entries remember how they were made (2026-11-14)

**Decision:** every entry keeps one mark of how it was made: clicked, written by hand, or edited after it was recorded.
The mark is stored from the first entry, and an edited or hand-written entry also keeps its reason ("Every edit carries
a reason"). In the lists, an entry that was not clicked carries an "e" tag after its break's, from _editera_, in
"Senaste" and "Visa alla" alike, the same for an edited entry and a written one; "Visa alla" also shows its reason under
the row, "ändrad: …" for an edited entry and "tillagd: …" for a written one. Showing the mark itself in the report is
not decided; see "Corrected entries in the report", in `codebase-ideas.md`.

**Why:** honesty in reporting: the boss can trust that a time set by hand is known to be one. Stored from the start, the
mark is right for every entry; added later, it would be missing on all entries before it.

**Rejected:** no mark: the record could not tell a click from a guess. Keeping every edit's old times: more than honesty
needs, for a report the boss reads at a glance. A tag of its own for a written entry: both mean set by hand, not
clicked, and the record keeps the difference. The reason line alone, in "Visa alla" only: "Senaste" had no sign of an
edit.

**Revisit if:** the boss asks to see what an edit changed.

**Cases:**

- An edited entry with a 20 min break, in "Senaste": "paus 20min" and "e"; in "Visa alla" also "ändrad: Glömd paus".
- A written entry in "Visa alla": "e", and "tillagd: …" under it.

## Every edit carries a reason (2026-11-26)

**Decision:** an edit that changes an entry's time or its profile, on its line or by writing a forgotten entry by hand,
needs a reason before it is saved. Under the entry line sits one closed field, "Välj orsak"; clicked, it opens the list
of reasons, which grows open and then fades its reasons in, and closes by fading them out and then shrinking, at the
interface's speed (at once in Stilla); and the confirm stays greyed out until one is chosen. The list starts with
"Glömde stämpla in", "Glömde stämpla ut", "Fel profil", "Ärende", "Glömd paus" and "Glömd post", and ends with "Annan
orsak", always last: a field in the list itself, looking like the other reasons but with a faint underline exactly as
long as the text it shows: "Annan orsak" while empty, else the text, growing and shrinking as it is typed, up to the
popup's padding. The list is never wider than the popup: a longer text scrolls inside the field, and the other reasons
stay in place. Typing in it makes the text the reason from its first character, so the confirm lights up; Enter, or a
click elsewhere, keeps it. A reason shows up to the length of "Glömde stämpla ut" and a longer one is cut with "…", both
in the closed field, typed or from the list, and in "Annan orsak" at rest; clicked again, the field opens to the whole
text. Esc puts back the text it had when clicked and closes the list, not the edit. The chosen reason stays in its place
in the list, greyed, and a click on it does nothing; a typed one is greyed the same, but clicked, it turns white to be
edited. The text stays while the edit is open: after another reason is chosen, the list shows it in place of "Annan
orsak", and a click opens it again; a cancel drops it. An empty field is no reason. The other reasons are in
alphabetical order, the Swedish way, with Å, Ä and Ö after Z, so one learned or renamed lands where it can be guessed.
The entry stores the reason's text, not a link to the list, and keeps only its latest one, as it keeps one mark
("Entries remember how they were made"). An edit that divides an entry gives every entry it makes the "edited" mark: the
new entry in a filled gap carries the reason chosen, and the parts around it an automatic one naming what divided them,
"Delad av Utveckling"; with a plain gap, both parts carry the reason chosen. The automatic text is never counted among
the "Annan orsak" texts. Any entry can also be given a reason with nothing else changed, such as why a day ran over
("Stannade kvar och monterade barngrind hos Bantis"): it keeps its mark and its times, has no "e" tag, and "Visa alla"
shows its reason with no prefix; a later edit's reason replaces it. Undo needs no reason: it puts back what was.
Deleting an entry needs none either, only "Ta bort?" to confirm. The list is kept in the picker itself, with no tab of
its own. It learns: an "Annan orsak" text written three times, matched after lowercasing and dropping punctuation and
extra spaces, joins the list in its place, its first letter a capital; the automatic text never counts. The list shows
at most seven lines, "Annan orsak" counted as one, which is as many as it starts with, and scrolls past them. Under the
pointer, each reason's line shows a pen at its end, drawn as the flex-day calendar's padlock; the pen turns the line
into a field drawn as "Annan orsak", holding its text, and editing it does not choose it. Enter keeps a new text, its
first letter turning a capital as it is typed; a name already in the list, matched the same way, is refused with
"Orsaken finns redan" under the field in the removal red, the field left open. Emptied, Enter asks "Ta bort?" in the
removal red in the field, and a second Enter removes the reason. The field is never narrower than one character, so an
emptied one keeps its caret. Esc or a click outside puts the line back as it was, as a locked value in the menu does
("The menu has tabs, with every value locked behind "Ändra""), not as "Annan orsak", which keeps its text, since typing
there chooses the edit's reason while the pen changes the list. Every line can be edited, the six the list starts with
too. A removed reason is remembered, so it is never learned again, though it can still be written after "Annan orsak".
Renaming or removing a reason changes no entry. "Visa alla" shows each edited entry's reason; the report shows it only
on a day it lists ("The report lists the days the balance moved").

**Why:** honesty in reporting: a time set by hand comes with why, so the owner and the boss can trust it. A short list
keeps the reason one click and keeps notes readable; a required free text after "Annan orsak" stops it becoming an empty
way past the field. The closed field keeps the edit uncluttered, and with the field in the list there is no second
control to open and confirm. Greying the chosen reason in place and ordering by letter keep the list still, so each
reason stays where the hand remembers it. Stored text keeps old entries as they were given, as settings that change from
a date leave past days alone. Counting the free texts turns "this keeps coming up" into a reason with no step of the
owner's, and the pen fixes its wording where it appeared; the list is touched a few times a year, so it lives where
reasons are chosen. A divided part saying what divided it explains itself where the chosen reason, about the new entry,
would not. A break found afterwards is among the commonest fixes, so "Glömd paus" starts on the list rather than waiting
to be counted, and "Glömd post" with it for a whole forgotten entry. A reason on an unchanged entry explains overtime to
the boss where it is read, and leaves the mark, which is about times set by hand, honest.

**Rejected:** a free-text note alone: notes decay into "fix" and a full stop. Keeping every edit's reason: more than
honesty needs, as with old times. A reason for undo: it changes nothing that was true. The reasons ordered by how often
they are chosen: the list would reshuffle as habits change, and with a handful of reasons the most used one at the top
saves nothing. A reason for deleting: a deleted entry can only lower the hours, at most like a day never clocked, which
needs no reason either, and nothing is left to carry it. The list always open on the line: clutter. Fuzzy matching of
the free texts, for typos and other wordings: plain counting is enough for one person's notes. A separate text field
opened by "Annan orsak": it hung under the list with no way to confirm it, stayed after another reason was chosen, and
opened again empty. A typed reason cut after three words: words vary in length, so the field's width did too. The chosen
reason taken out of the list: the reasons below it would move up a row. The typed reason edited in the closed field
itself: one field would both open the list and take typing. Remembering the last reason for the next edit: not asked
for; see "Revisit if". An "Orsaker" tab in the menu, adding, renaming and removing reasons and listing the texts that
keep coming up with their counts: a whole tab for a list touched a few times a year. A greatest number of reasons: one
would have to be pushed out when another is learned. Removing a reason with a button of its own: emptying the line
already says it, and asks once. Learning a removed reason again: the entries that taught it would bring it straight
back.

**Revisit if:** picking the same reason for several edits in a row becomes tedious, or near-identical free texts keep
slipping past the count.

**Cases:**

- Enter in an empty "Annan orsak": no reason; the confirm stays greyed out.
- "Hämtade nycklar hos rektorn" typed: the confirm lights at the first letter, and the underline grows with each letter
  and shrinks with each one deleted; Enter shows it cut with "…" at the length of "Glömde stämpla ut".
- That text, then "Fel profil" chosen and the list opened again: the slot shows the text; clicked, it opens with it.
- Esc while typing: the text from before the click comes back, and the edit stays open.
- A reason longer than the popup typed: only its own text scrolls left, the other reasons stay; Enter cuts it with "…"
  at the length of "Glömde stämpla ut"; clicked again, it opens to the whole text.
- "Möte" typed and kept: its underline is as long as "Möte".
- "Fel profil" chosen and the list opened again: "Fel profil" is greyed in its place, and a click on it does nothing.
- The pen on "Ärende", the text changed to "fel profil", Enter: refused, "Orsaken finns redan"; Esc: "Ärende" as it was.
- The pen on "Glömd post", the text emptied, Enter: "Ta bort?" in red; Enter again: the reason is gone; a click outside
  instead: "Glömd post" as it was.
- The pen on the chosen reason, renamed: the picker shows the new name, still chosen.
- Six reasons: the list shows all seven lines with "Annan orsak" and does not scroll; a seventh reason learned: it
  scrolls, seven lines in view.
- An edit undone: no reason is asked for.
- An entry deleted: "Ta bort?", and no reason.
- An entry moved from janitor work to the development group: the confirm waits for a reason, such as "Fel profil".
- A break changed from 20 to 35 min in the edit: the confirm waits for a reason, such as "Glömd paus".
- The starting list, opened: "Fel profil", "Glömd paus", "Glömd post", "Glömde stämpla in", "Glömde stämpla ut",
  "Ärende", "Annan orsak".
- A clicked entry given only "Stannade kvar och monterade barngrind hos Bantis": no "e"; "Visa alla" shows the text
  alone.
