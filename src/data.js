// Portfolio content.
// Policy: product screenshots come only from sanitized / mock-data environments, production app URLs are
// never linked, and numbers are limited to results the owner chose to publish.

export const SITE_URL = "https://seungho-choi-portfolio.vercel.app";

export const navItems = [
  { to: "/main", label: "MAIN", end: true },
  { to: "/main/work", label: "WORK" },
  { to: "/main/impact", label: "IMPACT" },
  { to: "/main/experience", label: "EXPERIENCE" },
  { to: "/main/profile", label: "PROFILE" },
  { to: "/main#contact", label: "CONTACT", contact: true },
];

export const projectPath = (id) => `/main/work/${id}`;

export const screens = {
  inspectionApp: "/screens/inspection-app.webp",
  inspectionAppAnalysis: "/screens/inspection-app-analysis.webp",
  dashboard: "/screens/inspection-dashboard.webp",
  dashboardHistory: "/screens/inspection-dashboard-history.webp",
  dashboardProducts: "/screens/inspection-dashboard-products.webp",
  reportGenerator: "/screens/report-generator-wizard.webp",
  oneOps: "/screens/one-ops-hq.webp",
};

// Screens shown in the horizontal showreel (all sanitized / mock data).
export const showreel = [
  { src: screens.inspectionApp, projectId: "inspection-app", caption: "검품 현황 · 협력사별 진행", size: "l", pos: "center top" },
  { src: screens.dashboard, projectId: "inspection-dashboard", caption: "품질 운영 Overview", size: "xl", pos: "center" },
  { src: screens.reportGenerator, projectId: "report-generator", caption: "보고서 생성 단계", size: "n", pos: "center top" },
  { src: screens.oneOps, projectId: "one-ops", caption: "본사 통합 현황", size: "l", pos: "center" },
  { src: screens.inspectionAppAnalysis, projectId: "inspection-app", caption: "불량 사유 분석", size: "n", pos: "center top" },
  { src: screens.dashboardHistory, projectId: "inspection-dashboard", caption: "검품 이력 · 캘린더", size: "xl", pos: "center" },
  { src: screens.dashboardProducts, projectId: "inspection-dashboard", caption: "상품 분석", size: "l", pos: "center" },
];

// How the four products connect: capture -> monitor -> report -> expand.
export const projectStory = [
  { id: "inspection-app", step: "01", name: "Inspection App", role: "현장에서 검품 데이터를 생성" },
  { id: "inspection-dashboard", step: "02", name: "Inspection Operations Dashboard", role: "누적된 데이터를 운영 관점에서 분석·모니터링" },
  { id: "report-generator", step: "03", name: "Report Generator", role: "데이터를 보고서·의사결정 자료로 자동 변환" },
  { id: "one-ops", step: "04", name: "One Ops", role: "더 넓은 운영 프로세스로 확장" },
];

export const gsData = {
  inspectionRate: [
    { key: "before", name: "Before", lo: 3, hi: 5, label: "3~5%" },
    { key: "after", name: "After", lo: 6, hi: 8, label: "6~8%" },
  ],
  hoursSaved: 4,
  flow: [
    { step: "01", title: "현장 문제", body: "검품 기준·수량·사진 기록이 흩어져 담당자별 편차와 누락이 발생했습니다.", visual: "problem" },
    { step: "02", title: "Inspection App", body: "수량 확인, 검품 기준, 사진 기록, 협력사별 진행 상태를 하나의 현장 플로우로 묶었습니다.", visual: "app" },
    { step: "03", title: "Dashboard + Report Generator", body: "쌓인 데이터를 운영 관점에서 모니터링하고, 보고서는 자동으로 생성되도록 연결했습니다.", visual: "ops" },
    { step: "04", title: "Result", body: "검품률은 3~5%에서 6~8%로, 반복 업무는 하루 4시간 줄었습니다.", visual: "result" },
  ],
};

// Gate / hub copy
export const keyImpact = [
  { value: "3~5% → 6~8%", label: "검품률" },
  { value: "−4h / day", label: "업무시간 절감" },
  { value: "8+ YEARS", label: "Retail Operations" },
  { value: "4 PRODUCTS", label: "Built & Operated" },
];

