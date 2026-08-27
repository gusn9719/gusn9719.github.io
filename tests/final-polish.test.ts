import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pages = [
  {
    path: "index.html",
    title: "임현우 | Developer Portfolio",
    canonical: "https://gusn9719.github.io/",
    description:
      "문제를 확인 가능한 근거로 좁히고, 데이터와 기능을 실제 서비스 흐름으로 연결해 온 임현우의 개발 포트폴리오입니다.",
  },
  {
    path: "projects/security-hub/index.html",
    title: "Security Hub | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/security-hub/",
    description:
      "의심 URL을 열기 전에 분석하고 필요하면 격리 브라우저에서 확인하는 Security Hub의 문제 정의, 임현우의 기여, 검증과 한계를 정리한 Case Study입니다.",
  },
  {
    path: "projects/reviewfit-beautylens/index.html",
    title: "ReviewFit → BeautyLens | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/reviewfit-beautylens/",
    description:
      "피부타입별 리뷰 반응을 분석한 ReviewFit에서 Oracle과 Spring MVC 기반 BeautyLens 서비스로 발전한 과정을 정리한 Case Study입니다.",
  },
  {
    path: "projects/gemma4-t17-rag/index.html",
    title: "Gemma4 T17 RAG | 임현우 Portfolio",
    canonical: "https://gusn9719.github.io/projects/gemma4-t17-rag/",
    description:
      "Tennant T17 영문 서비스 매뉴얼 QA 데이터셋, text-only Gemma4 QLoRA와 Hybrid RAG의 실험 판단과 평가 한계를 정리한 Case Study입니다.",
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
  it.each(pages)(
    "$path에 공유 metadata와 canonical URL을 출력한다",
    async ({ path, title, canonical, description }) => {
      const html = await readBuiltPage(path);

      expect(html).toContain(`<title>${title}</title>`);
      expect(readAttribute(findTag(html, "meta", "name", "description"), "content")).toBe(description);
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
      expect(readAttribute(findTag(html, "meta", "name", "twitter:card"), "content")).toBe(
        "summary_large_image",
      );
      expect(readAttribute(findTag(html, "meta", "name", "twitter:title"), "content")).toBe(title);
      expect(readAttribute(findTag(html, "meta", "name", "twitter:description"), "content")).toBe(
        description,
      );
      expect(readAttribute(findTag(html, "meta", "name", "twitter:image"), "content")).toBe(
        "https://gusn9719.github.io/assets/social/portfolio-preview.png",
      );
      expect(readAttribute(findTag(html, "meta", "name", "twitter:image:alt"), "content")).toBe(
        "임현우 개발자 포트폴리오",
      );
      expect(readAttribute(findTag(html, "link", "rel", "icon"), "href")).toBe("/favicon.svg");
    },
  );

  it("공유 이미지는 1200×630 PNG로 제공한다", async () => {
    const preview = await readFile(join(process.cwd(), "dist", "assets", "social", "portfolio-preview.png"));

    expect(preview.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(preview.readUInt32BE(16)).toBe(1200);
    expect(preview.readUInt32BE(20)).toBe(630);
  });

  it("공식 Pretendard v1.3.9 동적 서브셋을 self-host한다", async () => {
    const html = await readBuiltPage("index.html");
    const fontStylesheet = findTag(
      html,
      "link",
      "href",
      "/assets/fonts/pretendard/pretendardvariable-dynamic-subset.css",
    );
    const cssPath = join(
      process.cwd(),
      "dist",
      readAttribute(fontStylesheet, "href").replace(/^\//, ""),
    );
    const css = await readFile(cssPath);
    const cssText = css.toString("utf8");
    const fontDirectory = join(
      process.cwd(),
      "dist",
      "assets",
      "fonts",
      "pretendard",
      "woff2-dynamic-subset",
    );
    const fontFiles = (await readdir(fontDirectory)).filter((file) => file.endsWith(".woff2")).sort();
    const fontHash = createHash("sha256");

    expect(createHash("sha256").update(css).digest("hex")).toBe(
      "2973bcae80262dcb630cfb793fbf6af29bd986c769ee54953fb3e5b3e32323ca",
    );
    expect(cssText.match(/@font-face/g)).toHaveLength(92);
    expect(cssText.match(/PretendardVariable\.subset\.\d+\.woff2/g)).toHaveLength(92);
    expect(cssText).toContain("font-display: swap");
    expect(fontFiles).toHaveLength(92);

    for (const fontFile of fontFiles) {
      const path = join(fontDirectory, fontFile);
      const [font, metadata] = await Promise.all([readFile(path), stat(path)]);
      fontHash.update(fontFile).update("\0").update(font);
      expect(font.subarray(0, 4).toString("ascii"), fontFile).toBe("wOF2");
      expect(metadata.size, `${fontFile} size`).toBeLessThan(45_000);
    }

    expect(fontHash.digest("hex")).toBe(
      "862cd8cec3918a4589ade1641ad9c0ab25e84e5ceb4018348376a3763e7d7f09",
    );

    await expect(
      stat(join(process.cwd(), "dist", "assets", "fonts", "PretendardVariable.woff2")),
    ).rejects.toThrow();
  });

  it("Pretendard 라이선스와 system fallback을 함께 배포한다", async () => {
    const html = await readBuiltPage("index.html");
    const siteStylesheet = (html.match(/<link\b[^>]*rel="stylesheet"[^>]*>/gi) ?? []).find(
      (tag) => !tag.includes("pretendardvariable-dynamic-subset.css"),
    );
    expect(siteStylesheet).toBeTruthy();

    const css = await readFile(
      join(process.cwd(), "dist", readAttribute(siteStylesheet!, "href").replace(/^\//, "")),
      "utf8",
    );
    const license = await readFile(
      join(process.cwd(), "dist", "assets", "fonts", "Pretendard-LICENSE.txt"),
      "utf8",
    );

    expect(css).toMatch(
      /font-family:(?:"Pretendard Variable"|Pretendard Variable),(?:"Noto Sans KR"|Noto Sans KR),-apple-system/,
    );
    expect(license).toContain("Copyright (c) 2021, Kil Hyung-jin");
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
  });
});
