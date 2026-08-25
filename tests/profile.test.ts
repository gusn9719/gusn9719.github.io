import { describe, expect, it } from "vitest";

describe("개인 정보와 수상 데이터", () => {
  it("두 수상의 기관을 한국실천공학교육학회로 기록하고 Security Hub와 연결하지 않는다", async () => {
    const module = await import("../src/data/profile").catch(() => undefined);

    expect(module?.achievements).toEqual([
      {
        year: "2025",
        title: "2025 종합학술발표대회 우수논문상",
        organization: "사단법인 한국실천공학교육학회",
      },
      {
        year: "2025",
        title: "2025 교육장비 개발 및 아이디어 경진대회 동상",
        organization: "사단법인 한국실천공학교육학회",
      },
    ]);
  });
});
