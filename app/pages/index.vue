<template>
  <div class="flex flex-col p-2 pb-20 sm:pb-24 lg:p-8 lg:pb-24">
    <!-- Header Action Controls -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <!-- Left: Round Timeline Selector -->
      <div class="flex items-center gap-1 bg-gray-200/80 dark:bg-gray-900/80 p-1 rounded-lg border border-gray-300 dark:border-gray-800 shadow-inner overflow-x-auto min-w-0 max-w-full">
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1.5 shrink-0 flex items-center gap-1">
          <AppIcon name="clock" class="w-3.5 h-3.5 shrink-0" />
          <span class="hidden md:inline">Timeline</span>
        </span>
        <button
          v-for="s in roundsStore.roundHistory"
          :key="s.roundNumber"
          type="button"
          class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold rounded-md transition-colors shrink-0"
          :class="roundsStore.viewingRoundNumber === s.roundNumber
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-800'"
          @click="roundsStore.setViewingRound(s.roundNumber)"
        >
          R{{ s.roundNumber }}
        </button>

        <button
          type="button"
          class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 shrink-0"
          :class="!roundsStore.isViewingHistory
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-500 hover:bg-gray-300/50 dark:hover:bg-gray-800'"
          @click="roundsStore.setViewingRound(null)"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>R{{ roundsStore.currentRoundNumber }}</span>
          <span class="text-[10px] opacity-80 hidden sm:inline">(Live)</span>
        </button>
      </div>

      <!-- Right: Meeting / Match Controls -->
      <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0">
        <!-- Next Round Button (Primary Action for End of Meeting) -->
        <button
          class="h-9 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm flex-1 sm:flex-initial justify-center"
          :class="crewStore.activeCrewMembers.length > 0 && !roundsStore.isViewingHistory && !roundsStore.isMaxRoundsReached
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-950/30'
            : 'bg-gray-800/40 text-gray-500 border border-gray-700/30 cursor-not-allowed'"
          :disabled="crewStore.activeCrewMembers.length <= 0 || roundsStore.isViewingHistory || roundsStore.isMaxRoundsReached"
          data-test="new-round-btn"
          :title="roundsStore.isMaxRoundsReached ? 'Maximum rounds reached (10 rounds)' : 'Meeting concluded — archive round snapshot and advance to next meeting'"
          @click="initNewRound"
        >
          <AppIcon name="bell" class="w-4 h-4 shrink-0" />
          <div class="flex flex-col text-left leading-none">
            <div class="flex items-center gap-1">
              <span>Next Round</span>
              <span v-if="roundsStore.isMaxRoundsReached" class="text-[9px] text-amber-300 font-semibold">(Max R10)</span>
            </div>
            <span class="text-[8px] sm:text-[9px] font-normal opacity-75 block mt-0.5">Meeting ended</span>
          </div>
        </button>

        <div class="h-6 w-px bg-gray-700/60 hidden sm:block" />

        <!-- New Match Button (Destructive / Full Reset Action) -->
        <button
          class="h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 shrink-0 justify-center"
          :class="crewStore.activeCrewMembers.length > 0
            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/40'
            : 'bg-gray-800/40 text-gray-500 border border-gray-700/30 cursor-not-allowed'"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-game-btn"
          title="Game concluded — reset deduction board for a new game (preserves lobby roster)"
          @click="initNewMatch"
        >
          <AppIcon name="refresh" class="w-3.5 h-3.5 shrink-0" />
          <div class="flex flex-col text-left leading-none">
            <span>New Match</span>
            <span class="text-[8px] sm:text-[9px] font-normal opacity-75 block mt-0.5">Reset game</span>
          </div>
        </button>
      </div>
    </header>

    <!-- Match Lobby & Roster Selector (18 Colors, Glowing LEDs, Presets) -->
    <GameRosterSelector />

    <!-- Browser Zoom Notice Banner -->
    <div
      v-if="isBrowserZoomed && !isZoomNoticeDismissed"
      class="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shadow-sm transition-all"
      data-test="zoom-warning-banner"
    >
      <div class="flex items-center gap-2 min-w-0">
        <AppIcon name="alert" class="w-4 h-4 text-amber-500 shrink-0" />
        <div class="leading-tight text-[11px] sm:text-xs">
          <span>Browser zoom detected. If columns feel cramped, use built-in <strong>Board Zoom</strong> in </span>
          <button
            type="button"
            class="underline font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500"
            @click="openSettingsForZoom"
          >
            Settings
          </button>
          <span> for the cleanest fit.</span>
        </div>
      </div>
      <button
        type="button"
        class="shrink-0 p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 rounded text-xs font-bold leading-none flex items-center justify-center"
        title="Dismiss notice"
        @click="dismissZoomNotice"
      >
        <AppIcon name="close" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- History Inspection Mode Warning Banner -->
    <div
      v-if="roundsStore.isViewingHistory"
      class="mb-3 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/40 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between gap-2 shadow-sm"
    >
      <div class="flex items-center gap-2 min-w-0">
        <AppIcon name="clock" class="w-4 h-4 text-indigo-400 shrink-0" />
        <span class="leading-tight text-[11px] sm:text-xs">
          Viewing historical snapshot for <strong>Round {{ roundsStore.viewingRoundNumber }}</strong> (Read-Only). Cards reflect past theories.
        </span>
      </div>
      <button
        type="button"
        class="shrink-0 px-2.5 py-1 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        @click="roundsStore.setViewingRound(null)"
      >
        Return to Live →
      </button>
    </div>

    <!-- Mobile Touch Drag Hint -->
    <div class="lg:hidden flex items-center justify-center gap-1.5 py-1 px-2 mb-1.5 text-[11px] text-gray-500 dark:text-gray-400 select-none">
      <AppIcon name="touch" class="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
      <span>Tip: Press &amp; hold card briefly to drag</span>
    </div>

    <!-- 6 Strict Deduction Hierarchy Columns -->
    <CrewTracker
      :player-color="crewStore.playerColor"
      :hard-clear="displayedCrewMembers.hardClear"
      :trusted="displayedCrewMembers.trusted"
      :unknown="displayedCrewMembers.unknown"
      :suspicious="displayedCrewMembers.suspicious"
      :impostor="displayedCrewMembers.impostor"
      :dead="displayedCrewMembers.dead"
      :highlight-color-names="settingsStore.highlightColorNames"
      :show-player-names="settingsStore.showPlayerNames"
      class="mb-2 lg:mb-4"
      @changed="handleCrewChanged"
      @removed="handleMemberRemoved"
    />

    <!-- Modern Bottom Detective Toolbar (Persistent Dock) -->
    <footer class="fixed bottom-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-2 sm:px-4 md:px-6 bg-gray-900/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-700/60 dark:border-gray-800/80 shadow-2xl">
      <!-- Left: Investigation Tools (Notes, Map, Tasks) -->
      <div class="flex items-center gap-1 sm:gap-2 shrink-0">
        <!-- Notes Button (Prominent & Evident) -->
        <button
          class="h-8 px-2.5 sm:px-3 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 transition-all shrink-0"
          data-test="notes-btn"
          title="Open Detective Notes (N)"
          @click="toggleNotesModal"
        >
          <AppIcon name="notes" class="w-3.5 h-3.5 shrink-0" />
          <span>Notes</span>
          <kbd class="hidden md:inline-block text-[10px] px-1 py-0.2 rounded bg-black/25 text-blue-100 font-mono">N</kbd>
        </button>

        <!-- Map Toggle Button -->
        <button
          class="h-8 px-2 sm:px-2.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shrink-0"
          :class="mapsStore.isMapVisible
            ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 hover:bg-indigo-600/40'
            : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-700/60'"
          data-test="toggle-map-btn"
          title="Toggle Interactive Map"
          @click="toggleMapVisibility"
        >
          <AppIcon name="map" class="w-3.5 h-3.5 shrink-0" />
          <span>{{ mapsStore.isMapVisible ? 'Hide' : 'Map' }}</span>
        </button>

        <!-- Tasks Reference Button -->
        <button
          class="h-8 px-2 sm:px-2.5 text-xs font-semibold rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition-colors flex items-center gap-1.5 shrink-0"
          data-test="tasks-btn"
          title="Open Tasks & Visual Reference Guide"
          @click="isTasksModalOpen = true"
        >
          <AppIcon name="tasks" class="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span>Tasks</span><span class="hidden sm:inline">&nbsp;Guide</span>
        </button>
      </div>

      <!-- Right: System Controls (Settings, Help, About) -->
      <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          class="h-8 w-8 sm:w-auto px-0 sm:px-2.5 text-xs font-medium rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-gray-400 hover:text-gray-200 border border-gray-700/40 transition-colors flex items-center justify-center gap-1"
          data-test="settings-btn"
          title="Settings"
          aria-label="Settings"
          @click="toggleSettingsModal"
        >
          <AppIcon name="settings" class="w-4 h-4 shrink-0" />
          <span class="hidden sm:inline">Settings</span>
        </button>
        <button
          class="h-8 w-8 sm:w-auto px-0 sm:px-2.5 text-xs font-medium rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-gray-400 hover:text-gray-200 border border-gray-700/40 transition-colors flex items-center justify-center gap-1"
          data-test="help-btn"
          title="How to play / Tutorial"
          aria-label="Help"
          @click="toggleHelpModal"
        >
          <AppIcon name="help" class="w-4 h-4 shrink-0" />
          <span class="hidden sm:inline">Help</span>
        </button>
        <button
          class="h-8 w-8 sm:w-auto px-0 sm:px-2.5 text-xs font-medium rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-gray-400 hover:text-gray-200 border border-gray-700/40 transition-colors flex items-center justify-center gap-1"
          data-test="about-btn"
          title="About Among Us Detective"
          aria-label="About"
          @click="toggleAboutModal"
        >
          <AppIcon name="about" class="w-4 h-4 shrink-0" />
          <span class="hidden sm:inline">About</span>
        </button>
      </div>
    </footer>

    <div class="relative">
      <Maps />
    </div>
    <NotesModal
      v-if="isNotesModalOpen"
      @close="toggleNotesModal"
    />
    <HelpModal v-if="isHelpModalOpen" @close="toggleHelpModal" />
    <AboutModal v-if="isAboutModalOpen" @close="toggleAboutModal" />
    <SettingsModal v-if="isSettingsModalOpen" @close="toggleSettingsModal" />
    <TasksModal v-if="isTasksModalOpen" @close="toggleTasksModal" />
    <CookieWarning />
  </div>
