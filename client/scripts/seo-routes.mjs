export const SEO_ROUTE_CONFIGS = [
  { path: "/all", changefreq: "weekly", priority: "0.9" },
  { path: "/luggage", changefreq: "weekly", priority: "1.0" },
  { path: "/esim", changefreq: "weekly", priority: "0.9" },
  { path: "/exchange", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

export const SEO_ROUTES = SEO_ROUTE_CONFIGS.map(({ path }) => path);
