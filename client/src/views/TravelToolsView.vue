<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { ShSurface, ShText } from "@shakilabs/ui";
import SEOHead from "@/components/common/SEOHead.vue";
import { TRAVEL_TOOLS } from "@/data/travelNavigation";
</script>

<template>
  <SEOHead
    title="여행 계산기 전체 보기 | 수하물·통신·환전 도구"
    description="수하물, eSIM·로밍, 환전 비용을 출국 전에 비교할 수 있는 여행 계산 도구를 확인하세요."
  />
  <div class="container space-y-5 py-5">
    <ShSurface padding="lg">
      <ShText as="p" variant="caption" tone="muted">TRAVEL TOOL DIRECTORY</ShText>
      <ShText as="h1" variant="display" class="mt-2">출국 전 비용을 한곳에서 점검하세요</ShText>
      <ShText tone="muted" class="mt-3 max-w-3xl">
        짐, 통신, 환전처럼 여행 전에 결정할 항목을 필요한 순서대로 비교하세요.
      </ShText>
    </ShSurface>

    <section aria-labelledby="travel-tools-title">
      <div class="mb-3">
        <ShText id="travel-tools-title" as="h2" variant="heading">여행 계산 도구</ShText>
        <ShText variant="caption" tone="muted" class="mt-1">
          항공권 예약 이후 발생하는 추가 비용을 항목별로 확인할 수 있습니다.
        </ShText>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink v-for="tool in TRAVEL_TOOLS" :key="tool.path" :to="tool.path" class="block no-underline">
          <ShSurface variant="outlined" padding="md" class="group flex h-full flex-col hover:border-primary">
            <ShText as="h3" variant="heading">{{ tool.title }}</ShText>
            <ShText variant="caption" tone="muted" class="mt-2 flex-1">{{ tool.description }}</ShText>
            <span class="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary">
              계산 시작 <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </span>
          </ShSurface>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
