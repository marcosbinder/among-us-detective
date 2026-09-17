<template>
  <div class="flex flex-col p-2 pb-12 lg:p-8 lg:pb-14">
    <!-- Header Action Controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-1.5">
        <button
          class="h-9 px-3 text-sm button"
          data-test="tasks-btn"
          @click="isTasksModalOpen = true"
        >
          <span class="icon-list mr-1 text-xs opacity-70" />Tasks
        </button>
        <button
          class="h-9 px-3 text-sm button"
          data-test="notes-btn"
          title="Open notes (N)"
          @click="toggleNotesModal"
        >
          <span class="icon-pencil mr-1 text-xs opacity-70" />Notes
        </button>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          class="h-9 px-3 text-sm button button-success font-bold"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-round-btn"
          title="Reset unconfirmed deductions, keep dead players"
          @click="initNewRound"
        >
          New round
        </button>
        <button
          class="h-9 px-3 text-sm button button-warning font-bold"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-game-btn"
          title="Full reset — new lobby, same players"
          @click="initNewGame"
        >
          New game
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

    <!-- 6 Strict Deduction Hierarchy Columns -->
    <CrewTracker
      :player-color="crewStore.playerColor"
      :hard-clear="crewStore.hardClearCrewMembers"
      :trusted="crewStore.trustedCrewMembers"
      :unknown="crewStore.unknownCrewMembers"
      :suspicious="crewStore.suspiciousCrewMembers"
      :impostor="crewStore.impostorCrewMembers"
      :dead="crewStore.deadCrewMembers"
      :highlight-color-names="settingsStore.highlightColorNames"
      :show-player-names="settingsStore.showPlayerNames"
      class="mb-2 lg:mb-4"
      @changed="handleCrewChanged"
      @removed="handleMemberRemoved"
    />

    <CrewStats
      :crew-members="crewStore.activeCrewMembers"
      :highlight-color-names="settingsStore.highlightColorNames"
      :show-player-names="settingsStore.showPlayerNames"
      class="mb-4"
    />

    <!-- Bottom Footer Toolbar -->
    <div class="fixed bottom-0 left-0 right-0 z-20 flex justify-end items-center px-3 py-1.5 bg-black/60 backdrop-blur-sm border-t border-gray-800/50">
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
const { gtag } = useGtag()

const isHelpModalOpen = ref(false)
const isAboutModalOpen = ref(false)
const isTasksModalOpen = ref(false)

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
  initNewGame()
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

function initNewGame() {
  crewStore.resetAllCrew()
  tasksStore.resetAllTasks()
  if (settingsStore.resetNotesOnNewGame) notesStore.clearGameNotes()
  notesStore.clearRoundNotes()
  gtag('event', 'init_new_game', { event_category: 'global_stats' })
}

function initNewRound() {
  crewStore.resetActiveCrew()
  tasksStore.resetAllTasks()
  notesStore.clearRoundNotes()
  gtag('event', 'init_new_round', { event_category: 'global_stats' })
}

function handleCrewChanged({ type, value }: { type: string; value: CrewMember[] }) {
  if (['hard_clear', 'trusted', 'unknown', 'suspicious', 'impostor', 'dead'].includes(type)) {
    crewStore.setColumnMembers(type as any, value)
  } else if (type === 'inactive') {
    crewStore.setInactiveCrewMembers(value)
  }
}

function handleMemberRemoved({ list, member }: { list: string; member: CrewMember }) {
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
