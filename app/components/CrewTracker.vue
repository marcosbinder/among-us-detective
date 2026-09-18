<template>
  <div class="crew-tracker grid grid-cols-3" :class="trackerGridGapClass" data-test="crew-tracker">
    <!-- Column 1: Hard Clear (Top) & Trusted (Bottom) -->
    <div class="flex flex-col min-w-0" :class="trackerGridGapClass">
      <!-- Hard Clear Box -->
      <div
        class="flex flex-col rounded border border-emerald-600/40 dark:border-emerald-800/60 bg-white dark:bg-gray-800 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: hardClearList.length === 0 }"
      >
        <div
          class="bg-emerald-700 text-white font-bold flex items-center justify-between rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-hard-clear"
        >
          <span class="truncate">Hard Clear</span>
          <span class="opacity-80 font-normal ml-1">({{ hardClearList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: hardClearList.length === 0 }"
          data-test="crew-column-hard-clear"
        >
          <CrewPool
            class="pool--hard_clear flex-1"
            :crew-members="hardClearList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'hard_clear', value })"
            @removed="member => emit('removed', { list: 'hard_clear', member })"
          />
        </div>
      </div>

      <!-- Trusted Box (underneath Hard Clear) -->
      <div
        class="flex flex-col rounded border border-teal-600/40 dark:border-teal-800/60 bg-white dark:bg-gray-800 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: trustedList.length === 0 }"
      >
        <div
          class="bg-teal-700 text-white font-bold flex items-center justify-between rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-trusted"
        >
          <span class="truncate">Trusted</span>
          <span class="opacity-80 font-normal ml-1">({{ trustedList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: trustedList.length === 0 }"
          data-test="crew-column-trusted"
        >
          <CrewPool
            class="pool--trusted flex-1"
            :crew-members="trustedList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'trusted', value })"
            @removed="member => emit('removed', { list: 'trusted', member })"
          />
        </div>
      </div>
    </div>

    <!-- Column 2: Unknown (Top) & Dead (Bottom - underneath Unknown) -->
    <div class="flex flex-col min-w-0" :class="trackerGridGapClass">
      <!-- Unknown Box -->
      <div
        class="flex flex-col rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: unknownList.length === 0 }"
      >
        <div
          class="bg-gray-700 text-white font-bold flex items-center justify-between unknown-column rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-unknown"
        >
          <span class="truncate">Unknown</span>
          <span class="opacity-80 font-normal ml-1">({{ unknownList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: unknownList.length === 0 }"
          data-test="crew-column-unknown"
        >
          <CrewPool
            class="pool--unknown flex-1"
            :crew-members="unknownList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'unknown', value })"
            @removed="member => emit('removed', { list: 'unknown', member })"
          />
        </div>
      </div>

      <!-- Dead Box (underneath Unknown) -->
      <div
        class="flex flex-col rounded border border-neutral-700/80 bg-white dark:bg-gray-900 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: deadList.length === 0 }"
      >
        <div
          class="bg-neutral-800 text-red-400 font-bold flex items-center justify-between rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-dead"
        >
          <span class="truncate">Dead</span>
          <span class="opacity-80 font-normal ml-1">({{ deadList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 bg-neutral-900/40 rounded-b flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: deadList.length === 0 }"
          data-test="crew-column-dead"
        >
          <CrewPool
            class="pool--dead flex-1"
            :crew-members="deadList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'dead', value })"
            @removed="member => emit('removed', { list: 'dead', member })"
          />
        </div>
      </div>
    </div>

    <!-- Column 3: Impostor (Top) & Suspicious (Bottom) -->
    <div class="flex flex-col min-w-0" :class="trackerGridGapClass">
      <!-- Impostor Box -->
      <div
        class="flex flex-col rounded border border-rose-600/40 dark:border-rose-800/60 bg-white dark:bg-gray-800 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: impostorList.length === 0 }"
      >
        <div
          class="bg-rose-700 text-white font-bold flex items-center justify-between rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-impostor"
        >
          <span class="truncate">Impostor</span>
          <span class="opacity-80 font-normal ml-1">({{ impostorList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: impostorList.length === 0 }"
          data-test="crew-column-impostor"
        >
          <CrewPool
            class="pool--impostor flex-1"
            :crew-members="impostorList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'impostor', value })"
            @removed="member => emit('removed', { list: 'impostor', member })"
          />
        </div>
      </div>

      <!-- Suspicious Box (underneath Impostor) -->
      <div
        class="flex flex-col rounded border border-amber-600/40 dark:border-amber-800/60 bg-white dark:bg-gray-800 shadow-sm transition-all"
        :class="{ [boxMinHeightClass]: suspiciousList.length === 0 }"
      >
        <div
          class="bg-amber-700 text-white font-bold flex items-center justify-between rounded-t select-none"
          :class="headerPaddingClass"
          data-test="crew-col-header-suspicious"
        >
          <span class="truncate">Suspicious</span>
          <span class="opacity-80 font-normal ml-1">({{ suspiciousList.length }})</span>
        </div>
        <div
          class="p-0.5 sm:p-1 flex-1 flex flex-col"
          :class="{ [poolMinHeightClass]: suspiciousList.length === 0 }"
          data-test="crew-column-suspicious"
        >
          <CrewPool
            class="pool--suspicious flex-1"
            :crew-members="suspiciousList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'suspicious', value })"
            @removed="member => emit('removed', { list: 'suspicious', member })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CrewMember } from '~/stores/crew';

const props = defineProps<{
  playerColor: string
  hardClear: CrewMember[]
  trusted: CrewMember[]
  unknown: CrewMember[]
  suspicious: CrewMember[]
  impostor: CrewMember[]
  dead: CrewMember[]
  highlightColorNames?: boolean
  showPlayerNames?: boolean
}>()

const emit = defineEmits<{
  changed: [payload: { type: string; value: CrewMember[] }]
  removed: [payload: { list: string; member: CrewMember }]
}>()

const settingsStore = useSettingsStore()

const trackerGridGapClass = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') return 'gap-1 sm:gap-1.5'
  if (zoom === 'large') return 'gap-2 sm:gap-3.5'
  if (zoom === 'extra-large') return 'gap-2.5 sm:gap-4'
  return 'gap-1.5 sm:gap-2.5'
})

const boxMinHeightClass = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') return 'min-h-[72px] sm:min-h-[85px]'
  if (zoom === 'large') return 'min-h-[105px] sm:min-h-[130px]'
  if (zoom === 'extra-large') return 'min-h-[120px] sm:min-h-[150px]'
  return 'min-h-[90px] sm:min-h-[110px]'
})

const poolMinHeightClass = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') return 'min-h-[50px] sm:min-h-[65px]'
  if (zoom === 'large') return 'min-h-[75px] sm:min-h-[100px]'
  if (zoom === 'extra-large') return 'min-h-[90px] sm:min-h-[120px]'
  return 'min-h-[64px] sm:min-h-[85px]'
})

const headerPaddingClass = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') return 'px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[11px]'
  if (zoom === 'large') return 'px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-sm'
  if (zoom === 'extra-large') return 'px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-base'
  return 'px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs'
})

const hardClearList = computed({
  get: () => props.hardClear,
  set: (value: CrewMember[]) => emit('changed', { type: 'hard_clear', value }),
})

const trustedList = computed({
  get: () => props.trusted,
  set: (value: CrewMember[]) => emit('changed', { type: 'trusted', value }),
})

const unknownList = computed({
  get: () => props.unknown,
  set: (value: CrewMember[]) => emit('changed', { type: 'unknown', value }),
})

const suspiciousList = computed({
  get: () => props.suspicious,
  set: (value: CrewMember[]) => emit('changed', { type: 'suspicious', value }),
})

const impostorList = computed({
  get: () => props.impostor,
  set: (value: CrewMember[]) => emit('changed', { type: 'impostor', value }),
})

const deadList = computed({
  get: () => props.dead,
  set: (value: CrewMember[]) => emit('changed', { type: 'dead', value }),
})
</script>
