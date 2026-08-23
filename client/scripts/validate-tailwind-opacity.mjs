import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Why this gate exists.
//
// Tailwind only emits a colour-opacity utility when the modifier is a key of
// theme.opacity. Anything else - `bg-profit/8`, `bg-primary/12`, `bg-card/92` -
// silently produces NO rule at all. The markup keeps the class, every review
// reads it as "there is a tint here", and the browser paints nothing. Six such
// classes shipped to production in this app, including the site header
// background on every page and the savings banner whose own code comment
// claimed the tint was carrying meaning for colour-blind readers.
//
// Nothing else catches this: typecheck does not see class strings, the build
// succeeds, the page renders, and the only symptom is a colour that was never
// there. So we compare every colour-opacity modifier in the source against the
// scale that actually generates CSS.
const SCALE = new Set([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]);

// Utility prefixes that take a colour and therefore accept an opacity modifier.
// Deliberately excludes size/layout prefixes so `w-1/2` and `aspect-16/9` cannot
// be mistaken for colour alpha.
const COLOR_PREFIX =
  "bg|text|border|divide|ring|ring-offset|outline|fill|stroke|from|via|to|" +
  "placeholder|decoration|accent|caret|shadow";

// Matches e.g. `bg-profit/8`, `hover:bg-primary/12`, `!border-profit/50`.
// Arbitrary alpha (`bg-black/[0.08]`) is intentionally not matched: it is a raw
// CSS value, not a scale lookup, and Tailwind emits it verbatim.
const MODIFIER = new RegExp(
  String.raw`(?<![\w-])!?(?:(?:[a-z][\w.-]*):)*(?:${COLOR_PREFIX})-[a-z][a-z0-9-]*\/(\d{1,3})(?![\w.%-])`,
  "g"
);

const SOURCE_EXTENSIONS = new Set([".vue", ".ts", ".js", ".mjs", ".html"]);
const SKIP_DIRECTORIES = new Set(["node_modules", "dist", ".git", "vendor", "artifacts"]);

function collectSourceFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRECTORIES.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectSourceFiles(full, found);
    else if (SOURCE_EXTENSIONS.has(extname(entry))) found.push(full);
  }
  return found;
}

// The hardcoded SCALE above is only true while the config leaves theme.opacity
// alone. If someone extends it, this gate would start reporting false failures,
// so make that a loud error instead of a mystery.
function assertOpacityScaleIsStock() {
  const config = readFileSync(resolve(projectRoot, "tailwind.config.ts"), "utf8");
  if (/\bopacity\s*:/.test(config)) {
    throw new Error(
      "tailwind.config.ts now customises theme.opacity - update SCALE in " +
        "scripts/validate-tailwind-opacity.mjs to match before this gate can be trusted."
    );
  }
}

assertOpacityScaleIsStock();

const files = [
  ...collectSourceFiles(resolve(projectRoot, "src")),
  resolve(projectRoot, "index.html"),
];

const failures = [];
let checked = 0;

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(MODIFIER)) {
      checked += 1;
      if (SCALE.has(Number(match[1]))) continue;
      failures.push({
        file: relative(projectRoot, file),
        line: i + 1,
        token: match[0],
      });
    }
  });
}

if (failures.length > 0) {
  const detail = failures
    .map((f) => `  ${f.file}:${f.line}  ${f.token}  (no CSS is generated for /${f.token.split("/").pop()})`)
    .join("\n");
  throw new Error(
    `Dead Tailwind opacity modifiers - ${failures.length} found.\n${detail}\n\n` +
      `Allowed steps: ${[...SCALE].join(", ")}. ` +
      "Snap to the nearest step, or drop the class if the tint was never wanted."
  );
}

console.log(
  `Validated ${checked} colour-opacity modifiers across ${files.length} source files: ` +
    "all resolve to a generated Tailwind utility."
);
