<template>
  <div class="flex">
    <Modal @close="emit('close')">
      <template #title>Tasks & Visual Reference</template>
      <template #body>
        <!-- Impostor Fake Tasks Alert Banner (when Impostor Mode is active) -->
        <div
          v-if="impostorStore.isImpostorModeActive"
          class="p-2.5 mb-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-900 dark:text-red-200 leading-relaxed shadow-sm"
        >
          <div class="flex items-center justify-between font-bold mb-1">
            <span class="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-400">
              <AppIcon name="flame" class="w-4 h-4 shrink-0" />
              <span>Impostor Tactics: Fake Tasks Advisory</span>
            </span>
            <span class="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/20 text-red-700 dark:text-red-300 font-bold">
              Impostor Mode
            </span>
          </div>
          <p class="text-[11px] opacity-90 mb-1">
            ⚠️ <strong>Never fake Visual Tasks</strong> if visual animations are ON in match settings — crewmates will see no animation and report you!
          </p>
          <p class="text-[11px] opacity-90">
            🎯 <strong>Safe to fake:</strong> Common tasks (only if everyone has them) or Short tasks without animations (Wires, Download, Swipe Card). Stand at the station for the realistic duration!
          </p>
        </div>

        <!-- Detective Tip Banner -->
        <div class="p-2.5 mb-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <p class="font-bold mb-1 flex items-center gap-1.5 text-xs">
            <AppIcon name="lightbulb" class="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Detective Knowledge</span>
          </p>
          <ul class="list-disc list-inside space-y-1 text-[11px] opacity-90">
            <li>
              <span class="inline-flex items-center gap-1 font-semibold text-blue-900 dark:text-blue-200">
                <AppIcon name="key" class="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                Common Tasks:
              </span>
              Either everyone in the lobby has them, or no one does. Catch impostors claiming a common task nobody has!
            </li>
            <li>
              <span class="inline-flex items-center gap-1 font-semibold text-emerald-900 dark:text-emerald-200">
                <AppIcon name="eye" class="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                Visual Tasks:
              </span>
              Have visible in-game animations (shields, asteroids, trash, medbay scan). Proves innocence when visual tasks are ON.
            </li>
          </ul>
        </div>

        <!-- Controls: MapSelector and Search -->
        <div class="space-y-2 mb-3">
          <div class="flex items-center justify-between gap-2">
            <MapSelector
              :selected-map="mapsStore.selectedMap"
              @map-selected="(map) => mapsStore.setSelectedMap(map)"
            />
          </div>

          <!-- Search & Filter Bar -->
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search task or room name..."
                class="w-full px-3 py-1.5 text-xs rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                v-if="searchQuery"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center"
                @click="searchQuery = ''"
              >
                <AppIcon name="close" class="w-3 h-3" />
              </button>
            </div>

            <!-- Filter Pills -->
            <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                v-for="filter in filterOptions"
                :key="filter.id"
                class="px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1"
                :class="activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
                @click="activeFilter = filter.id"
              >
                <AppIcon v-if="filter.icon" :name="filter.icon" class="w-3.5 h-3.5 shrink-0" />
                <span>{{ filter.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700/60 shadow-inner">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="sticky top-0 bg-gray-100 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
              <tr>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Task Name</th>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Room / Location</th>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Classification</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
              <tr
                v-for="task in filteredTasks"
                :key="task.name"
                class="hover:bg-blue-50/40 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td class="p-2.5 font-semibold text-gray-900 dark:text-gray-100">
                  {{ task.name }}
                </td>
                <td class="p-2.5 text-gray-600 dark:text-gray-400">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(loc, locIdx) in task.locations"
                      :key="locIdx"
                      class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      <AppIcon name="pin" class="w-3 h-3 text-red-500/80 shrink-0" />
                      <span>{{ loc }}</span>
                    </span>
                  </div>
                </td>
                <td class="p-2.5 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(type, i) in task.types"
                      :key="i"
                      class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded"
                      :class="getTaskBadgeStyle(type)"
                    >
                      <AppIcon v-if="getTaskTypeInfo(type).icon" :name="getTaskTypeInfo(type).icon" class="w-3 h-3 shrink-0" />
                      <span>{{ getTaskTypeInfo(type).label }}</span>
                    </span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTasks.length === 0">
                <td colspan="3" class="p-6 text-center text-gray-400 dark:text-gray-500">
                  No tasks found matching your filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

const tasksStore = useTasksStore();
const mapsStore = useMapsStore();
const impostorStore = useImpostorStore();

const activeFilter = ref("all");
const searchQuery = ref("");

const filterOptions = [
  { id: "all", label: "All", icon: "" },
  { id: "visual", label: "Visual", icon: "eye" },
  { id: "common", label: "Common", icon: "key" },
  { id: "short", label: "Short", icon: "zap" },
  { id: "long", label: "Long", icon: "timer" },
];

const currentMapTasks = computed(() => {
  const list = tasksStore.tasks[mapsStore.selectedMap] ?? [];
  return list.map((task, originalIndex) => ({
    ...task,
    originalIndex,
  }));
});

const filteredTasks = computed(() => {
  return currentMapTasks.value.filter((task) => {
    if (
      activeFilter.value === "visual" &&
      !task.types.some((t) => t.toLowerCase().includes("visual"))
    ) {
      return false;
    }
    if (
      activeFilter.value === "common" &&
      !task.types.some((t) => t.toLowerCase().includes("common"))
    ) {
      return false;
    }
    if (
      activeFilter.value === "short" &&
      !task.types.some((t) => t.toLowerCase().includes("short"))
    ) {
      return false;
    }
    if (
      activeFilter.value === "long" &&
      !task.types.some((t) => t.toLowerCase().includes("long"))
    ) {
      return false;
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = task.name.toLowerCase().includes(q);
      const matchLocation = task.locations.some((loc) =>
        loc.toLowerCase().includes(q)
      );
      return matchName || matchLocation;
    }

    return true;
  });
});

function getTaskBadgeStyle(type: string): string {
  if (type.includes("Visual")) {
    return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
  }
  if (type.includes("Common")) {
    return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30";
  }
  if (type.includes("Long")) {
    return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30";
  }
  if (type.includes("Short")) {
    return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30";
  }
  return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
}

function getTaskTypeInfo(type: string): { label: string; icon: string } {
  if (type.includes("Visual")) return { label: "Visual", icon: "eye" };
  if (type.includes("Common")) return { label: "Common", icon: "key" };
  if (type.includes("Long")) return { label: "Long", icon: "timer" };
  if (type.includes("Short")) return { label: "Short", icon: "zap" };
  return { label: type, icon: "" };
}
</script>
