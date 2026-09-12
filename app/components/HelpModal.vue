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
      "<b>Match roster:</b> Click a bean to toggle whether that player is active. Double-click or right-click a bean to set it as <b>ME</b>, or click the ME badge to choose your color.",
  },
  {
    description:
      "<b>Deduction board:</b> Use the six columns to organize players: <b>Hard Clear</b>, <b>Trusted</b>, <b>Unknown</b>, <b>Suspicious</b>, <b>Impostor</b>, and <b>Dead</b>.",
  },
  {
    description: "<b>Drag and drop:</b> Drag player beans between columns to classify them as the game develops.",
  },
  {
    description: "<b>Role assignment:</b> Click a player bean to open the role popover with Crew and Impostor roles.",
  },
  {
    description:
      "<b>Verification:</b> A yellow <b>?</b> means CLAIMED. Confirmed Crew roles show a green <b>check</b>; confirmed Impostor roles show a red <b>check</b>.",
  },
  {
    description:
      "<b>Role states:</b> Assigning a role records a claim. Confirming a Crew role moves the player to Hard Clear; confirming an Impostor role moves them to Impostor.",
  },
  {
    description:
      "<b>Dead players:</b> Drag a player to Dead or double-click a bean. Verified roles remain verified while dead; moving the player back to a living column clears verification.",
  },
  {
    description:
      "<b>New round:</b> Dead players and verified deductions are preserved. Unverified deductions reset to Unknown.",
  },
  {
    description:
      "<b>New game:</b> Reset the game state while keeping the lobby roster and player names.",
  },
  {
    description:
      "<b>Notes:</b> Click Notes or press <b>N</b>. Round notes clear each round; game notes follow the setting for new games.",
  },
  {
    description:
      "<b>Map:</b> Click Show map or press <b>M</b>, then drag beans onto the map to track locations.",
  },
  {
    description:
      "<b>Tasks:</b> Open Tasks to track fake tasks for the selected map and reset them when needed.",
  },
  {
    description:
      "<b>Keyboard shortcuts:</b> <b>N</b> toggles Notes, <b>M</b> toggles the map, and <b>Escape</b> closes Notes.",
  },
  {
    description:
      "<b>Settings, Help, and About:</b> Use the bottom toolbar to customize the app, reopen this guide, or view app information.",
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
