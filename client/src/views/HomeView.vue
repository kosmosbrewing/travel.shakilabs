<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { ShSurface, ShText } from "@shakilabs/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RelatedServices from "@/components/common/RelatedServices.vue";
import SEOHead from "@/components/common/SEOHead.vue";
import {
  HOME_COST_TABLE,
  HOME_INTENTS,
  HOME_MECHANISMS,
  TRAVEL_HOME_UPDATED,
} from "@/data/homeHighlights";
import { buildCanonicalUrl } from "@/lib/site";

const SEO_TITLE = "여행 비용 계산기 | 수하물·데이터·환전 출국 전 점검";
const SEO_DESCRIPTION =
  "항공권을 끊고 나면 수하물, 현지 데이터, 환전에서 예산이 새어 나갑니다. 세 항목의 요금 구조와 2026년 기준 가정값을 정리하고, 조건을 넣어 바로 비교할 수 있는 계산기를 제공합니다.";

// 홈에서 연결되는 계산기 목록을 구조화 데이터로도 노출한다 (화면의 질문 카드와 동일 순서)
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "여행 비용 계산기 목록",
  itemListElement: HOME_INTENTS.map((intent, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: intent.action,
    url: buildCanonicalUrl(intent.path),
  })),
};
</script>

<template>
  <SEOHead :title="SEO_TITLE" :description="SEO_DESCRIPTION" :json-ld="itemListJsonLd" />

  <div class="container space-y-5 py-5">
    <ShSurface padding="lg">
      <ShText as="p" variant="caption" tone="muted">SHAKILABS TRAVEL</ShText>
      <ShText as="h1" variant="display" class="mt-2">
        항공권을 끊은 다음부터가 진짜입니다
      </ShText>
      <ShText tone="muted" class="mt-3 max-w-3xl">
        여행 예산은 대개 항공권과 숙소로 잡습니다. 그런데 정작 예산을 넘기는 쪽은 수하물,
        현지 데이터, 환전처럼 결제 순간에야 금액이 드러나는 항목들입니다. 셋 다 출국 전에
        조건을 넣어 보면 미리 답이 나오는 것들이라, 계산기 세 개로 정리해 뒀습니다.
      </ShText>
      <div class="mt-4 flex flex-wrap gap-2">
        <RouterLink
          to="/luggage"
          class="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground no-underline"
        >
          수하물부터 계산하기 <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </RouterLink>
        <RouterLink
          to="/all"
          class="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-caption font-semibold text-foreground no-underline"
        >
          계산기 사용법 보기
        </RouterLink>
      </div>
    </ShSurface>

    <section aria-labelledby="home-intents-title">
      <div class="mb-3">
        <ShText id="home-intents-title" as="h2" variant="heading">지금 궁금한 질문부터 고르세요</ShText>
        <ShText variant="caption" tone="muted" class="mt-1">
          질문을 누르면 해당 계산기로 바로 이동합니다.
        </ShText>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="intent in HOME_INTENTS"
          :key="intent.key"
          :to="intent.path"
          class="block no-underline"
        >
          <ShSurface variant="outlined" padding="md" class="flex h-full flex-col hover:border-primary">
            <ShText as="h3" variant="body" class="font-semibold">{{ intent.question }}</ShText>
            <span class="mt-3 inline-flex items-center gap-1 text-caption font-semibold text-primary">
              {{ intent.action }} <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </span>
          </ShSurface>
        </RouterLink>
      </div>
    </section>

    <ShSurface as="section" padding="lg" aria-labelledby="home-mechanisms-title">
      <ShText id="home-mechanisms-title" as="h2" variant="heading">이 돈은 왜 눈에 안 띄나</ShText>
      <ShText variant="caption" tone="muted" class="mt-1">
        세 비용이 각각 어디에 숨어 있는지 먼저 알면 계산 결과를 읽기 쉬워집니다.
      </ShText>
      <div class="mt-4 space-y-4">
        <div v-for="mechanism in HOME_MECHANISMS" :key="mechanism.key">
          <ShText as="h3" variant="body" class="font-semibold">{{ mechanism.title }}</ShText>
          <ShText tone="muted" class="mt-1 max-w-3xl">{{ mechanism.body }}</ShText>
        </div>
      </div>
    </ShSurface>

    <ShSurface as="section" padding="lg" aria-labelledby="home-costs-title">
      <ShText id="home-costs-title" as="h2" variant="heading">계산에 쓰는 기준 금액</ShText>
      <ShText variant="caption" tone="muted" class="mt-1">
        계산기마다 흩어져 있는 요금 가정값을 한 표로 모았습니다. ({{ TRAVEL_HOME_UPDATED }} 점검)
      </ShText>
      <!-- 좁은 화면에서 3열은 마지막 열이 뭉개진다. 비고를 기준값 아래로 접어 2열로 유지한다 -->
      <Table class="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" class="w-2/5">항목</TableHead>
            <TableHead scope="col">기준</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in HOME_COST_TABLE" :key="row.item">
            <TableCell class="align-top font-semibold">{{ row.item }}</TableCell>
            <TableCell class="align-top">
              <span class="block font-semibold">{{ row.value }}</span>
              <span class="mt-0.5 block text-caption text-muted-foreground">{{ row.note }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <ShText variant="caption" tone="muted" class="mt-3 max-w-3xl">
        위 금액은 견적이 아니라 예산 범위를 잡기 위한 가정값입니다. 항공사 노선과 운임 조건,
        통신 판매처 프로모션, 실시간 환율에 따라 실제 결제 금액은 달라지므로 결제 직전에는
        각 공식 페이지에서 확인해 주세요.
      </ShText>
    </ShSurface>

    <RelatedServices />
  </div>
</template>
