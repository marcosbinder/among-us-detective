<template>
  <div class="flex">
    <Modal @close="handleCloseEvent">
      <template #title>{{
        isEditingPlayerNames ? "Player names" : "Settings"
      }}</template>
      <template #body>
        <!-- Player Names Editor Sub-View -->
        <template v-if="isEditingPlayerNames">
          <div class="flex justify-between items-center my-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Edit player nicknames</span>
            <button
              class="px-2.5 py-1 text-xs font-bold rounded bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/30 transition-colors"
              @click="crewStore.resetAllPlayerNames()"
            >
              Reset all
            </button>
          </div>
          <div class="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="(color, index) in playerColors"
              :key="index"
              class="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"
            >
              <CrewIcon :color="color" class="w-5 h-5 shrink-0" />
              <span class="text-xs font-medium capitalize text-gray-600 dark:text-gray-400 w-14 shrink-0">{{ color }}</span>
              <input
                type="text"
                class="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                :placeholder="color"
                :value="getPlayerName(color)"
                @input="
                  (e: Event) =>
                    crewStore.setCrewMemberPlayerName({
                      color,
                      playerName: (e.target as HTMLInputElement).value,
                    })
                "
              />
            </div>
          </div>
        </template>

        <!-- Main Settings -->
        <template v-else>
          <div class="space-y-2 mt-2">
            <!-- Display -->
            <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">Display</div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-players-as"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show players as</span>
              <button
                class="px-2.5 py-1 text-xs font-bold rounded bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border border-blue-500/30 transition-colors"
                data-test="setting-show-players-as-btn"
                @click="toggleColorNames"
              >
                {{ settingsStore.showColorNames ? "Color names" : "Icons" }}
              </button>
            </div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-theme"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Interface theme</span>
              <button
                class="px-2.5 py-1 text-xs font-bold rounded transition-colors"
                :class="darkModeStore.isDarkMode
                  ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/40'
                  : 'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 border border-yellow-500/40'"
                data-test="setting-theme-btn"
                @click="toggleDarkMode"
              >
                {{ darkModeStore.isDarkMode ? "🌙 Dark" : "☀️ Light" }}
              </button>
            </div>

            <!-- Tracking -->
            <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-3">Tracking</div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-imposter"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show Imposter checkbox</span>
              <Checkbox
                :is-checked="settingsStore.showImposterCheckbox"
                @changed="settingsStore.setShowImposterCheckbox"
              />
            </div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-tasks"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show Tasks checkbox</span>
              <Checkbox
                :is-checked="settingsStore.showTasksCheckbox"
                @changed="settingsStore.setShowTasksCheckbox"
              />
            </div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-meetings"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show Meetings count</span>
              <Checkbox
                :is-checked="settingsStore.showMeetingsCount"
                @changed="settingsStore.setShowMeetingsCount"
              />
            </div>

            <!-- Players -->
            <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-3">Players</div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-player-names"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show player names</span>
              <div class="flex items-center gap-2">
                <Checkbox
                  :is-checked="settingsStore.showPlayerNames"
                  @changed="settingsStore.setShowPlayerNames"
                />
                <button
                  v-if="settingsStore.showPlayerNames"
                  class="px-2 py-0.5 text-[11px] font-bold rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  data-test="edit-player-names-btn"
                  @click="isEditingPlayerNames = true"
                >
                  Edit names
                </button>
              </div>
            </div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-track-own-color"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Can track own color</span>
              <Checkbox
                :is-checked="settingsStore.canTrackOwnColor"
                @changed="settingsStore.setCanTrackOwnColor"
              />
            </div>

            <!-- Notes -->
            <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-3">Notes</div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-reset-notes"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Reset notes each game</span>
              <Checkbox
                :is-checked="settingsStore.resetNotesOnNewGame"
                @changed="settingsStore.setResetNotesOnNewGame"
              />
            </div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-show-round-notes"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Show round notes</span>
              <Checkbox
                :is-checked="settingsStore.showRoundNotes"
                @changed="settingsStore.setShowRoundNotes"
              />
            </div>

            <!-- Map -->
            <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-3">Map</div>

            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              data-test="setting-improve-map-contrast"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300">Improve map contrast</span>
              <Checkbox
                :is-checked="settingsStore.isImproveMapContrastEnabled"
                @changed="settingsStore.setIsImproveMapContrastEnabled"
              />
            </div>
          </div>
        </template>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import playerColors from "~/utils/playerColors.js";

const emit = defineEmits<{ close: [] }>();

const settingsStore = useSettingsStore();
const darkModeStore = useDarkModeStore();
const crewStore = useCrewStore();
const { gtag } = useGtag();

const isEditingPlayerNames = ref(false);

function getPlayerName(color: string): string {
  return crewStore.crewMembers.find((m) => m.color === color)?.playerName ?? "";
}

function handleCloseEvent() {
  if (isEditingPlayerNames.value) {
    isEditingPlayerNames.value = false;
  } else {
    emit("close");
  }
}

function toggleColorNames() {
  const newValue = !settingsStore.showColorNames;
  settingsStore.setShowColorNames(newValue);
  gtag("event", newValue ? "show_color_names" : "hide_color_names", {
    event_category: "global_stats",
  });
}

function toggleDarkMode() {
  const newValue = !darkModeStore.isDarkMode;
  darkModeStore.setDarkMode(newValue);
  gtag("event", newValue ? "dark_mode_enabled" : "light_mode_enabled", {
    event_category: "global_stats",
  });
}
</script>
