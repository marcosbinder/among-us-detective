# Among Us Detective — Master Features Backlog & Technical Implementation Specification

This document serves as the single source of truth for all planned features, architectural improvements, and backlog items accumulated across all development phases of **Among Us Detective**.

---

## 📌 Master Index & Priority Roadmap

### 🚀 Immediate Priorities (Phase 1 — Core Investigative Experience)
1. [Feature 1: Round Timeline & Match Snapshot Architecture (`New Round` & `New Match`)](#feature-1-round-timeline--match-snapshot-architecture)
2. [Feature 2: Top Bar Modernization & Tasks Relocation to Info Toolbar](#feature-2-top-bar-modernization--tasks-relocation-to-info-toolbar)
3. [Feature 3: Card Context Menu Polish & Direct Mobile "Mark as Dead"](#feature-3-card-context-menu-polish--direct-mobile-mark-as-dead)
4. [Feature 4: Dual Notes Architecture (Round Notes History + Match Notes) & Multilingual Speech](#feature-4-dual-notes-architecture-round-notes-history--match-notes--multilingual-speech)
5. [Feature 5: Per-Round Interactive Map Pins & One-Click Pin Reset](#feature-5-per-round-interactive-map-pins--one-click-pin-reset)
6. [Feature 6: Tasks Modal as Reference Guide & Visual Task Badges](#feature-6-tasks-modal-as-reference-guide--visual-task-badges)
7. [Feature 7: Full Rewrite of `HelpModal.vue` with Visual Images & Diagrams](#feature-7-full-rewrite-of-helpmodalvue-with-visual-images--diagrams)
8. [Feature 8: About Modal Modernization with Marcos Binder GitHub & Credits](#feature-8-about-modal-modernization-with-marcos-binder-github--credits)
9. [Feature 9: Legacy Cleanup — Removal of `CrewStats.vue`](#feature-9-legacy-cleanup--removal-of-crewstatsvue)
10. [Feature 10: Architectural Polish — Global Dark Mode on `<html>` & Memory Leak Audit](#feature-10-architectural-polish--global-dark-mode-on-html--memory-leak-audit)

### 🔮 Secondary Backlog (Phase 2 — Specialized Modes & Expansion)
11. [Feature 11: Dedicated Impostor Mode & Stealth HUD Workspace](#feature-11-dedicated-impostor-mode--stealth-hud-workspace)
12. [Feature 12: Audio & Sensory Feedback System (Web Audio API)](#feature-12-audio--sensory-feedback-system-web-audio-api)
13. [Feature 13: Full Playwright E2E Test Suite Modernization](#feature-13-full-playwright-e2e-test-suite-modernization)
14. [Feature 14: Match State Export/Import & Full Session Recovery](#feature-14-match-state-exportimport--full-session-recovery)
15. [Feature 15: Mobile Touch Gestures & Haptic Feedback Polish](#feature-15-mobile-touch-gestures--haptic-feedback-polish)

---

## Feature 1: Round Timeline & Match Snapshot Architecture

### 🎯 Purpose & User Story
In Among Us, games progress in cycles: **from match start to Meeting 1 (Round 1), Meeting 1 to Meeting 2 (Round 2), Meeting 2 to Meeting 3 (Round 3)...**
Detectives need to recall:
- *"Who was where in Round 1 before the first body was reported?"*
- *"Who was I suspecting back in Round 1 vs. who was cleared later in Round 3?"*

#### Core Mechanics:
1. **`New Round`**:
   - Closes the current round and creates a deep-copy **Snapshot** of the board state (cards, roles, columns, notes, map coordinates).
   - Round 2 starts with an exact copy of Round 1's final state (dead stay dead, confirmed deductions stay, unconfirmed stay in place).
   - The user can modify Round 2 without modifying Round 1.
2. **Timeline Navigation Bar**:
   - Selector buttons in the top area: `[ R1 ] [ R2 ] [ R3 ] ... [ Live ]`
   - Clicking an earlier round puts the board into a read-only historical inspection view so the player can analyze past deductions and map positions.
3. **Contradiction & Evolution Badges**:
   - When viewing an older round (e.g. Round 1), if Red was in "Suspicious" in Round 1 but is now in "Hard Clear" in Live round, show an evolution tag on Red's card: `Now: Hard Clear`.
   - Allows detectives to spot lies and shifting alibis over time.
4. **Dead Across Rounds & "Died in Round X"**:
   - Dead players remain dead throughout all subsequent rounds.
   - Cards display a subtle badge: `Died R1` or `Died R2`.
   - Players who died in earlier rounds are excluded from the active draggable map roster for subsequent rounds.
5. **`New Match`**:
   - Replaces the ambiguous `New Game`.
   - Clears all round history snapshots, resets all players to `Unknown`, revives dead, clears round/match notes.
   - **Crucial**: Preserves the active player lobby roster (`isActive`) and custom names so players don't have to reconfigure their lobby between matches.

### 🏗️ Technical Architecture

#### Pinia Store: `app/stores/rounds.ts`
```typescript
export interface RoundSnapshot {
  roundNumber: number
  timestamp: number
  columns: {
    hardClear: CrewMember[]
    trusted: CrewMember[]
    unknown: CrewMember[]
    suspicious: CrewMember[]
    impostor: CrewMember[]
    dead: CrewMember[]
  }
  roundNotes: string
  mapPins: Record<string, { x: number; y: number; room?: string }>
}

export const useRoundsStore = defineStore('rounds', () => {
  const currentRoundNumber = ref(1)
  const viewingRoundNumber = ref<number | null>(null) // null = Live
  const roundHistory = ref<RoundSnapshot[]>([])

  const isViewingHistory = computed(() => viewingRoundNumber.value !== null)

  function startNewRound(currentBoardState: Omit<RoundSnapshot, 'roundNumber' | 'timestamp'>) {
    // 1. Push snapshot of completed round
    roundHistory.value.push({
      roundNumber: currentRoundNumber.value,
      timestamp: Date.now(),
      ...JSON.parse(JSON.stringify(currentBoardState))
    })
    // 2. Increment round counter
    currentRoundNumber.value += 1
    viewingRoundNumber.value = null
  }

  function viewRound(roundNum: number | null) {
    viewingRoundNumber.value = roundNum
  }

  function startNewMatch() {
    currentRoundNumber.value = 1
    viewingRoundNumber.value = null
    roundHistory.value = []
  }

  return {
    currentRoundNumber,
    viewingRoundNumber,
    roundHistory,
    isViewingHistory,
    startNewRound,
    viewRound,
    startNewMatch,
  }
}, { persist: true })
```

---

## Feature 2: Top Bar Modernization & Tasks Relocation to Info Toolbar

### 🎯 Purpose & User Story
The top bar currently looks outdated with legacy buttons (`Tasks`, `Notes`, `New round`, `New game`).
- **Relocate `Tasks`**: Tasks is not an active per-game input (players don't tick checkboxes during meetings); it is a reference guide. Move it to the bottom toolbar beside `Settings`, `Help`, `About`.
- **Modern Action Controls**:
  - Clean, sleek header bar.
  - Left: `Notes (N)` button with keyboard shortcut badge.
  - Center: Round Timeline indicator `[ Round 1 ] [ + New Round ]`.
  - Right: `New Round` (meeting complete) and `New Match` (new lobby game).

---

## Feature 3: Card Context Menu Polish & Direct Mobile "Mark as Dead"

### 🎯 Purpose & User Story
On mobile and split-screen, double-clicking to mark a player dead is unreliable on touch screens, and dragging a card all the way down to the Dead column requires excessive finger movement.
- **Card Popover / Context Menu**:
  - Add a direct, prominent button in the popover:
    `💀 Mark as Dead` (or `❤️ Revive` if already dead).
  - Add `Died in Round X` badge when dead.
  - Instant toggle without requiring drag-and-drop.

---

## Feature 4: Dual Notes Architecture (Round Notes History + Match Notes) & Multilingual Speech

### 🎯 Purpose & User Story
- **Match Notes (General)**: Persistent across all rounds of the match (general playstyles, lobby rules).
- **Round Notes**: Bound directly to the active round snapshot!
  - When inspecting past Round 1, the user reads the exact notes written during Round 1.
  - When starting a new round, Round Notes start fresh for Round 2 while Round 1 notes remain stored in the Round 1 snapshot.
- **Speech-to-Text Multi-Language**:
  - Support Portuguese (`pt-BR`), English (`en-US`), Spanish (`es-ES`), etc.
  - Configurable in Settings or auto-detected from browser locale.

---

## Feature 5: Per-Round Interactive Map Pins & One-Click Pin Reset

### 🎯 Purpose & User Story
- Instead of moving whole deduction cards to the map, clicking or dragging a player drops a **location pin (x, y)** onto the map room.
- Each round maintains its own map pin snapshot!
  - Round 1 map shows sightings from Round 1.
  - Round 2 map starts fresh or with surviving players.
  - Players who died in Round 1 cannot be dropped onto Round 2's map.
- **"Clear Map Pins" button (🧹)**: One-click wipe for current round sightings without touching deduction columns.

---

## Feature 6: Tasks Modal as Reference Guide & Visual Task Badges

### 🎯 Purpose & User Story
- Tasks modal relocated to bottom reference bar.
- Functions as an encyclopedic reference guide for all 5 maps.
- **Visual Tasks Highlighted**: Amber `👁️ VISUAL` badge (MedBay Scan, Asteroids, Prime Shields, Trash).
- **Common Tasks Highlighted**: Blue `🔑 COMMON` badge (Card Swipe, Wiring).

---

## Feature 7: Full Rewrite of `HelpModal.vue` with Visual Images & Diagrams

### 🎯 Purpose & User Story
- Reintroduce illustrative screenshots and diagrams explaining the modern UI.
- Explain:
  1. Match Roster & ME Badge.
  2. 6-Column Deduction Board.
  3. Role Popover & Verification (`?` Claimed vs `✓` Verified).
  4. Round Timeline & Snapshots.
  5. Interactive Map Pins.
  6. Notes & Keyboard Shortcuts (`N`, `M`, `Esc`).

---

## Feature 8: About Modal Modernization with Marcos Binder GitHub & Credits

### 🎯 Purpose & User Story
- Update `AboutModal.vue` to prominently credit Marcos Binder alongside original author Atlesque.
- Add GitHub profile link (`https://github.com/marcosbinder`).
- Keep donation button, feedback form, and changelog/roadmap tabs.

---

## Feature 9: Legacy Cleanup — Removal of `CrewStats.vue`

### 🎯 Purpose & User Story
- Delete `app/components/CrewStats.vue`.
- Remove `<CrewStats ... />` block from `index.vue`.
- Eliminates the outdated per-player row table that conflicted with the 6-column deduction system.

---

## Feature 10: Architectural Polish — Global Dark Mode on `<html>` & Memory Leak Audit

### 🎯 Purpose & User Story
- Move `.dark-mode` class from root `<div>` to `<html>` via `useHead()` in `app/app.vue`.
- Ensures all Teleported modals and popovers (`<Teleport to="body">`) automatically receive dark mode styles.
- Audit all `window.addEventListener` in `index.vue`, `Maps.vue`, `PlayerCard.vue` to guarantee clean removal on `onUnmounted`.

---

## Feature 11: Dedicated Impostor Mode & Stealth HUD Workspace (Backlog)

### 🎯 Purpose & User Story
*Scheduled for development after Phase 1 core detective features are finalized.*
- Kill Cooldown Timer (10s–35s) with sound and visual alert.
- Fellow Impostor teammates highlight with red glowing aura and roles (Shapeshifter, Phantom, Viper).
- Fake Tasks Advisor (safe tasks vs visual tasks warning).
- Scapegoat & Frame Target planner.

---

## Feature 12: Audio & Sensory Feedback System (Web Audio API) (Backlog)
- Offline synth audio beeps and chimes via Web Audio API.
- Meeting alert, Kill Cooldown ready sound, body discovery cues.
- Toggle switch and volume in Settings.

---

## Feature 13: Full Playwright E2E Test Suite Modernization (Backlog)
- Modernize `game-flow.spec.ts`, `player-color.spec.ts`, and `settings.spec.ts` to match modern selectors.

---

## Feature 14: Match State Export/Import & Full Session Recovery (Backlog)
- Export deduction board as text report or JSON.
- Complete session recovery across browser refreshes.

---

## Feature 15: Mobile Touch Gestures & Haptic Feedback Polish (Backlog)
- Haptic vibration on card actions (`navigator.vibrate(50)`).
- Viewport safe area padding for notched mobile displays.

---

## Feature 16: Modernize & Improve Disclaimer (`app/pages/disclaimer.vue`)
### 🎯 Purpose & User Story
- Replace outdated 2020 text on `/disclaimer` with a modern, authoritative, and reassuring explanation.
- Detail 100% compliance with Innersloth's Companion & Modding policy:
  - This is an external digital companion notepad.
  - Zero memory reading, zero injection, zero file manipulation.
  - Safe and legal for standard online play.
- Implement responsive dark mode card UI with clear typographic hierarchy and return button.

---

## Feature 17: Help Modal & Tutorial Video/Visual Walkthrough Overhaul (`app/components/HelpModal.vue`)
### 🎯 Purpose & User Story
- Update `HelpModal.vue` and media assets with re-recorded video demonstrations reflecting v2.0 improvements.
- Step-by-step guidance for players:
  - Setting up the 18-player roster and picking your color.
  - How to log claims and roles during discussions.
  - Explaining the vital difference between **"Next Round (Meeting ended)"** (saving snapshot of current meeting) and **"New Match (Reset game)"** (starting a brand new game).
  - How to drop room pins on interactive maps.

---
*Maintained by Marcos Binder for Among Us Detective.*
