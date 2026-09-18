<template>
  <div
    class="player-card relative flex flex-col items-center justify-start gap-0 p-0.5 sm:p-1 rounded transition-all duration-200 select-none cursor-grab active:cursor-grabbing group"
    :class="[
      isPlayer ? 'ring-2 ring-yellow-400 bg-yellow-400/10 shadow' : 'shadow-sm',
      member.isDead
        ? 'bg-neutral-900/80 border border-red-900/40 opacity-70'
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500',
      cardSizeClasses
    ]"
    :aria-label="`${member.playerName || member.color}${member.role ? `, ${member.role}, ${member.roleConfirmed ? 'verified' : 'claimed'}` : ''}`"
    :title="`${member.playerName || member.color}${member.role ? ' (' + member.role + (member.roleConfirmed ? ' - Verified' : ' - Claimed') + ')' : ''}. Click for options.`"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @click.stop="handleCardClick"
    @contextmenu.prevent="openMenu"
    @dblclick.prevent="emit('dblclick', member)"
    @dragstart="closeMenu"
  >
    <span
      class="w-full shrink-0 text-[8px] sm:text-[9px] font-bold capitalize text-center truncate leading-3 rounded mb-0.5"
      :class="highlightColorNames
        ? 'h-3.5 sm:h-4 px-0.5 sm:px-1 py-0.5 leading-3 bg-white text-black ring-1 ring-gray-400 shadow-sm'
        : 'h-3 text-white bg-transparent'"
    >
      {{ member.color }}
    </span>

    <!-- Avatar Character Bean -->
    <div
      class="relative shrink-0 flex items-center justify-center pointer-events-none"
      :class="beanSizeClasses"
    >
      <CrewIcon
        :color="member.color"
        :is-dead="member.isDead"
        :is-player="member.isPlayer"
        :player-name="member.playerName"
        :show-player-name="false"
        :auto-width="true"
        :auto-height="true"
        class="w-full h-full"
      />
      <!-- Died in Round badge -->
      <span
        v-if="member.isDead && member.diedInRound"
        class="absolute -top-1.5 -right-2 z-30 px-1.5 py-0.5 bg-red-600 text-white text-[8px] sm:text-[9px] font-black rounded-md border border-white/80 shadow-md leading-none select-none"
        :title="`Died in Round ${member.diedInRound}`"
      >
        R{{ member.diedInRound }}
      </span>
    </div>

    <!-- Reveal the role below the stable name and bean without moving either one. -->
    <Transition name="role-reveal">
      <div
        v-if="member.role"
        :key="member.role"
        class="flex flex-col items-center justify-center mt-0.5 sm:mt-1 min-w-0 max-w-full"
      >
        <RoleIcon
          :role="member.role"
          :confirmed="member.roleConfirmed"
          size="sm"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
        />
        <span
          class="w-full text-[8px] sm:text-[9px] font-bold capitalize text-center truncate leading-tight mt-0.5"
          :class="isImpostorRole ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
        >
          {{ member.role }}
        </span>
      </div>
    </Transition>

    <!-- History evolution indicator (if viewing past round and current live status differs) -->
    <span
      v-if="roundsStore.isViewingHistory && liveStatusDifference"
      class="w-full text-[7px] font-bold text-center truncate leading-none mt-0.5 px-0.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
      :title="`Current status in Live game: ${liveStatusDifference}`"
    >
      Now: {{ liveStatusDifference }}
    </span>

    <!-- Compact Floating Popover Menu (Teleported to body, anchored beside clicked card) -->
    <Teleport to="body">
      <div
        v-if="isCurrentMenuOpen"
        class="fixed inset-0 z-50 select-none bg-transparent"
        @click.stop="closeMenu"
        @contextmenu.prevent.stop="closeMenu"
      >
        <div
          class="fixed bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl p-2.5 w-[215px] text-left text-xs text-gray-800 dark:text-gray-100"
          :style="menuStyle"
          @click.stop
        >
          <!-- Header: Color Dot, Player Name, Set as Me -->
          <div class="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                class="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0 shadow-sm"
                :class="`bg-player-${member.color}`"
              />
              <span class="font-bold capitalize truncate text-xs text-gray-900 dark:text-gray-100">
                {{ member.playerName || member.color }}
              </span>
            </div>

            <button
              v-if="!member.isPlayer"
              type="button"
              class="shrink-0 px-2 py-0.5 text-[11px] font-bold rounded bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
              title="Set as your player (ME)"
              @click="setAsMyPlayer"
            >
              Set as Me
            </button>
            <span
              v-else
              class="shrink-0 px-2 py-0.5 text-[11px] font-bold rounded bg-yellow-400 text-black shadow-sm"
            >
              ★ Me
            </span>
          </div>

          <div class="mb-2 rounded-md border p-2"
              :class="member.roleConfirmed
              ? isImpostorRole
                ? 'border-rose-500/50 bg-rose-500/10'
                : 'border-emerald-500/50 bg-emerald-500/10'
              : member.role
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60'"
            data-test="role-confirmation"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider"
                :class="member.roleConfirmed
                  ? isImpostorRole ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  : 'text-yellow-700 dark:text-yellow-400'"
              >
                {{ member.roleConfirmed ? 'Role verified' : 'Confirm this role' }}
              </span>
              <span v-if="member.role" class="text-[10px] font-bold"
                :class="member.roleConfirmed
                  ? isImpostorRole ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  : 'text-yellow-700 dark:text-yellow-400'"
              >
                {{ member.roleConfirmed ? 'VERIFIED' : 'CLAIMED' }}
              </span>
            </div>
            <button
              v-if="member.role"
              type="button"
              class="w-full py-1.5 px-2 text-[11px] font-bold rounded transition-colors text-center flex items-center justify-center gap-1"
              :class="member.roleConfirmed
                ? isImpostorRole
                  ? 'bg-rose-700 text-white hover:bg-rose-600 shadow-sm'
                  : 'bg-emerald-700 text-white hover:bg-emerald-600 shadow-sm'
                : isImpostorRole
                  ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'"
              @click="toggleRoleConfirmed"
            >
              {{ member.roleConfirmed ? 'Undo verification' : isImpostorRole ? '✓ Confirm impostor' : '✓ Confirm role' }}
            </button>
            <p v-else class="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              Choose a role below, then confirm it here.
            </p>
          </div>

          <!-- Crew Roles (5) -->
          <div class="mb-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Crew Roles
            </div>
            <div class="grid grid-cols-2 gap-1">
              <button
                v-for="r in crewRoles"
                :key="r"
                type="button"
                class="flex items-center gap-1 px-1.5 py-1 text-[11px] rounded border transition-colors text-left"
                :class="member.role === r
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/20 text-gray-700 dark:text-gray-300 border-transparent'"
                @click="selectRole(r)"
              >
                <RoleIcon :role="r" size="sm" :show-badge="false" class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ r }}</span>
              </button>
            </div>
          </div>

          <!-- Impostor Roles (3) -->
          <div class="mb-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
              Impostor Roles
            </div>
            <div class="grid grid-cols-3 gap-1">
              <button
                v-for="r in impostorRoles"
                :key="r"
                type="button"
                :disabled="member.status === 'hard_clear'"
                class="flex flex-col items-center justify-center p-1 text-[10px] rounded border transition-colors text-center"
                :class="member.status === 'hard_clear'
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 border-transparent cursor-not-allowed opacity-60'
                  : member.role === r
                  ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-rose-500/20 text-gray-700 dark:text-gray-300 border-transparent'"
                @click="selectRole(r)"
              >
                <RoleIcon :role="r" size="sm" :show-badge="false" class="w-3.5 h-3.5 mb-0.5 shrink-0" />
                <span class="truncate w-full leading-tight">{{ r }}</span>
              </button>
            </div>
          </div>

          <!-- Bottom actions: Clear role & Mark as dead / Revive -->
          <div class="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-1.5">
            <div v-if="member.role" class="flex justify-end">
              <button
                type="button"
                class="px-2 py-0.5 text-[11px] text-gray-400 hover:text-red-500 rounded hover:bg-red-500/10 transition-colors"
                title="Clear role"
                @click="clearRole"
              >
                ✕ Clear role
              </button>
            </div>

            <button
              type="button"
              class="w-full py-1.5 px-2 text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-1"
              :class="member.isDead
                ? 'bg-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/30 border border-red-500/40'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border border-gray-300 dark:border-gray-700'"
              @click="handleToggleDead"
            >
              <span>{{ member.isDead ? 'Revive player' : 'Mark as dead' }}</span>
              <span v-if="member.isDead && member.diedInRound" class="text-[9px] opacity-80 ml-1">
                (Died R{{ member.diedInRound }})
              </span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'

