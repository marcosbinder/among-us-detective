<template>
  <div class="crew-tracker grid grid-cols-1 md:grid-cols-3 gap-2.5" data-test="crew-tracker">
    <!-- Column 1: Hard Clear (Top) & Trusted (Bottom) -->
    <div class="flex flex-col gap-2.5">
      <!-- Hard Clear Box -->
      <div class="flex flex-col rounded border border-emerald-600/40 dark:border-emerald-800/60 bg-white dark:bg-gray-800 shadow-sm" :class="{ 'min-h-[110px]': hardClearList.length === 0 }">
        <div class="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 flex items-center justify-between rounded-t" data-test="crew-col-header-hard-clear">
          <span>Hard Clear</span>
          <span class="text-[11px] opacity-80 font-normal">({{ hardClearList.length }})</span>
        </div>
        <div class="p-1" :class="{ 'min-h-[90px]': hardClearList.length === 0 }" data-test="crew-column-hard-clear">
          <CrewPool
            class="pool--hard_clear"
            :crew-members="hardClearList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'hard_clear', value })"
            @removed="member => emit('removed', { list: 'hard_clear', member })"
          />
        </div>
      </div>

      <!-- Trusted Box (underneath Hard Clear) -->
      <div class="flex flex-col rounded border border-teal-600/40 dark:border-teal-800/60 bg-white dark:bg-gray-800 shadow-sm" :class="{ 'min-h-[110px]': trustedList.length === 0 }">
        <div class="bg-teal-700 text-white text-xs font-bold px-2.5 py-1.5 flex items-center justify-between rounded-t" data-test="crew-col-header-trusted">
          <span>Trusted</span>
          <span class="text-[11px] opacity-80 font-normal">({{ trustedList.length }})</span>
        </div>
        <div class="p-1" :class="{ 'min-h-[90px]': trustedList.length === 0 }" data-test="crew-column-trusted">
          <CrewPool
            class="pool--trusted"
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
    <div class="flex flex-col gap-2.5">
      <!-- Unknown Box -->
      <div class="flex flex-col rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm" :class="{ 'min-h-[110px]': unknownList.length === 0 }">
        <div class="bg-gray-700 text-white text-xs font-bold px-2.5 py-1.5 flex items-center justify-between unknown-column rounded-t" data-test="crew-col-header-unknown">
          <span>Unknown</span>
          <span class="text-[11px] opacity-80 font-normal">({{ unknownList.length }})</span>
        </div>
        <div class="p-1" :class="{ 'min-h-[90px]': unknownList.length === 0 }" data-test="crew-column-unknown">
          <CrewPool
            class="pool--unknown"
            :crew-members="unknownList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'unknown', value })"
            @removed="member => emit('removed', { list: 'unknown', member })"
          />
        </div>
      </div>

      <!-- Dead Box (underneath Unknown) -->
      <div class="flex flex-col rounded border border-neutral-700/80 bg-white dark:bg-gray-900 shadow-sm" :class="{ 'min-h-[110px]': deadList.length === 0 }">
        <div class="bg-neutral-800 text-red-400 text-xs font-bold px-2.5 py-1.5 flex items-center justify-between rounded-t" data-test="crew-col-header-dead">
          <span>Dead</span>
          <span class="text-[11px] opacity-80 font-normal">({{ deadList.length }})</span>
        </div>
        <div class="p-1 bg-neutral-900/40 rounded-b" :class="{ 'min-h-[90px]': deadList.length === 0 }" data-test="crew-column-dead">
          <CrewPool
            class="pool--dead"
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
    <div class="flex flex-col gap-2.5">
      <!-- Impostor Box -->
      <div class="flex flex-col rounded border border-rose-600/40 dark:border-rose-800/60 bg-white dark:bg-gray-800 shadow-sm" :class="{ 'min-h-[110px]': impostorList.length === 0 }">
        <div class="bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 flex items-center justify-between rounded-t" data-test="crew-col-header-impostor">
          <span>Impostor</span>
          <span class="text-[11px] opacity-80 font-normal">({{ impostorList.length }})</span>
        </div>
        <div class="p-1" :class="{ 'min-h-[90px]': impostorList.length === 0 }" data-test="crew-column-impostor">
          <CrewPool
            class="pool--impostor"
            :crew-members="impostorList"
            :highlight-color-names="highlightColorNames"
            :show-player-names="showPlayerNames"
            @changed="value => emit('changed', { type: 'impostor', value })"
            @removed="member => emit('removed', { list: 'impostor', member })"
          />
        </div>
      </div>

      <!-- Suspicious Box (underneath Impostor) -->
      <div class="flex flex-col rounded border border-amber-600/40 dark:border-amber-800/60 bg-white dark:bg-gray-800 shadow-sm" :class="{ 'min-h-[110px]': suspiciousList.length === 0 }">
        <div class="bg-amber-700 text-white text-xs font-bold px-2.5 py-1.5 flex items-center justify-between rounded-t" data-test="crew-col-header-suspicious">
          <span>Suspicious</span>
          <span class="text-[11px] opacity-80 font-normal">({{ suspiciousList.length }})</span>
        </div>
        <div class="p-1" :class="{ 'min-h-[90px]': suspiciousList.length === 0 }" data-test="crew-column-suspicious">
          <CrewPool
            class="pool--suspicious"
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
