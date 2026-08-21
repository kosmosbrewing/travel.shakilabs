<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { ShSiteFooter } from "@shakilabs/ui";
import { FOOTER_ALL_LINK, FOOTER_SECTIONS } from "@/data/footerNav";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
const year = new Date().getFullYear();
const SUPPORT_EMAIL = constantsStore.supportEmail;

// 블로그는 root(shakilabs.com/blog) 소유라 travel 라우터에 없다. href를 주면
// ShSiteFooter가 RouterLink 대신 <a href>로 렌더해 /travel/blog로 깨지지 않는다.
const policyLinks = [
  { to: "/about", label: "사이트 안내" },
  { to: "/terms", label: "이용약관" },
  { to: "/privacy", label: "개인정보 처리방침" },
  { to: "", href: "/blog", label: "블로그" },
  { to: "", href: `mailto:${SUPPORT_EMAIL}`, label: "문의" },
];

const note = computed(() => `여행비용 데이터 기준: ${constantsStore.feeDataUpdated} | 프로모션, 실시간 환율, 카드 우대율에 따라 실제 결제 금액은 달라질 수 있습니다.`);
</script>

<template>
  <ShSiteFooter
    app="travel"
    :sections="FOOTER_SECTIONS"
    :all-link="FOOTER_ALL_LINK"
    :policy-links="policyLinks"
    :note="note"
    site-label="shakilabs.com/travel"
    :copyright="`Copyright © ${year} shakilabs.com`"
    :link-component="RouterLink"
  />
</template>
