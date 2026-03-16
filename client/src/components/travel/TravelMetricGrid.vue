<script setup lang="ts">
defineProps<{
  items: ReadonlyArray<{ label: string; value: string; helper: string }>;
}>();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <article
      v-for="item in items"
      :key="item.label"
      class="retro-panel-muted p-4"
    >
      <p class="text-caption font-semibold text-muted-foreground">{{ item.label }}</p>
      <p class="mt-2 text-heading font-bold text-foreground">{{ item.value }}</p>
      <p class="mt-1 text-tiny leading-relaxed text-muted-foreground">{{ item.helper }}</p>
    </article>
  </div>
</template>
