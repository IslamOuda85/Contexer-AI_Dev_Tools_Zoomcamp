# QA: BLOCKED — B-04 local auth, database, and host spike

- **Issue:** [B-04 / #4](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/4)
- **Sender → recipient:** independent QA → coordinating agent; runtime blockers to environment owner, documentation gap to engineer
- **Environment:** local Windows checkout, 2026-11-24. Reviewed uncommitted B-04 files. No paid AI call, production account, or live Supabase test was made.
- **Outcome sought:** Prove signed-in private database access and the proposed local/host stack before the app depends on it.

## Acceptance verdicts

| B-04 acceptance check | Verdict | Evidence and missing proof |
| --- | --- | --- |
| A signed-in server request writes and reads a private row locally. | **BLOCKED** | `src/routes/api/spike.ts` verifies a bearer token with `/auth/v1/user` and forwards it to PostgREST; the migration defines the table. The test script describes the request, but Supabase Auth/Postgres did not start and no signed-in write/read was observed. |
| A second account cannot read the first account's row. | **BLOCKED** | SQL enables RLS with an `auth.uid() = owner_id` select policy. The script now plans a second account, a direct PostgREST read, and a forged-owner insert rejection. It could not run without the local Supabase stack. The isolation claim must await observed results. |
| Local services start with repeatable documented steps, identifying the one-command gap. | **BLOCKED** | `docs/b04-local-spike.md` gives separate `supabase start` and `docker compose up --build` commands and explicitly identifies the B-13 one-command gap. Compose configuration passed with a dummy key, but image download stalled before Dockerfile execution, and the Supabase CLI was unavailable. Neither service startup was observed. |
| Deployment target, `contexer.owda.io`, DNS prerequisites, and necessary configuration are recorded without committed secrets. | **PASS (record only)** | `docs/b04-local-spike.md` now records a provisional Supabase/Vercel architecture, the selected hostname, hosted environment values, DNS verification through the project-specific target, and the inherited Cloudflare Nitro preset as an unresolved Vercel adapter proof. `.env` is ignored, `.dockerignore` excludes it, and `.env.example` has placeholders. No hosted deployment or adapter compatibility is claimed. |

## Findings and next actions

1. **High — Runtime proof is missing.** Start Supabase Auth/Postgres and the app, supply only the local publishable key in ignored `.env`, then run `node --env-file=.env scripts/check-private-spike.mjs`. Record the command, exit code, and whether both accounts were created and isolated. Do not publish tokens or keys. Re-run QA against the observed result.
2. **Medium — Vercel adapter remains unproven.** The provisional architecture decision correctly records the inherited Cloudflare Nitro preset as an unresolved risk. Verify a Vercel-compatible server build before claiming production compatibility or deploying in B-15; revise the host choice if that proof fails.
3. **Resolved test coverage gap, still unexecuted.** The engineer added a second-account direct insert with `owner_id: row.owner_id`, asserts that it fails, and checks that the created row supplies a string owner ID first. This removes the obvious false pass from an omitted owner ID. The test has not run against Supabase; no access-control behavior was observed.

## Checks and limits

- `node --check scripts/check-private-spike.mjs`: PASS after the forged-owner test was added.
- `npx tsc --noEmit`: PASS.
- `git diff --check`: PASS; Git printed only line-ending notices.
- `git check-ignore -v .env`: `.gitignore:18:.env`, confirming the local key file is excluded. I did not open `.env`.
- Parent handoff reports `npm run build`, `npm run lint` (six existing Fast Refresh warnings), `docker compose config --quiet` with a dummy key, and an offline `npm ci --dry-run` passed. I did not rerun those commands independently.
- The app returns a controlled 503 when Supabase configuration is absent, per the parent's observed HTTP request; this is not evidence that Auth or Postgres works.
- No container image build, live database, account creation, RLS enforcement, or Vercel deploy was observed. This report does not certify application-wide security or resilience.
- The intentional `public/favicon.ico` change is outside B-04 and was not reviewed or edited.

**Next recipient:** Coordinator and environment owner resolve Supabase CLI/image availability; engineer later verifies the Vercel adapter. Keep B-04 open, then request a fresh independent QA review after the live two-account check.
