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

        <!-- ME: (Color) indicator badge -->
        <div
          class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 cursor-pointer hover:bg-yellow-400/25 transition-colors"
          title="This is your player. Double-click any bean below to change."
        >
          <span class="text-[10px] font-black tracking-wider text-yellow-400">ME:</span>
          <div class="w-4 h-4 flex items-center justify-center">
            <CrewIcon :color="crewStore.playerColor" :is-player="true" class="w-full h-full" />
          </div>
          <span class="text-[11px] font-bold capitalize text-white">{{ crewStore.playerColor }}</span>
        </div>
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

    <!-- 18 Colors: Compact Bean Character Row (collapsible) -->
    <div
      v-if="!isMinimized"
      class="flex flex-wrap items-center justify-center sm:justify-between gap-1.5 pt-2 mt-1.5 border-t border-gray-800"
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
        style="width: 38px; height: 44px;"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import allColors from '~/utils/playerColors.js'

const crewStore = useCrewStore()
const isMinimized = ref(false)

const activeCount = computed(() => {
  return crewStore.crewMembers.filter(m => m.isActive).length
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
