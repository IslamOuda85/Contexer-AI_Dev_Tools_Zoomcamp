export type Mission = {
  id: string;
  level: number;
  title: string;
  brief: string;
  goal: string;
  skill: string;
  hints: string[];
};

export const missions: Mission[] = [
  {
    id: "m1",
    level: 1,
    title: "Say it clearly",
    brief:
      "Zigo just booted up. He takes every word literally and fills any blank with the most boring default.",
    goal: "Get Zigo to write a birthday message for your friend Maya, who loves rock climbing and turns 30.",
    skill: "Specificity — name the who, the what and the details.",
    hints: [
      "Say exactly what artifact you want (a message, how long).",
      "Give the facts Zigo cannot guess: name, age, interests.",
    ],
  },
  {
    id: "m2",
    level: 2,
    title: "Give him a role",
    brief: "Zigo answers like a generic search engine unless you tell him who he should be.",
    goal: "Get Zigo to explain why the sky is blue to a curious 7-year-old, in under 60 words.",
    skill: "Role + audience + constraints.",
    hints: [
      "Assign Zigo a persona ('act as a science teacher for kids').",
      "State the audience and a hard limit (word count).",
    ],
  },
  {
    id: "m3",
    level: 3,
    title: "Shape the output",
    brief: "Zigo will happily hand you a wall of text. Tell him the shape you need.",
    goal: "Get Zigo to produce a 3-day Lisbon itinerary for a budget traveller who hates museums.",
    skill: "Output format + constraints + exclusions.",
    hints: [
      "Ask for a specific structure (day headings, bullets, times).",
      "State the budget and what to avoid.",
    ],
  },
  {
    id: "m4",
    level: 4,
    title: "Feed the context",
    brief: "Zigo knows nothing about your world. Everything he needs must be in the prompt.",
    goal: "Get Zigo to write a polite email declining a job offer while keeping the door open for future roles.",
    skill: "Context: situation, relationship, tone, desired outcome.",
    hints: [
      "Explain your situation and why you're declining.",
      "Specify tone, length, and the outcome you want from the reader.",
    ],
  },
  {
    id: "m5",
    level: 5,
    title: "Show, don't tell",
    brief: "Zigo copies patterns better than he follows adjectives. Give him an example.",
    goal: "Get Zigo to turn 5 messy product notes into consistent one-line marketing taglines.",
    skill: "Few-shot examples + explicit rules.",
    hints: [
      "Include one worked example of input → desired output.",
      "State the rules: length, tone, forbidden words.",
    ],
  },
  {
    id: "m6",
    level: 6,
    title: "Make him think",
    brief: "For tricky work, tell Zigo how to work, not just what to make.",
    goal: "Get Zigo to review a pricing decision: 3 options, trade-offs, and a recommendation with reasoning.",
    skill: "Process instructions, evaluation criteria, self-checking.",
    hints: [
      "Tell Zigo the steps to take before answering.",
      "Define the criteria he should judge against, and ask him to flag assumptions.",
    ],
  },
];
