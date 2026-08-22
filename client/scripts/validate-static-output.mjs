import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SEO_ROUTES } from "./seo-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const repositoryRoot = resolve(projectRoot, "..");
const distRoot = resolve(projectRoot, "dist");
const canonicalBase = "https://shakilabs.com/travel";
const MIN_MAIN_TEXT = 1500;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function routeOutputPath(route) {
  // vite-ssg는 홈을 dist/.html이 아니라 dist/index.html로 낸다
  return route === "/"
    ? resolve(distRoot, "index.html")
    : resolve(distRoot, `${route.slice(1)}.html`);
}

// cleanUrls가 "/travel/"를 "/travel"로 리다이렉트하므로 홈은 어디서나 슬래시 없이
// 주소를 잡는다: canonical, og:url, 사이트맵 loc 모두 같은 형태여야 한다.
function canonicalUrlFor(route) {
  return route === "/" ? canonicalBase : `${canonicalBase}${route}`;
}

function readCanonical(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>/)?.[1];
}

const AD_LOADER_PATTERN = /googlesyndication\.com|adsbygoogle/i;

// 화면 본문 자수. vite-ssg는 Vue 출력을 그대로 파일에 쓰므로 (JS 끔/켬 패리티 100%)
// <main> 안의 텍스트가 곧 이용자가 읽는 글이다. 헤더·푸터·네비는 전 라우트 공통이라
// 얇은 페이지를 두껍게 보이게 만들 뿐이므로 <main> 바깥은 세지 않는다.
function mainTextLength(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  return main
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, "")
    .replace(/\s+/g, " ")
    .trim().length;
}

function validateVercelConfig(configPath) {
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const indexRewrites = (config.rewrites ?? []).filter(
    (rewrite) => rewrite.destination === "/index.html"
  );

  assert(config.cleanUrls === true, `${configPath}: cleanUrls must be true`);
  assert(indexRewrites.length === 0, `${configPath}: index.html catch-all rewrite is forbidden`);
}

function validateRoute(route) {
  const outputPath = routeOutputPath(route);
  assert(existsSync(outputPath), `Missing static output for ${route}: ${outputPath}`);

  const html = readFileSync(outputPath, "utf8");
  const expectedCanonical = canonicalUrlFor(route);
  const h1Count = html.match(/<h1\b/gi)?.length ?? 0;

  assert(readCanonical(html) === expectedCanonical,
    `Invalid canonical for ${route}: expected ${expectedCanonical}`);
  assert(/<title>[^<]+<\/title>/.test(html), `Missing title for ${route}`);
  assert(h1Count === 1, `Expected one H1 for ${route}, found ${h1Count}`);
  assert(!/<noscript>/i.test(html),
    `Rendered route must not retain the shell noscript for ${route}`);
  assert(html.includes('id="app"'), `Missing app root for ${route}`);

  // 역방향 검증: 404에서 로더를 걷어내는 후처리가 정상 라우트까지 훑으면
  // 광고가 통째로 사라진다. 지워야 할 곳만 지웠는지 반대편도 확인한다.
  assert(AD_LOADER_PATTERN.test(html),
    `Ad wiring regressed: ${route} lost the AdSense loader`);

  // 얇은 콘텐츠 바닥선. 사이트맵에 올린 URL은 심사자가 열어보는 URL이다.
  const textLength = mainTextLength(html);
  assert(textLength >= MIN_MAIN_TEXT,
    `Thin content for ${route}: ${textLength} chars (min ${MIN_MAIN_TEXT})`);
}

// AdSense 심사 필수 3요소(제3자 광고 쿠키 고지·맞춤 광고 안내·옵트아웃 2링크)와
// 운영자 신원. 정책 문구를 다시 쓸 때 통째로 날아가기 쉬운 지점이라 게이트로 묶는다.
function validatePolicyDisclosures() {
  const privacy = readFileSync(routeOutputPath("/privacy"), "utf8");
  const terms = readFileSync(routeOutputPath("/terms"), "utf8");

  for (const link of ["https://adssettings.google.com", "https://www.aboutads.info/choices"]) {
    assert(privacy.includes(link), `/privacy must keep the AdSense opt-out link ${link}`);
  }
  assert(/제3자 광고/.test(privacy), "/privacy must disclose third-party ad cookies");
  assert(/맞춤 광고/.test(privacy), "/privacy must explain personalized ads");

  for (const [route, html] of [["/privacy", privacy], ["/terms", terms]]) {
    assert(/운영: ShakiLabs/.test(html), `${route} must state the operator (운영: ShakiLabs)`);
    assert(html.includes("skdba1313@gmail.com"), `${route} must state the contact address`);
  }
}

