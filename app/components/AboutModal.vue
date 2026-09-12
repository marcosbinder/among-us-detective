<template>
  <div class="flex">
    <Modal @close="handleCloseEvent">
      <template #title>{{ isFeedbackScreenOpen ? 'Feedback' : 'About' }}</template>
      <template #body>
        <template v-if="isFeedbackScreenOpen">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSda7OlGq68xKkVyx3GsZZntwrGN_CZZJRidgCl5J6R1QIyB2g/viewform?embedded=true"
            width="100%"
            height="520"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >Loading…</iframe>
        </template>
        <template v-else>
          <div class="space-y-2 mt-2 text-sm text-gray-700 dark:text-gray-300">
            <p>📝 Among Us Detective is a digital notebook for Among Us</p>
            <p>🙈 This tool is <b>not</b> a hack</p>
            <p>
              ✅ It is 100% legal and safe to use
              <NuxtLink to="/disclaimer" class="text-xs text-blue-500 hover:underline ml-1">(Read the disclaimer)</NuxtLink>
            </p>
          </div>

          <!-- Tabs -->
          <div class="flex mt-4 gap-1">
            <button
              class="px-3 py-1.5 text-xs font-bold rounded-t border border-b-0 transition-colors"
              :class="activeTab === 'changelog'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
              @click="activeTab = 'changelog'"
            >
              Changelog
            </button>
            <button
              class="px-3 py-1.5 text-xs font-bold rounded-t border border-b-0 transition-colors"
              :class="activeTab === 'upcomingChanges'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
              @click="activeTab = 'upcomingChanges'"
            >
              Roadmap & Backlog
            </button>
          </div>
          <div class="mb-3 border border-gray-300 dark:border-gray-700 rounded-b rounded-tr">
            <Changelog v-show="activeTab === 'changelog'" />
            <UpcomingChangesList v-show="activeTab === 'upcomingChanges'" />
          </div>

          <!-- Credits Footer -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <div class="space-y-0.5">
              <span class="block">
                Original project by <a href="https://atlesque.dev" class="text-blue-500 hover:underline font-medium">Atlesque</a>
              </span>
              <span class="block">
                Modernized & enhanced by <span class="font-medium text-gray-700 dark:text-gray-300">Marcos Binder</span>
              </span>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <button
                class="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                @click="isFeedbackScreenOpen = true"
              >
                Give feedback
              </button>
              <DonationButton show-link class="ml-auto" />
            </div>
          </div>
        </template>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const isFeedbackScreenOpen = ref(false)
const activeTab = ref('changelog')

function handleCloseEvent() {
  if (isFeedbackScreenOpen.value) {
    isFeedbackScreenOpen.value = false
  } else {
    emit('close')
  }
}
</script>
