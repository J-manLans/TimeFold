# Code

How the code is written and tested. Each decision follows the template in `README.md`, and is cited by its title.

## Tests come first, from the owner's rules (2026-11-14)

**Built by:** Clocking, from its first code.

**Decision:** before a piece of code is written, the owner says what must hold and what must never happen. Owner and
agent talk it through as a conversation: the agent names what it thinks is missing, and together they settle what
fits. The agreed cases are written as tests and seen to fail before the code is written. Cases agreed before their
part is built wait in the **Cases** line of the decision they mainly check. Tests are named for the rule they check,
and a test cites its decision by title only when its name cannot carry the reason. What cannot be tested
automatically, such as how something looks, is checked by hand under the phase's **Done when**.
**Why:** the rules come from the owner's working day, and a red test proves the rule is understood before the code
exists. Keeping cases under their decision means they change with it, and nothing agreed in talk is lost before its
phase.
**Rejected:** tests written after the code: they tend to check what the code does, not what the owner meant. A
separate file of cases grouped by module: the modules do not exist yet, and the cases would drift from their rules.
A sign-off checklist for cases: the workflow must not become a bottleneck. Every test citing its decision: a
well-named test already says its rule.
**Revisit if:** writing the cases first slows the work more than it saves.