export const emartData = {
  sales: [
    { key: "before", name: "Before", lo: 0.5, hi: 0.5, label: "0.5억" },
    { key: "after", name: "After", lo: 0.7, hi: 0.7, label: "0.7억" },
  ],
  rank: { from: 21, to: 1, total: 21 },
  openings: [
    { store: "구월", note: "신규 오픈" },
    { store: "화서", note: "신규 오픈" },
    { store: "안성", note: "신규 오픈" },
  ],
  intro: "매출 개선, 프로모션 성과, 신규점 오픈을 통해 7년 4개월간 리테일 현장 운영 역량을 쌓았습니다.",
};

export const projects = [
  {
    id: "inspection-app",
    no: "01",
    kicker: "CAPTURE",
    title: "신선상품 검품 시스템",
    english: "Inspection App",
    storyStep: "01 · CAPTURE",
    headline: ["현장에서 바로 쓰는", "신선상품 검품 시스템"],
    focus: ["Field Operations", "Process Standardization", "Internal Tool"],
    statusLabel: "PRODUCTION · SANITIZED DEMO",
    oneLine: "현장에서 바로 쓰는 신선상품 검품 PDA 웹앱",
    role: "기획 · 설계 · 개발",
    problem: "검품 기준, 수량, 사진 기록이 흩어져 담당자별 편차와 누락이 발생했습니다.",
    purpose: "수량 확인 · 검품 기준 · 사진 기록 · 협력사별 진행 상태를 하나의 현장형 플로우로 묶었습니다.",
    tech: ["React", "Vite", "Apps Script", "Ably", "Capacitor"],
    image: screens.inspectionApp,
    imageAlt: "Inspection App 샘플 데이터 화면 — 협력사 목록과 상품별 검품 진행",
    gallery: [screens.inspectionApp, screens.inspectionAppAnalysis],
    captions: ["검품 현황 · 협력사별 진행", "불량 사유 분석 (회송 · 교환)"],
    imageNote: "SANITIZED DEMO DATA",
    demoUrl: "https://quality-operations-prototype.vercel.app/",
    accent: "#2f7bff",
    result: "검품률 3~5% → 6~8%",
    resultLabel: "검품률",
    resultValue: "3~5% → 6~8%",
    handoff: "현장에서 쌓인 검품 데이터는 Dashboard로 이어집니다.",
    metrics: ["검품률 3~5% → 6~8%", "수량·기준·사진 기록을 한 화면에서 처리", "협력사별 검품 진행 상태 확인"],
    caseStudy: {
      why: "검품 결과가 사람마다 다르게 기록되면 협력사 품질 관리 자체가 흔들립니다. 먼저 기준과 기록 방식을 하나로 맞춰야 했습니다.",
      process: "현장 검품 동선 관찰 → 입력 항목 최소화 → 프로토타입 → 담당자 피드백 → 운영 적용 순서로 반복했습니다.",
      flow: ["현장 문제", "기준 정리", "입력 UI 설계", "현장 적용", "데이터 축적"],
    },
    story: {
      problem: [
        "검품 기준, 수량, 사진 기록이 흩어져 담당자별 편차와 누락이 발생했습니다.",
        "검품 결과가 사람마다 다르게 기록되면 협력사 품질 관리 자체가 흔들립니다.",
      ],
      constraints: [
        "현장에서 PDA로 바로 쓰는 웹앱이어야 했습니다.",
        "입력 항목을 최소화해야 검품 동선 안에서 실제로 쓰입니다.",
        "기준과 기록 방식을 하나로 맞춰야 했습니다.",
      ],
      approach: "현장 검품 동선을 관찰하고, 입력 항목을 최소화한 프로토타입을 만든 뒤 담당자 피드백을 받아 운영에 적용했습니다.",
      product: [
        "스캔 · CSV · 붙여넣기로 입고 데이터 불러오기",
        "협력사별 진행 현황과 상품별 검품 상태 (미검품 · 검품중 · 검품완료)",
        "중량 · 당도 · 누락 체크와 사진 기록",
        "불량 사유별 분석 (회송 · 교환 구분)",
        "H-100F 비파괴 당도계 연동",
      ],
      decisions: [
        "기준과 기록 방식을 먼저 하나로 통일했습니다.",
        "입력 항목을 최소화해 현장 동선에 맞췄습니다.",
        "수량 · 기준 · 사진 기록을 한 화면 흐름으로 묶었습니다.",
      ],
      iteration: "담당자 피드백을 받아 개선을 반복했고, 쌓이는 검품 데이터는 Dashboard와 Report Generator로 이어집니다.",
    },
  },
  {
    id: "inspection-dashboard",
    no: "02",
    kicker: "MONITOR",
    title: "신선상품 품질 운영 Control Tower",
    english: "Inspection Operations Dashboard",
    storyStep: "02 · MONITOR",
    headline: ["검품 데이터를 운영 판단으로", "연결하는 품질 Control Tower"],
    statusLabel: "PRODUCTION · SANITIZED DEMO",
    oneLine: "분산된 검품 데이터를 통합해 품질 이슈와 운영 상태를 한눈에 추적하는 현장 Operations Dashboard",
    role: "기획 · 설계 · 개발",
    focus: ["Operations Improvement", "Product Operations", "Quality Operations", "Internal Tool", "Data-driven Operations", "Process Innovation / DX"],
    problem: "검품 기록·사진·이력이 흩어져 있어 품질 이슈와 협력사별 추이를 당일 운영 판단으로 연결하기 어려웠습니다.",
    purpose: "검품 현황, 상품별 품질 이슈, 이력, 사진, 데이터 상태를 하나의 화면에서 추적해 현장 운영 의사결정을 지원합니다.",
    tech: ["React", "Recharts", "Tailwind", "Vercel"],
    image: screens.dashboard,
    imageAlt: "Inspection Operations Dashboard 데모 화면 — 검품 현황, 추이, 주요 이슈 (샘플 데이터)",
    gallery: [screens.dashboard, screens.dashboardHistory, screens.dashboardProducts],
    captions: ["품질 운영 Overview", "검품 이력 · 캘린더", "상품 분석"],
    imageNote: "SANITIZED DEMO DATA",
    demoUrl: "https://inspection-dashboard-demo.vercel.app/",
    accent: "#4f6bff",
    result: "운영 의사결정 지원",
    resultLabel: "Focus",
    resultValue: "운영 의사결정 지원",
    handoff: "모니터링한 데이터는 보고서로 자동 변환됩니다.",
    metrics: [
      "검품 현황 · 상품별 품질 이슈 · 협력사 추이를 한 화면에서 모니터링",
      "검품 이력 · 캘린더 · 상품 분석 · 사진 아카이브 · 데이터 상태 화면 구성",
      "읽기 전용 sanitized 데모 제공 (mock 데이터, 운영 시스템과 분리)",
    ],
    caseStudy: {
      why: "데이터가 쌓여도 운영 판단에 쓰이지 않으면 의미가 없습니다. 현장에서 만든 검품 기록을 품질 이슈 중심으로 다시 묶어, 담당자가 당일 무엇을 먼저 봐야 하는지 알 수 있어야 했습니다.",
      process: "검품 앱 데이터 구조 정리 → 운영 관점의 핵심 지표(검품률·불량률·이슈 등급) 정의 → 이슈·이력·사진·데이터 상태를 한 흐름으로 설계 → 사내 운영 서비스로 배포·개선 순서로 진행했습니다.",
      flow: ["현장 문제", "데이터 축적", "Dashboard 통합", "운영 모니터링", "의사결정 · 보고"],
    },
    story: {
      problem: [
        "검품 기록·사진·이력이 흩어져 있어 품질 이슈와 협력사별 추이를 당일 운영 판단으로 연결하기 어려웠습니다.",
        "데이터가 쌓여도 운영 판단에 쓰이지 않으면 의미가 없습니다.",
      ],
      constraints: [
        "검품 기록 · 사진 · 이력이 여러 곳에 분산되어 있었습니다.",
        "담당자가 당일 무엇을 먼저 봐야 하는지 알 수 있어야 했습니다.",
        "공개용 데모는 운영 시스템과 분리된 읽기 전용 mock 데이터로만 제공합니다.",
      ],
      approach: "검품 앱의 데이터 구조를 정리하고, 운영 관점의 핵심 지표(검품률 · 불량률 · 이슈 등급)를 정의한 뒤 이슈 · 이력 · 사진 · 데이터 상태를 한 흐름으로 설계했습니다.",
      product: [
        "검품 현황과 상품별 품질 이슈 모니터링",
        "협력사별 추이",
        "검품 이력 · 캘린더",
        "상품 분석",
        "사진 아카이브",
        "데이터 상태 확인",
      ],
      decisions: [
        "검품 기록을 ‘품질 이슈’ 중심으로 다시 묶었습니다.",
        "검품률 · 불량률 · 이슈 등급을 핵심 지표로 정의했습니다.",
        "이슈 · 이력 · 사진 · 데이터 상태를 한 흐름으로 설계했습니다.",
        "공개 데모는 운영 시스템과 완전히 분리해 mock 데이터로 구성했습니다.",
      ],
      iteration: "사내 운영 서비스로 배포한 뒤 개선을 이어가고 있으며, 공개용으로 mock 데이터 읽기 전용 데모를 별도 배포했습니다.",
    },
  },
  {
    id: "report-generator",
    no: "03",
    kicker: "REPORT",
    title: "보고서 자동 생성기",
    english: "Report Generator",
    storyStep: "03 · REPORT",
    headline: ["검품 데이터에서 보고서까지", "한 번에 만드는 자동화"],
    focus: ["Reporting Automation", "Operations Efficiency", "Internal Tool"],
    statusLabel: "INTERNAL TOOL · DEMO",
    oneLine: "검품 데이터에서 보고서까지 한 번에 만드는 자동화 도구",
    role: "기획 · 설계 · 개발",
    problem: "매일 반복되는 보고서 정리와 공유에 많은 시간이 소요됐습니다.",
    purpose: "사진·검품 데이터를 내부 공유용 / 파트너사 공유용 PPT와 엑셀 양식으로 자동 생성합니다.",
    tech: ["Node.js", "PptxGenJS", "ExcelJS", "Apps Script", "Gemini"],
    image: screens.reportGenerator,
    imageAlt: "Report Generator 샘플 데이터 화면 — 불량표 포함 내부공유용 PPT 생성 단계 (데모 빌드)",
    gallery: [screens.reportGenerator],
    captions: ["보고서 생성 단계"],
    imageNote: "SANITIZED DEMO DATA",
    demoNote: "사내 운영 도구 · 공개 데모 없음",
    accent: "#12a56a",
    result: "일 4시간 절감",
    resultLabel: "업무시간",
    resultValue: "일 4시간 절감",
    handoff: "보고 체계는 더 넓은 운영 프로세스로 확장됩니다.",
    metrics: ["일 4시간 업무시간 절감", "내부/파트너사 공유용 PPT 자동 생성", "불량·회송 엑셀 양식 자동 생성"],
    caseStudy: {
      why: "보고서의 내용보다 취합과 서식 맞추기에 시간이 더 들었습니다. 사람이 판단할 부분과 기계가 만들 부분을 분리했습니다.",
      process: "보고서 항목 표준화 → 데이터 집계 로직 → 사진 배치/캡션 규칙 → PPT·엑셀 템플릿 → 담당자 확인 단계 추가 순서로 만들었습니다.",
      flow: ["반복 보고", "항목 표준화", "자동 생성", "담당자 확인", "공유"],
    },
    story: {
      problem: [
        "매일 반복되는 보고서 정리와 공유에 많은 시간이 소요됐습니다.",
        "보고서의 내용보다 취합과 서식 맞추기에 시간이 더 들었습니다.",
      ],
      constraints: ["내부 공유용과 파트너사 공유용 양식이 각각 필요했습니다."],
      approach: "보고서 항목을 표준화하고 데이터 집계 로직과 사진 배치 · 캡션 규칙을 만든 뒤, PPT · 엑셀 템플릿에 연결했습니다.",
      product: [
        "내부 공유용 PPT 자동 생성",
        "파트너사 공유용 PPT 자동 생성",
        "불량 · 회송 엑셀 양식 자동 생성",
        "사진 배치 · 캡션 규칙",
      ],
      decisions: [
        "사람이 판단할 부분과 기계가 만들 부분을 분리했습니다.",
        "자동 생성 뒤에 담당자 확인 단계를 추가했습니다.",
      ],
      iteration: "담당자 확인 단계를 추가하는 방향으로 다듬었습니다.",
    },
  },
  {
    id: "one-ops",
    no: "04",
    kicker: "EXPAND",
    title: "One Ops",
    english: "One Ops",
    storyStep: "04 · EXPAND",
    headline: ["점포 · 센터 · 협력사 · 본사를", "하나의 운영 데이터로"],
    focus: ["Process Innovation / DX", "Operations Platform", "Product Planning"],
    statusLabel: "PROTOTYPE · MOCK DATA",
    oneLine: "점포·센터·협력사·본사를 잇는 통합 운영/작업관리 플랫폼",
    role: "기획 · 설계 · 프로토타입",
    problem: "운영 이슈와 작업 기록이 채널마다 흩어져 담당자가 바뀌면 맥락이 끊겼습니다.",
    purpose: "6개 역할별 화면을 하나의 운영 데이터로 연결해 이슈·작업·품질 현황을 함께 봅니다.",
    tech: ["React 19", "TypeScript", "Tailwind", "Supabase", "Recharts"],
    image: screens.oneOps,
    imageAlt: "One Ops 본사 Dashboard 화면 (샘플 데이터)",
    gallery: [screens.oneOps],
    captions: ["본사 통합 현황"],
    imageNote: "UI SHOWN WITH MOCK DATA",
    demoNote: "목 데이터 프로토타입 · 공개 데모 없음",
    accent: "#7c5cff",
    result: "6개 역할 · 하나의 데이터",
    resultLabel: "Roles",
    resultValue: "6개 역할 · 하나의 데이터",
    metrics: [
      "점포 / 센터 현장 / 품질 / 협력사 / 센터 관리자 / 본사 6개 역할",
      "센터·인력·품질·이슈 통합 현황",
      "Supabase 연동 구조 설계",
    ],
    caseStudy: {
      why: "현장 시스템이 따로 움직이면 본사는 결과만 보고, 현장은 이유를 설명해야 합니다. 같은 데이터를 역할별로 다르게 보여주는 구조가 필요했습니다.",
      process: "역할별 업무 정의 → 공통 데이터 모델 → 역할별 라우팅/화면 → 목 데이터 프로토타입 → Supabase 연동 설계 순서로 진행 중입니다.",
      flow: ["분산된 채널", "역할별 업무 정의", "공통 데이터", "역할별 화면", "통합 현황"],
    },
    story: {
      problem: [
        "운영 이슈와 작업 기록이 채널마다 흩어져 담당자가 바뀌면 맥락이 끊겼습니다.",
        "현장 시스템이 따로 움직이면 본사는 결과만 보고, 현장은 이유를 설명해야 합니다.",
      ],
      constraints: ["점포 · 센터 현장 · 품질 · 협력사 · 센터 관리자 · 본사, 6개 역할이 같은 데이터를 서로 다른 관점으로 봐야 했습니다."],
      approach: "역할별 업무를 정의하고 공통 데이터 모델을 세운 뒤, 역할별 라우팅과 화면을 목 데이터 프로토타입으로 구현했습니다.",
      product: [
        "6개 역할별 화면 (점포 / 센터 현장 / 품질 / 협력사 / 센터 관리자 / 본사)",
        "센터 · 인력 · 품질 · 이슈 통합 현황",
      ],
      decisions: ["같은 데이터를 역할별로 다르게 보여주는 구조를 택했습니다.", "화면보다 공통 데이터 모델을 먼저 정의했습니다."],
      iteration: "현재는 목 데이터 프로토타입 단계이며, Supabase 연동 구조를 설계하고 있습니다.",
    },
  },
];

