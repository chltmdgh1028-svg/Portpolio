// Portfolio content. Numbers marked "verified" come from the product screenshots
// (inspection-app header / KPI cards) or from the user's brief; nothing here is estimated.

export const navItems = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" },
];

// section ids that belong to a nav item without having their own menu entry
export const sectionToNav = { "gs-story": "projects", "emart-story": "projects" };

export const screens = {
  inspectionApp: "/screens/inspection-app.webp",
  inspectionKpi: "/screens/inspection-summary.webp",
  dashboardLogin: "/screens/inspection-dashboard-login.webp",
  scoreSimulator: "/screens/score-simulator.webp",
  reportGenerator: "/screens/report-generator-wizard.webp",
  oneOps: "/screens/one-ops-hq.webp",
};

// Verified from the Inspection App KPI cards (총 SKU 680 / 검품대상 SKU 326 / 총 수량 146,501 / 검품대상 수량 71,289)
export const gsData = {
  inspectionRate: [
    { name: "Before", range: [3, 5], label: "3~5%" },
    { name: "After", range: [6, 8], label: "6~8%" },
  ],
  sku: { target: 326, total: 680 },
  quantity: { target: 71289, total: 146501 },
  hoursSaved: 4,
  flow: [
    { step: "01", title: "현장 문제", body: "검품 기준·수량·사진 기록이 흩어져 담당자별 편차와 누락이 발생했습니다." },
    { step: "02", title: "시스템 구축", body: "Inspection App, Dashboard, Report Generator를 직접 설계하고 개발했습니다." },
    { step: "03", title: "운영 변화", body: "검품 기준이 하나로 통일되고, 현황 확인과 보고서 작성이 자동화됐습니다." },
    { step: "04", title: "수치 개선", body: "검품률 3~5% → 6~8%, 반복 업무 일 4시간을 줄였습니다." },
  ],
};

export const emartData = {
  sales: [
    { name: "Before", value: 0.5, label: "0.5억" },
    { name: "After", value: 0.7, label: "0.7억" },
  ],
  rank: { from: 21, to: 1, total: 21 },
  openings: [
    { store: "구월", note: "신규 오픈" },
    { store: "화서", note: "신규 오픈" },
    { store: "안성", note: "신규 오픈" },
  ],
};

