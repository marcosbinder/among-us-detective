# Changelog
All notable changes to **Among Us Detective** are documented in this file.

---

## [2.4.0] - 2026-10-04 (Critical Vote Quorum, Impostor Count & PWA Ergonomics)

### Added & Improved
- **Critical Vote Quorum HUD**: Real-time mathematical alerts during emergency meetings warning of critical threshold states:
  - Double Kill danger (6 alive vs 2 impostors) and Match Point danger (5 alive vs 2 impostors).
  - Triple Kill danger (9 or 8 alive vs 3 impostors).
  - Decisive final vote (3 alive vs 1 impostor).
  - Safe skip cushion notices (7 alive vs 2 impostors, 4 alive vs 1 impostor) preserving voting margin.
  - Interactive "Why?" toggle revealing detailed arithmetic breakdown, with per-round dismissal.
- **Configurable Match Impostor Count**: Added a direct 1, 2, or 3 impostor selector in the Match Roster header bar (defaulting to 3 impostors).
- **PWA Installation Ergonomics**:
  - Non-intrusive floating install card with clear title, dismissal controls, and install confirmation.
  - 3-day reminder cooldown when dismissed by the user to prevent prompt fatigue while keeping app discoverability.
  - Permanent dismissal once installed or when running in standalone PWA mode.
- **Consolidated Upstream V2 Refinements**:
  - Next Round info popover now closes automatically on outside pointer clicks and `Escape` key.
  - Added safety confirmation (`Confirm` / `Cancel`) before resetting map pin positions to prevent accidental loss of tactical notes.
  - "Show color names" setting unified under Players, allowing users to hide color names on both map pins and deduction board cards while preserving custom nicknames.
  - Tracker role localization parity across all 6 supported languages.

---

## [2.3.0] - 2026-09-23 (Light Mode & Visual Refinements)

### Added & Improved
- **Full Light Mode Support**: Complete theme overhaul supporting light mode across all deduction boards, popovers, Detective Notepad, and modals.
- **Dynamic Color Names Highlighting**: Theme-aware contrast badges for player names and roster beans.
- **General Bug Fixes**: Secondary color contrast improvements, graveyard header styling, and mobile text wrapping fixes.

---

## [2.2.0] - 2026-09-21 (Investigation Hardening & Review Polish)

### Added & Improved
- **Read-Only History Snapshots**: Locked drag-and-drop and edits during past meeting inspections.
- **Resilient Session Lifecycle**: Preserved round 1 state across reloads with 2-hour TTL and safe storage parsing.
- **Clean Match Reset**: Board reset preserving active lobby roster.
- **Impostor Role Routing**: Fixed role routing for confirmed fellow impostors.
- **Multilingual Tasks**: Official in-game task and room names in 6 languages.
- **Voice Dictation**: Automatic language detection and quick switcher.
- **General Bug Fixes**: Mobile color picker boundary constraints and meeting counters.

---

## [2.1.0] - 2026-09-20 (Performance, Shortcuts & Help Overhaul)

### Added
- **Performance Mode**: Added "Disable animations" toggle in Settings to eliminate all CSS transitions and keyframes for a lightweight experience on lower-end devices.
- **Help Modal Overhaul**: Expanded modal width to ~700px with segmented navigation, improved card spacing, and refreshed guides.
- **Keyboard Shortcuts**: Added hotkeys (`N` for Notes, `M` for Map, `T` for Tasks, `I` for Impostor HUD, `L` for Roster, `Esc` to close).
- **Authorship & Credits**: Clarified original authorship conceived and credited by Alexander Atlesque and modernization fork by Marcos Binder.

---

## [2.0.0] - 2026-09-18 (Version 2.0 Major Overhaul)

### Added
- Complete multilingual localization (i18n) supporting English, Portuguese, Spanish, Korean, French, and German.
- Dedicated Impostor Operations HUD with fake tasks safety advisor and sabotage planner.
- Player Tasks Completion tracker and Emergency Meetings counter in player card context menu.
- 6-column deduction hierarchy: Hard Clear, Trusted, Unknown, Suspicious, Impostor, and Dead.
- 18 official Among Us bean colors in Match Lobby with LED indicators and presets.
- Compact floating Role Popover with official role icons and claim verification badges.
- Persistent bottom Detective Toolbar docked with quick access to investigation tools.
- Round timeline inspection with snapshots.
