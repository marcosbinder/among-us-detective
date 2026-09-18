# 🚀 Among Us Detective - Complete Features Roadmap & Implementation Backlog

This document serves as the single source of truth for all modernizations, features, architectural decisions, and future roadmap ideas discussed for **Among Us Detective**.

---

## 📋 Project Status & Core Principles

- **Tech Stack**: Nuxt 4, Vue 3 (`<script setup>`, Composition API), Pinia, Tailwind CSS.
- **Active Working Branch**: `dev` (Base commit: `20fb764: feat: modernize deduction board, match roster, and role popover`). `master` is preserved as the stable original.
- **Development Server**: `pnpm dev` on `http://localhost:8071/`.
- **Golden Rules**:
  1. **Strictly No Git Commits Without User Permission**: Never commit without an explicit prompt.
  2. **Real Nuxt Stack Only (`app/`)**: Never generate static standalone HTML bundles; all development stays in the Nuxt app structure.
  3. **English Code Standards**: All code identifiers, variables, store states, DOM IDs, and code comments must be strictly in English.
  4. **Zero AI Footprint**: Clean, authentic, human-like code matching the original author's philosophy.
  5. **Split-Screen First**: Optimized for split-screen window sizing (ultra-compact vertical space, zero clipped elements, fast 1-click interactions).

---

## 🏷️ Status Legend
- `[COMPLETED]` - Implemented, verified, and committed on `dev`.
- `[IN PROGRESS]` - Immediate next target for development.
- `[PLANNED - HIGH PRIORITY]` - Core roadmap items agreed upon for this development cycle.
- `[PLANNED - MEDIUM PRIORITY]` - Advanced investigation & quality-of-life tools.
- `[BACKLOG / FUTURE]` - Inclusivity, accessibility, and experimental enhancements.

---

## 1. Features Already Implemented `[COMPLETED]`

### 1.1 Match Lobby & Roster Selector (`app/components/GameRosterSelector.vue`)
- **18 Official Among Us Colors**: All colors represented by mini bean avatars with status LEDs.
- **Count Indicator**: Tracks active players out of 15 (calculates how many are not in game).
- **Responsive Sizing**: Compact 36px bean tiles on mobile (so all 18 fit in 2 rows instead of taking half the screen) and 48-54px on desktop.
- **Collapsible/Minimizable Panel**: Includes an `isMinimized` toggle button to collapse the roster mid-game and save vertical screen space.
- **Presets**: 15 Players, All 18 Players, and Clear (cleaned up obsolete 10-player button).
- **"ME" Isolation**: User's own player is prominently displayed in a `ME: (Color)` badge, cannot be deactivated, and is excluded from deduction clutter.
- **Touch Adaptation**: "Right click to set as Me" hint is displayed on PC only (`hidden md:inline`).

### 1.2 3-Column Split-Screen Deduction Board (`app/components/CrewTracker.vue`)
- **Optimized 3-Column Layout**:
  - **Coluna 1**: Hard Clear (top) & Trusted (bottom)
  - **Coluna 2**: Unknown (top) & Dead (bottom)
  - **Coluna 3**: Impostor (top) & Suspicious (bottom)
- **Zero-Clip Wrapping**: Removed rigid `overflow-hidden` and equal `flex-1` splits so 15–18 player beans wrap seamlessly into 2 or 3 rows without getting cut in half.
- **Drag-and-Drop**: Full drag-and-drop support across all 6 columns (`vuedraggable`).

### 1.3 Mobile Touch Drag-and-Drop with Finger Tracking (`app/components/CrewPool.vue`)
- **Finger Tracking Fallback**: Uses `:force-fallback="true"` and `:fallback-on-body="true"` so that during mobile dragging, the card physically follows the player's finger across the screen instead of remaining fixed.
- **Scroll Protection**: `:delay="160"` with `:delay-on-touch-only="true"` and `:touch-start-threshold="4"` prevents page scrolling from triggering accidental card drags.
- **High-Performance CSS**: `transition: none !important;` on `.sortable-fallback` ensures instantaneous 1:1 finger tracking without animation lag.

### 1.4 Compact Floating Role Popover (`app/components/PlayerCard.vue`)
- **Anchored Popover**: Small (~215px wide) floating menu anchored right next to the clicked tile (`getBoundingClientRect`), flipping to the left if near the right edge of the screen.
- **Non-Intrusive**: No full-screen dark/blurred backdrop. Screen remains 100% visible and interactive.
- **Auto-Dismiss on Scroll & Drag**: Intercepts page scroll and card drag events to immediately close the popover, preventing it from floating/following the viewport.
- **Essential Controls Only**:
  - **Header**: Bean color dot, player name, and "Set as Me" button.
  - **Crew Roles**: 5 official roles (Detective, Judge, Scientist, Engineer, Noisemaker).
  - **Impostor Roles**: 3 official roles (Shapeshifter, Phantom, Viper).
  - **Claim Status**: One-click toggle between `✓ Verified` and `? Unverified`, plus a `✕ Clear Role` button.
  - **Direct Mark as Dead / Revive**: Quick action with "Died in Round X" badge.
