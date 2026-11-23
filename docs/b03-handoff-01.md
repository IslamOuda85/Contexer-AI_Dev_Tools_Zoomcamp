# B-03 handoff 01 — agent workflow to independent QA

- **Issue:** [B-03 / #3](https://github.com/IslamOuda85/Contexer-AI_Dev_Tools_Zoomcamp/issues/3)
- **Date:** 2026-11-23
- **Sender → recipient:** coordinating agent → QA engineer
- **Outcome sought:** Verify the project-scoped roles, durable context, and graph handoff process against every B-03 acceptance check in [backlog.md](../backlog.md).

## Change evidence sent to QA

- Added [QA](../.codex/agents/qa_engineer.toml) and [designer](../.codex/agents/designer.toml) agent definitions. The designer follows the owner's blue/dark-blue direction. QA is independent from engineering and reports PASS, FAIL, or BLOCKED with observed evidence.
- Updated the existing [PM](../.codex/agents/project_manager.toml), [engineer](../.codex/agents/software_engineer.toml), and [learner-trial](../.codex/agents/ui_ux_engineer.toml) agents to use the shared handoff contract.
- Updated [AGENTS.md](../AGENTS.md) with role boundaries, security rules, and concrete local commands; updated [the team process](agent-team.md) with issue selection, routing, return paths, and stop rules. Linked the team from [README.md](../README.md) and aligned [backlog.md](../backlog.md).
- The unrelated local `public/favicon.ico` change was not made for B-03 and must be excluded from this review and commit.

## Checks and limits

- `git diff --check` passed for tracked edits. This checks whitespace only.
- The Python TOML parser was unavailable locally because the Python launcher attempted a blocked runtime download. The agent definitions need either a local TOML parser or manual syntax review; do not claim a parser pass.
- No application behavior, paid AI call, live authentication, or deployment is part of B-03. This handoff asks QA to review documentation and agent routing, not to certify the future application.

## QA request and next action

Inspect every B-03 criterion independently. Record a verdict and evidence in [the QA report](qa-b03-review-01.md). Send a failing criterion with reproduction to the coordinator for correction, then recheck it. Return a final verdict and coverage limits to the owner; only then decide whether B-03 can be closed.

## Owner review

On 2026-11-24, the owner approved the B-03 changes after reviewing the result. The independent QA report records `QA: PASS` for all five acceptance checks. This approval permits the coordinating agent to close B-03; it does not certify future application security or deployment behavior.
