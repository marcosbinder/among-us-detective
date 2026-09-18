<template>
  <div class="flex flex-col" data-test="notes-container">
    <div
      v-if="roundsStore.isViewingHistory"
      class="p-2 mb-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-500 text-xs font-semibold flex items-center justify-between"
    >
      <span class="flex items-center gap-1">
        <AppIcon name="clock" class="w-3.5 h-3.5 shrink-0" />
        <span>Archived notes from Round {{ roundsStore.viewingRoundNumber }} (Read-Only)</span>
      </span>
      <button
        class="text-[11px] underline hover:text-amber-400 font-bold"
        @click="roundsStore.setViewingRound(null)"
      >
        Return to Live
      </button>
    </div>

    <div v-show="showRoundNotes" class="my-2 round-notes-wrapper">
      <span class="text-sm text-red-500">{{ speechError }}</span>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <label
            for="round-notes"
            class="block mr-1 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300"
          >
            <template v-if="roundsStore.isViewingHistory">
              Round {{ roundsStore.viewingRoundNumber }} Notes
            </template>
            <template v-else>This round</template>
          </label>
          <button
            v-if="isSpeechRecognitionSupported && !roundsStore.isViewingHistory"
            class="relative flex items-center justify-center w-8 h-8 record-round-button"
            :class="{
              'text-player-green': isRecordingRoundNotes,
              'text-player-red':
                lastRecordedType === 'roundNotes' && speechError.length > 0,
            }"
            @click="toggleRecordRoundNotes"
          >
            <span class="icon-mic" />
          </button>
        </div>
        <span class="text-xs leading-5 text-gray-500 dark:text-gray-400">
          <template v-if="roundsStore.isViewingHistory">Snapshot (read-only)</template>
          <template v-else>Cleared each round</template>
        </span>
      </div>
      <div class="relative mt-1 rounded-md">
        <textarea
          id="round-notes"
          ref="roundNotesEl"
          v-model="displayRoundNotes"
          :readonly="roundsStore.isViewingHistory"
          placeholder="e.g. Red saw me do medbay"
          rows="5"
          class="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          :class="{ 'opacity-80 bg-gray-50 dark:bg-gray-900 cursor-not-allowed': roundsStore.isViewingHistory }"
        />
      </div>
    </div>
    <div class="game-notes-wrapper">
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <label
            for="game-notes"
            class="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-300"
          >
            <template v-if="resetNotesOnNewGame">This game</template>
            <template v-else>General</template>
          </label>
          <button
            v-if="isSpeechRecognitionSupported"
            class="relative flex items-center justify-center w-8 h-8 record-round-button"
            :class="{
              'text-player-green': isRecordingGameNotes,
              'text-player-red':
                lastRecordedType === 'gameNotes' && speechError.length > 0,
            }"
            @click="toggleRecordGameNotes"
          >
            <span class="icon-mic" />
          </button>
        </div>
        <span class="text-xs leading-5 text-gray-500 dark:text-gray-400">
          <template v-if="resetNotesOnNewGame">Cleared each game</template>
          <template v-else>Never cleared</template>
        </span>
      </div>
      <div class="relative w-full mt-1">
        <textarea
          id="game-notes"
          ref="gameNotesEl"
          v-model="gameNotes"
          placeholder="e.g. Orange and cyan are a group"
          rows="5"
          class="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HighlightWithinTextarea from "~/utils/highlight-within-textarea.js";
import allColors from "~/utils/playerColors.js";

/* global webkitSpeechRecognition, webkitSpeechGrammarList */
declare const webkitSpeechRecognition: any;
declare const webkitSpeechGrammarList: any;

const notesStore = useNotesStore();
const roundsStore = useRoundsStore();
const settingsStore = useSettingsStore();
const { resetNotesOnNewGame, showRoundNotes } = storeToRefs(settingsStore);

const roundNotesEl = ref<HTMLTextAreaElement | null>(null);
const gameNotesEl = ref<HTMLTextAreaElement | null>(null);

const isRecordingRoundNotes = ref(false);
const isRecordingGameNotes = ref(false);
const speechError = ref("");
const lastRecordedType = ref("");
let speechRecognition: any = null;
let roundNotesHighlighter: any = null;
let gameNotesHighlighter: any = null;

const isSpeechRecognitionSupported = computed(
  () => typeof webkitSpeechRecognition !== "undefined"
);

