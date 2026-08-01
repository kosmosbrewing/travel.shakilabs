// SBOM이 "이 앱의 것"인지만 확인하는 가드. 12개 앱에 그대로 복사해 쓰는 파일이다.
// 재생성 후 diff 방식을 쓰지 않는 이유: CycloneDX metadata.timestamp와
// SPDX documentNamespace(UUID), tools의 npm CLI 버전이 매 실행마다 달라져 상시 red가 된다.
// 그래서 비결정적 필드는 건드리지 않고 신원 필드 3개만 본다 — 1초 미만, 네트워크 불필요.
// 실제로 잡아야 할 사고: 스캐폴딩 복사로 seller-fee-compare SBOM이 house·biz·loan에 박힌 건.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sbomDir = resolve(projectRoot, "artifacts", "sbom");
const cyclonedxPath = resolve(sbomDir, "production.cyclonedx.json");
const spdxPath = resolve(sbomDir, "production.spdx.json");

// SBOM을 만들지 않는 앱에서도 무해하게 통과하도록 no-op. 나중에 어느 앱이
// SBOM을 생성하기 시작하면 가드가 저절로 켜진다.
if (!existsSync(cyclonedxPath)) {
  console.log("verify-sbom-identity: no SBOM present, skipping");
  process.exit(0);
}

const pkg = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
const cyclonedx = JSON.parse(readFileSync(cyclonedxPath, "utf8"));
const component = cyclonedx.metadata?.component ?? {};
const errors = [];

if (component.name !== pkg.name) {
  errors.push(`cyclonedx metadata.component.name is "${component.name}", expected "${pkg.name}"`);
}

if (component.version !== pkg.version) {
  errors.push(`cyclonedx metadata.component.version is "${component.version}", expected "${pkg.version}"`);
}

// GITHUB_REPOSITORY는 CI에만 있다. 로컬에서는 vcs 대조를 건너뛴다.
if (process.env.GITHUB_REPOSITORY) {
  const expectedVcs = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
  const vcs = (component.externalReferences ?? []).find((reference) => reference.type === "vcs");

  if (!vcs) {
    errors.push(`cyclonedx metadata.component has no vcs externalReference (expected ${expectedVcs})`);
  } else if (vcs.url.replace(/\.git$/, "") !== expectedVcs) {
    errors.push(`cyclonedx vcs url is "${vcs.url}", expected "${expectedVcs}"`);
  }
}

if (existsSync(spdxPath)) {
  const spdx = JSON.parse(readFileSync(spdxPath, "utf8"));
  const rootId = spdx.documentDescribes?.[0];
  const rootPackage = spdx.packages?.find((item) => item.SPDXID === rootId);

  if (!rootPackage) {
    errors.push(`spdx documentDescribes points at "${rootId}" which is not in packages[]`);
  } else if (rootPackage.name !== pkg.name) {
    errors.push(`spdx root package name is "${rootPackage.name}", expected "${pkg.name}"`);
  }
}

if (errors.length > 0) {
  console.error("verify-sbom-identity: SBOM does not describe this repository");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify-sbom-identity: OK (${component.name}@${component.version})`);
