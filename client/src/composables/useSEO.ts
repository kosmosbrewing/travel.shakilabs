import { useHead } from "@unhead/vue";
import { toValue, type MaybeRefOrGetter } from "vue";
import { useRoute } from "vue-router";
import { getSiteUrl } from "@/lib/site";

// 2026-10-03 네이버 CTR 레시피 개정(BRIEF-TITLE.md): 네이버가 제목을 약 35자에서 자르는데
// 옛 접미사(" | 앱 이름 | ShakiLabs")가 20~25자를 먹어 핵심 구절이 안 보였다. 계산기·도구
// 페이지는 가운데 앱 이름을 빼 "<페이지 제목> | ShakiLabs"로 줄인다. 다만 홈·허브(/all)·
// 소개·약관류는 앱 이름을 남긴다 — 빼면 "이용약관 | ShakiLabs"가 12개 앱에서 동일해져
// 도메인 안에서 제목이 중복되기 때문이다(검색 유입이 목적이 아니므로 35자 절단은 무해).
const APP_NAME = "여행 준비 비용 비교";
const LEGACY_TITLE_SUFFIXES = [
  " | shakilabs.com/travel",
  ` | ${APP_NAME} | ShakiLabs`,
  ` | ${APP_NAME}`,
  " | ShakiLabs",
] as const;

// 앱 이름을 남기는 섹션(허브·소개·약관류·404). 그 외(계산기·도구)는 기본값("<제목> | ShakiLabs").
// 홈은 라우트 이름으로 별도 분기한다 — 페이지 제목 없이 앱 이름만 노출한다.
const APP_NAME_SUFFIX_ROUTE_NAMES = new Set(["AllTools", "About", "Terms", "Privacy", "NotFound"]);

function stripLegacySuffix(rawTitle: string): string {
  const trimmed = rawTitle.trim();

  for (const suffix of LEGACY_TITLE_SUFFIXES) {
    if (trimmed.endsWith(suffix)) {
      return trimmed.slice(0, -suffix.length).trimEnd();
    }
  }

  return trimmed;
}

type SEOOptions = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  ogImage?: MaybeRefOrGetter<string | undefined>;
  noindex?: MaybeRefOrGetter<boolean | undefined>;
  jsonLd?: MaybeRefOrGetter<
    Record<string, unknown> | Record<string, unknown>[] | undefined
  >;
};

function normalizeTitle(rawTitle: string, routeName: string | undefined): string {
  // 홈은 레시피상 페이지 제목을 쓰지 않고 앱 이름만 노출한다
  if (routeName === "Home") {
    return `${APP_NAME} | ShakiLabs`;
  }

  const pageTitle = stripLegacySuffix(rawTitle) || APP_NAME;

  if (routeName && APP_NAME_SUFFIX_ROUTE_NAMES.has(routeName)) {
    return `${pageTitle} · ${APP_NAME} | ShakiLabs`;
  }

  return `${pageTitle} | ShakiLabs`;
}

export function useSEO({
  title,
  description,
  ogImage,
  noindex = false,
  jsonLd,
}: SEOOptions): void {
  const route = useRoute();

  useHead(() => {
    const resolvedTitle = normalizeTitle(toValue(title), route.name?.toString());
    const resolvedDescription = toValue(description);
    const resolvedNoindex = Boolean(toValue(noindex));
    const resolvedOgImage = toValue(ogImage);
    const resolvedJsonLd = toValue(jsonLd);
    const resolvedJsonLdArray = Array.isArray(resolvedJsonLd)
      ? resolvedJsonLd.filter(
          (entry): entry is Record<string, unknown> =>
            Boolean(entry) && typeof entry === "object"
        )
      : resolvedJsonLd && typeof resolvedJsonLd === "object"
        ? [resolvedJsonLd]
        : [];
    const siteUrl = getSiteUrl().replace(/\/+$/, "");
    const currentPath = route.path || "/";
    const currentUrl = currentPath === "/" ? siteUrl : `${siteUrl}${currentPath}`;

    return {
      htmlAttrs: {
        lang: "ko",
      },
      title: resolvedTitle,
      link: currentUrl
        ? [
            { rel: "canonical", href: currentUrl },
            { rel: "alternate", hreflang: "ko", href: currentUrl },
            { rel: "alternate", hreflang: "x-default", href: currentUrl },
          ]
        : [],
      meta: [
        { name: "description", content: resolvedDescription },
        { property: "og:title", content: resolvedTitle },
        { property: "og:description", content: resolvedDescription },
        { name: "twitter:title", content: resolvedTitle },
        { name: "twitter:description", content: resolvedDescription },
        ...(currentUrl ? [{ property: "og:url", content: currentUrl }] : []),
        ...(resolvedNoindex ? [{ name: "robots", content: "noindex,nofollow" }] : []),
        ...(resolvedOgImage
          ? [
              { property: "og:image", content: resolvedOgImage },
              { name: "twitter:image", content: resolvedOgImage },
            ]
          : []),
      ],
      script: resolvedJsonLdArray.map((entry, index) => ({
        key: `json-ld-${index}`,
        type: "application/ld+json",
        textContent: JSON.stringify(entry),
      })),
    };
  });
}
