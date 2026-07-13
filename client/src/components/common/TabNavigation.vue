<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  ShPrimaryNavigation,
  type PrimaryNavigationItem,
} from "@shakilabs/ui";
import { TRAVEL_TOOLS } from "@/data/travelNavigation";

const route = useRoute();
const tabs: readonly PrimaryNavigationItem[] = [
  { key: "all", label: "여행 도구", to: "/all" },
  ...TRAVEL_TOOLS.map((tool) => ({
    key: tool.key,
    label: tool.navigationLabel,
    to: tool.path,
  })),
];

const activeItem = computed(() => tabs.find((item) =>
  route.path === item.to || route.path.startsWith(`${item.to}/`),
));
</script>

<template>
  <ShPrimaryNavigation
    :items="tabs"
    :active-key="activeItem?.key"
    :link-component="RouterLink"
    :mobile-columns="2"
  />
</template>
