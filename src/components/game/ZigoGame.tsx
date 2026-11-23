import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Send, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";
import { missions } from "@/lib/missions";
import { askZigo, type ZigoResult } from "@/lib/zigo.functions";
import zigoImg from "@/assets/zigo.png";

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="font-mono text-signal">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-signal transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone: "muted" | "signal" }) {
  return (
    <div className="mt-4">
      <p
        className={`font-mono text-[11px] uppercase tracking-widest ${
          tone === "signal" ? "text-signal" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <textarea
        readOnly
        value={value}
        rows={8}
        className="mt-1.5 w-full resize-y rounded-2xl border border-border bg-surface-2 p-4 font-mono text-xs leading-relaxed text-foreground/90 outline-none"
      />
    </div>
  );
}

function rank(score: number) {
  if (score >= 85) return { label: "Expert prompter", tone: "text-signal" };
  if (score >= 65) return { label: "Solid operator", tone: "text-signal" };
  if (score >= 40) return { label: "Getting warmer", tone: "text-accent" };
  return { label: "Beginner signal", tone: "text-destructive" };
}

export function ZigoGame() {
  const [index, setIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<ZigoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [best, setBest] = useState<Record<string, number>>({});

  const run = useServerFn(askZigo);
  const mission = missions[index]!;
  const totalXp = Object.values(best).reduce((a, b) => a + b, 0);

  async function send() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await run({
        data: {
          missionTitle: mission.title,
          missionGoal: mission.goal,
          missionSkill: mission.skill,
          level: mission.level,
          prompt: prompt.trim(),
        },
      });
      setResult(res);
      setBest((b) => ({ ...b, [mission.id]: Math.max(b[mission.id] ?? 0, res.score) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zigo went offline. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function goTo(i: number) {
    setIndex(i);
    setPrompt("");
    setResult(null);
    setError(null);
    setShowHints(false);
  }

  return (
    <section id="play" className="mx-auto w-full max-w-6xl px-5 pb-24">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {missions.map((m, i) => {
          const active = i === index;
          const scored = best[m.id];
          return (
            <button
              key={m.id}
              onClick={() => goTo(i)}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                active
                  ? "border-signal bg-signal text-signal-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              LV{m.level}
              {scored !== undefined && !active ? ` · ${scored}` : ""}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          XP <span className="text-accent">{totalXp}</span>
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        {/* Mission brief */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-panel">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Mission {mission.level} of {missions.length}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{mission.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission.brief}</p>

          <div className="mt-5 rounded-2xl border border-border bg-surface-2 p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-signal">Your goal</p>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{mission.goal}</p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            <span className="text-foreground">Skill:</span> {mission.skill}
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            <span className="text-foreground">Weak prompt example:</span> “{mission.weakExample}”
          </p>

          <button
            onClick={() => setShowHints((s) => !s)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Lightbulb className="size-3.5" />
            {showHints ? "Hide hints" : "Need a hint?"}
          </button>
          {showHints && (
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {mission.hints.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-accent">›</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex items-end gap-4 border-t border-border pt-6">
            <img
              src={zigoImg}
              alt="Zigo the robot"
              width={816}
              height={816}
              loading="lazy"
              className="size-28 shrink-0 animate-float object-contain drop-shadow-[0_10px_30px_oklch(0.8_0.14_194/0.25)]"
            />
            <p className="pb-3 font-mono text-xs leading-relaxed text-muted-foreground">
              Zigo is listening.
              <br />
              He knows only what you type.
            </p>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
            <label
              htmlFor="prompt"
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
            >
              Prompt → Zigo
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send();
              }}
              rows={7}
              placeholder="Write your prompt here. Beginners write one line. Experts give role, context, format and constraints…"
              className="mt-2 w-full resize-none rounded-2xl border border-input bg-surface-2 p-4 font-mono text-sm leading-relaxed text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:shadow-glow"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                {prompt.trim().split(/\s+/).filter(Boolean).length} words · ⌘/Ctrl + Enter
              </span>
              <button
                onClick={() => void send()}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {loading ? "Zigo is processing" : "Send to Zigo"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-display text-4xl font-bold text-signal">
                    {result.score}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">/100</span>
                  <p className={`text-sm font-semibold ${rank(result.score).tone}`}>
                    {rank(result.score).label}
                  </p>
                </div>
                <p className="font-mono text-xs text-accent">{result.verdict}</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Meter label="Clarity" value={result.scores.clarity} />
                <Meter label="Context" value={result.scores.context} />
                <Meter label="Constraints" value={result.scores.constraints} />
              </div>

              {result.coach && (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{result.coach}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" /> Try again
                </button>
                {index < missions.length - 1 && (
                  <button
                    onClick={() => goTo(index + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    Next mission <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-side: your path vs the ideal path */}
      {result && (
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Side by side</p>
          <h3 className="mt-1 text-xl font-bold">Your path vs. the ideal path</h3>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-panel">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Your path
              </p>
              <Field label="Your prompt" value={prompt} tone="muted" />
              <Field label="What Zigo executed" value={result.reply} tone="muted" />
            </div>

            <div className="rounded-3xl border border-signal/40 bg-surface p-5 shadow-panel">
              <p className="font-mono text-[11px] uppercase tracking-widest text-signal">
                Ideal path
              </p>
              <Field label="Perfectly-structured prompt" value={result.upgrade} tone="signal" />
              <Field label="What Zigo returns" value={result.upgradeReply} tone="signal" />
              <button
                onClick={() => setPrompt(result.upgrade)}
                className="mt-3 font-mono text-[11px] text-signal underline underline-offset-4"
              >
                Load ideal prompt into my terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
