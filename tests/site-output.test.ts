import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

async function readBuiltPage(pathname: string): Promise<string> {
  return readFile(join(process.cwd(), "dist", pathname), "utf8");
}

describe("정적 사이트 출력", () => {
  it("Home에 semantic landmark와 고정 순서의 대표 프로젝트를 출력한다", async () => {
    const html = await readBuiltPage("index.html");

    expect(html).toContain("<nav");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");

    const securityIndex = html.indexOf("Security Hub");
    const reviewIndex = html.indexOf("ReviewFit");
    const gemmaIndex = html.indexOf("Gemma4 T17 RAG");

    expect(securityIndex).toBeGreaterThan(-1);
    expect(reviewIndex).toBeGreaterThan(securityIndex);
    expect(gemmaIndex).toBeGreaterThan(reviewIndex);
  });

  it("Home에 공개 금지 개인정보를 출력하지 않는다", async () => {
    const html = await readBuiltPage("index.html");

    expect(html).not.toMatch(/010-\d{3,4}-\d{4}/);
    expect(html).not.toContain("생년월일");
    expect(html).not.toContain("상세 주소");
    expect(html).not.toContain("병역");
  });

  it.each([
    ["projects/security-hub/index.html", "Security Hub"],
    ["projects/reviewfit-beautylens/index.html", "ReviewFit → BeautyLens"],
    ["projects/gemma4-t17-rag/index.html", "Gemma4 T17 RAG"],
  ])("Case Study %s를 독립 문서로 생성한다", async (pathname, title) => {
    const html = await readBuiltPage(pathname);

    expect(html).toContain(`<h1`);
    expect(html).toContain(title);
    expect(html).toContain("Home으로 돌아가기");
    expect(html).toContain("Limitations");
  });

  it("Security Hub에서 개인 기여와 팀 전체 범위를 구분한다", async () => {
    const html = await readBuiltPage("projects/security-hub/index.html");

    expect(html).toContain("개인 기여 범위");
    expect(html).toContain("Sandbox 전체");
    expect(html).toContain("팀 전체 Backend");
  });

  it("ReviewFit에서 KLUE-BERT 비교 결과와 BiLSTM 서비스 artifact를 구분한다", async () => {
    const html = await readBuiltPage("projects/reviewfit-beautylens/index.html");

    expect(html).toContain("KLUE-BERT");
    expect(html).toContain("서비스용 recommendation artifact");
    expect(html).toContain("BiLSTM prediction 기반 집계");
  });

  it("BeautyLens ERD를 원본 비율로 반응형 출력한다", async () => {
    const html = await readBuiltPage("projects/reviewfit-beautylens/index.html");
    const image = html.match(/<img\b[^>]*beautylens-erd\.svg[^>]*>/i)?.[0];
    const cssHref = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/i)?.[1];

    expect(image).toContain('width="1440"');
    expect(image).toContain('height="1050"');
    expect(cssHref).toBeTruthy();

    const css = await readFile(join(process.cwd(), "dist", cssHref!.replace(/^\//, "")), "utf8");
    expect(css).toMatch(/\.inline-visual--diagram img\{[^}]*height:auto/);
  });

  it("Gemma 개선 수치에 동일 평가셋 조건을 함께 출력한다", async () => {
    const html = await readBuiltPage("projects/gemma4-t17-rag/index.html");

    expect(html).toContain("text-only");
    expect(html).toContain("동일한 development/evaluation set");
    expect(html).toContain("독립 test 성능 향상으로 해석할 수 없습니다");
  });

  it("사용자 친화적인 404 문서를 생성한다", async () => {
    const html = await readBuiltPage("404.html");

    expect(html).toContain("페이지를 찾을 수 없습니다");
    expect(html).toContain('href="/"');
  });

  it.each([
    "index.html",
    "404.html",
    "projects/security-hub/index.html",
    "projects/reviewfit-beautylens/index.html",
    "projects/gemma4-t17-rag/index.html",
  ])("정적 문서 %s에 불필요한 client script를 포함하지 않는다", async (pathname) => {
    const html = await readBuiltPage(pathname);

    expect(html).not.toMatch(/<script\b/i);
  });

  it.each([
    "index.html",
    "projects/security-hub/index.html",
    "projects/reviewfit-beautylens/index.html",
    "projects/gemma4-t17-rag/index.html",
  ])("외부 새 창 링크 %s에 보안 속성을 함께 출력한다", async (pathname) => {
    const html = await readBuiltPage(pathname);
    const externalLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) ?? [];

    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link).toMatch(/rel="[^"]*noopener[^"]*"/i);
      expect(link).toMatch(/rel="[^"]*noreferrer[^"]*"/i);
    }
  });

  it("영상은 poster와 원본 비율을 예약하고 metadata만 미리 읽으며 자동 재생하지 않는다", async () => {
    const securityHtml = await readBuiltPage("projects/security-hub/index.html");
    const reviewHtml = await readBuiltPage("projects/reviewfit-beautylens/index.html");
    const securityVideo = securityHtml.match(/<video\b[^>]*>/i)?.[0];
    const reviewVideo = reviewHtml.match(/<video\b[^>]*>/i)?.[0];

    expect(securityVideo).toBeTruthy();
    expect(securityVideo).toContain('width="334"');
    expect(securityVideo).toContain('height="720"');
    expect(securityVideo).toMatch(/\bcontrols\b/i);
    expect(securityVideo).toContain('preload="metadata"');
    expect(securityVideo).toContain('poster="/assets/security-hub/analysis-result-poster.webp"');
    expect(securityVideo).not.toMatch(/\bautoplay\b/i);

    expect(reviewVideo).toBeTruthy();
    expect(reviewVideo).toContain('width="1280"');
    expect(reviewVideo).toContain('height="686"');
    expect(reviewVideo).toMatch(/\bcontrols\b/i);
    expect(reviewVideo).toContain('preload="metadata"');
    expect(reviewVideo).toContain('poster="/assets/reviewfit/reviewfit-service-poster.webp"');
    expect(reviewVideo).not.toMatch(/\bautoplay\b/i);

    const reviewDemo = await stat(join(process.cwd(), "public", "assets", "reviewfit", "reviewfit-demo.mp4"));
    expect(reviewDemo.size).toBeLessThan(6 * 1024 * 1024);
  });

  it("모든 콘텐츠 이미지에 대체 텍스트를 둔다", async () => {
    const pages = await Promise.all([
      readBuiltPage("projects/security-hub/index.html"),
      readBuiltPage("projects/reviewfit-beautylens/index.html"),
      readBuiltPage("projects/gemma4-t17-rag/index.html"),
    ]);
    const html = pages.join("\n");
    const images = html.match(/<img\b[^>]*>/gi) ?? [];

    expect(images.length).toBeGreaterThan(0);
    expect(images.every((image) => /\balt="[^"]+"/i.test(image))).toBe(true);
  });
});