- **Official Local PNG Icons**: 8 official high-res PNG icons stored in `public/images/roles/` with zero external image dependencies.

### 1.5 Round Timeline & Snapshot History (`app/stores/rounds.ts`, `app/pages/index.vue`)
- **Meeting Snapshots**: Clicking "Next Round" archives complete board state into round snapshots.
- **Interactive Timeline**: Allows read-only historical inspection of past rounds to detect shifting claims and lies.
- **Contradiction Badges**: Displays current live status difference if viewing past rounds.
- **Round Ceiling**: Limited to a clean 10 rounds max with inline warning badge.

### 1.6 Modern Bottom Dock & Top Controls (`app/pages/index.vue`)
- **Top Bar**: "Next Round (Meeting ended)" and "New Match (Reset game)" clearly explained with subtitles on all screen sizes including mobile.
- **Persistent Bottom Dock**: Quick 1-click access to Notes (with hotkey [N]), Map, Tasks Reference Guide, Settings, Help, and About.

### 1.7 Detailed v2.0 Changelog (`app/components/Changelog.vue`)
- Explicitly documents both **Added Features** and **Cleaned Up / Removed Legacy Elements** (removed old modals, emojis, table layouts, redundant buttons).

---

## 2. Immediate Next Steps `[PLANNED - HIGH PRIORITY]`

### 2.1 Top Action Bar Modernization
- **File**: `app/pages/index.vue`
- **Objective**: Clean up legacy headers, remove redundant controls, and establish a compact, intuitive control panel.
- **Specification**:
  1. **Remove `PlayerSelector` Component**: Delete the legacy "My Player" dropdown and modal from the header. Player selection is already handled with 1 click in the Roster and Player Card popovers.
  2. **Remove Unused Code**: Clean up `isPlayerPickerOpen`, `handleChangePlayerColor`, and `handleTogglePlayerPicker`.
  3. **Left Utility Group**:
     - Modern `Tasks` button with clipboard icon.
     - Modern `Notes` button with notepad icon and hotkey badge `[N]`.
  4. **Right Match Controls Group**:
     - `New Round` button: Emerald/green theme, primary action button for meetings.
     - `New Game` button: Amber/orange theme, secondary action for starting fresh lobbies.
     - Clear disabled and hover states.

### 2.2 Strict Round & Game Reset Logic
- **File**: `app/stores/crew.ts`
- **Objective**: Ensure that game states transition correctly without losing vital deduction history.
- **Specification**:
  1. **`resetActiveCrew()` (`New Round` / Meeting Over)**:
     - **Dead Players Persist**: Any player with `isDead: true` or `status: 'dead'` **MUST stay dead**.
     - **Confirmed Claims Persist**: Players with `roleConfirmed === true` stay in `hard_clear` (Crew) or `impostor` (Impostor).
     - **Unconfirmed Claims Reset**: Players in `trusted` or `suspicious` whose `roleConfirmed === false` reset to `'unknown'` (since suspicion/trust was only valid for that specific round).
     - **Clear Round Protections & Accusations**: Wipes `suspectedBy` and `protectedBy` lists.
     - **Clear Map Tokens**: Automatically removes round-specific map tokens.
  2. **`resetAllCrew()` (`New Game`)**:
     - Resets all players to status `'unknown'`.
     - Revives all dead players (`isDead: false`).
     - Clears all roles and verification badges.
     - **Preserves Active Roster**: Retains active/inactive status (`isActive`) chosen in the Match Roster.
     - **Preserves Player Names**: Keeps custom player names entered in settings.

### 2.3 Modals & Dialog System Modernization
- **Files**: `app/components/Modal.vue`, `AboutModal.vue`, `SettingsModal.vue`, `Changelog.vue`, `UpcomingChangesList.vue`
- **Objective**: Elevate all dialogs to modern dark-mode standards, clean up layouts, and add proper author attributions.
- **Specification**:
  1. **`Modal.vue`**:
     - Replace legacy `bg-gray-200 text-black` with `dark:bg-gray-900 dark:text-gray-100 border border-gray-700/80 shadow-2xl backdrop-blur-sm`.
  2. **`AboutModal.vue`**:
     - Tab navigation: `Changelog` vs `Roadmap & Backlog`.
     - Footer attribution: `"Original project by Atlesque (atlesque.com). Modernized & enhanced by Marcos Binder."`
     - Retain feedback Google form embed, donation button (`DonationButton.vue`), and disclaimer link.
  3. **`Changelog.vue`**:
     - Add entries for the current modernization release (3-column board, match roster, compact popover, PNG icons, dev branch).
     - Dark-mode friendly styling (`dark:bg-gray-800 dark:text-gray-200`).
  4. **`UpcomingChangesList.vue`**:
     - Update with the current roadmap items (Impostor Mode, Map Location Pins, Dual Notes, Timeline Review).
  5. **`SettingsModal.vue`**:
     - Redesign from dated HTML `<table>` into responsive setting cards with toggle switches:
       - Show players as: Color names vs Icons.
       - Theme: Dark vs Light.
       - Toggles for Imposter, Tasks, and Meetings checkboxes.
       - Show player names + "Edit Names" sub-view (with bean avatar previews, clean text inputs, and "Reset All Names" button).
       - Notes settings: Reset notes on new game, Show round notes.
       - Can track own color toggle.
       - Improve map contrast toggle.

