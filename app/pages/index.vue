<template>
  <div class="flex flex-col p-2 lg:p-8" :class="{ 'dark-mode': isDarkMode }">
    <!-- Header Action Controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2">
        <PlayerSelector
          :current-color="crewStore.playerColor"
          :is-picker-open="isPlayerPickerOpen"
          class="h-10"
          @color-changed="handleChangePlayerColor"
          @picker-toggle="handleTogglePlayerPicker"
        />
        <button
          class="h-10 px-4 button"
          data-test="tasks-btn"
          @click="isTasksModalOpen = true"
        >
          Tasks
        </button>
        <button
          class="h-10 px-4 button"
          data-test="notes-btn"
          @click="toggleNotesModal"
        >
          Notes
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="h-10 px-4 button button-success font-bold"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-round-btn"
          @click="initNewRound"
        >
          New round
        </button>
        <button
          class="h-10 px-4 button button-warning font-bold"
          :disabled="crewStore.activeCrewMembers.length <= 0"
          data-test="new-game-btn"
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
      :show-color-names="settingsStore.showColorNames"
      :show-player-names="settingsStore.showPlayerNames"
      class="mb-2 lg:mb-4"
      @changed="handleCrewChanged"
      @removed="handleMemberRemoved"
    />
    <div class="fixed bottom-0 left-0 right-0 z-20 flex justify-end px-2 py-1">
      <button class="mr-2 button-sm" data-test="settings-btn" @click="toggleSettingsModal">
        Settings
      </button>
      <button class="mr-2 button-sm" data-test="help-btn" @click="toggleHelpModal">
        Help
      </button>
      <button class="button-sm" data-test="about-btn" @click="toggleAboutModal">About</button>
    </div>
    <div class="relative">
      <Maps />
    </div>
    <NotesModal
      v-if="isNotesModalOpen"
      :round="roundNotes"
      :game="gameNotes"
      @round-notes-changed="value => (roundNotes = value)"
      @game-notes-changed="value => (gameNotes = value)"
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

const { isDarkMode } = storeToRefs(useDarkModeStore())

const isPlayerPickerOpen = ref(false)
const isHelpModalOpen = ref(false)
const isAboutModalOpen = ref(false)
const isTasksModalOpen = ref(false)
const roundNotes = ref('')
const gameNotes = ref('')

const isNotesModalOpen = computed({
  get: () => notesStore.areNotesOpen,
  set: (value: boolean) => notesStore.setNotesOpenState(value),
})

const isSettingsModalOpen = computed({
  get: () => settingsStore.settingsModalOpenState,
  set: (value: boolean) => settingsStore.setSettingsModalOpenState(value),
})

onMounted(() => {
  initNewGame()
  if (JSON.parse(localStorage.getItem('returningPlayer') ?? 'false') !== true) {
    isHelpModalOpen.value = true
    localStorage.setItem('returningPlayer', JSON.stringify(true))
  }
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === 'KeyN' && !isNotesModalOpen.value && !isSettingsModalOpen.value) {
      isNotesModalOpen.value = true
    } else if (e.code === 'Escape' && isNotesModalOpen.value) {
      isNotesModalOpen.value = false
    }
  })
})

function initNewGame() {
  crewStore.resetAllCrew()
  tasksStore.resetAllTasks()
  if (settingsStore.resetNotesOnNewGame) gameNotes.value = ''
  roundNotes.value = ''
  gtag('event', 'init_new_game', { event_category: 'global_stats' })
}

function initNewRound() {
  crewStore.resetActiveCrew()
  tasksStore.resetAllTasks()
  roundNotes.value = ''
  gtag('event', 'init_new_round', { event_category: 'global_stats' })
}

function handleChangePlayerColor(selectedColor: string) {
  crewStore.setPlayerColor(selectedColor)
  initNewGame()
  gtag('event', `change_player_color_${selectedColor}`, { event_category: 'player_stats' })
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

function handleTogglePlayerPicker(isOpen: boolean) {
  isPlayerPickerOpen.value = isOpen
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
