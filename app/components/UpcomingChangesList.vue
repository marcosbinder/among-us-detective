<template>
  <section class="upcoming-changes">
    <div class="p-2 overflow-y-scroll rounded max-h-64 bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200">
      <span class="text-xs font-bold text-gray-900 dark:text-gray-100">Planned features and improvements:</span>
      <ul class="pl-4 mb-4 text-sm leading-5 list-disc text-gray-700 dark:text-gray-300">
        <li v-for="(item, index) in upcomingChanges" :key="index">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const upcomingChanges: string[] = [
  'Dedicated Impostor Mode — specialized workspace when playing as Impostor with kill cooldown tracker, alibi disruption tools, fake task router, and sabotage coordination',
  'Map Location Drop Pins — drag player tokens onto map rooms as (x, y) pins without removing cards from the deduction board',
  'Clear Map Tokens — one-click wipe for round map pins between meetings',
  'Dual Focus-Safe Notes — volatile round notepad (auto-cleared each round) and persistent match notes with proper cursor focus retention',
  'Fix tracking fellow imposters when you are an impostor too',
  'Optional saving of all state after page reload',
  'Fix double-click shortcuts on mobile',
  'Text guide for new players',
]
</script>