export const careers = [
  {
    key: "gs",
    company: "GS리테일",
    logo: { src: "/logos/gs-retail.png", w: 151, h: 44, alt: "GS리테일 로고" },
    meta: ["신선강화지원팀", "매니저", "2026.01 – Present"],
    summary: "현장 운영 문제를 제품과 자동화로 전환한 Product / Operations 실무자",
    impacts: [
      { value: "3~5% → 6~8%", label: "검품률" },
      { value: "일 4시간", label: "업무시간 절감" },
    ],
    role: ["검품 기준안 수립", "현장 운영 개선", "업무 자동화"],
    built: ["Inspection App", "Inspection Operations Dashboard", "Report Generator", "H-100F 비파괴 당도계 연동"],
    bullets: [
      "검품 시스템을 구축하고 검품 기준안을 수립했습니다.",
      "대시보드와 보고서 생성기로 현황 확인과 보고를 자동화했습니다.",
      "H-100F 비파괴 당도계를 검품 흐름에 연동했습니다.",
    ],
  },
  {
    key: "emart",
    company: "이마트 트레이더스",
    logo: { src: "/logos/emart-traders.png", w: 447, h: 171, alt: "TRADERS WHOLESALE CLUB 로고" },
    meta: ["주임 (BAND5)", "총 7년 4개월 근무"],
    summary: "7년 4개월간 매장 운영으로 매출·재고·동선·프로모션을 현장에서 개선한 경험",
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
  { word: "OBSERVE", title: "관찰", body: "현장에서 반복되는 불편을 발견합니다." },
  { word: "QUESTION", title: "의심", body: "당연하게 해오던 절차를 다시 질문합니다." },
  { word: "MEASURE", title: "데이터 확인", body: "문제의 크기를 데이터로 확인합니다." },
  { word: "BUILD", title: "직접 구현", body: "필요한 도구를 직접 만듭니다." },
  { word: "VALIDATE", title: "현장 검증", body: "운영에 적용하고 결과로 검증합니다." },
];

// `level` is a plain text label, never a percentage or star rating.
export const skillGroups = [
  {
    key: "ops",
    title: "Product / Operations",
    desc: "문제를 정의하고 현장에 정착시키는 힘",
    items: [
      { name: "Process Improvement" },
      { name: "현장 프로세스 개선" },
      { name: "업무 표준화" },
      { name: "KPI 기반 운영 개선" },
      { name: "사용자 피드백 반영" },
    ],
  },
  {
    key: "data",
    title: "Data / Office",
    desc: "숫자를 모으고, 읽히는 보고로 바꾸는 힘",
    items: [
      { name: "Excel", level: "Advanced" },
      { name: "PowerPoint", level: "Advanced" },
      { name: "Google Sheets" },
      { name: "SQL", level: "Basic" },
      { name: "데이터 정리 및 리포팅" },
      { name: "KPI 시각화" },
    ],
  },
  {
    key: "ai",
    title: "AI / Automation",
    desc: "반복 업무를 줄이고 개발 속도를 높이는 힘",
    items: [
      { name: "생성형 AI 활용" },
      { name: "AI 기반 업무 자동화" },
      { name: "Prompt Engineering" },
      { name: "AI를 활용한 개발/디버깅" },
      { name: "문서 및 보고서 자동화" },
    ],
  },
  {
    key: "dev",
    title: "Development",
    desc: "현장이 쓰는 화면과 데이터 흐름을 직접 구현",
    items: [
      { name: "React" },
      { name: "TypeScript / JavaScript" },
      { name: "Vite" },
      { name: "Tailwind CSS" },
      { name: "Apps Script" },
      { name: "Supabase" },
      { name: "Git" },
      { name: "Vercel" },
      { name: "Capacitor" },
    ],
  },
];

export const strengths = [
  { title: "현장 이해도", body: "7년 4개월간 매장 운영을 경험하며 현장의 동선, 재고, 고객 흐름을 몸으로 익혔습니다." },
  { title: "문제 발견 및 원인 분석", body: "불편함을 지나치지 않고, 왜 생기는지 기준과 절차까지 거슬러 올라가 확인합니다." },
  { title: "데이터 기반 의사결정", body: "감이 아니라 수치로 문제의 크기와 개선 효과를 확인하고 우선순위를 정합니다." },
  { title: "직접 구현하는 실행력", body: "아이디어에 그치지 않고 검품 앱, 대시보드, 보고서 생성기까지 직접 만들어 현장에 적용했습니다." },
  { title: "AI 활용 능력", body: "생성형 AI를 기획·개발·디버깅·문서화에 활용해 업무의 실행 속도와 완성도를 높입니다." },
  { title: "운영과 개발을 연결하는 능력", body: "현장 담당자의 언어를 제품 요구사항으로 옮기고, 운영 결과로 다시 검증합니다." },
];

export const certifications = ["컴퓨터활용능력 2급", "자동차운전면허 1종 보통"];

// Final PDFs are not ready yet. Put the file path here (e.g. "/Seungho_Choi_Resume.pdf" after adding the file to
// /public) and the header / contact buttons switch from "준비 중" to a working download automatically.
export const documents = {
  resume: { label: "RESUME", file: null, filename: "Seungho_Choi_Resume.pdf" },
  portfolio: { label: "PORTFOLIO PDF", file: null, filename: "Seungho_Choi_Portfolio.pdf" },
};

export const contacts = {
  name: "최승호",
  nameEn: "Seungho Choi",
  email: "chltmdgh10@naver.com",
  phone: "010-6372-2996",
  phoneHref: "tel:+821063722996",
};
