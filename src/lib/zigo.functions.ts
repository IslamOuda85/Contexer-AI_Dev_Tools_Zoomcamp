import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { missions, PROMPT_MAX_CHARS } from "@/lib/missions";

const Input = z.object({
  missionId: z.string().min(1).max(16),
  prompt: z.string().trim().min(1).max(PROMPT_MAX_CHARS),
});

export type ZigoResult = {
  reply: string;
  score: number;
  scores: { clarity: number; context: number; constraints: number };
  verdict: string;
  coach: string;
  upgrade: string;
  upgradeReply: string;
};

const SYSTEM = `You are the engine of "Contexer", a game that teaches prompt engineering.

The player writes a prompt to ZIGO, a literal-minded AI robot. You must do TWO jobs:

1) ROLEPLAY ZIGO. Answer the player's prompt exactly as literally as it was written.
   - Vague prompt => produce a bland, generic, comically off-target or wrongly-assumed answer,
     and let Zigo mention the assumptions he had to invent.
   - Detailed prompt with role/context/format/constraints => produce a genuinely excellent, on-target answer.
   - Zigo's voice: warm, beepy, slightly deadpan robot. Keep the reply under 160 words.
     Never coach the player inside the reply.

2) GRADE the prompt against the mission goal, 0-100 total, from three sub-scores 0-100:
   clarity (is the task and desired artifact unambiguous?),
   context (are the facts, audience, situation and role Zigo cannot guess supplied?),
   constraints (format, length, tone, exclusions, examples, success criteria).
   Be a strict but fair teacher. A one-line vague prompt scores under 35.
   A prompt that nails role + context + format + constraints scores 85+.

3) DEMONSTRATE THE IDEAL PATH. Write the perfect, expert-level prompt for this mission ("upgrade"),
   then roleplay Zigo answering THAT prompt ("upgradeReply") — a genuinely excellent, on-target,
   well-structured answer that obeys every constraint of the ideal prompt. Same Zigo voice, under 220 words.

Return ONLY JSON: {"reply":string,"score":number,"scores":{"clarity":number,"context":number,"constraints":number},"verdict":string,"coach":string,"upgrade":string,"upgradeReply":string}
- verdict: max 10 words, e.g. "Zigo guessed. Badly."
- coach: 2-3 sentences of concrete feedback naming what was missing or strong.
- upgrade: a rewritten, expert-level version of the player's prompt for this mission, no more than 800 characters.
- upgradeReply: Zigo's response to that ideal prompt.`;

export const askZigo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<ZigoResult> => {
    const mission = missions.find((item) => item.id === data.missionId);
    if (!mission) throw new Error("Unknown mission.");

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `MISSION (level ${mission.level}): ${mission.title}
GOAL THE PLAYER MUST ACHIEVE: ${mission.goal}
SKILL BEING TAUGHT: ${mission.skill}

PLAYER'S PROMPT TO ZIGO:
"""
${data.prompt}
"""

Respond with the JSON object.`,
          },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Zigo is overheating (rate limit). Try again shortly.");
    if (res.status === 402) throw new Error("Out of AI credits. Add credits to keep playing.");
    if (!res.ok) throw new Error(`Zigo failed to respond (${res.status})`);

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "";
    let parsed: Partial<ZigoResult> = {};
    try {
      parsed = JSON.parse(raw) as Partial<ZigoResult>;
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]) as Partial<ZigoResult>;
    }

    const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
    return {
      reply: parsed.reply ?? "…beep. My circuits returned static. Try that prompt again?",
      score: clamp(parsed.score),
      scores: {
        clarity: clamp(parsed.scores?.clarity),
        context: clamp(parsed.scores?.context),
        constraints: clamp(parsed.scores?.constraints),
      },
      verdict: parsed.verdict ?? "Signal unclear.",
      coach: parsed.coach ?? "",
      upgrade: parsed.upgrade ?? "",
      upgradeReply: parsed.upgradeReply ?? "",
    };
  });
