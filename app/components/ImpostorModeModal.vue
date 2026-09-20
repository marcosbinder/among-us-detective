<template>
  <div class="flex">
    <Modal max-width="700px" @close="emit('close')">
      <template #title>
        <div class="flex items-center gap-2 text-rose-500">
          <AppIcon name="skull" class="w-5 h-5 shrink-0" />
          <span>{{ t('impostor.modeTitle') }}</span>
        </div>
      </template>

      <template #body>
        <!-- Stealth Subtitle Banner -->
        <div class="p-2.5 mb-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-200 flex items-center justify-between gap-2 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span class="text-[11px] sm:text-xs">{{ t('impostor.subtitle') }}</span>
          </div>
          <span class="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-rose-600/30 text-rose-300 border border-rose-500/40">
            STEALTH HUD
          </span>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex gap-1 mb-3 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="px-3 py-1.5 text-xs font-bold rounded-t transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border-b-2 cursor-pointer"
            :class="activeTab === tab.id
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/10'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'"
            :data-test="`impostor-tab-${tab.id}`"
            @click="activeTab = tab.id"
          >
            <AppIcon :name="tab.icon" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- TAB 2: Fellow Impostors Coordination -->
        <div v-if="activeTab === 'teammates'" class="space-y-3" data-test="impostor-teammates-section">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ t('impostor.fellowImpostors') }}</span>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ t('impostor.coordination') }}</span>
            </div>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-bold rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              data-test="sync-impostors-btn"
              @click="syncImpostorsToBoard"
            >
              <AppIcon name="refresh" class="w-3.5 h-3.5" />
              <span>{{ t('impostor.syncToBoard') }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="member in crewStore.activeCrewMembers"
              :key="member.color"
              class="p-2 rounded-lg border flex items-center justify-between gap-2 transition-colors"
              :class="isTeammate(member.color)
                ? 'bg-rose-950/30 border-rose-500/60'
                : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60'"
            >
              <div class="flex items-center gap-2 min-w-0">
                <CrewIcon :color="member.color" class="w-6 h-6 shrink-0" />
                <div class="flex flex-col min-w-0">
                  <span class="text-xs font-bold capitalize text-gray-800 dark:text-gray-200 truncate">
                    {{ member.playerName || member.color }}
                  </span>
                  <span v-if="isTeammate(member.color)" class="text-[10px] font-semibold text-rose-400 uppercase">
                    {{ getTeammateRole(member.color) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <select
                  v-if="isTeammate(member.color)"
                  :value="getTeammateRole(member.color)"
                  class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gray-900 border border-rose-500/50 text-rose-300 focus:outline-none"
                  @change="(e: Event) => setTeammateRole(member.color, (e.target as HTMLSelectElement).value)"
                >
                  <option value="Impostor">Impostor</option>
                  <option value="Shapeshifter">Shapeshifter</option>
                  <option value="Phantom">Phantom</option>
                  <option value="Viper">Viper</option>
                </select>

                <button
                  type="button"
                  class="px-2 py-1 text-xs font-bold rounded border transition-colors cursor-pointer"
                  :class="isTeammate(member.color)
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-300 dark:hover:bg-gray-600'"
                  @click="toggleTeammate(member.color)"
                >
                  {{ isTeammate(member.color) ? t('impostor.partner') : t('impostor.addPartner') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Fake Tasks Advisor -->
        <div v-if="activeTab === 'faketasks'" class="space-y-3" data-test="impostor-faketasks-section">
          <!-- Visual Tasks Warning Alert -->
          <div class="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <AppIcon name="alert" class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong class="block font-bold mb-0.5">{{ t('impostor.visualTasksWarning') }}</strong>
              <span class="text-[11px] opacity-90">
                Crewmates can see Medbay scan, Shields lighting up, Asteroids guns firing, and Trash ejecting. Faking these will immediately expose you if animations are ON!
              </span>
            </div>
          </div>

          <!-- Safe Fake Tasks -->
          <div class="space-y-1.5">
            <span class="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <AppIcon name="check" class="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>{{ t('impostor.safeTasks') }}</span>
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                v-for="task in safeTasks"
                :key="task.name"
                class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex flex-col gap-1"
              >
                <div class="flex items-center justify-between font-bold text-gray-900 dark:text-gray-100">
                  <span>{{ task.name }}</span>
                  <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{{ task.duration }}</span>
                </div>
                <div class="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                  <AppIcon name="map" class="w-3 h-3 shrink-0" />
                  <span>{{ task.room }}</span>
                </div>
                <p class="text-[10px] text-gray-600 dark:text-gray-400 italic">"{{ task.tip }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: Sabotage & Alibi Planner -->
        <div v-if="activeTab === 'sabotage'" class="space-y-3" data-test="impostor-sabotage-section">
          <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ t('impostor.sabotagePlanner') }}</span>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div
              v-for="sab in sabotages"
              :key="sab.name"
              class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <AppIcon :name="sab.icon" class="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{{ sab.name }}</span>
                </span>
                <span class="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {{ sab.type }}
                </span>
              </div>
              <p class="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
                {{ sab.description }}
              </p>
              <div class="p-1.5 rounded bg-gray-100 dark:bg-gray-900 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <strong>Alibi Strategy:</strong> {{ sab.alibi }}
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: Frame Target / Scapegoat -->
        <div v-if="activeTab === 'frame'" class="space-y-3" data-test="impostor-frame-section">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ t('impostor.frameTarget') }}</span>
            <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ t('impostor.selectScapegoat') }}</span>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="member in nonImpostorActiveMembers"
              :key="member.color"
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5"
              :class="selectedScapegoat === member.color
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
              @click="selectedScapegoat = member.color"
            >
              <CrewIcon :color="member.color" class="w-4 h-4 shrink-0" />
              <span class="capitalize">{{ member.playerName || member.color }}</span>
            </button>
          </div>

          <div v-if="selectedScapegoat" class="p-3 rounded-lg bg-gray-900 border border-amber-500/40 space-y-2 mt-2">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AppIcon name="lightbulb" class="w-3.5 h-3.5 text-amber-400" />
              <span>Accusation Lines for {{ selectedScapegoatName }}:</span>
            </span>
            <ul class="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
              <li>"I saw <strong class="text-amber-300 capitalize">{{ selectedScapegoatName }}</strong> standing near the vent right before the lights went out."</li>
              <li>"<strong class="text-amber-300 capitalize">{{ selectedScapegoatName }}</strong> was lingering in the hallway without doing any tasks."</li>
              <li>"Didn't <strong class="text-amber-300 capitalize">{{ selectedScapegoatName }}</strong> claim a task in Medbay, but the bar never moved?"</li>
            </ul>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCrewStore } from '~/stores/crew';
