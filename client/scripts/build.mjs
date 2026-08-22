import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { SEO_ROUTE_CONFIGS, SEO_ROUTES } from "./seo-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const sitemapPath = resolve(projectRoot, "public", "sitemap.xml");
const viteSsgBin = resolve(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vite-ssg.cmd" : "vite-ssg"
);

function resolveBuildDate() {
  const candidate = process.env.BUILD_DATE?.trim();
  if (candidate && /^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    return candidate;
  }

  return new Date().toISOString().slice(0, 10);
}

function renderSitemap(buildDate) {
  const baseUrl = "https://shakilabs.com/travel";
  const urls = SEO_ROUTE_CONFIGS
    .map(
      // cleanUrls가 "/travel/"를 "/travel"로 리다이렉트하므로 홈은 슬래시 없이 실어야
      // 한다 (canonical·og:url도 슬래시 없는 형태다 — 셋이 어긋나면 모순 신호가 된다).
      ({ path, changefreq, priority }) => `  <url>
    <loc>${path === "/" ? baseUrl : `${baseUrl}${path}`}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function routeOutputPath(route) {
  return route === "/"
    ? resolve(projectRoot, "dist", "index.html")
    : resolve(projectRoot, "dist", `${route.slice(1)}.html`);
}

function removeRenderedNoscriptFallbacks() {
  // SEO_ROUTES에 "/"가 포함되므로 따로 앞에 붙이지 않는다
  for (const route of [...SEO_ROUTES, "/404"]) {
    const outputPath = routeOutputPath(route);
    if (!existsSync(outputPath)) continue;

    const html = readFileSync(outputPath, "utf8");
    const nextHtml = html.replace(
      /\n?\s*<noscript>[\s\S]*?<\/noscript>/i,
      "",
    );
    writeFileSync(outputPath, nextHtml, "utf8");
  }
}

// 404 화면은 제목·안내 문장·복귀 링크뿐(74자)이라 게시자 콘텐츠가 사실상 없다.
// 셸(index.html)의 애드센스 로더는 vite-ssg가 만드는 모든 산출물에 그대로 복사되므로
// 404.html에도 실려 자동 광고가 붙는데, 이는 Google "Valuable Inventory" 정책
// (콘텐츠 없는 화면에 광고 금지) 위반이고 nutri /disclosure의 자사 고지와도 어긋난다.
// 정상 라우트의 배선은 건드리지 않고 404 산출물에서만 로더를 걷어낸다.
// 제거가 유지되는지는 validate-static-output.mjs가 양방향으로 검사한다.
function stripAdsenseLoaderFromNotFound() {
  const outputPath = routeOutputPath("/404");
  if (!existsSync(outputPath)) return;

  const html = readFileSync(outputPath, "utf8");
  const nextHtml = html.replace(
    /\n?\s*<script\b[^>]*(?:googlesyndication\.com|adsbygoogle)[^>]*>\s*<\/script>/gi,
    "",
  );
  writeFileSync(outputPath, nextHtml, "utf8");
}

const buildDate = resolveBuildDate();

mkdirSync(dirname(sitemapPath), { recursive: true });
writeFileSync(sitemapPath, renderSitemap(buildDate), "utf8");

const result = spawnSync(viteSsgBin, ["build"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    BUILD_DATE: buildDate,
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

removeRenderedNoscriptFallbacks();
stripAdsenseLoaderFromNotFound();

const validationResult = spawnSync(
  process.execPath,
  [resolve(projectRoot, "scripts", "validate-static-output.mjs")],
  {
    cwd: projectRoot,
    stdio: "inherit",
  }
);

process.exit(validationResult.status ?? 1);