function readSitemapUrls() {
  const sitemapPath = resolve(distRoot, "sitemap.xml");
  assert(existsSync(sitemapPath), `Missing sitemap output: ${sitemapPath}`);

  const sitemap = readFileSync(sitemapPath, "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// 사이트맵 = SEO_ROUTES 전수, 순서까지 동일해야 한다.
function validateSitemap(actualUrls) {
  const expectedUrls = SEO_ROUTES.map(canonicalUrlFor);

  assert(JSON.stringify(actualUrls) === JSON.stringify(expectedUrls),
    "Sitemap must list exactly the SEO routes");
}

// 라우터에 선언된 경로를 뜯어 { path, redirect } 목록으로 돌려준다.
// 라우터 파일이 진실의 원천이라 소스를 직접 읽는다 — SEO_ROUTE_CONFIGS는 사람이 손으로
// 맞추는 사본이고, 이번 결함이 바로 그 사본이 원본과 어긋난 사고였다.
function parseRouterRoutes(source) {
  const body = source.slice(source.indexOf("export const routes"));
  const marks = [...body.matchAll(/path:\s*"([^"]+)"/g)].map((match) => ({
    path: match[1],
    index: match.index,
  }));

  return marks.map((mark, i) => ({
    path: mark.path,
    // 다음 path: 선언 전까지가 이 라우트의 본문이다
    redirect: /redirect:/.test(body.slice(mark.index, marks[i + 1]?.index ?? body.length)),
  }));
}

// 회귀 게이트: 라우터에 등록된 정적 라우트(특히 인덱스 라우트)가 사이트맵에 있는가.
//
// 왜 필요한가: "/"가 SEO_ROUTE_CONFIGS에서 빠져 있어도 빌드는 통과했고, 프리렌더도 됐고,
// 라이브도 200을 돌려줬다. 사이트맵에서만 조용히 사라져 앱에서 가장 권위 높은 URL이
// 색인 후보 밖에 있었다. 사람 눈으로 XML을 세는 것 말고는 잡을 방법이 없던 결함이다.
//
// 양방향인 이유: 리다이렉트 라우트는 자기 화면이 없어 다른 페이지로 canonical 통합되므로
// 사이트맵에 실으면 안 된다. "홈을 넣어라"만 검사하면 홈을 리다이렉트로 되돌린 뒤
// 사이트맵에만 URL을 남기는, 더 나쁜 모순 상태를 통과시키게 된다.
function validateRouterRoutesAreListed(sitemapUrls) {
  const routerSource = readFileSync(
    resolve(projectRoot, "src", "router", "index.ts"),
    "utf8"
  );
  const routerRoutes = parseRouterRoutes(routerSource);
  const indexRoute = routerRoutes.find((route) => route.path === "/");

  assert(indexRoute, "router/index.ts must register an index route");
  assert(!indexRoute.redirect,
    "Index route must render its own view: a redirect home canonicalizes to the "
      + "target page, and a page that points its canonical elsewhere cannot be listed");

  for (const route of routerRoutes) {
    // 파라미터·캐치올 라우트는 정적 URL이 아니고, 리다이렉트는 위 규칙대로 제외한다
    if (route.redirect || route.path.includes(":")) continue;
    assert(sitemapUrls.has(canonicalUrlFor(route.path)),
      `Router route is missing from the sitemap: ${canonicalUrlFor(route.path)}`);
  }
}

validateVercelConfig(resolve(repositoryRoot, "vercel.json"));
validateVercelConfig(resolve(projectRoot, "vercel.json"));
// validateRoute는 이제 "/"에도 돈다: 홈의 canonical·H1·본문 자수·광고 배선이 거기서 검사된다
SEO_ROUTES.forEach(validateRoute);
validatePolicyDisclosures();
// 라우터 대조를 먼저 돌린다: 어떤 라우트가 왜 빠졌는지 이름을 찍어 주므로
// "목록이 다르다"는 기계적 비교보다 원인을 바로 알려준다.
const sitemapUrls = readSitemapUrls();
validateRouterRoutesAreListed(new Set(sitemapUrls));
validateSitemap(sitemapUrls);

// 홈이 실제로 자기 콘텐츠를 갖고 렌더됐는지. 라우터가 리다이렉트로 되돌아가면
// vite-ssg는 대상 페이지를 그대로 index.html에 복사해 /travel이 /travel/luggage의 사본이 된다.
const rootHtml = readFileSync(routeOutputPath("/"), "utf8");
const titleOf = (html) => html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
assert(!/<div id="app">\s*<\/div>/.test(rootHtml),
  "Home must be prerendered, not shipped as the empty shell");
for (const twin of ["/luggage", "/all"]) {
  assert(titleOf(rootHtml) !== titleOf(readFileSync(routeOutputPath(twin), "utf8")),
    `Home must not duplicate ${twin}: identical titles mean the home has no page of its own`);
}

const notFoundPath = resolve(distRoot, "404.html");
assert(existsSync(notFoundPath), "Missing custom 404.html output");
const notFoundHtml = readFileSync(notFoundPath, "utf8");
assert(/name="robots" content="noindex,nofollow"/.test(notFoundHtml),
  "404.html must be noindex,nofollow");
assert(/href="\/travel\/luggage"/.test(notFoundHtml),
  "404.html must keep a recovery link into the app");

// 404 화면에는 게시자 콘텐츠가 없다. 로더가 남아 있으면 자동 광고가 붙어
// "Valuable Inventory" 정책을 어긴다. 셸이 로더를 계속 심으므로 검사가 없으면 되돌아온다.
assert(!AD_LOADER_PATTERN.test(notFoundHtml),
  "404.html must not load the AdSense script (Valuable Inventory: no ads on a contentless screen)");

console.log(
  `Validated ${SEO_ROUTES.length} SEO routes (>=${MIN_MAIN_TEXT} chars, ad wiring intact), ` +
    "policy disclosures, root canonical, and an ad-free custom 404 output."
);
