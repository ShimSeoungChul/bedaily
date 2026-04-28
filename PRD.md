# PRD: bedaily.dev — 기술 콘텐츠 허브

**작성일**: 2026-04-27
**작성자**: Seoungchul Shim
**상태**: Draft v2

---

## 1. 배경 및 문제 정의

### 상황

Threads/Instagram에서 백엔드·AI·Java 계열 기술 스택과 뉴스를 공유하는 소셜 채널 운영 예정.

### 소셜 플랫폼의 구조적 한계

| 한계 | 영향 |
|------|------|
| 단편적 포맷 | 깊이 있는 기술 내용 전달 불가 (코드, 다이어그램, 긴 분석) |
| 플랫폼 의존성 | 알고리즘 변동·계정 제한으로 팔로워 접근 불안정 |
| 소유권 부재 | 구독자 데이터를 플랫폼이 보유 — 개인 자산 누적 없음 |
| 검색 비가시성 | 소셜 포스트는 Google 검색 노출 제한적 |

### 해결 방향

소셜 채널을 **트래픽 유입 채널**로 활용하고, bedaily.dev를 **콘텐츠 심화 + 구독자 직접 소유** 허브로 삼는다.

```
Threads/Instagram 포스트
        │
        ▼ (링크 클릭)
  bedaily.dev
        │
        ├─ 심화 블로그 글 읽기
        ├─ 뉴스레터 구독 (이메일 직접 소유)
        └─ Google 검색 유입 → 신규 독자 획득
```

---

## 2. 목표

1. **콘텐츠 아카이브**: 소셜 포스트의 심화 버전을 검색 가능한 형태로 축적
2. **구독자 직접 소유**: 이메일 리스트 확보 — 플랫폼 종속 탈피
3. **기술 브랜드 구축**: SEO를 통한 검색 유입으로 개인 커리어 자산화

---

## 3. 사용자

### 페르소나

| 페르소나 | 유입 경로 | 핵심 니즈 | 행동 패턴 |
|----------|-----------|-----------|-----------|
| **소셜 팔로워** | Threads/Instagram 링크 | 포스트보다 깊은 내용 | 모바일, 짧은 집중 시간, CTA 클릭률 낮음 |
| **검색 유입 개발자** | Google (기술 키워드) | 특정 문제 해결 or 개념 이해 | 데스크톱, 높은 집중도, 코드 스니펫 스캔 |
| **뉴스레터 구독자** | 사이트 구독 폼 | 정기적 기술 업데이트 | 이메일 클릭 → 사이트 재방문 |

### 방문자 행동 흐름

```
신규 방문 → 콘텐츠 소비 → 뉴스레터 구독 (전환 목표)
재방문     → 뉴스레터 클릭 or Google 재검색
```

---

## 4. 기능 요구사항

### Phase 1 — MVP (4주)

#### 홈페이지 (`/`)
- [ ] 최신 블로그 글 카드 목록 (상위 6개)
- [ ] 최신 뉴스 카드 목록 (상위 4개)
- [ ] 뉴스레터 구독 CTA 섹션 (히어로 또는 중간 배치)
- [ ] 소셜 링크 (Threads, Instagram, GitHub)

**인수 조건**: 홈 로드 시 LCP 2.5초 이내, 구독 폼 노출 필수

#### 블로그 목록 (`/posts`)
- [ ] 카테고리 필터 (Backend / AI / Java / DevOps / All)
- [ ] 예상 읽기 시간 표시 (본문 기준 자동 계산, 분당 200단어)
- [ ] 날짜 내림차순 정렬
- [ ] 카드: 제목, 요약, 날짜, 카테고리, 읽기 시간

#### 블로그 상세 (`/posts/[slug]`)
- [ ] MDX 렌더링
- [ ] 코드 블록 하이라이팅 (Shiki 또는 Prism)
- [ ] 예상 읽기 시간 + 게시일 표시
- [ ] 글 하단 뉴스레터 구독 CTA
- [ ] 이전/다음 글 네비게이션
- [ ] OG 메타태그 (title, description, og:image)

