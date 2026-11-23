import { createFileRoute } from "@tanstack/react-router";

type User = { id: string };

function config() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function authorized(request: Request) {
  const settings = config();
  if (!settings) return { error: json({ error: "Database is not configured." }, 503) };
  const match = /^Bearer (.+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!match) return { error: json({ error: "Sign in required." }, 401) };
  const token = match[1];
  try {
    const response = await fetch(`${settings.url}/auth/v1/user`, {
      headers: { apikey: settings.key, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { error: json({ error: "Invalid session." }, 401) };
    const user = (await response.json()) as User;
    if (!user.id) return { error: json({ error: "Invalid session." }, 401) };
    return { settings, token, user };
  } catch {
    return { error: json({ error: "Auth service unavailable." }, 503) };
  }
}

async function rows(request: Request, method: "GET" | "POST") {
  const auth = await authorized(request);
  if (auth.error) return auth.error;
  const { settings, token, user } = auth;
  let body: string | undefined;
  if (method === "POST") {
    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return json({ error: "Invalid JSON." }, 400);
    }
    const note = (input as { note?: unknown } | null)?.note;
    if (typeof note !== "string" || note.trim().length < 1 || note.length > 200) {
      return json({ error: "Note must contain 1–200 characters." }, 400);
    }
    body = JSON.stringify({ owner_id: user.id, note: note.trim() });
  }
  try {
    const endpoint = new URL(`${settings.url}/rest/v1/private_spike_rows`);
    if (method === "GET") {
      endpoint.searchParams.set("select", "id,note,created_at");
      endpoint.searchParams.set("order", "created_at.desc");
      endpoint.searchParams.set("limit", "20");
    }
    const response = await fetch(endpoint, {
      method,
      headers: {
        apikey: settings.key,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      ...(body ? { body } : {}),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return json({ error: "Database request failed." }, 502);
    return json(await response.json(), method === "POST" ? 201 : 200);
  } catch {
    return json({ error: "Database service unavailable." }, 503);
  }
}

export const Route = createFileRoute("/api/spike")({
  server: {
    handlers: {
      GET: ({ request }) => rows(request, "GET"),
      POST: ({ request }) => rows(request, "POST"),
    },
  },
});
