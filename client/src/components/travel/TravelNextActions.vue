<script setup lang="ts">
import { onMounted } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { ShSurface, ShText } from "@shakilabs/ui";
import { getRelatedTravelTools, type TravelToolKey } from "@/data/travelNavigation";
import { trackEvent } from "@/lib/analytics";

const props = defineProps<{ currentTool: TravelToolKey }>();
const links = getRelatedTravelTools(props.currentTool);

onMounted(() => {
  links.forEach((link) => trackEvent("related_tool_impression", {
    app_id: "travel",
    from_tool: props.currentTool,
    to_tool: link.key,
    placement: "after_result",
  }));
  trackEvent("related_tool_impression", {
    app_id: "travel",
    from_tool: props.currentTool,
    to_tool: "overseas_payment",
    placement: "after_result",
  });
});

function trackRelatedClick(toTool: string): void {
  trackEvent("related_tool_click", {
    app_id: "travel",
    from_tool: props.currentTool,
    to_tool: toTool,
    placement: "after_result",
  });
}
</script>

<template>
  <section :aria-labelledby="`${currentTool}-next-actions-title`">
    <ShText :id="`${currentTool}-next-actions-title`" as="h2" variant="heading" class="mb-3">
      여행 준비의 다음 비용도 확인하세요
    </ShText>
    <div class="grid gap-3 sm:grid-cols-3">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="block no-underline"
        @click="trackRelatedClick(link.key)"
      >
        <ShSurface variant="outlined" padding="md" class="group flex h-full flex-col hover:border-primary">
          <ShText as="h3" variant="heading">{{ link.title }}</ShText>
          <ShText variant="caption" tone="muted" class="mt-2 flex-1">{{ link.description }}</ShText>
          <span class="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary">
            이어서 계산 <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </span>
        </ShSurface>
      </RouterLink>
      <ShSurface
        as="a"
        href="/card/overseas-payment"
        variant="outlined"
        padding="md"
        class="group flex h-full flex-col no-underline hover:border-primary"
        @click="trackRelatedClick('overseas_payment')"
      >
        <ShText as="h3" variant="heading">해외결제 카드 수수료</ShText>
        <ShText variant="caption" tone="muted" class="mt-2 flex-1">
          현지통화 결제와 DCC, 카드사 수수료까지 비교합니다.
        </ShText>
        <span class="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary">
          카드 비용 확인 <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </span>
      </ShSurface>
    </div>
  </section>
</template>