export const projects = [
  {
    id: "inspection-app",
    title: "신선상품 검품 시스템",
    english: "Inspection App",
    status: "운영중",
    oneLine: "현장에서 바로 쓰는 신선상품 검품 PDA 웹앱",
    problem: "검품 기준, 수량, 사진 기록이 흩어져 담당자별 편차와 누락이 발생했습니다.",
    purpose: "수량 확인 · 검품 기준 · 사진 기록 · 협력사별 진행 상태를 하나의 현장형 플로우로 묶었습니다.",
    tech: ["React", "Vite", "Apps Script", "Ably", "Capacitor"],
    image: screens.inspectionApp,
    imageAlt: "Inspection App 화면 — 협력사 목록과 상품별 검품 진행",
    gallery: [screens.inspectionApp, screens.inspectionKpi],
    accent: "#2f7bff",
    result: "검품률 3~5% → 6~8%",
    metrics: ["검품률 3~5% → 6~8%", "총 SKU 680 중 검품대상 326", "검품대상 수량 71,289개"],
    demoNote: "GS리테일 사내 운영 환경이라 외부 공개 데모는 제공하지 않습니다.",
    caseStudy: {
      why: "검품 결과가 사람마다 다르게 기록되면 협력사 품질 관리 자체가 흔들립니다. 먼저 기준과 기록 방식을 하나로 맞춰야 했습니다.",
      process: "현장 검품 동선 관찰 → 입력 항목 최소화 → 프로토타입 → 담당자 피드백 → 운영 적용 순서로 반복했습니다.",
    },
  },
  {
    id: "inspection-dashboard",
    title: "Inspection Dashboard",
    english: "Inspection Dashboard",
    status: "운영중",
    oneLine: "신선식품 검품 데이터를 한눈에 보는 운영 대시보드",
    problem: "검품 데이터가 쌓여도 당일 운영 판단에 바로 쓰기 어려웠습니다.",
    purpose: "쌓인 검품 데이터를 빠르게 읽고 협력사별 실행 수준을 확인하도록 구성했습니다.",
    tech: ["React", "Recharts", "Tailwind", "Vercel"],
    image: screens.dashboardLogin,
    imageAlt: "Inspection Dashboard 로그인 화면",
    gallery: [screens.dashboardLogin, screens.scoreSimulator],
    liveUrl: "https://inspection-dashboard-silk.vercel.app/login",
    accent: "#4f6bff",
    result: "실서비스 배포 중",
    metrics: ["Vercel 실서비스 운영", "협력사별 검품 수행 수준 확인", "검품점수 시뮬레이터(설명용 데모) 포함"],
    caseStudy: {
      why: "데이터가 있어도 의사결정에 쓰이지 않으면 의미가 없습니다. 당일 운영에서 바로 볼 수 있는 형태가 필요했습니다.",
      process: "검품 앱 데이터 구조 정리 → 핵심 지표 정의 → 대시보드 설계 → 로그인 기반 실서비스 배포 순서로 진행했습니다.",
    },
  },
  {
    id: "report-generator",
    title: "보고서 자동 생성기",
    english: "Report Generator",
    status: "운영중",
    oneLine: "검품 데이터에서 보고서까지 한 번에 만드는 자동화 도구",
    problem: "매일 반복되는 보고서 정리와 공유에 많은 시간이 소요됐습니다.",
    purpose: "사진·검품 데이터를 내부 공유용 / 파트너사 공유용 PPT와 엑셀 양식으로 자동 생성합니다.",
    tech: ["Node.js", "PptxGenJS", "ExcelJS", "Apps Script", "Gemini"],
    image: screens.reportGenerator,
    imageAlt: "Report Generator 화면 — 불량표 포함 내부공유용 PPT 생성: 불량 상품 확인과 AI 문구 작성 단계 (데모 빌드)",
    gallery: [screens.reportGenerator],
    accent: "#12a56a",
    result: "일 4시간 절감",
    metrics: ["일 4시간 업무시간 절감", "내부/파트너사 공유용 PPT 자동 생성", "불량·회송 엑셀 양식 자동 생성"],
    demoNote: "운영 버전은 사내 데이터를 사용합니다. 화면은 회사 정보를 제거한 데모 빌드입니다.",
    imageNote: "Sanitized demo build",
    caseStudy: {
      why: "보고서의 내용보다 취합과 서식 맞추기에 시간이 더 들었습니다. 사람이 판단할 부분과 기계가 만들 부분을 분리했습니다.",
      process: "보고서 항목 표준화 → 데이터 집계 로직 → 사진 배치/캡션 규칙 → PPT·엑셀 템플릿 → 담당자 확인 단계 추가 순서로 만들었습니다.",
    },
  },
  {
    id: "one-ops",
    title: "One Ops",
    english: "One Ops",
    status: "프로토타입",
    oneLine: "점포·센터·협력사·본사를 잇는 통합 운영/작업관리 플랫폼",
    problem: "운영 이슈와 작업 기록이 채널마다 흩어져 담당자가 바뀌면 맥락이 끊겼습니다.",
    purpose: "6개 역할별 화면을 하나의 운영 데이터로 연결해 이슈·작업·품질 현황을 함께 봅니다.",
    tech: ["React 19", "TypeScript", "Tailwind", "Supabase", "Recharts"],
    image: screens.oneOps,
    imageAlt: "One Ops 본사 Dashboard 화면 (목 데이터)",
    gallery: [screens.oneOps],
    accent: "#7c5cff",
    result: "6개 역할 · 하나의 데이터",
    metrics: ["점포 / 센터 현장 / 품질 / 협력사 / 센터 관리자 / 본사 6개 역할", "센터·인력·품질·이슈 통합 현황", "Supabase 연동 구조 설계"],
    demoNote: "목(mock) 데이터 기반 프로토타입으로, 외부 공개 데모는 아직 없습니다.",
    imageNote: "Mock data prototype",
    caseStudy: {
      why: "현장 시스템이 따로 움직이면 본사는 결과만 보고, 현장은 이유를 설명해야 합니다. 같은 데이터를 역할별로 다르게 보여주는 구조가 필요했습니다.",
      process: "역할별 업무 정의 → 공통 데이터 모델 → 역할별 라우팅/화면 → 목 데이터 프로토타입 → Supabase 연동 설계 순서로 진행 중입니다.",
    },
  },
];

