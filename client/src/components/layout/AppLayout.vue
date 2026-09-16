<script setup lang="ts">
import { ShSurface } from "@shakilabs/ui";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import TabNavigation from "@/components/common/TabNavigation.vue";
</script>

<template>
  <ShSurface
    as="div"
    variant="plain"
    padding="none"
    class="design-system-shell min-h-screen flex flex-col bg-background"
  >
    <!-- 본문 바로가기는 ShGlobalHeader가 자체 SkipLink로 렌더한다(v3 §3.1) — 중복 링크 제거 -->
    <AppHeader />
    <TabNavigation />
    <!-- v3 §3.2 BL-005 — 팁 문구는 @shakilabs/ui 0.3.24부터 헤더 #tip 슬롯이 흐름 밖에
         절대 배치·한 줄 말줄임으로 그려서 헤더 높이를 흔들지 않는다(AppHeader.vue 참조).
         본문 캡션 줄은 제거. -->
    <main id="main-content" tabindex="-1" class="flex-1 relative">
      <slot />
    </main>
    <AppFooter />
  </ShSurface>
</template>
