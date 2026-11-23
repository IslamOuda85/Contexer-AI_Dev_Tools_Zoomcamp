import { createFileRoute } from "@tanstack/react-router";
import zigoImg from "@/assets/zigo.png";
import { ZigoGame } from "@/components/game/ZigoGame";
import { missions } from "@/lib/missions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Contexer — Learn Prompt Engineering by Playing with Zigo" },
      {
        name: "description",
        content:
          "Contexer is a prompt engineering game. Brief Zigo, a literal-minded AI robot, and level up from vague beginner prompts to expert context-rich ones.",
      },
      { property: "og:title", content: "Contexer — Learn Prompt Engineering by Playing" },
      {
        property: "og:description",
        content:
          `Prompt Zigo the robot through ${missions.length} missions and get scored on clarity, context and constraints.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-display text-lg font-bold tracking-tight">
          contexer<span className="text-signal">.</span>
        </span>
        <a
          href="#play"
          className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Start playing
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Prompt engineering, as gameplay
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">
            Teach a robot what
            <br />
            you actually mean.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Meet <span className="text-foreground">Zigo</span> — an AI model you can only reach
            through prompts. Say too little and he guesses. Give him role, context, format and
            constraints and he becomes brilliant. {missions.length} missions turn that gap into a skill.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#play"
              className="rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-opacity hover:opacity-90"
            >
              Contact Zigo
            </a>
            <span className="rounded-full border border-border px-6 py-3 font-mono text-xs text-muted-foreground">
              beginner → expert · {missions.length} levels
            </span>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              ["Clarity", "Is the task unambiguous?"],
              ["Context", "Does Zigo know your world?"],
              ["Constraints", "Format, tone, limits."],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="font-mono text-xs uppercase tracking-widest text-signal">{t}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 -z-10 rounded-full bg-signal/15 blur-3xl" />
          <img
            src={zigoImg}
            alt="Zigo, the friendly retro-futuristic AI robot of Contexer"
            width={816}
            height={816}
            className="w-64 animate-float object-contain sm:w-80"
          />
        </div>
      </section>

      <ZigoGame />

      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted-foreground">
        contexer — the skill of saying exactly what you mean.
      </footer>
    </main>
  );
}

