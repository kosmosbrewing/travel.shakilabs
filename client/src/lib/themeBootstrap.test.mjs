import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("theme bootstrap", () => {
  it("applies the stored travel theme before the app bundle loads", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

    expect(html).toContain('const key = "travel-tools:theme:v1"');
    expect(html).toContain('document.documentElement.classList.add("dark")');
    expect(html.indexOf('const key = "travel-tools:theme:v1"')).toBeLessThan(
      html.indexOf('<script type="module" src="/src/main.ts"></script>'),
    );
  });
});
