<script setup lang="ts">
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
      <table class="w-full text-left text-caption">
        <thead class="bg-muted/25 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-semibold">순위</th>
            <th class="px-4 py-3 font-semibold">옵션</th>
            <th class="px-4 py-3 font-semibold text-right">총비용</th>
            <th class="hidden px-4 py-3 font-semibold lg:table-cell">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="row.name"
            class="border-t border-border/50"
          >
            <td class="px-4 py-3">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full text-tiny font-bold"
                :class="index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'"
              >
                {{ index + 1 }}
              </span>
            </td>
            <td class="px-4 py-3 font-semibold text-foreground">{{ row.name }}</td>
            <td class="px-4 py-3 text-right font-bold text-foreground">{{ row.value }}</td>
            <td class="hidden px-4 py-3 text-muted-foreground lg:table-cell">{{ row.helper }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
