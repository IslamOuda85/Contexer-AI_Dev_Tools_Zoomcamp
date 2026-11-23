import { missions } from "../src/lib/missions.ts";
import { missionSpecs } from "../src/lib/mission-specs.server.ts";

const fail = (message) => {
  throw new Error(`Mission content: ${message}`);
};

if (missions.length !== 10 || missionSpecs.length !== missions.length) {
  fail(
    `expected ten matching mission cards and specs, got ${missions.length} and ${missionSpecs.length}`,
  );
}

const cardIds = new Set(missions.map((mission) => mission.id));
const specIds = new Set(missionSpecs.map((spec) => spec.missionId));
if (cardIds.size !== missions.length || specIds.size !== missionSpecs.length) {
  fail("mission IDs must be unique");
}

for (const [index, mission] of missions.entries()) {
  if (mission.id !== `m${index + 1}` || mission.level !== index + 1) {
    fail(`mission order or level is wrong at position ${index + 1}`);
  }
  if (
    !mission.goal ||
    !mission.brief ||
    !mission.skill ||
    !mission.weakExample ||
    mission.hints.length === 0
  ) {
    fail(`${mission.id} has an incomplete learner card`);
  }
  const spec = missionSpecs.find((item) => item.missionId === mission.id);
  if (!spec) fail(`${mission.id} has no server-side specification`);
  if (spec.version < 1 || !Number.isInteger(spec.version))
    fail(`${mission.id} has an invalid version`);
  if (spec.fixtures.weak.prompt !== mission.weakExample)
    fail(`${mission.id} weak example differs from its fixture`);
  if (!spec.referencePrompt || spec.referencePrompt.length > 800) {
    fail(`${mission.id} reference prompt must fit the planned 800-character limit`);
  }

  const ids = spec.rubric.map((item) => item.id);
  if (new Set(ids).size !== ids.length) fail(`${mission.id} has duplicate rubric IDs`);
  if (spec.rubric.reduce((sum, item) => sum + item.weight, 0) !== 100) {
    fail(`${mission.id} rubric weights must total 100`);
  }
  if (
    spec.rubric.some(
      (item) => !item.requirement || item.weight <= 0 || typeof item.critical !== "boolean",
    )
  ) {
    fail(`${mission.id} has an invalid rubric element`);
  }

  const scores = [];
  for (const label of ["weak", "partial", "strong"]) {
    const fixture = spec.fixtures[label];
    const present = fixture.present;
    const partial = fixture.partial ?? [];
    const mentioned = [...present, ...partial];
    if (new Set(mentioned).size !== mentioned.length || mentioned.some((id) => !ids.includes(id))) {
      fail(`${mission.id} ${label} fixture has duplicate or unknown rubric IDs`);
    }
    if (label !== "strong" && (!fixture.prompt || fixture.prompt.length > 800)) {
      fail(`${mission.id} ${label} fixture prompt is empty or too long`);
    }
    if (label === "strong" && (present.length !== ids.length || partial.length !== 0)) {
      fail(`${mission.id} strong fixture must cover every rubric element`);
    }
    const score = spec.rubric.reduce(
      (sum, item) =>
        sum +
        (present.includes(item.id) ? item.weight : partial.includes(item.id) ? item.weight / 2 : 0),
      0,
    );
    const everyCriticalPresent = spec.rubric
      .filter((item) => item.critical)
      .every((item) => present.includes(item.id));
    if (label !== "strong" && score >= 80 && everyCriticalPresent) {
      fail(`${mission.id} ${label} fixture unexpectedly passes the planned rule`);
    }
    scores.push(score);
  }
  if (!(scores[0] < scores[1] && scores[1] < scores[2])) {
    fail(`${mission.id} fixtures must progress from weak to partial to strong`);
  }
  console.log(`${mission.id}: weak ${scores[0]}, partial ${scores[1]}, strong ${scores[2]}`);
}

console.log(
  `Validated ${missions.length} mission cards, rubrics, reference prompts, and fixture sets.`,
);
