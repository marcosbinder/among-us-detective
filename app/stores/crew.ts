import allColors from "~/utils/playerColors.js";

export type ColumnStatus = 'hard_clear' | 'trusted' | 'unknown' | 'suspicious' | 'impostor' | 'dead';

export interface CrewMember {
  id: string;
  color: string;
  status: ColumnStatus;
  role: string | null;
  roleConfirmed: boolean;
  isDead: boolean;
  previousStatus: ColumnStatus;
  mapPosition: { x: number; y: number } | null;
  playerName: string;
  isPlayer: boolean;
  isActive: boolean;
  isImposter: boolean;
  isDoneWithTasks: boolean;
  totalMeetingsHeld: number;
  suspectedBy: string[];
  protectedBy: string[];
}

const DEFAULT_PLAYER_COLOR = "yellow";

function createDefaultCrewMembers(): CrewMember[] {
  return (allColors as string[]).map((colorName, idx) => ({
    id: `player-${colorName}`,
    color: colorName,
    status: 'unknown' as ColumnStatus,
    role: null,
    roleConfirmed: false,
    isDead: false,
    previousStatus: 'unknown' as ColumnStatus,
    mapPosition: null,
    playerName: "",
    isPlayer: colorName === DEFAULT_PLAYER_COLOR,
    isActive: idx < 15,
    isImposter: false,
    isDoneWithTasks: false,
    totalMeetingsHeld: 0,
    suspectedBy: [],
    protectedBy: [],
  }));
}

