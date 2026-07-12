<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  ShPrimaryNavigation,
  type PrimaryNavigationItem,
} from "@shakilabs/ui";

const route = useRoute();
const tabs: readonly PrimaryNavigationItem[] = [
  { key: "luggage", label: "수하물", to: "/luggage" },
  { key: "esim", label: "eSIM 비교", to: "/esim" },
  { key: "exchange", label: "환전 수수료", to: "/exchange" },
];

const activeItem = computed(() =>
  tabs.find((item) => route.path === item.to),
);
</script>

<template>
  <ShPrimaryNavigation
    :items="tabs"
    :active-key="activeItem?.key"
    :link-component="RouterLink"
  />
</template>
