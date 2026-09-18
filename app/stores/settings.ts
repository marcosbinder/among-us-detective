export const useSettingsStore = defineStore(
  "settings",
  () => {
    const highlightColorNames = ref(false);
    const showImposterCheckbox = ref(true);
    const showTasksCheckbox = ref(true);
    const showMeetingsCount = ref(true);
    const showPlayerNames = ref(false);
    const showMapColorNames = ref(false);
    const settingsModalOpenState = ref(false);
    const resetNotesOnNewGame = ref(true);
    const showRoundNotes = ref(true);
    const canTrackOwnColor = ref(true);
    const isImproveMapContrastEnabled = ref(true);
    const boardZoom = ref<'compact' | 'normal' | 'large' | 'extra-large'>('normal');
    const speechLanguage = ref<'auto' | 'pt-BR' | 'en-US' | 'es-ES'>('auto');

    function setBoardZoom(value: 'compact' | 'normal' | 'large' | 'extra-large') {
      boardZoom.value = value;
    }

    function setSpeechLanguage(value: 'auto' | 'pt-BR' | 'en-US' | 'es-ES') {
      speechLanguage.value = value;
    }

    function setHighlightColorNames(value: boolean) {
      highlightColorNames.value = value;
    }
    function setShowImposterCheckbox(value: boolean) {
      showImposterCheckbox.value = value;
    }
    function setShowTasksCheckbox(value: boolean) {
      showTasksCheckbox.value = value;
    }
    function setShowMeetingsCount(value: boolean) {
      showMeetingsCount.value = value;
    }
    function setShowPlayerNames(value: boolean) {
      showPlayerNames.value = value;
    }
    function setShowMapColorNames(value: boolean) {
      showMapColorNames.value = value;
    }
    function setSettingsModalOpenState(value: boolean) {
      settingsModalOpenState.value = value;
    }
    function setResetNotesOnNewGame(value: boolean) {
      resetNotesOnNewGame.value = value;
    }
    function setShowRoundNotes(value: boolean) {
      showRoundNotes.value = value;
    }
    function setCanTrackOwnColor(value: boolean) {
      canTrackOwnColor.value = value;
    }
    function setIsImproveMapContrastEnabled(value: boolean) {
      isImproveMapContrastEnabled.value = value;
    }

    return {
      highlightColorNames,
      showImposterCheckbox,
      showTasksCheckbox,
      showMeetingsCount,
      showPlayerNames,
      showMapColorNames,
      settingsModalOpenState,
      resetNotesOnNewGame,
      showRoundNotes,
      canTrackOwnColor,
      isImproveMapContrastEnabled,
      boardZoom,
      speechLanguage,
      setHighlightColorNames,
      setShowImposterCheckbox,
      setShowTasksCheckbox,
      setShowMeetingsCount,
      setShowPlayerNames,
      setShowMapColorNames,
      setSettingsModalOpenState,
      setResetNotesOnNewGame,
      setShowRoundNotes,
      setCanTrackOwnColor,
      setIsImproveMapContrastEnabled,
      setBoardZoom,
      setSpeechLanguage,
    };
  },
  { persist: true }
);
