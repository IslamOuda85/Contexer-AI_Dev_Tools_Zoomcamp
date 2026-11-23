# Contexer Backlog

This is the local source of truth for planned work. It is based on [project_plan.md](project_plan.md) and the [current 2026 final-project rubric](https://github.com/DataTalksClub/ai-dev-tools-zoomcamp/blob/main/project/README.md). Documentation and GitHub issues are in English for peer reviewers. The priorities are: pass the course, make the app worth showing publicly, then add advanced operations work.

**GitHub status:** The public repository has 19 tasks with verified GitHub issue URLs in the table below. Run `./scripts/publish-backlog.ps1` with GitHub CLI authenticated after adding a task to create or reuse its issue and update the table; never infer an issue number from its backlog ID. An agent starting an item should link its issue in the work branch or PR and record what acceptance checks it ran. The project manager keeps this file and GitHub issues synchronized.

| ID | Issue | Phase | Depends on | GitHub issue |
| --- | --- | --- | --- | --- |
| B-01 | Document the product and public task process | Pass | — | [#1](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/1) |
| B-02 | Complete ten mission scenarios and rubrics | Pass | B-01 | [#2](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/2) |
| B-03 | Define agent roles and durable project context | Pass | B-01 | [#3](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/3) |
| B-04 | Prove auth, database, and host integration | Pass | B-01 | [#4](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/4) |
| B-05 | Add sign-in and protected account access | Pass | B-04 | [#5](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/5) |
| B-06 | Persist private attempts and progress | Pass | B-04, B-05 | [#6](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/6) |
| B-07 | Run the learner prompt through OpenAI | Pass | B-02, B-04 | [#7](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/7) |
| B-08 | Version and store independently executed references | Pass | B-02, B-07 | [#8](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/8) |
| B-09 | Evaluate checklist evidence and compute score | Pass | B-02, B-07, B-08 | [#9](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/9) |
| B-10 | Complete the learning loop in the UI | Pass | B-05–B-09 | [#10](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/10) |
| B-11 | Add limits, usage records, and admin dashboard | Pass | B-05, B-06, B-07 | [#11](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/11) |
| B-12 | Add unit, frontend, and integration tests | Pass | B-07–B-11 | [#12](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/12) |
| B-13 | Start the full local system with one Docker-based command | Pass | B-04–B-06 | [#13](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/13) |
| B-14 | Run CI checks on every pull request | Pass | B-12, B-13 | [#14](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/14) |
| B-15 | Publish the app and document rollback | Pass | B-10–B-14 | [#15](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/15) |
| B-16 | Instrument the attempt journey | Showcase | B-07, B-10, B-15 | [#16](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/16) |
| B-17 | Alert on failed learner attempts | Showcase | B-16 | [#17](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/17) |
| B-18 | Demonstrate a bounded on-call responder | Advanced | B-17 | [#18](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/18) |
| B-19 | Verify submission evidence and complete peer reviews | Submission | B-15–B-18 | [#19](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/19) |

## Pass: product, application, and delivery

### B-01 — Document the product and public task process

**Outcome:** A reviewer can understand the problem, users, expected behavior, system boundary, and development process without reading implementation code.

**Boundary:** Update README and product documentation; make the public repository and issue tracker usable. Do not implement features in this item.

**Acceptance checks:**

- README states the problem, the ten-mission learning loop, expected behavior, proposed architecture, and current limitations.
- `project_plan.md` holds acceptance criteria and records provisional decisions as such.
- Public GitHub issues use this backlog's IDs and link back to the plan; the backlog contains verified issue URLs after publication.
- At least one subsequent agent task or PR explicitly cites and updates its issue, proving the tracker is used.

**Evidence:** Public README, plan, issue index, and an agent/PR reference to an issue. **Rubric:** Problem Description; Product Specification.

### B-02 — Complete ten mission scenarios and rubrics

**Outcome:** Every mission gives the learner enough information to succeed, and grading is tied to visible requirements.

**Boundary:** Mission content, examples, reference prompts, and rubric definitions. No live model calls yet.

**Acceptance checks:**

- All ten cards provide goals, facts, hints, a short weak example, and a reviewed strong reference prompt.
- Mission 4 includes a fictional job-offer situation; Mission 5 supplies five notes; Mission 6 supplies three pricing options; Missions 7–10 cover source grounding, clarification, critique, and instruction boundaries.
- Each rubric element has a unique ID, description, weight, and critical flag. Weights total 100 per mission.
- Each mission has reviewed weak, partial, and strong prompt fixtures with expected checklist outcomes.
- The reference remains hidden until the first attempt; examples do not reveal the full answer beforehand.

**Evidence:** [Learner mission cards](src/lib/missions.ts), [rubrics, references, and fixtures](src/lib/mission-specs.server.ts), [content review](docs/mission-content-review.md), and `npm run check:missions`. Actual reference responses and evaluator results belong to B-08/B-09. **Rubric:** Product Specification; Application; Testing.

### B-03 — Define agent roles and durable project context

**Outcome:** An agent can find the right context, understand its role, and leave work that another agent can verify.

**Boundary:** Project instructions and team process. No code changes.

**Acceptance checks:**

- `AGENTS.md` describes Contexer, essential commands, relevant docs, security boundaries, and Git practices; preserve the Lovable published-history warning while applicable.
- Define project manager, designer, engineer, independent QA, and learner-trial responsibilities with project-scoped agent files; the designer follows the owner's blue/dark-blue direction.
- Document the routing graph: PM grooming, design brief for visual work, engineering, independent QA, failure return to engineering, blocked-work escalation, and owner review before closure.
- The process explains how agents choose an issue, report assumptions, record acceptance evidence, and hand off for independent review.
- Instructions link to modular documents instead of duplicating the full plan.

**Evidence:** `AGENTS.md`, agent definitions, team/process document, one recorded agent handoff and independent QA verdict. **Rubric:** Agent Team Specification; Context Management.

### B-04 — Prove auth, database, and host integration

**Outcome:** The proposed stack is validated before the application depends on it.

**Boundary:** A small technical spike and architecture decision record for TanStack Start, Supabase Auth/PostgreSQL, local Docker services, and Vercel. Do not migrate the entire app here.

**Acceptance checks:**

- A minimal signed-in server request reads and writes a private database row locally.
- A second account cannot read it.
- Local services can be started in a documented, repeatable way; identify any gap to the course's one-command container criterion.
- Record the deployment target, the owner's selected production hostname `contexer.owda.io`, its DNS prerequisites, and necessary configuration, with no secrets committed.

**Evidence:** Spike code or branch, local run notes, access-control check, architecture decision. **Rubric:** Application; Containerization; Deployment.

### B-05 — Add sign-in and protected account access

**Outcome:** Live AI requests belong to identified learners; visitors can inspect a precomputed demonstration.

**Boundary:** Registration/sign-in/sign-out, session handling, and protected routes/server actions. No mission scoring.

**Acceptance checks:**

- An anonymous visitor can view the demonstration but cannot make a live AI request.
- A learner signs in and out, and private actions reject anonymous requests at the server boundary.
- Account and administrator roles are distinguished server-side.
- The README explains local auth setup and how to use a test account.

**Evidence:** Auth flow demo and authorization tests. **Rubric:** Application; Testing.

### B-06 — Persist private attempts and progress

**Outcome:** A learner's attempts survive reload and later sign-in without becoming visible to other users.

**Boundary:** Database schema, migrations, access policies, attempt history, best score, and deletion. AI responses may be fixtures at this stage.

**Acceptance checks:**

- An attempt stores mission/reference version, prompt, response, checklist status, score, feedback, and timestamps.
- Reopening the app shows earlier attempts and the best score; deleting history removes it from learner views and storage according to the documented policy.
- Cross-account reads and writes are rejected, including direct server calls.
- Migrations and seed data reproduce the schema in local and hosted environments.

**Evidence:** Migration files, data-flow test, cross-account test, deletion test. **Rubric:** Application; Testing; Containerization.

### B-07 — Run the learner prompt through OpenAI

**Outcome:** Zigo's displayed answer is the model's real response to the learner prompt, not an intentionally staged wrong answer.

**Boundary:** Replace the Lovable gateway in the server-only learner execution path. No grading or reference generation here.

**Acceptance checks:**

- Only a signed-in, quota-eligible user may submit; the server accepts a mission ID and at most 800 prompt characters.
- Mission facts and criteria are loaded server-side, not trusted from client-supplied text.
- The OpenAI key stays server-side; output is concise and bounded.
- Errors and configured retries produce clear states and measurable usage records; no routine test spends API credit.

**Evidence:** Server integration, redacted response sample, validation and error tests. **Rubric:** Application; Testing.

### B-08 — Version and store independently executed references

**Outcome:** The comparison uses a real response to a reviewed reference prompt and stays stable across learner attempts.

**Boundary:** Reference execution, review, versioning, and storage for ten fixed missions.

**Acceptance checks:**

- Each mission has an approved reference prompt and a response produced in an isolated model request.
- Reference text records the mission and model version; changing either requires review and a new reference version.
- Normal learner attempts reuse the approved reference and do not regenerate it.
- The complete reference is unavailable to a learner before that learner's first attempt.

**Evidence:** Versioned reference records and a test showing reuse. **Rubric:** Application; Testing.

### B-09 — Evaluate checklist evidence and compute score

**Outcome:** The learner receives a percentage backed by mission-specific evidence and two useful next steps.

**Boundary:** Second AI request for semantic checklist evaluation, output validation, deterministic score computation, and feedback formatting.

**Acceptance checks:**

- Evaluator returns present/partial/missing for every rubric element with concise support; synonyms can satisfy an element.
- Server computes weighted 0–100 score and applies provisional pass rule: at least 80% and all critical elements present.
- Feedback has at most two actionable points and does not claim a difference unsupported by the two observed responses.
- Invalid or incomplete evaluator output fails safely; reviewed fixtures produce expected results.

**Evidence:** Rubric fixtures, calculation tests, evaluated examples. **Rubric:** Application; Testing.

### B-10 — Complete the learning loop in the UI

**Outcome:** A learner can see the effect of a revision and understand why a prompt improved.

**Boundary:** Mission UI, counter, loading/errors, checklist, side-by-side comparison, retry, and history presentation. Keep backend calls centralized.

**Acceptance checks:**

- UI shows `x / 800`, blocks over-limit submission, and preserves the user's text when a request fails.
- First successful attempt reveals the actual response, rubric evidence, score, concise feedback, and the reference prompt/response.
- A retry appears alongside the previous attempt and updates best score without erasing history.
- Core flow works on mobile and desktop and has accessible labels/status messages.

**Evidence:** Frontend tests and a short screen recording or screenshots of first attempt and retry. **Rubric:** Application; Testing.

### B-11 — Add limits, usage records, and admin dashboard

**Outcome:** Free use stays within the owner's budget, and the owner can see who consumed it.

**Boundary:** Daily quota, global cap/pause, token and estimated cost ledger, and administrator UI. No payment features.

**Acceptance checks:**

- Default limit is provisionally five live attempts per account per day; concurrent requests cannot bypass it.
- Track learner and evaluator calls separately, including reported input/output tokens, model, failure/retry status, and estimated cost.
- Admin can see aggregate and per-user daily attempts/cost and pause new calls; ordinary users cannot access admin data.
- Low balance, quota exhaustion, and API failure produce distinct user-visible states; billed failed requests are not silently omitted.

**Evidence:** Quota concurrency test, ledger examples, admin authorization test, dashboard screenshot. **Rubric:** Application; Testing; Alerting on User Impact (only if an actual alert is added later).

### B-12 — Add unit, frontend, and integration tests

**Outcome:** Core product behavior and permissions can be independently verified without spending API credit.

**Boundary:** Test setup, fixtures, commands, and documented coverage for existing behavior.

**Acceptance checks:**

- One command runs unit and integration tests; frontend tests cover the counter, result states, and retry.
- Unit tests cover weighted scoring, critical requirements, validation, and cost calculation.
- Integration tests cover auth boundaries, persistence, quota, and the end-to-end submission path with a controlled AI fixture.
- All tests pass in CI and the README states the exact commands.

**Evidence:** Test files, clean test run, CI artifact. **Rubric:** Testing; Application.

### B-13 — Start the full local system with one Docker-based command

**Outcome:** A reviewer can run the application and its persistent database locally without undocumented manual steps.

**Boundary:** Container build, database/auth runtime, startup orchestration, seed/migration path, and instructions.

**Acceptance checks:**

- One documented command starts the app and required local database/auth services via Docker or Docker Compose.
- Starting from a clean checkout applies migrations and reaches a usable health state.
- The reviewer can create an account and complete the controlled or live main flow with documented environment variables.
- No API secrets are included in images or committed files.

**Evidence:** Docker configuration and a clean-machine start log or reproducible demo. **Rubric:** Application; Containerization.

### B-14 — Run CI checks on every pull request

**Outcome:** A failing change is visible before merge or deployment.

**Boundary:** GitHub Actions for install, lint/typecheck, tests, and build.

**Acceptance checks:**

- CI runs on every PR; one passing and one intentionally failing run demonstrate the gate.
- Tests use fixtures, so CI does not use paid model calls.
- README links or points to CI status and explains the gate.

**Evidence:** Workflow file and public check runs. **Rubric:** CI/CD; Testing.

### B-15 — Publish the app and document rollback

**Outcome:** Reviewers can access a working deployment and see how updates reach production safely.

**Boundary:** Hosted database and app, domain, environment configuration, dev deployment, manual production promotion, rollback, and verification.

**Acceptance checks:**

- `contexer.owda.io` serves the app and a reviewer can complete the main flow with a test account; include a link from the owner's `owda.io` project collection when that collection's location is confirmed.
- Passing CI deploys to development; production deployment requires an explicit manual promotion.
- A documented rollback restores a previous working version in a demonstration or rehearsal.
- README documents URLs and setup without exposing credentials.

**Evidence:** Public URL, deployment history, pipeline run, rollback record. **Rubric:** Deployment; CI/CD.

## Showcase and advanced operations

### B-16 — Instrument the attempt journey

**Outcome:** An operator can trace a learner-visible failed attempt across request, model call, and save.

**Boundary:** Structured logs, traces, metrics, collection/storage, and a viewable dashboard. Exclude prompt text and credentials.

**Acceptance checks:**

- A key submission journey emits metrics, traces, and structured logs with one shared trace ID.
- Signals are collected and visible in an operator UI, with an example trace documented.
- A data review verifies that prompt content, account secrets, and API keys are absent from telemetry.

**Evidence:** Dashboard screenshot, example trace, redacted log, data review. **Rubric:** Observability.

### B-17 — Alert on failed learner attempts

**Outcome:** An operator learns when users cannot complete the core journey.

**Boundary:** One actionable alert and reproducible trigger; not generic CPU monitoring.

**Acceptance checks:**

- A threshold for failed submissions or unacceptable latency is documented and enabled.
- A controlled failure triggers the alert and links to relevant traces or logs.
- Recovery clears or resolves the alert and is recorded.

**Evidence:** Alert rule, trigger demo, alert and recovery screenshots. **Rubric:** Alerting on User Impact.

### B-18 — Demonstrate a bounded on-call responder

**Outcome:** A limited agent receives the alert, diagnoses a controlled incident, performs an approved repair action, and verifies recovery.

**Boundary:** One reproducible incident and one narrowly allowed repair action. Do not give the agent blanket production write access.

**Acceptance checks:**

- Alert delivery wakes the agent; its tools, permissions, and repair action are documented.
- The agent records evidence for its diagnosis, performs the bounded fix, and checks that the user journey works again.
- Failed or ambiguous diagnosis stops safely and surfaces the need for human action.

**Evidence:** Alert-to-agent trace, action log, before/after journey proof, permission note. **Rubric:** On-Call Agent; Agent Team Specification.

### B-19 — Verify submission evidence and complete peer reviews

**Outcome:** The project can be evaluated against the current rubric and meets the course participation requirement.

**Boundary:** Submission audit and course-platform peer-review workflow; no new feature work unless a genuine gap is found.

**Acceptance checks:**

- Re-read the published rubric and check each criterion against a public artifact or URL.
- Verify the clean local run, tests, deployment, CI/CD, traces, alert, and responder evidence.
- Confirm current deadline and complete three required peer reviews through the course platform.

**Evidence:** Submission checklist with links and course-platform peer-review confirmations. **Rubric:** All 12 criteria; peer-review requirement.

## Open decisions to resolve during discovery

- Confirm the exact sign-in method and production email delivery setup during B-04/B-05.
- Validate that the proposed Supabase local stack plus app meets the course's single-command Docker criterion during B-04/B-13; change the integration plan if it does not.
- Tune the provisional 80% threshold and five-attempt daily quota using reviewed examples and observed API cost during B-02/B-09/B-11.
- Choose a safe, demonstrable responder action only after the deployed failure modes are known in B-16/B-18.
