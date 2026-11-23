# Contexer agent instructions

Contexer is an English-language prompt-engineering learning game. The current code is an early TanStack Start/React prototype; [project_plan.md](project_plan.md) is the intended product behavior, [backlog.md](backlog.md) is the ordered work, [docs/agent-team.md](docs/agent-team.md) defines handoffs, and [README.md](README.md) distinguishes implemented from planned features. Read those files and the current [2026 course rubric](https://github.com/DataTalksClub/ai-dev-tools-zoomcamp/blob/main/project/README.md) before changing scope.

## Working process

- The project manager owns the problem statement, backlog, dependency order, and acceptance criteria. Its project-scoped definition is [.codex/agents/project_manager.toml](.codex/agents/project_manager.toml). Use it for substantial planning or backlog changes.
- An engineer implements one bounded backlog task at a time and keeps the project runnable.
- A separate QA review checks behavior against acceptance criteria and records evidence. Define specialized engineer and QA agents when those roles enter active work.
- Keep repository documentation and user-facing product text in English. Explain planning changes to the owner in the language of the conversation.
- Distinguish current behavior from planned behavior. Do not claim a feature, test, GitHub issue, deployment, or AI evaluation exists without checking it.
- Keep API keys and user prompts out of source control and telemetry. AI calls must originate on the server. Authorize private data access in the server and database.
- Before publishing work, run the relevant build, lint, and tests when available. Document any missing command or failed check.
- Avoid rewriting published Git history. Keep changes small and reviewable, especially while Lovable synchronization may apply.

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
