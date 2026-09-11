<template>
  <div class="flex w-full h-full crewpool" data-test="crew-pool">
    <Draggable
      v-model="crewMembersInPool"
      group="crewMembers"
      item-key="color"
      class="flex flex-wrap content-start gap-1.5 p-1.5 min-h-[100px] w-full"
    >
      <template #item="{ element: member }">
        <PlayerCard
          :key="member.color"
          :member="member"
          :show-color-names="showColorNames === true"
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
  showColorNames?: boolean
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
