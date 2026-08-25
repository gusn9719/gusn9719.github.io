export interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

export interface Achievement {
  year: string;
  title: string;
  organization: string;
}

export const profile = {
  name: "임현우",
  englishName: "Hyunwoo Lim",
  hero:
    "데이터와 기능을 서비스 흐름으로 연결하고, 예상과 다른 결과는 근거를 확인해 바로잡습니다.",
  school: "한국폴리텍대학 성남캠퍼스 인공지능소프트웨어과",
  grade: "4.32 / 4.5",
  email: "gusn9719@gmail.com",
  github: "https://github.com/gusn9719",
  about: [
    "문제가 생기면 먼저 오류 메시지와 요청·응답, 데이터베이스 상태, 평가 결과를 확인합니다. 추측과 확인된 사실을 구분하면서 어느 구간부터 예상과 달라졌는지 범위를 좁혀 해결합니다.",
    "협업할 때는 확인한 내용과 남은 한계를 정확히 공유하고, 역할과 일정을 작은 단위로 나누어 조율합니다. 서로 다른 작업이 하나의 서비스 흐름으로 연결되는 지점을 함께 확인하는 과정을 중요하게 생각합니다.",
  ],
};

export const education: TimelineItem[] = [
  {
    period: "2025.03 — 현재",
    title: "한국폴리텍대학 성남캠퍼스 · 인공지능소프트웨어과",
    detail:
      "누적 학점 4.32 / 4.5 · 프로그래밍, 데이터베이스, 웹 개발, 운영체제, 네트워크와 인공지능을 프로젝트 중심으로 학습",
  },
  {
    period: "2024.01 — 2024.08",
    title: "KDT React / Node.js / MySQL 과정",
    detail: "React 화면 구성, Node.js API, MySQL 연동 실습 과정 수료",
  },
  {
    period: "2025.08 — 2026.08",
    title: "한국폴리텍대학 학생회 · 기획부장",
    detail: "교내 행사 기획과 외부 학생 대표와의 일정·지원 범위 조율",
  },
];

export const certifications: TimelineItem[] = [
  {
    period: "2026.06",
    title: "정보처리산업기사",
    detail: "한국산업인력공단",
  },
  {
    period: "2025.06",
    title: "SQLD",
    detail: "한국데이터산업진흥원",
  },
  {
    period: "2025.06",
    title: "ADsP",
    detail: "한국데이터산업진흥원",
  },
];

export const achievements: Achievement[] = [
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
];

export const skillGroups = [
  {
    title: "Backend / Web",
    items: ["Java", "Spring MVC", "MyBatis", "JSP", "JavaScript", "REST API", "FastAPI"],
  },
  {
    title: "Client / Application",
    items: ["Flutter", "Dart", "Streamlit"],
  },
  {
    title: "Data / Machine Learning",
    items: ["Python", "SQL", "Pandas", "TensorFlow · Keras", "PyTorch", "Hugging Face Transformers"],
  },
  {
    title: "Database / Testing / Infrastructure",
    items: ["Oracle", "MySQL", "Docker", "Selenium", "Playwright", "Git · GitHub"],
  },
  {
    title: "KDT 실습",
    items: ["React", "Node.js"],
  },
];
