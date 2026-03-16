<script setup lang="ts">
defineProps<{
  items: ReadonlyArray<{ key: string; label: string; description: string }>;
}>();

defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      class="retro-panel-muted px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
      @click="$emit('select', item.key)"
    >
      <p class="text-caption font-semibold text-foreground">{{ item.label }}</p>
      <p class="mt-0.5 text-tiny text-muted-foreground">{{ item.description }}</p>
    </button>
  </div>
</template>
