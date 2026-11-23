# B-04 local auth and database spike

This is a narrow integration check, not the learner account or attempt-history feature. The app exposes `POST /api/spike` and `GET /api/spike`. Both require a Supabase access token; the server verifies it with Auth, then forwards the same token to PostgREST. Row-level security on `private_spike_rows` enforces ownership in PostgreSQL. The route never uses a service-role key.

## Provisional architecture decision

Use Supabase Auth and PostgreSQL for identity and private data. Keep authorization in database RLS and verify bearer tokens with Auth in the server route. Use the Supabase local Docker stack for the B-04 proof and a hosted Supabase project later. The app Dockerfile is for local reproducibility; Vercel remains a proposed production host until its TanStack Start adapter is verified. The selected public hostname is `contexer.owda.io`; no DNS or production service has been configured. Revisit this decision if the local two-account check or Vercel adapter proof fails.

Production prerequisites to verify in B-15: a Vercel-compatible server build instead of the inherited Cloudflare Nitro preset; hosted Supabase project and applied migrations; server environment values for the hosted Supabase URL and publishable key; a server-only OpenAI key once B-07 replaces Lovable; a development deployment before production promotion; and a `contexer.owda.io` DNS record using the project-specific target returned by [Vercel domain verification](https://vercel.com/docs/domains/set-up-custom-domain). If `owda.io` DNS is managed in Cloudflare, create the record there and verify domain ownership and HTTPS in Vercel. Do not commit keys or infer a DNS target before the Vercel project exists.

## Local setup

Prerequisites: Node.js 24+, Docker Desktop running, and the Supabase CLI installed. The CLI's default `supabase start` uses Docker for local Auth and PostgreSQL. Install the CLI as documented by Supabase; no CLI package has been added to this repository yet.

1. Start the local services from the repository root with `supabase start`. The migration in `supabase/migrations/` creates the test table and its RLS policies.
2. Run `supabase status` and copy only the local API URL and publishable/anon key into your ignored `.env` as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. Keep the existing `OPENAI_API_KEY` private. Never copy the service-role key into the browser or repository. `.env.example` contains placeholders only.
3. Start the app with `npm run dev` for a direct local check, or `docker compose up --build` for the containerized app. Compose connects to the Docker-hosted Supabase API through `host.docker.internal`. The local Supabase stack must start first.
4. With the app on `http://127.0.0.1:8080`, run `node --env-file=.env scripts/check-private-spike.mjs`. It creates two disposable local accounts, writes and reads one row through the app server, and checks that the second account and an anonymous visitor cannot read it. It also checks PostgreSQL RLS directly. The script prints no passwords, tokens, or keys.

Stop the app with Ctrl+C or `docker compose down`; stop local Supabase services with `supabase stop`. The test accounts and row are local test data. Reset them with `supabase db reset` only when intentionally clearing the local database.

## Current evidence and open checks

- `npx tsc --noEmit` and `npm run build` pass with the spike route.
- `docker compose config --quiet` passes when a placeholder publishable key is supplied for configuration validation.
- Local Docker Engine is available, but the container build stopped while downloading the BuildKit image. Supabase CLI installation failed in npm with `Invalid Version`, and a temporary `npx` invocation did not finish. The owner is installing the CLI locally. The two-account test must run successfully before B-04 can receive QA PASS.
- B-13 must later make **the app and its Auth/database services** start with one documented command. `supabase start` followed by `docker compose up` is currently two commands and does not yet satisfy that criterion.
- The current production build defaults to a Cloudflare Nitro preset inherited from Lovable. B-04 must record a verified Vercel adapter decision before using Vercel for production.