#### 뉴스 목록 (`/news`)
- [ ] 카테고리 필터
- [ ] 날짜 내림차순 정렬
- [ ] 카드: 제목, 짧은 코멘트, 원문 출처, 날짜

#### 뉴스 상세 (`/news/[slug]`)
- [ ] 운영자 코멘트 렌더링
- [ ] 원문 링크 (외부 탭 열기)
- [ ] 태그 표시

#### 뉴스레터 구독
- [ ] 이메일 입력 폼 (홈, 블로그 상세 하단, About)
- [ ] `/api/subscribe` Route — Resend API로 연락처 추가
- [ ] 중복 구독 방지 (이미 등록된 이메일 처리)
- [ ] 구독 완료 피드백 (토스트 or 인라인 메시지)

**인수 조건**: 구독 성공 시 Resend Audience에 이메일 저장 확인

#### About 페이지 (`/about`)
- [ ] 운영자 소개 (경력, 관심 기술 스택)
- [ ] 채널 운영 목적
- [ ] 소셜 링크 (GitHub, Threads, Instagram)

---

### Phase 2 (MVP 이후)

- [ ] **주간 뉴스레터 발송 템플릿** (Resend + React Email)
- [ ] **OG Image 자동 생성** (Vercel OG / `@vercel/og`, 글 제목 기반)
- [ ] **RSS 피드** (`/feed.xml`) — 외부 피드 리더 지원
- [ ] **사이트 내 검색** (Fuse.js 클라이언트 사이드 or Pagefind)

### Phase 3 (선택)

- [ ] **주간 기술 뉴스 큐레이션** (`/weekly`) — 뉴스 묶음 형식
- [ ] **댓글** (giscus — GitHub Discussions 기반)
- [ ] **태그 페이지** (`/tags/[tag]`)

---

## 5. 기술 스펙

### 스택

| 레이어 | 선택 | 근거 |
|--------|------|------|
| 프레임워크 | Next.js 15 (App Router) | SSG로 SEO 최적화, Vercel 최적 배포 |
| 콘텐츠 | MDX (로컬 파일, `contentlayer` or `next-mdx-remote`) | Git 버전 관리, 별도 CMS 불필요 |
| 스타일 | Tailwind CSS v4 | 유틸리티 퍼스트, 번들 최소화 |
| 코드 하이라이팅 | Shiki | 빌드 타임 처리, 런타임 오버헤드 없음 |
| 뉴스레터 | Resend API | 무료 3,000건/월, Audience 관리 내장 |
| 배포 | Vercel | GitHub 연동 자동 배포, Edge Network |
| 도메인 | bedaily.dev | |

### 콘텐츠 디렉토리 구조

```
content/
├── posts/
│   └── spring-virtual-threads.mdx
└── news/
    └── openai-gpt5-release.mdx
```

### MDX Frontmatter 스키마

**블로그 글** (`content/posts/*.mdx`)

```yaml
---
title: "Spring Boot 3.x에서 Virtual Threads 활용하기"
date: "2026-04-20"
category: "Java"          # Backend | AI | Java | DevOps
tags: ["Spring", "Virtual Threads", "Java 21"]
summary: "Java 21 Virtual Threads를 Spring Boot에 적용하는 방법과 성능 비교"
published: true
---
```

**뉴스** (`content/news/*.mdx`)

```yaml
---
title: "OpenAI, GPT-5 발표"
date: "2026-04-20"
category: "AI"
tags: ["LLM", "OpenAI"]
source: "https://openai.com/blog/..."
comment: "멀티모달 강화 + 추론 능력 대폭 개선. 백엔드 AI 연동 시 달라지는 점 정리 예정."
published: true
---
```

> `published: false`인 글은 빌드에서 제외 (드래프트 관리)

### 공통 카테고리

| 카테고리 | 포함 주제 |
|----------|----------|
| `Backend` | 서버, REST/gRPC API, 아키텍처, 데이터베이스 |
| `AI` | LLM, ML, AI 서비스, 프롬프트 엔지니어링 |
| `Java` | Java, Spring, JVM 생태계 |
| `DevOps` | 인프라, CI/CD, 컨테이너, 쿠버네티스 |

