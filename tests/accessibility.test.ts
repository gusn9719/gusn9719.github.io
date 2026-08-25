import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const cssPath = join(process.cwd(), "src", "styles", "global.css");

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5]
    .map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function readCssVariable(css: string, name: string) {
  const value = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
  if (!value) throw new Error(`CSS variable --${name} was not found`);
  return value;
}

describe("accessibility foundations", () => {
  it("keeps the primary CSS color pairs above WCAG AA normal-text contrast", async () => {
    const css = await readFile(cssPath, "utf8");
    const colors = {
      background: readCssVariable(css, "background"),
      ink: readCssVariable(css, "ink"),
      muted: readCssVariable(css, "muted"),
      accent: readCssVariable(css, "accent"),
      accentStrong: readCssVariable(css, "accent-strong"),
      accentSoft: readCssVariable(css, "accent-soft"),
    };
    const pairs = [
      [colors.ink, colors.background],
      [colors.muted, colors.background],
      [colors.accent, colors.background],
      ["#ffffff", colors.accent],
      [colors.accentStrong, colors.accentSoft],
    ];

    for (const [foreground, background] of pairs) {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("defines visible keyboard focus and reduced-motion handling", async () => {
    const css = await readFile(cssPath, "utf8");

    expect(css).toContain(":focus-visible");
    expect(css).toContain("outline: 3px solid #d8772f");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
