import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";

const supabaseUrl = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const appUrl = process.env.APP_URL ?? "http://127.0.0.1:8080";
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error("Set SUPABASE_PUBLISHABLE_KEY before running the local spike check.");

async function account() {
  const email = `spike-${randomUUID()}@example.test`;
  const password = `Local-${randomUUID()}!`;
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`Local signup failed (${response.status}).`);
  const signup = await response.json();
  if (signup.access_token) return signup.access_token;
  const login = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`Local login failed (${login.status}).`);
  const session = await login.json();
  assert.equal(typeof session.access_token, "string");
  return session.access_token;
}

const [firstToken, secondToken] = await Promise.all([account(), account()]);
const note = `Private row ${randomUUID()}`;
const created = await fetch(`${appUrl}/api/spike`, {
  method: "POST",
  headers: { Authorization: `Bearer ${firstToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ note }),
});
assert.equal(created.status, 201, "First account should create a row through the app server.");
const [row] = await created.json();
assert.equal(row.note, note);
assert.equal(typeof row.owner_id, "string", "Created row must include its owner ID.");

const own = await fetch(`${appUrl}/api/spike`, {
  headers: { Authorization: `Bearer ${firstToken}` },
});
assert.equal(own.status, 200);
assert((await own.json()).some((item) => item.id === row.id));

const other = await fetch(`${appUrl}/api/spike`, {
  headers: { Authorization: `Bearer ${secondToken}` },
});
assert.equal(other.status, 200);
assert(!(await other.json()).some((item) => item.id === row.id));

const direct = await fetch(`${supabaseUrl}/rest/v1/private_spike_rows?id=eq.${row.id}&select=id`, {
  headers: { apikey: key, Authorization: `Bearer ${secondToken}` },
});
assert.equal(direct.status, 200);
assert.deepEqual(await direct.json(), [], "RLS must hide the first account's row.");

const forged = await fetch(`${supabaseUrl}/rest/v1/private_spike_rows`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${secondToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ owner_id: row.owner_id, note: "Forged ownership" }),
});
assert(!forged.ok, "RLS must reject a second account writing as the first account.");

const anonymous = await fetch(`${appUrl}/api/spike`);
assert.equal(anonymous.status, 401);
console.log(
  "B-04 private-row write, read, cross-account isolation, and anonymous rejection passed.",
);
