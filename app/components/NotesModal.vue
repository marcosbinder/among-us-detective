<template>
  <Modal @close="emit('close')">
    <template #title>Notes</template>
    <template #body>
      <Notes />
    </template>
  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()
</script>