---

## 3. Core Gameplay & Investigation Features `[PLANNED - MEDIUM PRIORITY]`

### 3.1 Dual Notepad System: General Notes vs. Round Notes
- **Files**: `app/components/NotesModal.vue`, `app/components/Notes.vue`, `app/stores/notes.ts`
- **Objective**: Provide dedicated spaces for long-term deduction strategies vs immediate meeting alibis.
- **Specification**:
  1. **General Notes (Persistent)**:
     - Retained across rounds throughout the entire match.
     - Used for game-wide observations ("Green never did visual tasks", "Yellow & Purple vouch for each other").
  2. **Round Notes (Volatile)**:
     - Automatically wiped on `New Round`.
     - Used for fast alibi tracking during meetings ("Cyan claims medbay scanner at 45s").
  3. **Focus-Safe Input**: Ensure reactive typing does not drop cursor focus or re-render parent cards.
  4. **Speech-to-Text / Audio Dictation**: Modernize the voice input tool using the browser's Web Speech API for hands-free notes during discussions.
  5. **Keyboard Shortcuts**: `N` toggles notes modal, `Esc` dismisses.

### 3.2 Reconstructed Interactive Map & Location Drop Tokens
- **Files**: `app/components/Maps.vue`, `app/components/MapPlayer.vue`, `app/stores/crew.ts`
- **Objective**: Allow players to place bean tokens on map rooms without disturbing deduction column placement.
- **Specification**:
  1. **Linked Location Tokens**:
     - Dragging a player card to a room on the map spawns/updates a **linked location pin** with `(x, y)` coordinates.
     - **The card stays in its deduction column** (Hard Clear, Unknown, etc.) — placing on the map does NOT remove the card from the deduction board.
  2. **"Clear Map Tokens" Button**:
     - Dedicated button on the map toolbar to instantly clear all map pins between rounds.
     - Also automatically cleared upon clicking `New Round`.
  3. **Map Overlays & Navigation**:
     - High-contrast room overlays.
     - Mira HQ door sensor logger overlay (tracking North, South, East sensor triggers).
     - Switcher between maps (The Skeld, MIRA HQ, Polus, The Airship, The Fungle).

### 3.3 Chronology, Round Snapshots & Timeline Review
- **Files**: `app/stores/history.ts` (new), `app/components/TimelineReview.vue` (new), `app/pages/index.vue`
- **Objective**: Review historical snapshots of previous meetings to catch impostor contradictions.
- **Specification**:
  1. **Lightweight JSON Snapshots**:
     - On `New Round`, capture a pure data snapshot (zero DOM clones):
       ```ts
       interface RoundSnapshot {
         roundNumber: number;
         timestamp: string;
         deadPlayers: string[];
         confirmedRoles: Record<string, string>;
         playerStatuses: Record<string, ColumnStatus>;
         mapPins: Record<string, { x: number; y: number }>;
         roundNotes: string;
       }
       ```
  2. **Timeline Bar**:
     - Header bar with buttons: `Round 1`, `Round 2`, `Current Round`.
     - Clicking a previous round displays a read-only historical view of the board and map at that point in time.
     - "Back to Live" button returns to active game mode.

---

## 4. Advanced Game Modes `[PLANNED - MEDIUM PRIORITY]`

### 4.1 Dedicated Impostor Mode
- **Files**: `app/components/ImpostorMode.vue` (new), `app/stores/crew.ts`
- **Objective**: Specialized investigative workspace when playing as an Impostor.
- **Specification**:
  1. **Kill Cooldown Timer**:
     - Interactive cooldown timer synced with game lobby settings (e.g. 10s, 22.5s, 30s).
  2. **Fake Tasks Router & Alibi Tracker**:
     - List of common fake tasks that match crew tasks for the selected map.
     - Alibi builder: record which crewmates saw you in specific rooms to construct solid claims.
  3. **Sabotage Sync**:
     - Cooldown trackers for Doors, Reactor, O2, Lights, and Comms.
  4. **Fellow Impostor Sync**:
     - Clearly highlights partner Impostors and tracks their claimed alibis to avoid mutual contradictions.

