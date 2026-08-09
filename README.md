# 시프트메이트 (ShiftMate) — Frontend

**AI 교대근무 생체리듬 코치**

교대근무자가 매주 바뀌는 근무 패턴에도 수면·빛 노출·카페인·식사 타이밍을 실행 가능한 루틴으로 관리할 수 있도록 돕는 서비스입니다. 근무표 사진을 업로드하면 근무 유형을 인식해 자동으로 스케줄을 만들고, 하루 단위 체크리스트와 타이머로 실천을 지원합니다.

## 핵심 기능

| 기능 | 설명 |
| --- | --- |
| 근무표 자동 인식 | 근무표 사진을 업로드하면 데이·이브닝·나이트·오프 패턴을 인식해 캘린더로 변환 |
| 리듬 코칭 | 근무 유형별 빛 노출·카페인 컷오프·파워냅 타이밍 산출 |
| 오늘의 루틴 | 하루 단위 체크리스트와 스트릭, 웹 타이머로 실행 지원 |
| 전환 프로토콜 | 나이트 → 오프 → 데이 전환 주간의 단계별 가이드 |
| 챗봇 | "지금 커피 마셔도 될까?" 같은 질문에 개인 스케줄을 반영해 응답 |

> 건강 관련 정보는 참고용이며 의료 행위를 대체하지 않습니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| 빌드 도구 | Vite 8 |
| 프레임워크 | React 19 (JavaScript) |
| 스타일 | SCSS (sass-embedded) |
| 라우팅 | React Router 7 |
| 린트 | Oxlint |

## 실행 방법

```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 실행
npm run build   # 프로덕션 빌드
npm run preview # 빌드 결과 미리보기
npm run lint    # 린트 검사
```

## 폴더 구조

```
src/
├── assets/              # 이미지 등 정적 리소스 (SVG)
├── components/
│   └── common/          # 전역 공통 컴포넌트
├── layouts/
│   └── AppLayout.jsx    # 앱 기준 393px 프레임 레이아웃
├── pages/               # 라우트 단위 페이지 (폴더당 jsx + scss)
│   ├── Onboarding/
│   └── NotFound/
├── routes/
│   ├── paths.js         # 라우트 경로 상수
│   └── router.jsx       # 라우터 정의
├── styles/
│   ├── _variables.scss  # 색상·타이포·간격 등 디자인 토큰
│   ├── _mixins.scss     # 반응형·레이아웃 믹스인
│   ├── _core.scss       # 토큰 전역 주입 진입점
│   ├── _reset.scss      # CSS 리셋
│   └── global.scss      # 전역 스타일 (main.jsx에서 import)
├── App.jsx
└── main.jsx
```

## 레이아웃 기준

**모바일 앱을 기준으로 제작합니다.** 기본 너비는 **393px**이며, 데스크톱 브라우저에서도 콘텐츠는 393px 폭으로 중앙 정렬되고 양옆은 배경만 노출됩니다. 이 프레임은 `AppLayout`과 `@include app-frame` 믹스인이 담당합니다.

## 스타일 규칙

- 서비스는 **다크 테마**를 기본으로 합니다. 색상 토큰은 브랜드 퍼플(`$purple-*`)과 다크 뉴트럴(`$night-*`, 숫자가 클수록 밝음)로 구성되어 있습니다.
- `src/styles/_core.scss`(변수 + 믹스인)가 **모든 SCSS 파일 상단에 자동 주입**됩니다.
  → 컴포넌트 SCSS에서 `@use 'variables'` 같은 재-import를 하면 네임스페이스가 충돌하므로 하지 마세요. 바로 `$color-primary`, `@include flex-center` 처럼 사용하면 됩니다.
- 색상·간격·폰트 크기는 하드코딩하지 말고 `_variables.scss`의 토큰을 사용합니다.
- 클래스 네이밍은 BEM(`block__element--modifier`)을 따릅니다.
- 반응형은 `@include respond-to('md') { ... }` (해당 폭 이하) 또는 `@include respond-from('md') { ... }` (초과)를 사용합니다.
- 경로 별칭 `@` → `src` 가 설정되어 있습니다.

## 협업 규칙

브랜치 전략, 커밋 메시지, PR 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
