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

let keyupListener: ((e: KeyboardEvent) => void) | null = null

onMounted(() => {
  initNewGame()
  if (JSON.parse(localStorage.getItem('returningPlayer') ?? 'false') !== true) {
    isHelpModalOpen.value = true
    localStorage.setItem('returningPlayer', JSON.stringify(true))
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