---

## 5. Inclusivity, Accessibility & Audio-Visual Backlog `[BACKLOG / FUTURE]`

### 5.1 Colorblind Accessibility Mode
- **Files**: `app/components/RoleIcon.vue`, `app/components/CrewIcon.vue`, `app/components/SettingsModal.vue`
- **Specification**:
  - Optional toggle to display high-contrast textual color badges (e.g. "CYAN", "BLUE", "ROSE", "PINK").
  - Optional geometric pattern symbols (circle, square, triangle, diamond) stamped on beans to prevent colorblind confusion between similar shades (Lime vs Green, Coral vs Red).

### 5.2 Screen Reader & Keyboard Navigation
- **Files**: `app/components/PlayerCard.vue`, `app/components/CrewTracker.vue`
- **Specification**:
  - Semantic ARIA labels: `aria-label="Red: Alive, Unknown, Claimed Detective"`.
  - Keyboard drag-and-drop: Select card with `Space`/`Enter`, move between columns using `Arrow Left`/`Arrow Right`, place with `Enter`.
  - ARIA-live region announcing board movements ("Red moved to Hard Clear").

### 5.3 Audio & Visual Alerts
- **Specification**:
  - Subtle sound cues or border flash for meeting called, body reported, or round timer expiration.
  - Setting toggle to mute/unmute audio effects.

### 5.4 Modernize & Improve Disclaimer (`app/pages/disclaimer.vue`)
- **Files**: `app/pages/disclaimer.vue`, `app/components/AboutModal.vue`
- **Specification**:
  - Full modern rewrite replacing legacy 2020 text with clean, authoritative legal clarity.
  - Reaffirm 100% compliance with Innersloth's Companion & Modding policy: purely an external manual digital notepad; does not hook game memory, inject code, or alter files.
  - Modern card-based UI with dark mode support, crisp typography, and direct navigation back to app.

### 5.5 Help Modal & Tutorial Video Overhaul (`app/components/HelpModal.vue`)
- **Files**: `app/components/HelpModal.vue`, `public/help/`
- **Specification**:
  - Re-record / update walkthrough demonstrations showing new v2 features.
  - Clear user guide explaining:
    - How to record claims and locations during task phases vs meetings.
    - Exactly when to use "Next Round (Meeting ended)" vs "New Match (Reset game)".
    - How to use room pins on maps and verify claimed roles.

### 5.6 Multilingual Localization (i18n)
- **Supported Languages**: English (`en-US` - default), Portuguese (`pt-BR`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`).
- **Key Specifications**:
  - Auto-detection via `navigator.language` with persistent preference stored in `settingsStore`.
  - Game Terminology Exclusions: Keep map names (*The Skeld, MIRA HQ, Polus, The Airship, The Fungle, Submerged*) and room names (*Electrical, Medbay, Navigation, Admin, Reactor, Security...*) in English to maintain universal communication in multiplayer lobbies.
  - Translated deduction headers (*Hard Clear, Trusted, Unknown, Suspicious, Impostor, Dead*), round controls, badges, and modal text.

---

## 6. Implementation Order & Phasing Plan

```mermaid
flowchart TD
    subgraph Phase 1 [Phase 1: Header & Modals Cleanup]
        F1[Top Bar Controls & Clean Header]
        F2[Strict Round & Game Reset Logic]
        F3[Modals Overhaul: Settings, About, Changelog]
    end

    subgraph Phase 2 [Phase 2: Investigation Workflows]
        F4[Dual Notepad: General vs Round Notes]
        F5[Linked Map Tokens & Clear Map Pins]
        F6[Round Snapshots & Timeline Review]
    end

    subgraph Phase 3 [Phase 3: Specialized Modes & Accessibility]
        F7[Dedicated Impostor Mode]
        F8[Colorblind & Screen Reader Accessibility]
        F9[Audio-Visual Alerts]
    end

    Phase 1 --> Phase 2 --> Phase 3
```

### Execution Strategy:
1. **Phase 1 Execution (Immediate)**:
   - Modernize top bar in `index.vue` (remove redundant `PlayerSelector`).
   - Implement strict reset rules in `stores/crew.ts` (`resetActiveCrew` preserves dead + verified roles).
   - Refactor `SettingsModal.vue`, `AboutModal.vue` (Marcos Binder attribution), `Changelog.vue`, and `Modal.vue`.
2. **Phase 2 Execution**:
   - Split `Notes.vue` into General and Round notes with auto-clear.
   - Implement non-destructive location drop pins on `Maps.vue`.
   - Implement JSON round snapshots with timeline buttons.
3. **Phase 3 Execution**:
   - Implement Impostor Mode tab.
   - Add colorblind overlays and keyboard accessibility.