// Shared module singleton ensures ONLY ONE menu can be open across all cards
const activeMenuColor = ref<string | null>(null)
const menuPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 })
</script>

<script setup lang="ts">
import type { CrewMember } from '~/stores/crew'

const props = defineProps<{
  member: CrewMember
  highlightColorNames?: boolean
  showPlayerNames?: boolean
  isPlayer?: boolean
}>()

const emit = defineEmits<{
  dblclick: [member: CrewMember]
}>()

const crewStore = useCrewStore()
const settingsStore = useSettingsStore()
const roundsStore = useRoundsStore()

const liveStatusDifference = computed(() => {
  if (!roundsStore.isViewingHistory) return null
  const liveMember = crewStore.crewMembers.find((m) => m.color === props.member.color)
  if (!liveMember) return null
  if (liveMember.status !== props.member.status) {
    const statusMap: Record<string, string> = {
      hard_clear: 'Hard Clear',
      trusted: 'Trusted',
      unknown: 'Unknown',
      suspicious: 'Suspicious',
      impostor: 'Impostor',
      dead: 'Dead',
    }
    return statusMap[liveMember.status] || liveMember.status
  }
  return null
})

const cardSizeClasses = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') {
    return [
      'w-[42px] sm:w-[48px] md:w-[52px]',
      'h-auto pb-1 sm:pb-1'
    ]
  }
  if (zoom === 'large') {
    return [
      'w-[58px] sm:w-[66px] md:w-[74px]',
      'h-auto pb-1.5 sm:pb-2'
    ]
  }
  if (zoom === 'extra-large') {
    return [
      'w-[66px] sm:w-[76px] md:w-[84px]',
      'h-auto pb-2 sm:pb-2.5'
    ]
  }
  return [
    'w-[50px] sm:w-[58px] md:w-[64px]',
    'h-auto pb-1 sm:pb-1.5'
  ]
})

