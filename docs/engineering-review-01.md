# Initial software engineering review

This read-only audit of the early Lovable prototype was performed while planning B-02. It records verified code behavior and the issue where each concern belongs. It does not claim that the planned OpenAI, account, or scoring architecture is already implemented.

| Priority | Finding and evidence | Impact | Planned correction |
| --- | --- | --- | --- |
| High | The single model request in [`zigo.functions.ts`](../src/lib/zigo.functions.ts) instructs Zigo to make vague answers deliberately bad and to synthesize an ideal reply in the same call. | The UI cannot honestly present these as two independently observed outcomes. | B-07 and B-08: run the learner prompt independently and create a separately executed, reviewed reference. |
| High | The server accepts mission title, goal, skill, and level from the browser in [`zigo.functions.ts`](../src/lib/zigo.functions.ts). | A client can forge the task context used for grading. | B-07: accept a mission ID and load versioned mission data on the server. |
| High | The paid submission function has no sign-in, per-user quota, or global budget guard. | A public live endpoint could exhaust the owner's AI credit. | B-05 and B-11: require identity and enforce quota and a global pause before paid calls. |
| Medium | The server parses model JSON as a partial result and fills missing values with empty text or zero. | A malformed model response can appear as a legitimate low score. | B-09: validate structured output and distinguish evaluation failure from learner score. |
| Medium | The UI can switch missions while a request is pending in [`ZigoGame.tsx`](../src/components/game/ZigoGame.tsx). | A late result may be shown under the newly selected mission. | B-10: tie each result to its submitted mission or cancel stale requests. |
| Medium | npm scripts are documented, but the repository has `bun.lock` and no npm lockfile. | A clean npm install is not guaranteed to reproduce the same dependency versions. | B-04 and B-13: choose one package manager, commit its lockfile, and verify clean setup. |
| Medium | The repository-wide `npm run lint` reports formatting errors in files outside B-02. | CI cannot use lint as a passing gate yet, despite the B-02 files passing targeted ESLint. | B-12/B-14: format and verify the full codebase before enabling a lint gate. |
| Medium | [`error-capture.ts`](../src/lib/error-capture.ts) keeps the last error in a shared server variable. | Concurrent requests may attribute an error to the wrong user; full error details may disclose sensitive text. | B-16: use request-scoped, redacted diagnostics. |
| Low | [`zigo.functions.ts`](../src/lib/zigo.functions.ts) combines model instructions, network transport, parsing, and grading. | Later behavior is harder to test and replace independently. | B-07 to B-09: separate execution, validation, and scoring responsibilities. |

These findings are a baseline for later reviews. Recheck each one after its assigned issue is implemented and record actual test evidence. No paid model calls were used for this review.

## Follow-up after the UI revision

- The server now receives a mission ID and loads mission facts itself. It trims prompts and enforces the shared 800-character limit. This resolves the forged-mission finding above; sign-in and quota controls remain future work.
- The UI ignores a response that arrives after changing levels and displays a snapshot of the prompt actually submitted. This resolves the stale-result finding above.
- The former formatting error in `src/routes/__root.tsx` was fixed. `npm run lint` now exits successfully with six non-blocking Fast Refresh warnings. The lockfile and clean-install concern remains.