export const useCrewStore = defineStore("crew", () => {
  const settingsStore = useSettingsStore();

  const crewMembers = ref<CrewMember[]>(createDefaultCrewMembers());
  const playerColor = ref<string>(DEFAULT_PLAYER_COLOR);

  // Getters
  const canTrackOwnColor = computed(() => settingsStore.canTrackOwnColor);

  const crewMembersWithoutPlayer = computed(() =>
    crewMembers.value.filter((m) => m.color !== playerColor.value)
  );

  const usableCrewMembers = computed(() =>
    canTrackOwnColor.value ? crewMembers.value : crewMembersWithoutPlayer.value
  );

  const activeCrewMembers = computed(() =>
    usableCrewMembers.value.filter((m) => m.isActive)
  );

  const activeCrewMembersWithoutPlayer = computed(() =>
    activeCrewMembers.value.filter((m) => m.color !== playerColor.value)
  );

  const inactiveCrewMembers = computed(() =>
    crewMembers.value.filter((m) => {
      if (canTrackOwnColor.value) return !m.isActive;
      return m.color !== playerColor.value && !m.isActive;
    })
  );

  const aliveCrewMembers = computed(() =>
    crewMembers.value.filter((m) => !m.isDead && m.status !== 'dead')
  );

  // Canonical 6-column hierarchy getters (only for active in-game players, excluding ME)
  const hardClearCrewMembers = computed(() =>
    crewMembers.value.filter((m) => m.isActive && m.color !== playerColor.value && m.status === 'hard_clear' && !m.isDead)
  );

  const trustedCrewMembers = computed(() =>
    crewMembers.value.filter((m) => m.isActive && m.color !== playerColor.value && m.status === 'trusted' && !m.isDead)
  );

  const unknownCrewMembers = computed(() =>
    crewMembers.value.filter(
      (m) => m.isActive && m.color !== playerColor.value && (m.status === 'unknown' || !m.status) && !m.isDead && m.status !== 'dead'
    )
  );

  const suspiciousCrewMembers = computed(() =>
    crewMembers.value.filter((m) => m.isActive && m.color !== playerColor.value && m.status === 'suspicious' && !m.isDead)
  );

  const impostorCrewMembers = computed(() =>
    crewMembers.value.filter((m) => m.isActive && m.color !== playerColor.value && m.status === 'impostor' && !m.isDead)
  );

  const deadCrewMembers = computed(() =>
    crewMembers.value.filter((m) => m.isActive && m.color !== playerColor.value && (m.isDead || m.status === 'dead'))
  );

  const crewMembersDoneWithTasks = computed(() =>
    crewMembers.value.filter((m) => m.isDoneWithTasks)
  );

  const crewMembersNotDoneWithTasks = computed(() =>
    crewMembers.value.filter((m) => !m.isDoneWithTasks)
  );

  const playerCrewMember = computed(() =>
    crewMembers.value.find((m) => m.color === playerColor.value)
  );

  const isPlayerImposter = computed(
    () => playerCrewMember.value?.isImposter === true
  );

  const crewMembersProtectedByPlayer = computed(() =>
    usableCrewMembers.value.filter(
      (m) => m.isActive && m.protectedBy.includes(playerColor.value)
    )
  );

  const unknownCrewMembersForPlayer = computed(() =>
    usableCrewMembers.value.filter(
      (m) =>
        m.isActive &&
        !m.isDead &&
        !m.suspectedBy.includes(playerColor.value) &&
        !m.protectedBy.includes(playerColor.value)
    )
  );

  const crewMembersSuspectedByPlayer = computed(() =>
    usableCrewMembers.value.filter(
      (m) => m.isActive && m.suspectedBy.includes(playerColor.value)
    )
  );

  function getAllMembersSuspectedBy(accuser: CrewMember): CrewMember[] {
    return usableCrewMembers.value.filter((m) =>
      m.suspectedBy.includes(accuser.color)
    );
  }

  function getAllMembersProtectedBy(protector: CrewMember): CrewMember[] {
    return usableCrewMembers.value.filter((m) =>
      m.protectedBy.includes(protector.color)
    );
  }

  // Actions
  function resetAllCrew() {
    const defaultCrew = createDefaultCrewMembers();
    crewMembers.value = defaultCrew.map((defaultMember) => {
      const existing = crewMembers.value.find(
        (m) => m.color === defaultMember.color
      );
      return {
        ...defaultMember,
        isActive: existing ? existing.isActive : defaultMember.isActive,
        playerName: existing?.playerName ?? "",
        isPlayer: defaultMember.color === playerColor.value,
      };
    });
  }

  function resetActiveCrew() {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.isDead || m.status === 'dead') {
        return {
          ...m,
          isDead: true,
          status: 'dead' as ColumnStatus,
          isDoneWithTasks: false,
          totalMeetingsHeld: 0,
        };
      }
      return {
        ...m,
        status: 'unknown' as ColumnStatus,
        isDead: false,
        isDoneWithTasks: false,
        totalMeetingsHeld: 0,
        suspectedBy: [],
        protectedBy: [],
      };
    });
  }

  function setPlayerStatus(colorOrId: string, newStatus: ColumnStatus) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === colorOrId || m.id === colorOrId) {
        let roleConfirmed = m.roleConfirmed;
        const isImpostor = m.role && (IMPOSTOR_ROLES as readonly string[]).includes(m.role);
        // If crew role moved out of hard_clear, unverify!
        if (!isImpostor && newStatus !== 'hard_clear' && m.roleConfirmed) {
          roleConfirmed = false;
        }
        // If impostor role moved out of impostor, unverify!
        if (isImpostor && newStatus !== 'impostor' && m.roleConfirmed) {
          roleConfirmed = false;
        }
        if (newStatus === 'dead') {
          return {
            ...m,
            previousStatus: m.status !== 'dead' ? m.status : m.previousStatus || 'unknown',
            isDead: true,
            status: 'dead' as ColumnStatus,
            roleConfirmed,
          };
        } else {
          return {
            ...m,
            isDead: false,
            previousStatus: m.status !== 'dead' ? m.status : m.previousStatus,
            status: newStatus,
            roleConfirmed,
          };
        }
      }
      return m;
    });
  }

  function togglePlayerDead(colorOrId: string) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === colorOrId || m.id === colorOrId) {
        if (m.isDead || m.status === 'dead') {
          // Manual toggle reversal strictly for error correction
          const restoredStatus = (m.previousStatus && m.previousStatus !== 'dead')
            ? m.previousStatus
            : 'unknown';
          return {
            ...m,
            isDead: false,
            status: restoredStatus as ColumnStatus,
          };
        } else {
          return {
            ...m,
            previousStatus: m.status,
            isDead: true,
            status: 'dead' as ColumnStatus,
          };
        }
      }
      return m;
    });
  }

  function setColumnMembers(status: ColumnStatus, members: CrewMember[]) {
    const memberColors = members.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (memberColors.includes(m.color)) {
        let roleConfirmed = m.roleConfirmed;
        const isImpostor = m.role && (IMPOSTOR_ROLES as readonly string[]).includes(m.role);
        // If crew role moved out of hard_clear, unverify!
        if (!isImpostor && status !== 'hard_clear' && m.roleConfirmed) {
          roleConfirmed = false;
        }
        // If impostor role moved out of impostor, unverify!
        if (isImpostor && status !== 'impostor' && m.roleConfirmed) {
          roleConfirmed = false;
        }
        if (status === 'dead') {
          return {
            ...m,
            previousStatus: m.status !== 'dead' ? m.status : m.previousStatus || 'unknown',
            isDead: true,
            status: 'dead' as ColumnStatus,
            roleConfirmed,
          };
        } else {
          return {
            ...m,
            isDead: false,
            previousStatus: m.status !== 'dead' ? m.status : m.previousStatus,
            status: status,
            roleConfirmed,
          };
        }
      }
      return m;
    });
  }

  const CREW_ROLES = ['Detective', 'Judge', 'Scientist', 'Engineer', 'Noisemaker'] as const;
  const IMPOSTOR_ROLES = ['Shapeshifter', 'Phantom', 'Viper'] as const;

  function setPlayerRole(colorOrId: string, role: string | null, roleConfirmed = false) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === colorOrId || m.id === colorOrId) {
        const updated = {
          ...m,
          role,
          roleConfirmed,
        };

        if (role && (CREW_ROLES as readonly string[]).includes(role)) {
          // Crew Trigger: Assigning a Crew role automatically moves the player to the "Trusted" column, unless already in "Hard Clear".
          if (updated.status !== 'hard_clear' && !updated.isDead) {
            updated.previousStatus = updated.status;
            updated.status = 'trusted' as ColumnStatus;
          }
        } else if (role && (IMPOSTOR_ROLES as readonly string[]).includes(role)) {
          // Impostor Trigger: Assigning an Impostor role automatically moves the player to the "Suspicious" column, unless already in "Impostor".
          if (updated.status !== 'impostor' && !updated.isDead) {
            updated.previousStatus = updated.status;
            updated.status = 'suspicious' as ColumnStatus;
          }
        }

        return updated;
      }
      return m;
    });
  }

  function toggleRoleConfirmed(colorOrId: string) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === colorOrId || m.id === colorOrId) {
        const newConfirmed = !m.roleConfirmed;
        const updated = {
          ...m,
          roleConfirmed: newConfirmed,
        };

        if (newConfirmed) {
          if (!updated.isDead) {
            updated.previousStatus = updated.status;
            const isImpostor = updated.role && (IMPOSTOR_ROLES as readonly string[]).includes(updated.role);
            if (isImpostor) {
              // Confirmed Impostor role moves to "impostor"!
              updated.status = 'impostor' as ColumnStatus;
            } else {
              // Confirmed Crew role moves to "hard_clear"!
              updated.status = 'hard_clear' as ColumnStatus;
            }
          }
        } else {
          // If reverted to unverified:
          if (!updated.isDead) {
            const isImpostor = updated.role && (IMPOSTOR_ROLES as readonly string[]).includes(updated.role);
            if (isImpostor) {
              if (updated.status === 'impostor') {
                updated.status = 'suspicious' as ColumnStatus;
              }
            } else {
              if (updated.status === 'hard_clear') {
                updated.status = (updated.previousStatus && updated.previousStatus !== 'hard_clear')
                  ? updated.previousStatus
                  : 'trusted' as ColumnStatus;
              }
            }
          }
        }

        return updated;
      }
      return m;
    });
  }

  function togglePlayerActive(colorOrId: string) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === colorOrId || m.id === colorOrId) {
        // Prevent disabling ME (the user's own player is always active)
        if (m.color === playerColor.value && m.isActive) {
          return m;
        }
        const newActive = !m.isActive;
        return {
          ...m,
          isActive: newActive,
          // When turning back on, ALWAYS reset to 'unknown'
          status: newActive ? ('unknown' as ColumnStatus) : m.status,
        };
      }
      return m;
    });
  }

  function setPresetPlayerCount(count: number) {
    crewMembers.value = crewMembers.value.map((m, idx) => {
      // ME is always active!
      const isActive = m.color === playerColor.value || idx < count;
      return {
        ...m,
        isActive,
        // If reactivated or newly active without status, set to 'unknown'
        status: isActive && !m.isActive ? ('unknown' as ColumnStatus) : (isActive && (!m.status || m.status === 'unknown') ? 'unknown' as ColumnStatus : m.status),
      };
    });
  }

  function setPlayerColor(color: string) {
    playerColor.value = color;
    crewMembers.value = crewMembers.value.map((m) => ({
      ...m,
      isPlayer: m.color === color,
      isActive: m.color === color ? true : m.isActive,
    }));
  }

  function setInactiveCrewMembers(inactiveMembers: CrewMember[]) {
    const inactiveColors = inactiveMembers.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (inactiveColors.includes(m.color)) {
        return {
          ...m,
          isActive: false,
          isDead: false,
          suspectedBy: [],
          protectedBy: [],
        };
      }
      return m;
    });
  }

  function setProtectedCrewMembers(protectedMembers: CrewMember[]) {
    const protectedColors = protectedMembers.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color !== playerColor.value && protectedColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          isDead: false,
          isImposter: false,
          protectedBy: m.protectedBy.includes(playerColor.value)
            ? m.protectedBy
            : [...m.protectedBy, playerColor.value],
          suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
        };
      }
      return m;
    });
  }

  function setUnknownCrewMembers(unknownMembers: CrewMember[]) {
    const unknownColors = unknownMembers.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (unknownColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          isDead: false,
          isImposter: false,
          protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
          suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
        };
      }
      return m;
    });
  }

  function setSuspectedCrewMembers(suspectedMembers: CrewMember[]) {
    const suspectedColors = suspectedMembers.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color !== playerColor.value && suspectedColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          isDead: false,
          protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
          suspectedBy: m.suspectedBy.includes(playerColor.value)
            ? m.suspectedBy
            : [...m.suspectedBy, playerColor.value],
        };
      }
      return m;
    });
  }

  function setDeadCrewMembers(deadMembers: CrewMember[]) {
    const deadColors = deadMembers.map((m) => m.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (deadColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          isDead: true,
          protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
          suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
        };
      }
      return m;
    });
  }

  function linkSuspectsWithAccuser({
    suspects,
    accuser,
  }: {
    suspects: CrewMember[];
    accuser: CrewMember;
  }) {
    const suspectColors = suspects
      .map((m) => m.color)
      .filter((c) => c !== accuser.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (suspectColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          suspectedBy: m.suspectedBy.includes(accuser.color)
            ? m.suspectedBy
            : [...m.suspectedBy, accuser.color],
          protectedBy: m.protectedBy.filter((c) => c !== accuser.color),
        };
      }
      return m;
    });
  }

  function linkInnocentsWithProtector({
    innocents,
    protector,
  }: {
    innocents: CrewMember[];
    protector: CrewMember;
  }) {
    const innocentColors = innocents
      .map((m) => m.color)
      .filter((c) => c !== protector.color);
    crewMembers.value = crewMembers.value.map((m) => {
      if (innocentColors.includes(m.color)) {
        return {
          ...m,
          isActive: true,
          protectedBy: m.protectedBy.includes(protector.color)
            ? m.protectedBy
            : [...m.protectedBy, protector.color],
          suspectedBy: m.suspectedBy.filter((c) => c !== protector.color),
        };
      }
      return m;
    });
  }

  function setCrewMemberIsDoneWithTasks({
    member,
    isDone,
  }: {
    member: CrewMember;
    isDone: boolean;
  }) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === member.color) return { ...m, isDoneWithTasks: isDone };
      return m;
    });
  }

  function setMemberIsImposter({
    member,
    isImposter,
  }: {
    member: CrewMember;
    isImposter: boolean;
  }) {
    const isPlayerCurrentlyImposter =
      playerCrewMember.value?.isImposter === true;
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === member.color) {
        let updated = { ...m, isImposter };
        if (!m.isDead && m.color !== playerColor.value) {
          if (isImposter && isPlayerCurrentlyImposter) {
            updated = {
              ...updated,
              suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
              protectedBy: [...new Set([...m.protectedBy, playerColor.value])],
            };
          } else if (!isImposter && isPlayerCurrentlyImposter) {
            updated = {
              ...updated,
              protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
              suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
            };
          } else {
            updated = {
              ...updated,
              protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
              suspectedBy: [...new Set([...m.suspectedBy, playerColor.value])],
            };
          }
        }
        return updated;
      }
      return m;
    });
  }

  function setCrewMemberTotalMeetings({
    member,
    meetingsCount,
  }: {
    member: CrewMember;
    meetingsCount: number;
  }) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === member.color)
        return { ...m, totalMeetingsHeld: meetingsCount };
      return m;
    });
  }

  function setMemberAsUnknown(member: CrewMember) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === member.color) {
        return {
          ...m,
          isActive: true,
          isDead: false,
          protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
          suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
        };
      }
      return m;
    });
  }

  function setMemberAsInactive(member: CrewMember) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === member.color) {
        return {
          ...m,
          isActive: false,
          isDead: false,
          protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
          suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
        };
      }
      return m;
    });
  }

  function removeProtectedFromProtector({
    protectedMember,
    protector,
  }: {
    protectedMember: CrewMember;
    protector: CrewMember;
  }) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === protectedMember.color) {
        return {
          ...m,
          protectedBy: m.protectedBy.filter((c) => c !== protector.color),
        };
      }
      return m;
    });
  }

  function removeSuspectFromAccuser({
    suspect,
    accuser,
  }: {
    suspect: CrewMember;
    accuser: CrewMember;
  }) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === suspect.color) {
        return {
          ...m,
          suspectedBy: m.suspectedBy.filter((c) => c !== accuser.color),
        };
      }
      return m;
    });
  }

  function setAllMembersAsUnknown() {
    crewMembers.value = crewMembers.value.map((m) => ({
      ...m,
      isActive: true,
      isDead: false,
      suspectedBy: m.suspectedBy.filter((c) => c !== playerColor.value),
      protectedBy: m.protectedBy.filter((c) => c !== playerColor.value),
    }));
  }

  function setCrewMemberPlayerName({
    color,
    playerName,
  }: {
    color: string;
    playerName: string;
  }) {
    crewMembers.value = crewMembers.value.map((m) => {
      if (m.color === color) return { ...m, playerName };
      return m;
    });
  }

  function resetAllPlayerNames() {
    crewMembers.value = crewMembers.value.map((m) => ({
      ...m,
      playerName: "",
    }));
  }

  return {
    crewMembers,
    playerColor,
    canTrackOwnColor,
    crewMembersWithoutPlayer,
    usableCrewMembers,
    activeCrewMembers,
    activeCrewMembersWithoutPlayer,
    inactiveCrewMembers,
    deadCrewMembers,
    aliveCrewMembers,
    crewMembersDoneWithTasks,
    crewMembersNotDoneWithTasks,
    playerCrewMember,
    isPlayerImposter,
    crewMembersProtectedByPlayer,
    unknownCrewMembersForPlayer,
    crewMembersSuspectedByPlayer,
    getAllMembersSuspectedBy,
    getAllMembersProtectedBy,
    resetAllCrew,
    resetActiveCrew,
    setPlayerColor,
    setInactiveCrewMembers,
    setProtectedCrewMembers,
    setUnknownCrewMembers,
    setSuspectedCrewMembers,
    setDeadCrewMembers,
    linkSuspectsWithAccuser,
    linkInnocentsWithProtector,
    setCrewMemberIsDoneWithTasks,
    setMemberIsImposter,
    setCrewMemberTotalMeetings,
    setMemberAsUnknown,
    setMemberAsInactive,
    removeProtectedFromProtector,
    removeSuspectFromAccuser,
    hardClearCrewMembers,
    trustedCrewMembers,
    unknownCrewMembers,
    suspiciousCrewMembers,
    impostorCrewMembers,
    setPlayerStatus,
    togglePlayerDead,
    setColumnMembers,
    setPlayerRole,
    toggleRoleConfirmed,
    togglePlayerActive,
    setPresetPlayerCount,
    setCrewMemberPlayerName,
    resetAllPlayerNames,
  };
});
