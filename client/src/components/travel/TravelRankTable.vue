<script setup lang="ts">
import { ShBadge, ShTable, ShTableBody, ShTableCell, ShTableHead, ShTableHeader, ShTableRow } from "@shakilabs/ui";

defineProps<{
  title: string;
  rows: ReadonlyArray<{ name: string; value: string; helper: string }>;
}>();
</script>

<template>
  <section class="retro-panel overflow-hidden">
    <div class="retro-titlebar rounded-t-2xl">
      <h2 class="retro-title">{{ title }}</h2>
    </div>
    <div class="retro-panel-content p-0">
      <ShTable :aria-label="title" density="compact" min-width="34rem" scroll-hint="표를 좌우로 스크롤해 전체 옵션을 확인하세요.">
        <ShTableHeader>
          <ShTableRow>
            <ShTableHead>순위</ShTableHead>
            <ShTableHead>옵션</ShTableHead>
            <ShTableHead numeric>총비용</ShTableHead>
            <ShTableHead>비고</ShTableHead>
          </ShTableRow>
        </ShTableHeader>
        <ShTableBody>
          <ShTableRow
            v-for="(row, index) in rows"
            :key="row.name"
          >
            <ShTableCell>
              <ShBadge :tone="index === 0 ? 'primary' : 'neutral'">
                {{ index + 1 }}
              </ShBadge>
            </ShTableCell>
            <ShTableCell emphasis>{{ row.name }}</ShTableCell>
            <ShTableCell numeric emphasis>{{ row.value }}</ShTableCell>
            <ShTableCell class="text-muted-foreground">{{ row.helper }}</ShTableCell>
          </ShTableRow>
        </ShTableBody>
      </ShTable>
    </div>
  </section>
</template>
