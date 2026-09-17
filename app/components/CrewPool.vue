<template>
  <div class="flex w-full h-full crewpool flex-1" data-test="crew-pool">
    <Draggable
      v-model="crewMembersInPool"
      group="crewMembers"
      item-key="color"
      :delay="140"
      :delay-on-touch-only="true"
      :touch-start-threshold="6"
      class="flex flex-wrap content-start items-start gap-1 sm:gap-1.5 p-1 sm:p-1.5 w-full flex-1"
      :class="{ 'min-h-[64px] sm:min-h-[85px]': crewMembers.length === 0 }"
    >
      <template #item="{ element: member }">
        <PlayerCard
          :key="member.color"
          :member="member"
          :highlight-color-names="highlightColorNames === true"
          :show-player-names="showPlayerNames === true"
          :is-player="member.isPlayer"
          :data-test="`crew-member-${member.color}`"
          @dblclick="removeMember(member)"
        />
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import type { CrewMember } from '~/stores/crew';

const props = defineProps<{
  crewMembers: CrewMember[]
  highlightColorNames?: boolean
  showPlayerNames?: boolean
}>()

const emit = defineEmits<{
  changed: [value: CrewMember[]]
  removed: [member: CrewMember]
}>()

const crewMembersInPool = computed({
  get: () => props.crewMembers,
  set: (value: CrewMember[]) => emit('changed', value),
})

function removeMember(member: CrewMember) {
  emit('removed', member)
}
</script>

<style lang="scss">
.crewpool {
  &.pool--dead {
    .player-name {
      @apply text-theme-gray-extra-light;
    }
  }
}
</style>