const displayRoundNotes = computed({
  get: () => {
    if (roundsStore.isViewingHistory && roundsStore.activeSnapshot) {
      return roundsStore.activeSnapshot.roundNotes || "";
    }
    return notesStore.roundNotes;
  },
  set: (value: string) => {
    if (roundsStore.isViewingHistory) return;
    notesStore.setRoundNotes(value);
    roundNotesHighlighter?.handleInput();
  },
});

const gameNotes = computed({
  get: () => notesStore.gameNotes,
  set: (value: string) => {
    notesStore.setGameNotes(value);
    gameNotesHighlighter?.handleInput();
  },
});

function getEffectiveSpeechLanguage(): string {
  if (settingsStore.speechLanguage === "auto") {
    return typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : "en-US";
  }
  return settingsStore.speechLanguage;
}

watch(
  () => settingsStore.speechLanguage,
  () => {
    if (speechRecognition) {
      speechRecognition.lang = getEffectiveSpeechLanguage();
    }
  }
);

watch(
  () => roundsStore.viewingRoundNumber,
  () => {
    nextTick(() => {
      roundNotesHighlighter?.handleInput();
    });
  }
);

onMounted(() => {
  const playerHighlightColors = (allColors as string[]).map((color) => ({
    highlight: color,
    className: `bg-player-${color}-light`,
  }));
  if (roundNotesEl.value) {
    roundNotesHighlighter = new HighlightWithinTextarea(roundNotesEl.value, {
      highlight: playerHighlightColors,
    });
  }
  if (gameNotesEl.value) {
    gameNotesHighlighter = new HighlightWithinTextarea(gameNotesEl.value, {
      highlight: playerHighlightColors,
    });
  }
  initSpeechRecording();
  roundNotesEl.value?.focus();
});

function initSpeechRecording() {
  if (!isSpeechRecognitionSupported.value) return;
  speechRecognition = new webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.maxAlternatives = 1;
  speechRecognition.lang = getEffectiveSpeechLanguage();

  if (
    typeof webkitSpeechGrammarList !== "undefined" &&
    webkitSpeechGrammarList != null
  ) {
    const grammar =
      "#JSGF V1.0; grammar colors; public <color> = " +
      (allColors as string[]).join(" | ") +
      " ;";
    const speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    speechRecognition.grammars = speechRecognitionList;
  }

  speechRecognition.onstart = () => {
    speechError.value = "";
  };

  speechRecognition.onresult = (event: any) => {
    let finalTranscript = "";
    speechError.value = "";
    if (typeof event.results === "undefined") {
      speechRecognition.onend = null;
      speechRecognition.stop();
      return;
    }
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    const sanitized = finalTranscript.replace(/newline|new line|enter/gi, "\n");
    if (lastRecordedType.value === "roundNotes") {
      notesStore.setRoundNotes(notesStore.roundNotes + sanitized);
      roundNotesHighlighter?.handleInput();
    } else {
      notesStore.setGameNotes(notesStore.gameNotes + sanitized);
      gameNotesHighlighter?.handleInput();
    }
  };

  speechRecognition.onerror = (event: any) => {
    if (event.error === "no-speech") speechError.value = "No speech detected";
    if (event.error === "audio-capture")
      speechError.value = "Check your recording device";
    if (event.error === "not-allowed")
      speechError.value = "Check recording permissions in your browser";
    isRecordingRoundNotes.value = false;
    isRecordingGameNotes.value = false;
  };
}

function toggleRecordRoundNotes() {
  if (!isRecordingRoundNotes.value) {
    isRecordingRoundNotes.value = true;
    lastRecordedType.value = "roundNotes";
    speechRecognition?.start();
  } else {
    isRecordingRoundNotes.value = false;
    speechRecognition?.stop();
    roundNotesHighlighter?.handleInput();
    setTimeout(() => {
      if (roundNotesEl.value) {
        roundNotesEl.value.scrollTop = roundNotesEl.value.scrollHeight;
      }
    }, 500);
  }
}

function toggleRecordGameNotes() {
  if (!isRecordingGameNotes.value) {
    isRecordingGameNotes.value = true;
    lastRecordedType.value = "gameNotes";
    speechRecognition?.start();
  } else {
    isRecordingGameNotes.value = false;
    speechRecognition?.stop();
    gameNotesHighlighter?.handleInput();
    setTimeout(() => {
      if (gameNotesEl.value) {
        gameNotesEl.value.scrollTop = gameNotesEl.value.scrollHeight;
      }
    }, 500);
  }
}
</script>

<style lang="scss" scoped>
.record-round-button {
  bottom: 5px;
}
</style>
