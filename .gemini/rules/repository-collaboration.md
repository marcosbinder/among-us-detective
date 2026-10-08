# Repository Collaboration & Branching Rules

## CRITICAL SAFETY DIRECTIVE:
1. **NEVER PUSH DIRECTLY TO `main` OR `master`**:
   - Under NO circumstances may the assistant or developer run `git push origin master` or `git push origin main`.
   - The primary branches (`main`, `master`) are protected and maintained exclusively by the upstream owner (Alexandre / atlesque).

2. **ALL WORK IN DEDICATED FEATURE BRANCHES**:
   - Every change, enhancement, refactor, or fix must be committed onto dedicated branches (e.g., `feature/v2`, `fix/...`).
   - All contributions to the main repository must be submitted strictly via **Pull Requests (PRs)**.

3. **COLLABORATION ETIQUETTE & PERMISSIONS**:
   - Never merge PRs, delete remote branches, or alter upstream repository settings without explicit consent from Alexandre.
   - All PRs must have clean, documented descriptions, atomic commits, passing test suites, and zero regressions.
   - After addressing code review requests, push the updates, comment politely on the PR, and allow the maintainer (Alexandre) to review and perform the merge.

4. **UPSTREAM CODE REVIEW INVARIANTS (See gemini.md)**:
   - **PR Scope Discipline**: Never bundle unrelated fixes into a feature PR. Keep PRs strictly atomic.
   - **Speech Recognition (STT)**: Always ignore `event.error === 'aborted'` on normal stop in Web Speech API handlers.
   - **PWA Prompts**: Always expose `canPrompt` and provide graceful fallback hints when install prompts are unavailable (Safari, Firefox).
   - **Analytics**: Use `useGtag()`, never duplicate events.
   - **Translations**: Never cross-reuse keys from unrelated domains; always maintain 100% key parity across all 6 locales.
   - **Language**: English-only for all code comments, identifiers, commits, and PR descriptions.