const beanSizeClasses = computed(() => {
  const zoom = settingsStore.boardZoom || 'normal'
  if (zoom === 'compact') return 'w-7 h-7 sm:w-8 sm:h-8'
  if (zoom === 'large') return 'w-9 h-9 sm:w-10 sm:h-10'
  if (zoom === 'extra-large') return 'w-11 h-11 sm:w-12 sm:h-12'
  return 'w-8 h-8 sm:w-9 sm:h-9'
})

const isCurrentMenuOpen = computed(() => activeMenuColor.value === props.member.color)

const crewRoles = ['Detective', 'Judge', 'Scientist', 'Engineer', 'Noisemaker']
const impostorRoles = ['Shapeshifter', 'Phantom', 'Viper']

const isImpostorRole = computed(() => {
  return props.member.role && impostorRoles.includes(props.member.role)
})

const menuStyle = computed(() => ({
  top: `${menuPosition.value.top}px`,
  left: `${menuPosition.value.left}px`,
}))

let scrollListener: (() => void) | null = null
let escListener: ((e: KeyboardEvent) => void) | null = null

function cleanupListeners() {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener, { capture: true })
    scrollListener = null
  }
  if (escListener) {
    window.removeEventListener('keydown', escListener)
    escListener = null
  }
}

// Close on Escape key or when the page is scrolled
watch(isCurrentMenuOpen, (isOpen) => {
  cleanupListeners()
  if (isOpen) {
    escListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }
    scrollListener = () => {
      closeMenu()
    }
    window.addEventListener('keydown', escListener)
    window.addEventListener('scroll', scrollListener, { passive: true, capture: true })
  }
})

onBeforeUnmount(() => {
  cleanupListeners()
})

let touchStartX = 0
let touchStartY = 0
let isTouchDragging = false

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    isTouchDragging = false
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    const dx = Math.abs(e.touches[0].clientX - touchStartX)
    const dy = Math.abs(e.touches[0].clientY - touchStartY)
    if (dx > 8 || dy > 8) {
      isTouchDragging = true
      closeMenu()
    }
  }
}

function handleCardClick(e: MouseEvent) {
  if (isTouchDragging) {
    isTouchDragging = false
    return
  }
  openMenu(e)
}

function openMenu(event?: MouseEvent) {
  if (event) {
    const target = (event.currentTarget as HTMLElement) || (event.target as HTMLElement)
    if (target && target.getBoundingClientRect) {
      const rect = target.getBoundingClientRect()
      const popoverWidth = 215
      const popoverHeight = 300

      let left: number
      let top: number

      if (window.innerWidth < 640) {
        // Mobile / split-screen: center popover relative to card or screen, clamped
        left = Math.max(8, Math.min(rect.left - (popoverWidth - rect.width) / 2, window.innerWidth - popoverWidth - 8))
        if (rect.bottom + popoverHeight + 8 <= window.innerHeight) {
          top = rect.bottom + 4
        } else {
          top = Math.max(8, rect.top - popoverHeight - 4)
        }
      } else {
        // Desktop: anchor to right of card
        left = rect.right + 6
        top = rect.top

        // If overflows viewport right, position to the left of the card
        if (left + popoverWidth > window.innerWidth - 8) {
          left = rect.left - popoverWidth - 6
        }
        if (left < 8) {
          left = 8
        }

        // If overflows viewport bottom, adjust upward
        if (top + popoverHeight > window.innerHeight - 8) {
          top = Math.max(8, window.innerHeight - popoverHeight - 8)
        }
      }

      menuPosition.value = { top, left }
    }
  }
  activeMenuColor.value = props.member.color
}

function closeMenu() {
  cleanupListeners()
  if (activeMenuColor.value === props.member.color) {
    activeMenuColor.value = null
  }
}

function selectRole(role: string) {
  if (props.member.role === role) {
    crewStore.setPlayerRole(props.member.color, null, false)
  } else {
    crewStore.setPlayerRole(props.member.color, role, false)
  }
  closeMenu()
}

function clearRole() {
  crewStore.setPlayerRole(props.member.color, null, false)
  closeMenu()
}

function toggleRoleConfirmed() {
  crewStore.toggleRoleConfirmed(props.member.color)
  closeMenu()
}

function setAsMyPlayer() {
  crewStore.setPlayerColor(props.member.color)
  closeMenu()
}

function handleToggleDead() {
  crewStore.togglePlayerDead(props.member.color)
  closeMenu()
}
</script>

<style scoped>
.player-card {
  position: relative;
  flex-shrink: 0;
}

.role-reveal-enter-active,
.role-reveal-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.role-reveal-enter-from,
.role-reveal-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
