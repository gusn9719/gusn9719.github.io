import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pages = [
  {
    path: "index.html",
    title: "임현우 | Developer Portfolio",
    canonical: "https://gusn9719.github.io/",
  },
  {
    path: "projects/security-hub/index.html",
    title: "Security Hub | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/security-hub/",
  },
  {
    path: "projects/reviewfit-beautylens/index.html",
    title: "ReviewFit → BeautyLens | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/reviewfit-beautylens/",
  },
  {
    path: "projects/gemma4-t17-rag/index.html",
    title: "Gemma4 T17 RAG | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/gemma4-t17-rag/",
  },
] as const;

async function readBuiltPage(pathname: string): Promise<string> {
  return readFile(join(process.cwd(), "dist", pathname), "utf8");
}

function findTag(html: string, tagName: "link" | "meta", attribute: string, value: string): string {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  const tag = tags.find((candidate) => new RegExp(`\\b${attribute}="${value}"`, "i").test(candidate));

  expect(tag, `${tagName}[${attribute}="${value}"]`).toBeTruthy();
  return tag!;
}

function readAttribute(tag: string, name: string): string {
  const value = tag.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
  expect(value, `${name} in ${tag}`).toBeTruthy();
  return value!;
}

describe("final portfolio polish", () => {
  it.each(pages)("$path에 공유 metadata와 canonical URL을 출력한다", async ({ path, title, canonical }) => {
    const html = await readBuiltPage(path);
    const description = readAttribute(findTag(html, "meta", "name", "description"), "content");

    expect(html).toContain(`<title>${title}</title>`);
    expect(readAttribute(findTag(html, "link", "rel", "canonical"), "href")).toBe(canonical);
    expect(readAttribute(findTag(html, "meta", "property", "og:type"), "content")).toBe("website");
    expect(readAttribute(findTag(html, "meta", "property", "og:locale"), "content")).toBe("ko_KR");
    expect(readAttribute(findTag(html, "meta", "property", "og:title"), "content")).toBe(title);
    expect(readAttribute(findTag(html, "meta", "property", "og:description"), "content")).toBe(description);
    expect(readAttribute(findTag(html, "meta", "property", "og:url"), "content")).toBe(canonical);
    expect(readAttribute(findTag(html, "meta", "property", "og:image"), "content")).toBe(
      "https://gusn9719.github.io/assets/social/portfolio-preview.png",
    );
    expect(readAttribute(findTag(html, "meta", "property", "og:image:width"), "content")).toBe("1200");
    expect(readAttribute(findTag(html, "meta", "property", "og:image:height"), "content")).toBe("630");
    expect(readAttribute(findTag(html, "meta", "property", "og:image:alt"), "content")).toBe(
      "임현우 개발자 포트폴리오",
    );
    expect(readAttribute(findTag(html, "meta", "name", "twitter:card"), "content")).toBe("summary_large_image");
    expect(readAttribute(findTag(html, "meta", "name", "twitter:title"), "content")).toBe(title);
    expect(readAttribute(findTag(html, "meta", "name", "twitter:description"), "content")).toBe(description);
    expect(readAttribute(findTag(html, "meta", "name", "twitter:image"), "content")).toBe(
      "https://gusn9719.github.io/assets/social/portfolio-preview.png",
    );
    expect(readAttribute(findTag(html, "meta", "name", "twitter:image:alt"), "content")).toBe(
      "임현우 개발자 포트폴리오",
    );
    expect(readAttribute(findTag(html, "link", "rel", "icon"), "href")).toBe("/favicon.svg");
  });

  it("공유 이미지는 1200×630 PNG로 제공한다", async () => {
    const preview = await readFile(join(process.cwd(), "dist", "assets", "social", "portfolio-preview.png"));

    expect(preview.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(preview.readUInt32BE(16)).toBe(1200);
    expect(preview.readUInt32BE(20)).toBe(630);
  });

  it("한글 webfont를 self-host하고 system fallback과 swap을 유지한다", async () => {
    const html = await readBuiltPage("index.html");
    const cssHref = readAttribute(findTag(html, "link", "rel", "stylesheet"), "href");
    const css = await readFile(join(process.cwd(), "dist", cssHref.replace(/^\//, "")), "utf8");
    const font = await readFile(join(process.cwd(), "dist", "assets", "fonts", "PretendardVariable.woff2"));

    expect(font.subarray(0, 4).toString("ascii")).toBe("wOF2");
    expect(css).toMatch(/@font-face\{[^}]*font-family:Pretendard[^}]*font-display:swap/);
    expect(css).toContain("/assets/fonts/PretendardVariable.woff2");
    expect(css).toMatch(/font-family:Pretendard,(?:"Noto Sans KR"|Noto Sans KR),-apple-system/);
  });
});
