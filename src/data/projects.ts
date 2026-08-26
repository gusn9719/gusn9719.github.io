export type ProjectSlug =
  | "security-hub"
  | "reviewfit-beautylens"
  | "gemma4-t17-rag";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "detail" | "github" | "demo";
}

export interface ProjectPreviewItem {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: "contain" | "cover";
  presentation?: "portrait" | "landscape" | "diagram";
}

export interface ProjectPreview {
  caption: string;
  items: ProjectPreviewItem[];
}

export interface Project {
  slug: ProjectSlug;
  order: string;
  title: string;
  context: string;
  type: string;
  problem: string;
  result: string;
  contribution: string;
  role: string;
  stack: string[];
  links: ProjectLink[];
  preview: ProjectPreview;
  serviceRecommendationModel?: string;
  comparedModels?: string[];
  klueBertUsedForServiceArtifact?: boolean;
  fineTuningModality?: string;
  retrievalImprovementContext?: string;
}

export const projects: Project[] = [
  {
    slug: "security-hub",
    order: "01",
    title: "Security Hub",
    context: "한이음 ICT 드림업 2026 · 3인 팀 프로젝트",
    type: "Mobile security service",
    problem:
      "의심 링크의 안전 여부를 확인하고 싶어도 직접 열어보는 것은 위험하다는 문제에서 시작했습니다.",
    result:
      "문자·공유·클립보드 등으로 URL을 받아 규칙, 도메인 평판, 휴리스틱 신호로 위험도를 판정하고, 필요한 경우 격리 브라우저로 이어지는 Flutter·FastAPI 서비스를 구현했습니다.",
    contribution:
      "프로젝트 아이디어와 사용자 흐름을 구상하고 Flutter 주요 화면, FastAPI 인증·분석 연동, 휴리스틱 보완, URL 처리 보안 수정과 시스템 통합에 참여했습니다.",
    role: "아이디어·서비스 흐름, Flutter 주요 기능, FastAPI 기능·통합",
    stack: ["Flutter", "FastAPI", "Docker", "Playwright"],
    preview: {
      caption: "실제 앱 demo에서 URL 분석 결과를 확인한 장면입니다.",
      items: [
        {
          label: "App demo",
          src: "/assets/security-hub/analysis-result-poster.webp",
          alt: "Security Hub 앱에서 URL을 분석해 의심 판정을 표시한 실제 demo 화면",
          width: 334,
          height: 720,
          fit: "contain",
          presentation: "portrait",
        },
      ],
    },
    links: [
      {
        label: "Case Study",
        href: "/projects/security-hub/",
        kind: "detail",
      },
      {
        label: "GitHub",
        href: "https://github.com/gusn9719/security_hub",
        kind: "github",
      },
    ],
  },
  {
    slug: "reviewfit-beautylens",
    order: "02",
    title: "ReviewFit → BeautyLens",
    context: "리뷰 분석 프로토타입에서 Spring MVC 서비스로 발전한 연속 프로젝트",
    type: "Project evolution",
    problem:
      "평균 별점만으로는 피부타입에 따른 반응 차이를 보기 어렵다는 점에서 시작했습니다.",
    result:
      "ReviewFit에서 리뷰를 통합·정규화하고 피부타입별 부정 반응 비율을 계산한 뒤, recommendation artifact와 리뷰 데이터를 BeautyLens의 Oracle DB에 적재해 사용자·관리자 웹 서비스로 연결했습니다.",
    contribution:
      "OliveYoung 리뷰를 직접 수집하고 제공받은 Musinsa·Coupang 데이터를 통합했습니다. 전처리·모델 비교·추천 집계·Streamlit 구현 후 BeautyLens의 데이터 적재와 Spring MVC 기능을 구현했습니다.",
    role: "데이터 수집·통합, 모델 비교, 추천 artifact, Spring MVC 서비스",
    stack: ["Python", "BiLSTM", "Spring MVC", "Oracle"],
    preview: {
      caption: "ReviewFit에서 BeautyLens로 이어진 실제 결과물: 실행 화면과 후속 서비스의 최신 ERD입니다.",
      items: [
        {
          label: "ReviewFit",
          src: "/assets/reviewfit/reviewfit-service-poster.webp",
          alt: "피부타입 필터, 상품 점수와 긍정·부정 리뷰를 표시한 ReviewFit 실제 Streamlit 화면",
          width: 900,
          height: 483,
          fit: "cover",
          presentation: "landscape",
        },
        {
          label: "BeautyLens",
          src: "/assets/beautylens/beautylens-erd.svg",
          alt: "상품, 외부 리뷰, 회원 평가와 운영 기록의 관계를 나타낸 BeautyLens 최신 ERD",
          width: 1440,
          height: 1050,
          fit: "contain",
          presentation: "diagram",
        },
      ],
    },
    links: [
      {
        label: "Case Study",
        href: "/projects/reviewfit-beautylens/",
        kind: "detail",
      },
      {
        label: "ReviewFit GitHub",
        href: "https://github.com/gusn9719/WebCrawling",
        kind: "github",
      },
      {
        label: "BeautyLens GitHub",
        href: "https://github.com/gusn9719/beautylens-mvc",
        kind: "github",
      },
    ],
    serviceRecommendationModel: "BiLSTM",
    comparedModels: ["BiLSTM", "Transformer", "KLUE-BERT"],
    klueBertUsedForServiceArtifact: false,
  },
  {
    slug: "gemma4-t17-rag",
    order: "03",
    title: "Gemma4 T17 RAG",
    context: "385쪽 영문 서비스 매뉴얼을 대상으로 한 기술문서 QA 실험",
    type: "NLP experiment",
    problem:
      "기술문서 질의응답에서 학습 결과뿐 아니라 데이터 분리, 근거 검색, 답변 실패를 구분해 확인하고자 했습니다.",
    result:
      "source 단위 분리와 검증을 거친 QA 데이터로 text-only QLoRA fine-tuning을 수행하고, 2,703개 문서 청크의 Hybrid RAG를 구축해 검색과 답변을 나누어 평가했습니다.",
    contribution:
      "PDF 데이터 가공, QA 작성·검증, fine-tuning 실험 비교, 검색 인덱스와 평가 코드, 실패 분석과 chatbot까지 전체 과정을 수행하고 기록했습니다.",
    role: "데이터셋 구성·검증, QLoRA 실험, RAG 평가·실패 분석",
    stack: ["Python", "Gemma 4", "QLoRA", "FAISS · BM25"],
    preview: {
      caption: "실제 QLoRA 학습 기록입니다. 이 곡선만으로 일반화 성능을 판단하지 않습니다.",
      items: [
        {
          label: "Training record",
          src: "/assets/gemma/loss-curve.png",
          alt: "Gemma4 QLoRA 학습 단계에 따른 train loss와 eval loss 변화 그래프",
          width: 1248,
          height: 701,
          fit: "contain",
          presentation: "landscape",
        },
      ],
    },
    links: [
      {
        label: "Case Study",
        href: "/projects/gemma4-t17-rag/",
        kind: "detail",
      },
      {
        label: "GitHub",
        href: "https://github.com/gusn9719/gemma4-t17-rag-finetuning",
        kind: "github",
      },
    ],
    fineTuningModality: "text-only",
    retrievalImprovementContext:
      "gold context 정렬과 retrieval 규칙을 수정하며 동일한 development/evaluation set에서 확인한 결과로, 독립 test 성능이 아니다.",
  },
];

export function getProjectBySlug(slug: ProjectSlug): Project {
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    throw new Error(`Unknown project: ${slug}`);
  }

  return project;
}
