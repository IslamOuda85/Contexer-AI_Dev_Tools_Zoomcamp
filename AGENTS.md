# Contexer agent instructions

Contexer is an English-language prompt-engineering learning game. The current code is an early TanStack Start/React prototype; [project_plan.md](project_plan.md) is the intended product behavior, [backlog.md](backlog.md) is the ordered work, [docs/agent-team.md](docs/agent-team.md) defines handoffs, and [README.md](README.md) distinguishes implemented from planned features. Read those files and the current [2026 course rubric](https://github.com/DataTalksClub/ai-dev-tools-zoomcamp/blob/main/project/README.md) before changing scope.

## Essential local commands

Use Node.js 24 or newer. From this repository directory, run `npm install --legacy-peer-deps --no-package-lock` for the current prototype, then `npm run dev` to serve it locally. Check a change with `npm run check:missions` for mission content, `npm run lint` for source lint, `npx tsc --noEmit` for types, and `npm run build` for a production build. There is no automated unit or integration test command yet; see [README.md](README.md) for setup limits and do not report these checks as tests that do not exist.

## Working process

- The project manager owns the problem statement, backlog, dependency order, and acceptance criteria. Its project-scoped definition is [.codex/agents/project_manager.toml](.codex/agents/project_manager.toml). Use it for substantial planning or backlog changes.
- The [software engineer](.codex/agents/software_engineer.toml) implements one bounded backlog task at a time, keeps the project runnable, and reviews code at each meaningful stage against reproducibility, scalability, security, integrity, modularity, and product relevance.
- The [designer](.codex/agents/designer.toml) prepares a blue/dark-blue, implementation-ready visual brief for learner-facing changes, including typography, color relationships, components, responsive states, and accessibility. The owner decides product direction.
- The independent [QA engineer](.codex/agents/qa_engineer.toml) judges each acceptance check against observed behavior and reports `PASS`, `FAIL`, or `BLOCKED`. It checks data security, service integrity, functionality, and failure resilience within the issue scope, without editing the code it reviews.
- The [UI/UX learner-trial agent](ui-ux-engineer.md) tests the actual learner journey and records experience feedback separately from QA and code review.
- Follow the routing graph and handoff contract in [docs/agent-team.md](docs/agent-team.md): PM grooms, designer briefs visual changes, engineer implements, QA verifies, failed checks return to engineering, and the owner reviews before closure. A blocked check is never counted as a pass.
- Keep repository documentation and user-facing product text in English. Explain planning changes to the owner in the language of the conversation.
- Distinguish current behavior from planned behavior. Do not claim a feature, test, GitHub issue, deployment, or AI evaluation exists without checking it.
- Keep API keys and user prompts out of source control and telemetry. AI calls must originate on the server. Authorize private data access in the server and database.
- Before publishing work, run the relevant build, lint, and tests when available. Document any missing command or failed check.
- Avoid rewriting published Git history. Keep changes small and reviewable, especially while Lovable synchronization may apply.

The Lovable warning below was inherited with the prototype. Verify whether this GitHub repository is still connected to Lovable before relying on synchronization; keep the history precaution in either case.

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
