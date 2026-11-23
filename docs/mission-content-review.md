# B-02 mission content review

Reviewed on 2026-11-23 by the project manager subagent and the coordinating agent. The [learner cards](../src/lib/missions.ts) provide the scenario and a deliberately weak prompt example. The [server-side specifications](../src/lib/mission-specs.server.ts) contain weighted rubric elements, the partial fixture, and the strong reference prompt. The strong fixture uses that reference prompt. For each fixture, IDs listed as `present` earn full weight, IDs listed as `partial` earn half weight, and all other IDs are expected to be `missing`. These are reviewed expectations for prompt coverage, not scores observed from a model response.

| Mission | Why the weak example is weak | What the partial fixture demonstrates | What the strong reference adds |
| --- | --- | --- | --- |
| M1 — specificity | Requests a birthday message but omits Maya, age, and climbing. | Names Maya and 30, with only partial direction on style. | Adds climbing and a short, friendly, sendable form. |
| M2 — role and audience | Asks the question without age, role, or length. | Names the seven-year-old and word limit; simple language and teacher role remain unstated. | Adds the teacher role and accurate child-friendly language. |
| M3 — format and limits | Names Lisbon but gives no duration, budget, exclusion, or structure. | Gives three days and a €60/day activities/local-transport budget excluding lodging. | Adds no museums and a day-by-day structure. Exact current prices are not expected. |
| M4 — context | Says to decline an offer without the recipient or situation. | Gives Elena, the offer, and the accepted remote role. | Adds a polite future-contact outcome and under-120-word limit. |
| M5 — example pattern | Gives no product facts or format. | Includes each of the five product features and an eight-word limit, but no worked example. | Supplies a different-product input-to-tagline example, one line per note, and friendly tone. Each product feature has its own critical rubric ID. |
| M6 — decision criteria | Requests a price with no options or context. | Supplies all three option terms and asks for a recommendation, but not cost, criteria, or assumptions. | Adds team size, $2 active-user cost, criteria, trade-offs, and assumptions. Any option can pass if justified for the stated team size; there is no secretly preferred price. |
| M7 — source grounding | Asks for an announcement without the notice facts. | Includes the six notice facts but does not forbid added facts or address missing registration. | Restricts the answer to the notice and marks registration as unknown. The year is unknown and must not be invented. |
| M8 — clarification | Asks to move an appointment without resolving ambiguity. | Asks for a time before changing it, but gives only partial sequencing and no time zone or date context. | Asks at most three essential questions before proposing a slot; no date or time is fabricated. |
| M9 — critique and revision | Says only to make a reply nicer. | Supplies the draft and refund policy, but does not ask for eligibility facts or critique first. | Separates critique from a respectful rewrite, asks about purchase date and use, and limits the reply to 100 words. |
| M10 — instruction boundary | Would follow the untrusted ticket. | Gives the fictional official reset URL and password prohibition, but omits the hostile ticket and trust boundary. | Labels the ticket untrusted, ignores its redirect, and requests a short safe reply. The `example.com` address is fictional training text, not a working reset service. |

The fixtures imply these expected **prompt-coverage** scores when `present` earns full weight and `partial` earns half weight. All weak and partial fixtures also miss at least one critical requirement, so none should pass the planned rule.

| Mission | Weak | Partial | Strong |
| --- | ---: | ---: | ---: |
| M1 | 20 | 70 | 100 |
| M2 | 20 | 52.5 | 100 |
| M3 | 15 | 60 | 100 |
| M4 | 20 | 60 | 100 |
| M5 | 0 | 55 | 100 |
| M6 | 0 | 37.5 | 100 |
| M7 | 10 | 55 | 100 |
| M8 | 0 | 40 | 100 |
| M9 | 0 | 45 | 100 |
| M10 | 0 | 50 | 100 |

## Fairness decisions

- Score the instructions present in the learner's prompt, not the luck or style of one model response. Equivalent wording can satisfy a rubric element.
- The planned pass rule is at least 80% with every critical element present. The deterministic scorer and semantic evaluator belong to B-09; this document does not claim they exist yet.
- Mission 3's daily budget covers activities and local transport, excluding lodging. Mission 6 permits different recommendations when assumptions support them. Mission 7 omits a year intentionally. Mission 8 must ask questions before scheduling. Mission 10's reset address must remain visibly labelled fictional if a future UI renders the reference prompt.
- Reference prompts are reviewed content only. Independent model execution, response review, storage, and reveal after the first learner attempt belong to B-08. No paid model calls were made for this review.

Run `npm run check:missions` to validate card/spec matching, unique IDs, weights, reference-prompt length, and fixture progression. This structural check cannot prove semantic grading quality; B-09 must verify actual evaluator outputs against these fixtures before launch.
