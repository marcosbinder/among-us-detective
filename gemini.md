# Directives & Code Review Guidelines (Upstream Standards)

These guidelines document key architecture and collaboration rules based on upstream reviews by Alexandre (`atlesque`). Follow these strictly to prevent review rejections:

## 1. Strict PR Scope Discipline
- **One Concern per PR**: Never bundle unrelated fixes (e.g. Workbox Service Worker crashes, Speech Recognition improvements) into a feature PR (e.g. Settings PWA button).
- Keep PRs strictly scoped to the exact issue being addressed. If a runtime crash or peripheral bug is identified during development, create a separate branch and PR (`fix/...`) so it can be reviewed and tested independently.

## 2. Web Speech API (STT) Invariants
- **Ignore `event.error === 'aborted'`**:
  In Chromium and Web Speech API implementations, stopping recording intentionally via `speechRecognition.abort()` or `stop()` fires an error event where `event.error === 'aborted'`.
  Always check:
  ```ts
  else if (event.error !== 'aborted') {
    speechError.value = t('notes.speechError.startFailed')
  }
  ```
  Never treat `aborted` as a user-facing failure.
- **Audio Device Release**:
  When checking microphone permissions via `getUserMedia`, release all tracks immediately and introduce a brief delay (~80ms) before starting `SpeechRecognition` to allow OS audio drivers (e.g. Windows WASAPI) to release the hardware handle cleanly.

## 3. PWA Installation & Reactive `canPrompt`
- **Never Assume Prompt Availability**:
  Browsers like iOS Safari and desktop Firefox never fire `beforeinstallprompt`. Chromium also clears the event once a prompt is dismissed or cancelled.
- **Always Expose `canPrompt`**:
  `usePwaInstall` must expose a reactive `canPrompt` ref.
  In UI buttons:
  - If `isAppInstalled || isStandalone`: Show disabled "Installed" state with checkmark.
  - If `!isAppInstalled && canPrompt`: Show active "Install as app" action button.
  - If `!canPrompt`: Gracefully disable the action button and display a fallback instructional hint (e.g. *"Use your browser menu (Add to Home Screen) to install"*).

## 4. Analytics Hygiene (`useGtag`)
- **Use Official Composables**: Always send Google Analytics events using the project's standard `useGtag()` composable, never direct `window.gtag` calls.
- **No Duplicate Logging**: Log `pwa_installed` only once via the native `appinstalled` window listener. Do not log duplicate events inside prompt resolution promises.

## 5. Localization & Translation Integrity
- **No Cross-Domain Key Reusing**: Do not reuse translation keys across unrelated domains (e.g. using `notepad.dismissError` for a PWA install dialog close button). Always create dedicated domain keys (e.g. `pwa.close`).
- **100% Locale Parity**: Always maintain identical key structure across all 6 supported locales (`en-US`, `pt-BR`, `es-ES`, `fr-FR`, `de-DE`, `ko-KR`). Always run `npm run check:locale-parity` before committing.

## 6. PR Descriptions & Changelog Accuracy
- **Reflect Actual Code**: PR descriptions and changelog entries must only claim features that are actually implemented in that PR.
- **No Inaccurate Claims**: Never reference legacy assumptions that do not exist in the base branch (e.g. do not claim removal of a 3-day cooldown if the base branch had no such cooldown).

## 7. Codebase Language Consistency
- **English-Only Comments & Identifiers**: All source code comments, variable names, and commit messages must be in English to match the upstream repository conventions.
