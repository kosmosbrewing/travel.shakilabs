<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

defineProps<{
  items: ReadonlyArray<{ label: string; value: string; helper: string }>;
}>();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <Card
      v-for="item in items"
      :key="item.label"
      class="border-border/50 bg-muted/30"
    >
      <CardContent class="travel-metric-card p-4">
        <p class="text-caption font-semibold text-muted-foreground">{{ item.label }}</p>
        <p class="mt-2 text-heading font-bold text-foreground tabular-nums">{{ item.value }}</p>
        <p class="mt-1 text-tiny leading-relaxed text-muted-foreground">{{ item.helper }}</p>
      </CardContent>
    </Card>
  </div>
</template>