export const careers = [
  {
    key: "gs",
    company: "GS리테일",
    mark: "GS",
    team: "신선강화지원팀",
    period: "2024.02 – 현재",
    summary: "검품 현장의 문제를 직접 제품과 자동화로 바꾼 운영 개발자",
    impacts: [
      { value: "3~5% → 6~8%", label: "검품률" },
      { value: "일 4시간", label: "업무시간 절감" },
    ],
    role: ["검품 기준안 수립", "현장 운영 개선", "업무 자동화"],
    built: ["Inspection App", "Inspection Dashboard", "Report Generator", "H-100F 비파괴 당도계 연동"],
    bullets: [
      "검품 시스템을 구축하고 검품 기준안을 수립했습니다.",
      "대시보드와 보고서 생성기로 현황 확인과 보고를 자동화했습니다.",
      "H-100F 비파괴 당도계를 검품 흐름에 연동했습니다.",
    ],
  },
  {
    key: "emart",
    company: "이마트 트레이더스",
    mark: "emart",
    team: "리테일 현장 운영",
    period: "2016 – 2023",
    summary: "8년+ 매장 운영으로 매출·재고·동선·프로모션을 현장에서 개선한 경험",
    impacts: [
      { value: "0.5억 → 0.7억", label: "즉석조리 일매출" },
      { value: "21위 → 1위", label: "피자 구독권" },
      { value: "3개점", label: "신규 오픈" },
    ],
    role: ["매출 활성화", "운영 개선", "프로모션"],
    built: ["재고 / 소비기한 관리", "매장 동선 개선", "신규점 오픈 (구월·화서·안성)"],
    bullets: [
      "구월·화서·안성 3개점 신규 오픈을 경험했습니다.",
      "화서점 피자 구독권 실적을 21위에서 1위로 끌어올렸습니다.",
      "즉석조리 일매출을 0.5억에서 0.7억으로 높였고, 재고·소비기한 관리와 매장 동선 개선에 참여했습니다.",
    ],
  },
];

export const aboutSteps = [
  { title: "관찰", body: "현장에서 반복되는 불편을 먼저 발견합니다." },
  { title: "의심", body: "당연하게 해오던 절차를 다시 묻습니다." },
  { title: "데이터 확인", body: "문제의 크기를 숫자로 확인합니다." },
  { title: "직접 구현", body: "필요한 도구를 직접 만듭니다." },
  { title: "현장 검증", body: "운영에 적용하고 결과로 증명합니다." },
];

export const skillGroups = [
  {
    key: "ops",
    title: "Product / Operations",
    desc: "문제를 정의하고 현장에 정착시키는 힘",
    items: ["Process Improvement", "Product Planning", "Data Analysis", "Field Operations", "검품 기준 수립", "재고 · 소비기한 관리"],
  },
  {
    key: "front",
    title: "Frontend",
    desc: "현장이 바로 쓰는 화면을 직접 구현",
    items: ["React", "TypeScript", "Vite", "Tailwind", "Recharts", "Framer Motion"],
  },
  {
    key: "back",
    title: "Backend / Data",
    desc: "데이터를 모으고 보고서로 바꾸는 자동화",
    items: ["Node.js", "Apps Script", "Google Sheets", "Supabase", "SQL", "H-100F 장비 연동"],
  },
  {
    key: "tools",
    title: "Tools",
    desc: "협업과 배포 워크플로",
    items: ["Git", "GitHub", "Vercel", "Figma", "Notion"],
  },
];

export const contacts = {
  github: "https://github.com/chltmdgh1028-svg",
  dashboard: "https://inspection-dashboard-silk.vercel.app/login",
  resume: "/seungho-choi-resume.txt",
  // Cards for empty values are hidden; fill in real values to show them.
  email: "",
  linkedin: "",
};
