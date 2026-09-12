<template>
  <div class="crew-stats overflow-x-auto" data-test="crew-stats">
    <table class="w-full overflow-hidden divide-y divide-gray-200 dark:divide-gray-700 rounded shadow table-auto lg:table-fixed">
      <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
        <tr>
          <th>Color</th>
          <th v-if="showImposterCheckbox">Imp?</th>
          <th v-if="showTasksCheckbox">Tasks?</th>
          <th v-if="showMeetingsCount">Meeting?</th>
          <th colspan="3">Protected / Innocent</th>
          <th colspan="3">Suspect</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="member in sortedCrewMembers"
          :key="member.color"
          :class="member.isDead ? 'is-dead bg-gray-800 text-gray-200' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'"
        >
          <td>
            <div class="flex flex-col-reverse items-center py-1 lg:flex-row justify-evenly">
              <CrewIcon
                :color="member.color"
                :show-color-name="true"
                :highlight-color-name="highlightColorNames"
                :show-player-name="showPlayerNames"
                :is-imposter="member.isImposter"
                :is-player="member.isPlayer"
                :player-name="member.playerName"
              />
              <div v-show="!member.isDead" class="flex lg:flex-col">
                <span
                  v-show="member.suspectedBy.length > 0"
                  class="px-1 font-bold text-player-red"
                >
                  {{ member.suspectedBy.length }}
                </span>
                <span
                  v-show="member.protectedBy.length > 0"
                  class="px-1 font-bold text-player-green"
                >
                  {{ member.protectedBy.length }}
                </span>
              </div>
            </div>
          </td>
          <td v-if="showImposterCheckbox">
            <Checkbox
              class="justify-center"
              :is-checked="member.isImposter"
              @changed="value => crewStore.setMemberIsImposter({ member, isImposter: value })"
            />
          </td>
          <td v-if="showTasksCheckbox">
            <Checkbox
              v-show="!member.isDead"
              :is-disabled="member.isDead"
              class="justify-center"
              :is-checked="member.isDoneWithTasks"
              @changed="value => crewStore.setCrewMemberIsDoneWithTasks({ member, isDone: value })"
            />
          </td>
          <td v-if="showMeetingsCount" class="px-1">
            <Counter
              v-show="!member.isDead"
              :count="member.totalMeetingsHeld"
              :is-disabled="member.isDead"
              @changed="value => crewStore.setCrewMemberTotalMeetings({ member, meetingsCount: value })"
            />
          </td>
          <td colspan="3">
            <CrewPool
              :crew-members="crewStore.getAllMembersProtectedBy(member)"
              :highlight-color-names="highlightColorNames"
              :show-player-names="showPlayerNames"
              class="td-min-height"
              @changed="value => crewStore.linkInnocentsWithProtector({ innocents: value, protector: member })"
              @removed="value => crewStore.removeProtectedFromProtector({ protectedMember: value, protector: member })"
            />
          </td>
          <td class="relative" colspan="3">
            <CrewPool
              :crew-members="crewStore.getAllMembersSuspectedBy(member)"
              :highlight-color-names="highlightColorNames"
              :show-player-names="showPlayerNames"
              class="td-min-height"
              @changed="value => crewStore.linkSuspectsWithAccuser({ suspects: value, accuser: member })"
              @removed="value => crewStore.removeSuspectFromAccuser({ suspect: value, accuser: member })"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { CrewMember } from '~/stores/crew'

const props = defineProps<{
  crewMembers: CrewMember[]
  highlightColorNames?: boolean
  showPlayerNames?: boolean
}>()

const crewStore = useCrewStore()
const settingsStore = useSettingsStore()
const { showImposterCheckbox, showTasksCheckbox, showMeetingsCount } = storeToRefs(settingsStore)

const sortedCrewMembers = computed(() =>
  [...props.crewMembers]
    .sort((a, b) => (a.color > b.color ? 1 : a.color < b.color ? -1 : 0))
    .sort((a, b) => (a.isDead && !b.isDead ? 1 : !a.isDead && b.isDead ? -1 : 0)),
)
</script>

<style lang="scss" scoped>
table {
  @screen md {
    .td-min-height {
      min-height: 56px;
    }
  }

  thead {
    th {
      @apply py-1 px-3;

      &:not(:last-of-type) {
        @apply border-r border-gray-300 dark:border-gray-700;
      }
    }
  }

  td:not(:last-of-type) {
    @apply border-r border-gray-200 dark:border-gray-700;
  }
}
</style>