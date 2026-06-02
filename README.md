# 📖 예산용어사전 (Budget Glossary)

> **공공·정부 예산 중심의 모바일 친화 예산용어사전**
> 한자(漢字) · 영문(English) 표기 포함, 빌드 도구 없음, 데이터는 JSON 한 파일.

[![MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![version](https://img.shields.io/badge/version-v0.9.1-blue.svg)]()
[![terms](https://img.shields.io/badge/terms-135-blue.svg)](./data/terms.json)
[![no build](https://img.shields.io/badge/build-none-lightgrey.svg)]()

---

## 📌 v0.9.1 변경 요약

| 항목 | 변경 |
|------|------|
| 용어 수 | 128 → **135** (sub6-3 주민참여 7개 추가) |
| 모달 카테고리 표기 | `대분류 · 중분류` → **`대분류-중분류`** (하이픈) |
| 결과 목록 제목 | `필터 결과` → **선택된 중분류명** (다중 시 쉼표 연결) |
| 초성 칩 동작 | `ALL` 외 칩 탭 시 **선택된 중분류 자동 해제** |
| 빈 상태 표시 | 메인 본문 → **헤더 내 인라인** (스크롤 시 따라옴) |
| 헤더 우상단 | **버전 배지 `v0.9.1`** 추가 (둥근 알약) |
| footer | 버전 `v1.0.0` → `v0.9.1`, **디자인 크레딧 `Design by jhKim Lab`** 추가 |
| 배경색 | 라이트/다크 모두 **본문 `--bg` 한 단계 더 진하게** 조정 |
| **PWA 지원** | **`manifest.json` + Service Worker** 추가 — 안드로이드·아이폰에 홈 화면 설치 가능, 오프라인 동작 |
| 가나다 칩 | 가로 스크롤 → **자동 줄바꿈** (좁은 화면에서 자연스럽게 2~3줄) |
| 참고 출처 footer | footer 에 **출처 섹션** 추가 (링크 제거 후 텍스트 전용, 5+6 = 11개 출처 2줄) |

---

## ✨ 특징

- **모바일 우선** — 360px ~ 480px 화면에 최적화, 태블릿·데스크톱도 대응
- **다크 모드** — 시스템 설정 자동 감지, 수동 토글 가능, `localStorage`에 저장
- **6대분류 20중분류** — `예산 절차 · 재정 수입과 지출 · 회계·기금·회계처리 · 재정 규모와 건전성 · 결산·성과·평가 · 정책·시민 참여 예산`
- **135개 시드 용어** — 국가재정법, 열린재정, 서울시재정포털, 기획재정부, NABO, KLRI 등 공공 출처 기반
- **한자 + 영문 동시 표기** — 카드 우상단과 모달 상단에 작게
- **실시간 검색** — 한글·한자·영문·요약·상세·출처 전부 대상, 150ms 디바운스
- **가나다 초성 인덱스** — ㄱ~ㅎ + EN, 모바일 폭에 따라 자동 줄바꿈. 칩 탭 시 선택된 중분류 자동 해제
- **모달 + 해시 라우팅** — `index.html#term/seip` 으로 특정 용어 직접 공유
- **PWA (홈 화면 설치)** — `manifest.json` + Service Worker 로 안드로이드·아이폰에 네이티브 앱처럼 설치 가능, 오프라인에서도 동작
- **의존성 0** — 외부 라이브러리, CDN, 폰트 임포트 없음 (시스템 폰트 스택)

---

## 📁 폴더 구조

```
dicmoney/
├── index.html              # 메인 페이지
├── manifest.json           # PWA 매니페스트 (홈 화면 설치)
├── sw.js                   # Service Worker (오프라인 캐시)
├── README.md               # 사용·배포·용어 추가 가이드
├── package.json            # 로컬 서버 실행 스크립트 (선택)
├── data/
│   └── terms.json          # 135개 용어 시드 데이터
└── assets/
    ├── css/
    │   └── style.css       # 반응형 + 다크모드 + 한자/영문 스타일
    ├── icons/              # PWA 아이콘
    │   ├── icon.svg        # 512x512 벡터 아이콘
    │   ├── icon-192.png    # 192x192 PNG (Android)
    │   └── icon-512.png    # 512x512 PNG (Android splash)
    └── js/
        ├── data.js         # fetch + window.DICT
        ├── theme.js        # 다크/라이트 토글
        ├── search.js       # 실시간 검색 (디바운스)
        ├── filter.js       # 대분류/중분류/초성 필터
        ├── modal.js        # 상세 모달 + 해시 라우팅
        └── app.js          # 메인 컨트롤러
```

---

## 🚀 사용법

### 모바일·PC에서 바로 열기
1. `index.html` 을 더블클릭하거나
2. 스마트폰 브라우저로 `index.html` 파일 위치를 열면 끝.

### 로컬 서버로 실행 (권장 — `fetch()` 가 file:// 에서 일부 차단될 수 있음)
```bash
cd dicmoney
npm start
# → http://localhost:4173
```
(`start` 스크립트는 Node.js 내장 `http` 모듈로 정적 서버를 띄웁니다. Node 18+ 권장.)

### GitHub Pages / Netlify / Vercel
- `dicmoney/` 폴더 전체를 그대로 업로드하면 됩니다.
- 별도 빌드·라우팅 설정 불필요.

---

## 📱 스마트폰에 설치 (PWA)

`npm start` 로 띄운 서버 또는 GitHub Pages URL 을 스마트폰에서 처음 열면, **네이티브 앱처럼 홈 화면에 추가**할 수 있습니다.

### 안드로이드 (Chrome / 삼성인터넷)
1. 페이지를 연다
2. 우상단 메뉴 (⋮) → **"홈 화면에 추가"** 또는 **"앱 설치"**
3. 안내에 따라 설치 — 앱 목록에 "예산용어사전" 아이콘이 생김

### 아이폰·아이패드 (Safari)
1. 페이지를 연다
2. 하단 **공유 버튼** (□↑) → **"홈 화면에 추가"**
3. "추가" 탭 — Safari 없이 독립 앱처럼 실행됨

### 공통
- 설치 후에는 오프라인에서도 동작 (Service Worker 가 모든 자원을 캐시)
- 다크모드, 검색, 모달, 해시 라우팅 등 모든 기능이 앱 환경에서 그대로 동작
- 새 버전이 배포되면 Service Worker 가 백그라운드에서 자동 갱신

---

## 🔍 기능 사용법

| 기능 | 조작 |
|------|------|
| 검색 | 상단 입력창에 한글·한자·영문 자유 입력 |
| 결과 비우기 | 입력창 `✕` 버튼 또는 `Esc` |
| 초성 점프 | ㄱ ㄴ ㄷ … EN 칩 탭 (선택된 중분류 자동 해제 후 점프) |
| 용어 상세 | 카드 탭 → 모달 오픈 |
| 모달 닫기 | `✕` 버튼 · 배경 탭 · `Esc` |
| 모달 공유 | 모달 열린 상태의 URL(`#term/ID`) 복사 |
| 다크 모드 | 우상단 ☀/🌙 버튼 (선택값 저장) |

### 결과 영역 동작
- 중분류 칩 선택 → 결과 목록 제목이 **선택된 중분류 이름** (예: `편성·심의`)
- 다중 중분류 선택 → 쉼표로 연결 (예: `편성·심의, 구성 요소`)
- 초성 칩 선택 → 제목을 `ㄱ 로 시작하는 용어` 형태로 표시
- 일치 항목이 0건이면 헤더 알파바 바로 아래 **인라인 빈 상태 카드** 노출

### 모달 카테고리 표기
- `대분류-중분류` 형식 (예: `예산 절차-편성·심의`)

---

## ➕ 용어 추가·수정 가이드

`data/terms.json` 의 `terms` 배열에 항목을 추가하거나 수정합니다.

```json
{
  "id": "my-term",
  "term": "예시용어",
  "hanja": "例示用語",
  "termEn": "Example Term",
  "initial": "ㅇ",
  "category": "cat1",
  "subcategory": "sub1-1",
  "summary": "한 줄 요약 (30~60자).",
  "detail": "상세 설명 (3~5문장).",
  "examples": ["예시1", "예시2"],
  "related": ["seip", "sechul"],
  "sources": ["국가재정법 제17조"]
}
```

| 필드 | 필수 | 비고 |
|------|------|------|
| `id` | ✅ | 영문·숫자·하이픈. URL 해시(`#term/<id>`)에 사용 |
| `term` | ✅ | 한글 명 |
| `hanja` | — | 한자. 영문 약어·신조어·고유명사는 생략 가능 |
| `termEn` | — | 영문 명. 없으면 생략 |
| `initial` | ✅ | 초성 ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ |
| `category` | ✅ | `cat1`~`cat6` 중 하나 |
| `subcategory` | ✅ | `sub1-1`~`sub6-4` 중 하나 (meta.subcategories 참고) |
| `summary` | ✅ | 모바일에서 한 줄로 보이도록 30~60자 |
| `detail` | ✅ | 3~5문장 |
| `examples` | — | 1~3개 |
| `related` | — | 2~5개 `id`. 없으면 빈 배열 `[]` |
| `sources` | — | 참고한 법령·사이트 |

새로고침하면 즉시 반영됩니다.

---

## 🈁 한자·영문 표기 가이드

### 한자
- 표준은 **국한혼용체** 한자(한국 사전·법령 표기 기준)
- 한자가 없는 항목은 `hanja` 필드를 생략하거나 `null` 로 둡니다.
  - 예: `D1/D2/D3`, `CBAM`, `dBrain`, `BTO`, `BTL`
- 일본식/중국식 한자는 가급적 피하고 한국어 사전 표준 표기를 우선

### 영문
- OECD/IMF 표준 영문명을 우선
- `termEn` 표기 예시
  - 통합재정수지 → `Consolidated Fiscal Balance`
  - 관리재정수지 → `Managed Fiscal Balance`
  - 주민참여예산 → `Participatory Budgeting`
  - 기후예산 → `Climate Budgeting`
  - 성인지예산 → `Gender-Responsive Budgeting (GRB)`
  - 순계예산 → `Net Budget`
  - 예비타당성조사 → `Pre-feasibility Study`
  - 국가재정운용계획 → `National Fiscal Management Plan`

---

## 🗂 카테고리 (6대분류 / 20중분류)

| 대분류 | 한자 | 영문 | 중분류 |
|--------|------|------|--------|
| ① 예산 절차 | 豫算 節次 | Budget Process | 편성·심의 / 구성 요소 / 예산 집행 / 운용·계획 / 원칙·제도 |
| ② 재정 수입과 지출 | 財政 收入·支出 | Revenue & Expenditure | 세입 / 세출 / 보조·교부 |
| ③ 회계·기금·회계처리 | 會計·基金 | Accounting & Funds | 회계 구분 / 기금 / 회계 처리 |
| ④ 재정의 규모와 건전성 | 財政 規模·健全性 | Fiscal Scale & Soundness | 재정 수지 / 국가채무 / 재정준칙·거버넌스 |
| ⑤ 결산·성과·평가 | 決算·成果·評價 | Settlement, Performance & Evaluation | 결산 / 성과·평가 |
| ⑥ 정책·시민 참여 예산 | 市民·政策豫算 | Policy & Participatory Budget | 성인지 / 기후·녹색 / **주민참여 (7)** / 지방재정 |

카테고리 정의는 `data/terms.json` 상단 `meta.categories` / `meta.subcategories` 에서 변경 가능합니다.

---

## 📚 참고 출처 (data/terms.json `meta.sources`)

- [국가재정법](https://www.law.go.kr) — 법제처 국가법령정보센터
- [열린재정 재정정보공개시스템](https://www.openfiscaldata.go.kr) (openfiscaldata.go.kr)
- [서울시재정포털 재정용어사전](https://openfinance.seoul.go.kr) (openfinance.seoul.go.kr)
- 기획재정부 재정정책·재정분석통계 용어사전
- 통계청 [e-나라지표](https://www.index.go.kr)
- 국회예산정책처(NABO) 재정경제통계 Brief
- 한국법제연구원(KLRI) 「국가채무 및 재정수지 관리 법제의 현황과 개선방안 연구」
- 행정안전부 주민참여예산 운영지침
- 여성가족부 성인지예산 운영지침
- 환경부 기후예산 안내 (2023)
- [OECD Climate Budgeting](https://www.oecd.org)

각 항목의 출처는 `terms[].sources` 에 배열로 표기되어 있습니다.

---

## ⚖️ 면책

이 사전은 공공정보를 바탕으로 한 **참고자료**입니다. 정확한 재정 정보는 반드시 원출처(법령·공공기관 통계)를 다시 확인해 주세요. 본 콘텐츠는 법적 효력이 없으며, 작성자는 콘텐츠 사용으로 인한 손해에 대해 책임을 지지 않습니다.

---

## 🎨 디자인

**Designed by jhKim Lab**

- 모바일 우선 UI, 한자/영문 병기 디자인
- 라이트/다크 모드 자동 감지 + 수동 토글
- 외부 폰트/라이브러리 의존성 0, 시스템 폰트 스택만 사용

---

## 🛠 라이선스

MIT
