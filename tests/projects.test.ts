import { describe, expect, it } from "vitest";

describe("대표 프로젝트 데이터", () => {
  it("고정된 순서의 세 Case Study를 제공한다", async () => {
    const module = await import("../src/data/projects").catch(() => undefined);

    expect(module?.projects.map((project) => project.slug)).toEqual([
      "security-hub",
      "reviewfit-beautylens",
      "gemma4-t17-rag",
    ]);
  });

  it("Security Hub 문제를 직접 열람의 위험으로 설명하고 단정 표현을 피한다", async () => {
    const { projects } = await import("../src/data/projects");
    const security = projects.find((project) => project.slug === "security-hub") as
      | { problem?: string }
      | undefined;

    expect(security?.problem).toContain(
      "의심 링크의 안전 여부를 확인하고 싶어도 직접 열어보는 것은 위험하다",
    );
    expect(security?.problem).not.toContain("결국 직접 열어야");
  });

  it("ReviewFit 서비스 artifact와 모델 비교 결과를 구분한다", async () => {
    const { projects } = await import("../src/data/projects");
    const reviewFit = projects.find(
      (project) => project.slug === "reviewfit-beautylens",
    ) as
      | {
          serviceRecommendationModel?: string;
          comparedModels?: string[];
          klueBertUsedForServiceArtifact?: boolean;
        }
      | undefined;

    expect(reviewFit).toMatchObject({
      serviceRecommendationModel: "BiLSTM",
      klueBertUsedForServiceArtifact: false,
    });
    expect(reviewFit?.comparedModels).toContain("KLUE-BERT");
  });

  it("Gemma를 text-only로 정의하고 동일 평가셋 개선 조건을 보존한다", async () => {
    const { projects } = await import("../src/data/projects");
    const gemma = projects.find((project) => project.slug === "gemma4-t17-rag") as
      | { fineTuningModality?: string; retrievalImprovementContext?: string }
      | undefined;

    expect(gemma?.fineTuningModality).toBe("text-only");
    expect(gemma?.retrievalImprovementContext).toContain(
      "동일한 development/evaluation set",
    );
    expect(gemma?.retrievalImprovementContext).toContain("독립 test 성능이 아니다");
  });
});