</template>

<script setup lang="ts">
import type { CrewMember } from '~/stores/crew'

const crewStore = useCrewStore()
const settingsStore = useSettingsStore()
const notesStore = useNotesStore()
const tasksStore = useTasksStore()
const roundsStore = useRoundsStore()
const mapsStore = useMapsStore()
const { gtag } = useGtag()

function toggleMapVisibility() {
  mapsStore.toggleMap()
  if (mapsStore.isMapVisible) {
    nextTick(() => {
      document.querySelector('.map-container')?.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

const isHelpModalOpen = ref(false)
const isAboutModalOpen = ref(false)
const isTasksModalOpen = ref(false)

const displayedCrewMembers = computed(() => {
  if (roundsStore.isViewingHistory && roundsStore.activeSnapshot) {
    const list = roundsStore.activeSnapshot.crewMembers
    const active = list.filter((m) => m.isActive && (settingsStore.canTrackOwnColor ? true : m.color !== crewStore.playerColor))
    return {
      hardClear: active.filter((m) => m.status === 'hard_clear' && !m.isDead),
      trusted: active.filter((m) => m.status === 'trusted' && !m.isDead),
      unknown: active.filter((m) => m.status === 'unknown' && !m.isDead),
      suspicious: active.filter((m) => m.status === 'suspicious' && !m.isDead),
      impostor: active.filter((m) => m.status === 'impostor' && !m.isDead),
      dead: active.filter((m) => m.status === 'dead' || m.isDead),
    }
  }
  return {
    hardClear: crewStore.hardClearCrewMembers,
    trusted: crewStore.trustedCrewMembers,
    unknown: crewStore.unknownCrewMembers,
    suspicious: crewStore.suspiciousCrewMembers,
    impostor: crewStore.impostorCrewMembers,
    dead: crewStore.deadCrewMembers,
  }
})

const isNotesModalOpen = computed({
  get: () => notesStore.areNotesOpen,
  set: (value: boolean) => notesStore.setNotesOpenState(value),
})

const isSettingsModalOpen = computed({
  get: () => settingsStore.settingsModalOpenState,
  set: (value: boolean) => settingsStore.setSettingsModalOpenState(value),
})

const isBrowserZoomed = ref(false)
const isZoomNoticeDismissed = ref(false)

function checkBrowserZoom() {
  if (typeof window === 'undefined') return
  const dpr = window.devicePixelRatio || 1
  const vpScale = window.visualViewport?.scale || 1
  // Trigger warning if browser zoom or viewport pinch scale is active
  isBrowserZoomed.value = vpScale > 1.05 || dpr >= 1.2
}

function dismissZoomNotice() {
  isZoomNoticeDismissed.value = true
  try {
    sessionStorage.setItem('dismissed_zoom_notice', 'true')
  } catch {}
}

function openSettingsForZoom() {
  settingsStore.setSettingsModalOpenState(true)
}

let keyupListener: ((e: KeyboardEvent) => void) | null = null
let zoomListener: (() => void) | null = null

onMounted(() => {
  if (roundsStore.roundHistory.length === 0) {
    initNewMatch()
  }
  if (JSON.parse(localStorage.getItem('returningPlayer') ?? 'false') !== true) {
    isHelpModalOpen.value = true
    localStorage.setItem('returningPlayer', JSON.stringify(true))
  }
  try {
    isZoomNoticeDismissed.value = sessionStorage.getItem('dismissed_zoom_notice') === 'true'
  } catch {}

  checkBrowserZoom()
  zoomListener = checkBrowserZoom
  window.addEventListener('resize', zoomListener)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', zoomListener)
  }

  keyupListener = (e: KeyboardEvent) => {
    if (e.code === 'KeyN' && !isNotesModalOpen.value && !isSettingsModalOpen.value) {
      isNotesModalOpen.value = true
    } else if (e.code === 'Escape' && isNotesModalOpen.value) {
      isNotesModalOpen.value = false
    }
  }
  document.addEventListener('keyup', keyupListener)
})

onUnmounted(() => {
  if (keyupListener) {
    document.removeEventListener('keyup', keyupListener)
    keyupListener = null
  }
  if (zoomListener) {
    window.removeEventListener('resize', zoomListener)
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', zoomListener)
    }
    zoomListener = null
  }
})

function initNewMatch() {
  roundsStore.startNewMatch()
  crewStore.resetAllCrew()
  tasksStore.resetAllTasks()
  if (settingsStore.resetNotesOnNewGame) notesStore.clearGameNotes()
  notesStore.clearRoundNotes()
  gtag('event', 'init_new_match', { event_category: 'global_stats' })
}

function initNewRound() {
  // Archive current round before advancing
  roundsStore.archiveCurrentRound(crewStore.crewMembers, notesStore.roundNotes)
  crewStore.resetActiveCrew()
  tasksStore.resetAllTasks()
  notesStore.clearRoundNotes()
  gtag('event', 'init_new_round', { event_category: 'global_stats' })
}

function handleCrewChanged({ type, value }: { type: string; value: CrewMember[] }) {
  if (roundsStore.isViewingHistory) return
  if (['hard_clear', 'trusted', 'unknown', 'suspicious', 'impostor', 'dead'].includes(type)) {
    crewStore.setColumnMembers(type as any, value)
  } else if (type === 'inactive') {
    crewStore.setInactiveCrewMembers(value)
  }
}

function handleMemberRemoved({ list, member }: { list: string; member: CrewMember }) {
  if (roundsStore.isViewingHistory) return
  crewStore.togglePlayerDead(member.color)
}

function toggleHelpModal() {
  const newValue = !isHelpModalOpen.value
  isHelpModalOpen.value = newValue
  if (newValue) gtag('event', 'open_help', { event_category: 'global_stats' })
}

function toggleAboutModal() {
  const newValue = !isAboutModalOpen.value
  isAboutModalOpen.value = newValue
  if (newValue) gtag('event', 'open_changelog', { event_category: 'global_stats' })
}

function toggleSettingsModal() {
  const newValue = !isSettingsModalOpen.value
  isSettingsModalOpen.value = newValue
  if (newValue) gtag('event', 'open_settings', { event_category: 'global_stats' })
}

function toggleNotesModal() {
  const newValue = !isNotesModalOpen.value
  isNotesModalOpen.value = newValue
  if (newValue) gtag('event', 'open_notes', { event_category: 'global_stats' })
}

function toggleTasksModal() {
  const newValue = !isTasksModalOpen.value
  isTasksModalOpen.value = newValue
  if (newValue) gtag('event', 'open_fake_tasks', { event_category: 'global_stats' })
}
</script>
