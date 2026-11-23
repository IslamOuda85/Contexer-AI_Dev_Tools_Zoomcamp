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
        content: `Prompt Zigo the robot through ${missions.length} missions and get scored on clarity, context and constraints.`,
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
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-6">
        <span className="font-display text-lg font-bold tracking-tight">
          contexer<span className="text-signal">.</span>
        </span>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
            Teach a robot what
            <br />
            you actually mean.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Contexer teaches prompt engineering through short challenges. Write instructions for
            Zigo, inspect his answer and feedback, then improve your prompt to see what changes.
          </p>
          <div className="mt-8">
            <a
              href="#play"
              className="inline-flex rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-opacity hover:opacity-90"
            >
              Start chatting with Zigo
            </a>
          </div>
          <section
            aria-labelledby="how-to-play"
            className="mt-9 max-w-xl rounded-2xl border border-border bg-surface p-5"
          >
            <h2 id="how-to-play" className="text-base font-semibold">
              How to play
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "Choose a level and read the task.",
                "Write a prompt that tells Zigo what you need.",
                "Read his answer and feedback, then revise your prompt.",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-signal/15 font-mono text-xs text-signal">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
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
