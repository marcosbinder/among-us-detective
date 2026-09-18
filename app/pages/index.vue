<template>
  <div class="flex flex-col p-2 pb-12 lg:p-8 lg:pb-14">
    <!-- Header Action Controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <!-- Left: Notes -->
      <div class="flex items-center gap-1.5">
        <button
          class="h-9 px-3 text-sm button font-medium flex items-center gap-1.5"
          data-test="notes-btn"
          title="Open notes (N)"
          @click="toggleNotesModal"
        >
          <span class="icon-pencil text-xs opacity-80" />
          <span>Notes</span>
          <kbd class="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-gray-300 font-mono border border-white/10">N</kbd>
        </button>
      </div>

      <!-- Center: Round Timeline Selector -->
      <div class="flex items-center gap-1 bg-gray-200/80 dark:bg-gray-900/80 p-1 rounded-lg border border-gray-300 dark:border-gray-800 shadow-inner overflow-x-auto max-w-full">
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1.5 shrink-0">
          Round
        </span>
        <button
          v-for="s in roundsStore.roundHistory"
          :key="s.roundNumber"
          type="button"
          class="px-2 py-0.5 text-xs font-bold rounded transition-colors shrink-0"
          :class="roundsStore.viewingRoundNumber === s.roundNumber
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-800'"
          @click="roundsStore.setViewingRound(s.roundNumber)"
        >
          R{{ s.roundNumber }}
        </button>

        <button
          type="button"
          class="px-2.5 py-0.5 text-xs font-bold rounded transition-colors flex items-center gap-1 shrink-0"
          :class="!roundsStore.isViewingHistory
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-500 hover:bg-gray-300/50 dark:hover:bg-gray-800'"
          @click="roundsStore.setViewingRound(null)"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>R{{ roundsStore.currentRoundNumber }} (Live)</span>
        </button>
      </div>

      <!-- Right: Round / Match Controls -->
      <div class="flex items-center gap-1.5">
        <button
          class="h-9 px-3 text-sm button button-success font-bold flex items-center gap-1.5 shadow-sm"
          :disabled="crewStore.activeCrewMembers.length <= 0 || roundsStore.isViewingHistory"
          data-test="new-round-btn"
          title="Meeting complete — archive round snapshot and advance to next round"
          @click="initNewRound"
        >
          <span>New round</span>
        </button>
        <button
          class="h-9 px-3 text-sm button button-warning font-bold flex items-center gap-1.5 shadow-sm"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-game-btn"
          title="Full reset — reset match, keep selected lobby roster and player names"
          @click="initNewMatch"
        >
          <span>New match</span>
        </button>
      </div>
    </div>

    <!-- Match Lobby & Roster Selector (18 Colors, Glowing LEDs, Presets) -->
    <GameRosterSelector />

    <!-- Browser Zoom Notice Banner -->
    <div
      v-if="isBrowserZoomed && !isZoomNoticeDismissed"
      class="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shadow-sm transition-all"
      data-test="zoom-warning-banner"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-sm shrink-0">⚠️</span>
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
        class="shrink-0 p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 rounded text-xs font-bold leading-none"
        title="Dismiss notice"
        @click="dismissZoomNotice"
      >
        ✕
      </button>
    </div>

    <!-- History Inspection Mode Warning Banner -->
    <div
      v-if="roundsStore.isViewingHistory"
      class="mb-3 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/40 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between gap-2 shadow-sm"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-sm shrink-0">🕒</span>
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

    <!-- Bottom Footer Toolbar -->
    <div class="fixed bottom-0 left-0 right-0 z-20 flex justify-between items-center px-3 py-1.5 bg-black/60 backdrop-blur-sm border-t border-gray-800/50">
      <div class="flex items-center">
        <button
          class="px-2.5 py-0.5 text-xs font-medium rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition-colors flex items-center gap-1"
          data-test="tasks-btn"
          title="Open tasks reference guide"
          @click="isTasksModalOpen = true"
        >
          <span class="icon-list text-xs opacity-70" />
          <span>Tasks Reference</span>
        </button>
      </div>

      <div class="flex items-center">
        <button
          class="mr-2 px-2.5 py-0.5 text-xs font-medium rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition-colors"
          data-test="settings-btn"
          @click="toggleSettingsModal"
        >
          Settings
        </button>
        <button
          class="mr-2 px-2.5 py-0.5 text-xs font-medium rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition-colors"
          data-test="help-btn"
          @click="toggleHelpModal"
        >
          Help
        </button>
        <button
          class="px-2.5 py-0.5 text-xs font-medium rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/60 transition-colors"
          data-test="about-btn"
          @click="toggleAboutModal"
        >
          About
        </button>
      </div>
    </div>

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
const { gtag } = useGtag()

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
