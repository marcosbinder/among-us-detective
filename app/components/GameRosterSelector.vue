<template>
  <div class="game-roster-selector bg-theme-gray-extra-dark/95 dark:bg-black/90 rounded border border-gray-700/60 p-2 mb-2.5 shadow-sm transition-all">
    <!-- Header Bar (Always visible) -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-2">
        <!-- Minimize / Expand Toggle Button -->
        <button
          class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 font-bold transition-colors"
          :title="isMinimized ? 'Expand Match Roster' : 'Minimize Match Roster'"
          @click="isMinimized = !isMinimized"
        >
          <span class="text-[10px]">{{ isMinimized ? '▶' : '▼' }}</span>
          <span class="font-bold">Match Roster</span>
        </button>

        <!-- Count indicator -->
        <span
          class="px-2 py-0.5 font-bold rounded text-[11px]"
          :class="activeCount <= 15 ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' : 'bg-amber-900/40 text-amber-300 border border-amber-700/50'"
        >
          {{ activeCount }} / 15 Playing ({{ 18 - activeCount }} Not In Game)
        </span>

        <!-- ME: (Color) indicator badge — clickable to open color picker -->
        <button
          class="relative flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 cursor-pointer hover:bg-yellow-400/30 hover:border-yellow-400/70 active:scale-95 transition-all group"
          data-test="player-selector-btn"
          title="Click to change your color"
          @click.stop="isColorPickerOpen = !isColorPickerOpen"
        >
          <span class="text-[10px] font-black tracking-wider text-yellow-400">ME:</span>
          <div class="w-4 h-4 flex items-center justify-center">
            <CrewIcon :color="crewStore.playerColor" :is-player="true" class="w-full h-full" />
          </div>
          <span class="text-[11px] font-bold capitalize text-white">{{ crewStore.playerColor }}</span>
          <span class="text-[9px] text-yellow-400/60 group-hover:text-yellow-400 transition-colors ml-0.5">▼</span>
        </button>
        <span
          class="inline max-w-[92px] text-[8px] sm:max-w-none sm:text-[9px] font-semibold leading-tight text-gray-400 dark:text-gray-500"
          title="Right-click a player bean to set it as Me"
        >
          Right click to set as Me
        </span>
      </div>

      <!-- Presets & Collapse State Control -->
      <div class="flex items-center gap-1 text-[11px]">
        <span v-if="!isMinimized" class="text-gray-400 mr-1 hidden sm:inline">Presets:</span>
        <button
          v-if="!isMinimized"
          class="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold transition-colors"
          title="Standard 15 players"
          @click="setPreset15"
        >
          15 Players
        </button>
        <button
          v-if="!isMinimized"
          class="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold transition-colors"
          title="10 players"
          @click="setPreset10"
        >
          10 Players
        </button>
        <button
          v-if="!isMinimized"
          class="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold transition-colors"
          data-test="activate-all-btn"
          title="All 18 players"
          @click="selectAll"
        >
          All 18
        </button>
        <button
          class="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 transition-colors ml-1"
          :title="isMinimized ? 'Expand Roster' : 'Minimize Roster'"
          @click="isMinimized = !isMinimized"
        >
          {{ isMinimized ? 'Expand' : 'Minimize' }}
        </button>
      </div>
    </div>

    <!-- Color Picker Popover (opens when ME badge is clicked) -->
    <Teleport to="body">
      <div
        v-if="isColorPickerOpen"
        class="fixed inset-0 z-50 select-none bg-transparent"
        @click.stop="isColorPickerOpen = false"
      >
        <div
          ref="colorPickerEl"
          class="fixed bg-gray-900 border border-yellow-400/50 rounded-lg shadow-2xl p-3 w-[280px] text-left"
          :style="colorPickerStyle"
          @click.stop
        >
          <div class="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-2">
            Choose your color
          </div>
          <div class="grid grid-cols-5 gap-1.5">
            <button
              v-for="color in allColors"
              :key="color"
              type="button"
              :data-test="`player-color-${color}`"
              class="flex flex-col items-center justify-center p-1 rounded transition-all cursor-pointer"
              :class="[
                isPlayerColor(color)
                  ? 'ring-2 ring-yellow-400 bg-yellow-400/20 scale-110 shadow-lg'
                  : 'bg-gray-800/80 hover:bg-gray-700 border border-gray-700/60 hover:border-gray-500'
              ]"
              style="width: 48px; min-height: 54px;"
              :title="`Set as ${color}`"
              @click="pickColor(color)"
            >
              <div class="w-5 h-5 flex items-center justify-center pointer-events-none">
                <CrewIcon :color="color" :is-player="isPlayerColor(color)" class="w-full h-full" />
              </div>
              <span class="text-[7px] font-bold capitalize text-gray-300 mt-0.5 leading-[8px] break-words w-full text-center">{{ color }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 18 Colors: Compact Bean Character Row (collapsible) -->
    <div
      v-if="!isMinimized"
      class="flex flex-wrap items-center justify-center gap-1.5 pt-2 mt-1.5 border-t border-gray-800"
    >
      <div
        v-for="color in allColors"
        :key="color"
        class="roster-bean relative flex flex-col items-center justify-center p-1 rounded transition-all cursor-pointer select-none"
        :class="[
          isMemberActive(color)
            ? 'bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 opacity-100'
            : 'bg-gray-900/40 hover:bg-gray-900/70 border border-dashed border-gray-800 opacity-30 grayscale',
          isPlayerColor(color) ? 'ring-2 ring-yellow-400 !border-yellow-400 !opacity-100 !grayscale-0 shadow-md' : ''
        ]"
        style="width: 56px; min-height: 58px;"
        :title="`${color} (${isMemberActive(color) ? 'Playing' : 'Not In Game'})${isPlayerColor(color) ? ' - You (Me - Cannot turn off)' : ''}. Click to toggle. Double click to set as Me.`"
        @click="toggleActive(color)"
        @contextmenu.prevent="setAsMyPlayer(color)"
        @dblclick.prevent="setAsMyPlayer(color)"
      >
        <!-- Bean Avatar -->
        <div class="w-6 h-6 flex items-center justify-center pointer-events-none">
          <CrewIcon
            :color="color"
            :is-dead="false"
            :is-player="isPlayerColor(color)"
            :show-player-name="false"
            class="w-full h-full"
          />
        </div>

        <!-- Dot / Me indicator -->
        <div class="mt-0.5 flex items-center justify-center">
          <span
            v-if="isPlayerColor(color)"
            class="text-[8px] font-black px-1 rounded bg-yellow-400 text-black leading-tight"
          >
            ME
          </span>
          <span
            v-else
            class="w-1.5 h-1.5 rounded-full"
            :class="isMemberActive(color) ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-gray-600'"
          />
        </div>

        <span class="mt-0.5 w-full text-center text-[8px] font-bold capitalize leading-[9px] text-gray-300 break-words">
          {{ color }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import allColors from '~/utils/playerColors.js'

const crewStore = useCrewStore()
const isMinimized = ref(false)
const isColorPickerOpen = ref(false)
const colorPickerEl = ref<HTMLElement | null>(null)

const activeCount = computed(() => {
  return crewStore.crewMembers.filter(m => m.isActive).length
})

// Position the color picker below the ME badge
const colorPickerStyle = computed(() => {
  const btn = document.querySelector('[data-test="player-selector-btn"]')
  if (!btn) return { top: '80px', left: '16px' }
  const rect = btn.getBoundingClientRect()
  const pickerWidth = 280
  let left = rect.left
  const top = rect.bottom + 6

  // Prevent overflow right
  if (left + pickerWidth > window.innerWidth - 8) {
    left = window.innerWidth - pickerWidth - 8
  }
  if (left < 8) left = 8

  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

function isMemberActive(color: string) {
  const m = crewStore.crewMembers.find(x => x.color === color)
  return m ? m.isActive : false
}

function isPlayerColor(color: string) {
  return crewStore.playerColor === color
}

function toggleActive(color: string) {
  crewStore.togglePlayerActive(color)
}

function setAsMyPlayer(color: string) {
  crewStore.setPlayerColor(color)
}

function pickColor(color: string) {
  crewStore.setPlayerColor(color)
  isColorPickerOpen.value = false
}

function setPreset15() {
  crewStore.setPresetPlayerCount(15)
}

function setPreset10() {
  crewStore.setPresetPlayerCount(10)
}

function selectAll() {
  crewStore.setPresetPlayerCount(18)
}
</script>

<style scoped>
.roster-bean {
  position: relative;
  flex-shrink: 0;
}
</style>
