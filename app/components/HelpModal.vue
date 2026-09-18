<template>
  <Modal @close="emit('close')">
    <template #title>How to use</template>
    <template #body>
      <div
        v-if="currentStepData"
        :key="currentStepIndex"
        class="mb-4 text-sm leading-5 text-gray-700 dark:text-gray-300"
      >
        <template v-if="currentStepData.media">
          <picture
            v-if="currentStepData.media.type === 'image'"
            class="mx-auto mb-4"
          >
            <source
              :srcset="`/help/${currentStepData.media.webp}`"
              type="image/webp"
            />
            <source
              :srcset="`/help/${currentStepData.media.png}`"
              type="image/png"
            />
            <img
              :src="`/help/${currentStepData.media.png}`"
              alt="Step demonstration"
            />
          </picture>
          <video
            v-else-if="currentStepData.media.type === 'video'"
            :key="`video-${currentStepIndex}`"
            autoplay
            loop
            class="mx-auto mb-4"
          >
            <source
              :src="`/help/${currentStepData.media.webm}`"
              type="video/webm"
            />
            <source
              :src="`/help/${currentStepData.media.mp4}`"
              type="video/mp4"
            />
          </video>
        </template>
        <div v-html="currentStepData.description" class="py-4 text-center" />
      </div>
      <div class="flex justify-between">
        <button
          class="button"
          :disabled="currentStep <= 0"
          data-test="help-prev-btn"
          @click="currentStep--"
        >
          Previous
        </button>
        <span
          class="flex items-center justify-center text-gray-500 dark:text-gray-400"
          data-test="help-step-counter"
          >{{ currentStep + 1 }}/{{ steps.length }}</span
        >
        <button
          v-show="currentStep < steps.length - 1"
          class="button"
          :disabled="currentStep >= steps.length - 1"
          data-test="help-next-btn"
          @click="currentStep++"
        >
          Next
        </button>
        <button
          v-show="currentStep >= steps.length - 1"
          class="button"
          data-test="help-close-btn"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
interface StepMedia {
  type: "image" | "video";
  webp?: string;
  png?: string;
  webm?: string;
  mp4?: string;
}

interface Step {
  description: string;
  media?: StepMedia | null;
}

const emit = defineEmits<{ close: [] }>();

const currentStepIndex = ref(0);

const steps: Step[] = [
  {
    description:
      "<b>Match roster:</b> Click a bean in the top roster to toggle active players. Use presets (10, 12, 15) and click the <b>ME</b> badge to set your player color.",
    media: {
      type: "video",
      webm: "changing-player-color.webm",
      mp4: "changing-player-color.mp4",
    },
  },
  {
    description:
      "<b>Deduction board:</b> Organize players across six columns: <b>Hard Clear</b>, <b>Trusted</b>, <b>Unknown</b>, <b>Suspicious</b>, <b>Impostor</b>, and <b>Dead</b>.",
    media: {
      type: "image",
      webp: "innocent-suspect-count.webp",
      png: "innocent-suspect-count.png",
    },
  },
  {
    description:
      "<b>Drag & drop:</b> Drag player cards between columns to classify them as your deductions develop.",
    media: {
      type: "video",
      webm: "marking-as-innocent.webm",
      mp4: "marking-as-innocent.mp4",
    },
  },
  {
    description:
      "<b>Role assignment:</b> Click a player card to open the popover menu. Assign official Crew roles (Detective, Judge, Scientist, Engineer, Noisemaker) or Impostor roles (Shapeshifter, Phantom, Viper).",
  },
  {
    description:
      "<b>Claimed vs. Verified:</b> A yellow <b>?</b> badge means CLAIMED. Verified roles display a green or red <b>check</b> badge. Confirming a Crew role moves them to Hard Clear; confirming an Impostor role moves them to Impostor.",
  },
  {
    description:
      "<b>Dead players:</b> Double-click a card or open the card popover and tap <b>💀 Mark as Dead</b>. Dead players display the round they died in (e.g. <b>R1</b>) and remain dead in all future rounds.",
    media: {
      type: "video",
      webm: "marking-as-dead.webm",
      mp4: "marking-as-dead.mp4",
    },
  },
  {
    description:
      "<b>New round & Snapshots:</b> When a meeting ends, click <b>New round</b>. The current round is archived into a permanent snapshot, and the board advances into Round 2 with all your current deductions preserved!",
    media: {
      type: "video",
      webm: "new-round.webm",
      mp4: "new-round.mp4",
    },
  },
  {
    description:
      "<b>Timeline navigation:</b> Click <b>R1</b>, <b>R2</b>, etc., in the header to inspect past round theories. Cards display an evolution tag (e.g. <b>Now: Hard Clear</b>) to easily spot contradictions!",
  },
  {
    description:
      "<b>New match:</b> When a game concludes, click <b>New match</b>. This clears round history and resets deductions to Unknown, while keeping your active lobby roster intact.",
    media: {
      type: "video",
      webm: "new-game.webm",
      mp4: "new-game.mp4",
    },
  },
  {
    description:
      "<b>Dual notes:</b> Press <b>N</b> to open Notes. Round notes save with each round snapshot, while Match notes persist across the entire game. Multi-language speech-to-text is supported!",
    media: {
      type: "video",
      webm: "taking-notes.webm",
      mp4: "taking-notes.mp4",
    },
  },
  {
    description:
      "<b>Interactive maps:</b> Press <b>M</b> or click Show map, then drag player beans onto rooms to track sightings and kills. Players who died in earlier rounds are automatically hidden.",
    media: {
      type: "video",
      webm: "tracking-on-map.webm",
      mp4: "tracking-on-map.mp4",
    },
  },
  {
    description:
      "<b>Tasks reference:</b> Click <b>Tasks Reference</b> in the bottom bar to review tasks by room, with warnings for visual tasks and common tasks.",
    media: {
      type: "video",
      webm: "tasks.webm",
      mp4: "tasks.mp4",
    },
  },
  {
    description:
      "<b>Keyboard shortcuts:</b> <b>N</b> = Notes, <b>M</b> = Map, <b>Escape</b> = Close modals. Customize your experience (Board Zoom, theme, languages) in <b>Settings</b>.",
  },
];

const currentStepData = computed((): Step => steps[currentStepIndex.value]);

const currentStep = computed({
  get: (): number => currentStepIndex.value,
  set: (value: number) => {
    currentStepIndex.value = value;
  },
});
</script>
