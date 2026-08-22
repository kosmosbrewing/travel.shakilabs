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
