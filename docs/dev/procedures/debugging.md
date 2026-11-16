# Debugging

The order of a bug hunt and the tools for it. Read in debug mode. What debug mode is, and who commits the fix, is in
`AGENTS.md`; tools not installed yet are in `codebase-ideas.md`.

## The hunt

1. **Reproduce it as a test,** and see it fail for the bug's reason before any code changes. When the bug came from a
   real day, start from that day's copy of the record (in `copies/`, beside the record) and replay it in a test. The
   committed test keeps only the entries the bug needs, written with the helpers in `tests/helpers/`, since the record
   stays on the owner's machines. A bug that cannot be reproduced is reported as such, with what was tried; it is not
   fixed by a guess.
2. **Find the cause from evidence:** read the code the test runs through, add temporary logging or set breakpoints, and
   run the test again. Name the cause and the evidence for it. Temporary logging is removed before the fix is done.
3. **Fix only what the evidence points at,** and see the test pass. Then run the checks for the change ("Commands" in
   `AGENTS.md`).
4. **The test stays,** named for the rule the bug broke, so the bug cannot come back unseen.

## When the cause will not show

Reach for these in order, the cheapest first:

1. **`git bisect run`** with the failing test, to find the commit that broke it.
2. **Property-based testing,** when the bug is "sometimes wrong": state the rule and let the tool try hundreds of inputs
   and shrink a failure to the smallest one.
3. **Coverage and mutation testing,** to find the paths no test reaches and the tests that check nothing.

A tool that is not installed is code to add, and is asked for first.