import { useImpostorStore } from '~/stores/impostor';
import { useI18n } from '~/composables/useI18n';

const emit = defineEmits<{ close: [] }>();

const crewStore = useCrewStore();
const impostorStore = useImpostorStore();
const { t } = useI18n();

const tabs = computed(() => [
  { id: 'faketasks', label: t('impostor.tabFakeTasks'), icon: 'tasks' },
  { id: 'teammates', label: t('impostor.tabTeammates'), icon: 'users' },
  { id: 'sabotage', label: t('impostor.tabSabotage'), icon: 'alert' },
  { id: 'frame', label: t('impostor.tabFrame'), icon: 'target' },
]);

const activeTab = ref('faketasks');

// Teammates State synced with impostorStore
function isTeammate(color: string): boolean {
  return impostorStore.isFellowImpostor(color);
}

function getTeammateRole(color: string): string {
  return impostorStore.fellowImpostorRoles[color] || 'Impostor';
}

function toggleTeammate(color: string) {
  impostorStore.toggleFellowImpostor(color);
}

function setTeammateRole(color: string, role: string) {
  impostorStore.setFellowImpostorRole(color, role);
}

function syncImpostorsToBoard() {
  for (const color of impostorStore.fellowImpostors) {
    crewStore.setPlayerStatus(color, 'impostor');
    const role = impostorStore.fellowImpostorRoles[color] || 'Impostor';
    crewStore.setPlayerRole(color, role, true);
  }
}

// Fake Tasks Advisor
const safeTasks = [
  { name: 'Download / Upload Data', room: 'Cafeteria, Weapons, Admin', duration: '~8.7s', tip: 'Stand still near the terminal for around 9 seconds. Great place to blend in.' },
  { name: 'Fix Wiring (Stage 1-3)', room: 'Electrical, Storage, Admin', duration: '~3.0s', tip: 'Always common if present. Pause for 2-4 seconds, never instant.' },
  { name: 'Swipe Card', room: 'Admin', duration: '~2.5s', tip: 'Common task. If one has it, all do. Wait for others to swipe first.' },
  { name: 'Calibrate Distributor', room: 'Electrical', duration: '~4.5s', tip: 'Great bait task. Stand near the distributor while teammates lurk in vents.' },
  { name: 'Fuel Engines', room: 'Storage & Engines', duration: '~3.5s', tip: 'Running back and forth between Storage and Engines creates a legitimate alibi route.' },
  { name: 'Divert Power', room: 'Electrical & Various', duration: '~2.0s', tip: 'Short, natural stop in electrical. Good setup for lights sabotage.' },
];

// Sabotages
const sabotages = [
  {
    name: 'Electrical (Lights)',
    icon: 'lightbulb',
    type: 'Vision Disruption',
    description: 'Reduces crewmate field of vision to immediate circle. Impostor vision remains 100% normal.',
    alibi: 'Pretend to run to Electrical to fix lights, get a stack kill on the electrical box, then pretend to flip switches.'
  },
  {
    name: 'Reactor Meltdown',
    icon: 'alert',
    type: 'Critical Crisis',
    description: 'Requires two players to hold hands at opposite reactor pads within 30-45 seconds or game is lost.',
    alibi: 'Forces everyone to the left side of the map. Perfect for killing an isolated player on the far right.'
  },
  {
    name: 'O2 Depletion',
    icon: 'alert',
    type: 'Critical Crisis',
    description: 'Two separate pin codes must be entered in Admin and O2 hallway before time expires.',
    alibi: 'Splits crew into two distant groups. Stand at Admin pad and pretend you entered the wrong code.'
  },
  {
    name: 'Communications',
    icon: 'notes',
    type: 'Surveillance Blind',
    description: 'Wipes security cameras, Admin player counters, Vitals monitor, and hides task arrows.',
    alibi: 'Best used when preparing a Shapeshifter or Vent kill so security cameras cannot catch you.'
  }
];

// Scapegoat State
const selectedScapegoat = ref<string>('');
const nonImpostorActiveMembers = computed(() => {
  return crewStore.activeCrewMembers.filter(m => !isTeammate(m.color));
});
const selectedScapegoatName = computed(() => {
  const member = crewStore.crewMembers.find(m => m.color === selectedScapegoat.value);
  return member?.playerName || selectedScapegoat.value;
});
</script>
