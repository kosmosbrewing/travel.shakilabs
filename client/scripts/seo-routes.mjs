export const SEO_ROUTE_CONFIGS = [
  // "/" must stay listed: this array is the only source for both the sitemap and
  // the prerender set, so an omission silently drops the app home — the most
  // authoritative URL we own — out of the sitemap entirely.
  // 홈이 최상위 priority. 다른 앱(invest/loan/biz 등)도 "/" 1.0 / 나머지 0.9 이하다.
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/all", changefreq: "weekly", priority: "0.9" },
  { path: "/luggage", changefreq: "weekly", priority: "0.9" },
  { path: "/esim", changefreq: "weekly", priority: "0.9" },
  { path: "/exchange", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

export const SEO_ROUTES = SEO_ROUTE_CONFIGS.map(({ path }) => path);

// 색인 소거(2026-10-16, 사용자 승인): 62일 활성 사용자 8명 미만 + 네이버 TOP 30 밖인 계산기·가이드.
// 도구는 그대로 쓰이고(내부 링크 유지) 사이트맵·색인에서만 뺀다. 네이버 클릭이 월 10+ 되면 다시 넣는다.
// validate-noindex.mjs가 사이트맵 ⇔ noindex 없음 / 사이트맵 밖 self-canonical ⇔ noindex를 빌드마다 대조한다.
export const NOINDEX_ROUTES = ["/esim"];
export const SITEMAP_ROUTE_CONFIGS = SEO_ROUTE_CONFIGS.filter(({ path }) => !NOINDEX_ROUTES.includes(path));
export const SITEMAP_ROUTES = SITEMAP_ROUTE_CONFIGS.map(({ path }) => path);

