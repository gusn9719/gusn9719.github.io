import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

async function readBuiltPage(pathname: string): Promise<string> {
  return readFile(join(process.cwd(), "dist", pathname), "utf8");
}

async function readBuiltCss(html: string): Promise<string> {
  const cssHref = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/i)?.[1];
  expect(cssHref).toBeTruthy();
  return readFile(join(process.cwd(), "dist", cssHref!.replace(/^\//, "")), "utf8");
}

function readProjectCard(html: string, slug: string): string {
  const marker = `aria-labelledby="${slug}-title"`;
  const start = html.lastIndexOf("<article", html.indexOf(marker));
  const end = html.indexOf("</article>", start);

  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return html.slice(start, end + "</article>".length);
}

const caseStudyPages = [
  "projects/security-hub/index.html",
  "projects/reviewfit-beautylens/index.html",
  "projects/gemma4-t17-rag/index.html",
];

describe("Portfolio usability and evidence", () => {
  it("Security Hub Home 카드에서 제목·visual·primary CTA로 Case Study에 들어간다", async () => {
    const html = await readBuiltPage("index.html");
    const card = readProjectCard(html, "security-hub");
    const detailLinks = card.match(/href="\/projects\/security-hub\/"/g) ?? [];

    expect(detailLinks).toHaveLength(3);
    expect(card).toMatch(/<h3\b[^>]*id="security-hub-title"[^>]*>\s*<a\b[^>]*href="\/projects\/security-hub\/"/i);
    expect(card).toMatch(/<a\b[^>]*class="[^"]*project-preview__link[^"]*"[^>]*href="\/projects\/security-hub\/"/i);
    expect(card).toMatch(/<a\b[^>]*class="[^"]*button[^"]*"[^>]*href="\/projects\/security-hub\/"[^>]*>\s*Case Study 보기/i);
  });

  it("Security Hub Home 카드에서 실제 판정과 확인 방식 선택 화면을 함께 보여준다", async () => {
    const html = await readBuiltPage("index.html");
    const card = readProjectCard(html, "security-hub");

    expect(card).toContain("/assets/security-hub/suspicious-result.png");
    expect(card).toContain("/assets/security-hub/analysis-mode.png");
    expect(card).not.toContain("/assets/security-hub/analysis-result-poster.webp");
    expect(card.match(/<img\b[^>]*>/gi)).toHaveLength(2);
  });

  it("Security Hub Home 카드는 세 칼럼 보고서 대신 짧은 설명과 개인 기여를 보여준다", async () => {
    const html = await readBuiltPage("index.html");
    const card = readProjectCard(html, "security-hub");

    expect(card).toContain("의심 URL을 분석하고, 판단이 어려운 링크는 격리된 화면에서 확인하도록 연결한 모바일 보안 서비스입니다.");
    expect(card).toContain("아이디어·사용자 흐름 설계, Flutter 주요 화면, FastAPI 인증·분석 연동과 시스템 통합에 참여했습니다.");
    expect(card).not.toContain("summary-label");
    expect(card).not.toContain(">Problem<");
    expect(card).not.toContain(">Built<");
  });

  it("Home에서 세 프로젝트의 실제 visual evidence를 바로 보여준다", async () => {
    const html = await readBuiltPage("index.html");
    const previews = html.match(/<figure\b[^>]*class="[^"]*project-preview[^"]*"[\s\S]*?<\/figure>/gi) ?? [];

    expect(previews).toHaveLength(3);
    expect(html).toContain("/assets/security-hub/suspicious-result.png");
    expect(html).toContain("/assets/security-hub/analysis-mode.png");
    expect(html).toContain("/assets/reviewfit/reviewfit-service-poster.webp");
    expect(html).toContain("/assets/beautylens/beautylens-erd.svg");
    expect(html).toContain("/assets/gemma/loss-curve.png");
    expect(html).toContain("ReviewFit에서 BeautyLens로 이어진 실제 결과물");

    const previewImages = previews.flatMap((preview) => preview.match(/<img\b[^>]*>/gi) ?? []);
    expect(previewImages.length).toBeGreaterThanOrEqual(4);
    expect(previewImages.every((image) => /\balt="[^"]+"/i.test(image))).toBe(true);
  });

  it("global header와 Case Study 목차를 sticky navigation으로 제공한다", async () => {
    const home = await readBuiltPage("index.html");
    const css = await readBuiltCss(home);

    expect(css).toMatch(/\.site-header\{[^}]*position:sticky/);
    expect(css).toMatch(/\.project-section-nav\{[^}]*position:sticky/);

    for (const pathname of caseStudyPages) {
      const html = await readBuiltPage(pathname);
      const nav = html.match(/<nav\b[^>]*class="[^"]*project-section-nav[^"]*"[\s\S]*?<\/nav>/i)?.[0];

      expect(nav).toBeTruthy();
      expect(nav).toContain('aria-label="Case Study 목차"');

      const anchors = [...nav!.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
      expect(anchors.length).toBeGreaterThanOrEqual(5);
      for (const id of anchors) {
        expect(html).toContain(`id="${id}"`);
      }
    }
  });

  it("각 Case Study에서 이전·다음 프로젝트로 이동할 수 있다", async () => {
    for (const pathname of caseStudyPages) {
      const html = await readBuiltPage(pathname);
      const switcher = html.match(/<nav\b[^>]*aria-label="다른 Case Study"[\s\S]*?<\/nav>/i)?.[0];

      expect(switcher).toBeTruthy();
      expect(switcher).toContain("Previous");
      expect(switcher).toContain("Next");
      expect(switcher?.match(/href="\/projects\//g)).toHaveLength(2);
    }
  });

  it("Security Hub 결과를 test context와 다른 관측까지 함께 설명한다", async () => {
    const html = await readBuiltPage("projects/security-hub/index.html");

    expect(html).toContain("508건");
    expect(html).toContain("regression set");
    expect(html).toContain("외부 네트워크");
    expect(html).toContain("mock");
    expect(html).toContain("1,000명");
    expect(html).toContain("개발 서버가 응답을 멈췄습니다");
    expect(html).toContain("10개 중 9개");
    expect(html).toContain("살아 있던 danger URL 1개");
    expect(html).toContain("safe URL 9개 중 2개");
    expect(html).toContain("What I would test next");
  });

  it("ReviewFit과 BeautyLens 검증 범위를 모델 평가와 import integrity로 구분한다", async () => {
    const html = await readBuiltPage("projects/reviewfit-beautylens/index.html");

    expect(html).toContain("weak label");
    expect(html).toContain("human-gold");
    expect(html).toContain("stratified 8:2");
    expect(html).toContain("47.1%");
    expect(html).toContain("52.9%");
    expect(html).toMatch(/BiLSTM[^<]{0,160}neutral precision[^<]{0,40}0\.196/i);
    expect(html).toContain("Data import integrity");
    expect(html).toContain("서비스 전체 품질을 증명하지 않습니다");
    expect(html).toContain("브라우저 자동 테스트는 구현하지 못했습니다");
    expect(html).toContain("What I would test next");
  });

  it("Gemma retrieval 수치를 반복 사용한 평가셋과 gold-context 수정 조건 안에서 설명한다", async () => {
    const html = await readBuiltPage("projects/gemma4-t17-rag/index.html");

    expect(html).toContain("0.5893");
    expect(html).toContain("0.9286");
    expect(html).toContain("gold context 정렬");
    expect(html).toContain("고정 60문항");
    expect(html).toContain("반복 사용");
    expect(html).toContain("독립 final test");
    expect(html).toContain("301–385쪽에는 QA가 없습니다");
    expect(html).toContain("What I would test next");
  });

  it("Security Hub lead video에 실제 poster를 두고 autoplay 없이 제한된 폭으로 출력한다", async () => {
    const html = await readBuiltPage("projects/security-hub/index.html");
    const css = await readBuiltCss(html);
    const video = html.match(/<video\b[^>]*>/i)?.[0];

    expect(video).toContain('poster="/assets/security-hub/analysis-result-poster.webp"');
    expect(video).not.toMatch(/\bautoplay\b/i);
    expect(css).toMatch(/\.project-visual--video\{[^}]*max-width/);
    expect(css).toMatch(/\.project-visual--portrait-video\{[^}]*max-width:420px/);
    const portraitVideoRule = css.match(/\.project-visual--portrait-video video\{[^}]*}/)?.[0];
    expect(portraitVideoRule).toContain("width:auto");
    expect(portraitVideoRule).toContain("max-height:720px");
    expect(portraitVideoRule).toContain("aspect-ratio:auto");
  });

  it("mobile에서는 wide content를 본문 밖으로 밀지 않고 내부에서만 처리한다", async () => {
    const html = await readBuiltPage("projects/reviewfit-beautylens/index.html");
    const css = await readBuiltCss(html);

    expect(css).toMatch(/\.project-row__body[^}]*min-width:0/);
    expect(css).toMatch(/\.table-wrap\{[^}]*max-width:100%[^}]*overflow-x:auto/);
    expect(css).toMatch(/@media\s*\(width<=680px\)[\s\S]*\.project-preview__media--split\{grid-template-columns:1fr/);
    expect(css).toMatch(/@media\s*\(width<=680px\)[\s\S]*\.project-switcher\{grid-template-columns:1fr/);
    expect(css).toMatch(/@media\s*\(width<=1240px\)[\s\S]*\.inline-visual\.inline-visual--diagram\{width:100%;margin-left:0/);
    expect(css).not.toContain("overflow-x:hidden");
  });
});
