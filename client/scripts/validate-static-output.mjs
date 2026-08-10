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
  return resolve(distRoot, `${route.slice(1)}.html`);
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
  const expectedCanonical = `${canonicalBase}${route}`;
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

validateVercelConfig(resolve(repositoryRoot, "vercel.json"));
validateVercelConfig(resolve(projectRoot, "vercel.json"));
SEO_ROUTES.forEach(validateRoute);
validatePolicyDisclosures();

const rootHtml = readFileSync(resolve(distRoot, "index.html"), "utf8");
assert(readCanonical(rootHtml) === `${canonicalBase}/luggage`, "Invalid root canonical");
assert((rootHtml.match(/<h1\b/gi)?.length ?? 0) === 1,
  "Root alias must contain exactly one H1");
assert(!/<noscript>/i.test(rootHtml),
  "Root alias must not retain the shell noscript");
assert(AD_LOADER_PATTERN.test(rootHtml),
  "Ad wiring regressed: root alias lost the AdSense loader");

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
