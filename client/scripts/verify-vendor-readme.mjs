// 벤더링된 tgz의 "공급망 기록"이 실제 파일과 어긋나지 않게 막는 가드.
// 과거 사고: README는 0.3.7 해시를 적어둔 채 실제 tgz만 0.3.11로 올라가,
// 무결성 검증을 시도하는 사람에게 오답을 주는 상태가 9개 저장소에 방치됐다.
// 네트워크·npm 재설치 없이 파일 3개만 대조하므로 완전히 결정적이다.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = resolve(projectRoot, "vendor");
const errors = [];

const tgzFiles = safeReaddir(vendorDir).filter((name) => name.endsWith(".tgz"));

// vendor 디렉터리 자체가 없는 앱에서도 그대로 붙여 쓸 수 있도록 no-op 처리.
if (tgzFiles.length === 0) {
  console.log("verify-vendor-readme: no vendored tgz, skipping");
  process.exit(0);
}

if (tgzFiles.length > 1) {
  errors.push(`expected exactly one vendored tgz, found ${tgzFiles.length}: ${tgzFiles.join(", ")}`);
}

const tgzName = tgzFiles[0];
const actualDigest = createHash("sha256").update(readFileSync(resolve(vendorDir, tgzName))).digest("hex");
const readme = readFileSync(resolve(vendorDir, "README.md"), "utf8");

// README가 여러 곳에서 파일명을 언급하므로 전부 같은 버전을 가리키는지 본다
// (일부만 고치고 넘어가는 부분 갱신이 실제 드리프트의 원인이었다).
const mentioned = [...new Set([...readme.matchAll(/shakilabs-ui-\d+\.\d+\.\d+\.tgz/g)].map((m) => m[0]))];

if (mentioned.length === 0) {
  errors.push("README.md does not mention any shakilabs-ui-<version>.tgz filename");
} else if (mentioned.length > 1) {
  errors.push(`README.md mentions conflicting artifacts: ${mentioned.join(", ")}`);
} else if (mentioned[0] !== tgzName) {
  errors.push(`README.md documents ${mentioned[0]} but vendor/ contains ${tgzName}`);
}

const digestMatch = readme.match(/SHA-256:\s*`([0-9a-f]{64})`/);

if (!digestMatch) {
  errors.push("README.md has no `SHA-256: <64 hex>` line");
} else if (digestMatch[1] !== actualDigest) {
  errors.push(`README.md records SHA-256 ${digestMatch[1]} but ${tgzName} hashes to ${actualDigest}`);
}

const pkg = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
const declared = pkg.dependencies?.["@shakilabs/ui"];
const expected = `file:vendor/${tgzName}`;

if (declared !== expected) {
  errors.push(`package.json depends on "${declared}" but vendor/ contains ${tgzName} (expected "${expected}")`);
}

if (errors.length > 0) {
  console.error("verify-vendor-readme: vendored artifact record is out of sync");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify-vendor-readme: OK (${tgzName}, sha256 ${actualDigest.slice(0, 12)}…)`);

function safeReaddir(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