### URL 구조

```
/                        홈
/posts                   블로그 글 목록
/posts/[slug]            블로그 글 상세
/news                    뉴스 목록
/news/[slug]             뉴스 상세
/about                   소개
/api/subscribe           뉴스레터 구독 (POST)
/feed.xml                RSS 피드 (Phase 2)
/weekly                  주간 큐레이션 (Phase 3)
```

### UTM 트래킹 규칙

소셜 채널별 링크에 UTM 파라미터 일관 적용:

```
https://bedaily.dev/posts/[slug]?utm_source=threads&utm_medium=social&utm_campaign=post
https://bedaily.dev/posts/[slug]?utm_source=instagram&utm_medium=social&utm_campaign=post
https://bedaily.dev/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
```

---

## 6. 비기능 요구사항

| 항목 | 기준 | 측정 방법 |
|------|------|----------|
| 성능 | Lighthouse Performance 90점 이상 | Vercel Analytics / PageSpeed Insights |
| 모바일 반응형 | 320px ~ 1440px 전 구간 정상 렌더링 | Chrome DevTools 모바일 시뮬레이션 |
| 다크 모드 | 시스템 설정 연동 (`prefers-color-scheme`) | OS 다크모드 전환 확인 |
| SEO | 모든 페이지 고유 `<title>`, `<description>`, OG 태그 | Google Search Console |
| 접근성 | 주요 인터랙션 키보드 접근 가능, 이미지 `alt` 필수 | axe DevTools |

---

## 7. 범위 외 (Non-Goals)

- 유료 콘텐츠 / 멤버십 / 페이월
- 다국어 지원 (한국어 전용)
- 서버 DB (콘텐츠는 MDX 파일, 구독자는 Resend에서 관리)
- 자체 댓글 시스템 (Phase 3에서 giscus로 경량 대체)
- 광고 게재

---

## 8. 성공 지표

| 지표 | 3개월 목표 | 측정 도구 |
|------|-----------|----------|
| 월 순 방문자 (UV) | 1,000명 | Vercel Analytics |
| 뉴스레터 구독자 | 200명 | Resend Audience |
| 소셜 → 사이트 CTR | 5% 이상 | UTM + Vercel Analytics |
| 평균 세션 시간 | 2분 이상 | Vercel Analytics |
| 블로그 글 수 | 12편 이상 (주 1편) | GitHub 커밋 |

---

## 9. 리스크 및 대응

| 리스크 | 가능성 | 영향 | 대응 |
|--------|--------|------|------|
| 콘텐츠 생산 지연 | 높음 | 높음 | 소셜 포스트를 MDX로 변환하는 워크플로 구성으로 작성 부담 최소화 |
| Resend 무료 한도 초과 | 낮음 (초기) | 낮음 | 구독자 3,000명 도달 시 유료 플랜 전환 ($20/월) |
| Vercel 빌드 시간 증가 | 낮음 | 중간 | ISR 또는 incremental builds 적용 |
| 소셜 알고리즘 변동 | 중간 | 중간 | 검색 SEO를 병행 트래픽 소스로 육성 |

---

## 10. 개발 일정

| 주차 | 마일스톤 | 세부 작업 |
|------|---------|----------|
| **1주** | 프로젝트 기반 세팅 | Next.js 프로젝트 초기화, Tailwind 설정, MDX 파이프라인 구성, 샘플 콘텐츠 2~3개 |
| **2주** | 콘텐츠 페이지 | 홈페이지 UI, 블로그 목록/상세, 뉴스 목록/상세 |
| **3주** | 전환 기능 | 뉴스레터 구독 폼 + Resend 연동, About 페이지, SEO 메타태그 |
| **4주** | 배포 & QA | Vercel 배포, 도메인 연결, Lighthouse 검수, 모바일 QA |

> Phase 2 (OG Image, RSS, 검색)는 MVP 안정화 후 진행

---

## 부록: 환경 변수

```env
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=...
NEXT_PUBLIC_SITE_URL=https://bedaily.dev
```
