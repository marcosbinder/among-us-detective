<template>
  <div class="flex">
    <Modal @close="emit('close')">
      <template #title>Tasks & Visual Reference</template>
      <template #body>
        <!-- Detective Tip Banner -->
        <div class="p-2.5 mb-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <p class="font-bold mb-0.5 flex items-center gap-1.5 text-xs">
            <span>💡</span> Detective Knowledge
          </p>
          <ul class="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
            <li><strong class="font-semibold">🔑 Common Tasks:</strong> Either everyone in the lobby has them, or no one does. Catch impostors claiming a common task nobody has!</li>
            <li><strong class="font-semibold">👁️ Visual Tasks:</strong> Have visible in-game animations (shields, asteroids, trash, medbay scan). Proves innocence when visual tasks are ON.</li>
          </ul>
        </div>

        <!-- Controls: MapSelector, Search, Reset -->
        <div class="space-y-2 mb-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <MapSelector
              :selected-map="mapsStore.selectedMap"
              @map-selected="(map) => mapsStore.setSelectedMap(map)"
            />
            <button
              class="button-danger button-sm"
              data-test="reset-tasks-btn"
              title="Reset checked tasks"
              @click="tasksStore.resetAllTasks()"
            >
              Reset checks
            </button>
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
                class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                @click="searchQuery = ''"
              >
                ✕
              </button>
            </div>

            <!-- Filter Pills -->
            <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                v-for="filter in filterOptions"
                :key="filter.id"
                class="px-2 py-1 text-xs font-semibold rounded whitespace-nowrap transition-colors"
                :class="activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
                @click="activeFilter = filter.id"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700/60">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
              <tr>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Task Name</th>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Room / Location</th>
                <th class="p-2.5 font-bold text-gray-700 dark:text-gray-300">Properties</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
              <tr
                v-for="task in filteredTasks"
                :key="task.name"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">
                  <Checkbox
                    :id="`task-checkbox-${task.originalIndex}`"
                    :is-checked="task.isDone"
                    @changed="
                      (value) =>
                        tasksStore.setTask({
                          map: mapsStore.selectedMap,
                          taskIndex: task.originalIndex,
                          isDone: value,
                        })
                    "
                  >
                    {{ task.name }}
                  </Checkbox>
                </td>
                <td class="p-2.5 text-gray-600 dark:text-gray-400">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(loc, locIdx) in task.locations"
                      :key="locIdx"
                      class="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      📍 {{ loc }}
                    </span>
                  </div>
                </td>
                <td class="p-2.5 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(type, i) in task.types"
                      :key="i"
                      class="px-1.5 py-0.5 text-[10px] font-bold rounded"
                      :class="getTaskBadgeStyle(type)"
                    >
                      {{ getTaskTypeDisplay(type) }}
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

const activeFilter = ref("all");
const searchQuery = ref("");

const filterOptions = [
  { id: "all", label: "All" },
  { id: "visual", label: "👁️ Visual" },
  { id: "common", label: "🔑 Common" },
  { id: "short", label: "⚡ Short" },
  { id: "long", label: "⏱️ Long" },
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

function getTaskTypeDisplay(type: string): string {
  if (type.includes("Visual")) return "👁️ Visual";
  if (type.includes("Common")) return "🔑 Common";
  if (type.includes("Long")) return "⏱️ Long";
  if (type.includes("Short")) return "⚡ Short";
  return type;
}
</script>
