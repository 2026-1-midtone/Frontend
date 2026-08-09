# 시프트메이트 (ShiftMate) — Frontend

팀의 근무 일정을 한 번에 관리하는 근무표 서비스, 시프트메이트의 프론트엔드 저장소입니다.

## 기술 스택

| 구분        | 기술                          |
| ----------- | ----------------------------- |
| 빌드 도구   | Vite 8                        |
| 프레임워크  | React 19 (JavaScript)         |
| 스타일      | SCSS (sass-embedded)          |
| 라우팅      | React Router 7                |
| 린트        | Oxlint                        |

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
├── assets/              # 이미지 등 정적 리소스
├── components/
│   └── common/          # 전역 공통 컴포넌트 (Header, Footer 등)
├── layouts/             # 페이지 공통 레이아웃
├── pages/               # 라우트 단위 페이지 (폴더당 jsx + scss)
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

## 스타일 규칙

- `src/styles/_core.scss`(변수 + 믹스인)가 **모든 SCSS 파일 상단에 자동 주입**됩니다.
  → 컴포넌트 SCSS에서 `@use 'variables'` 같은 재-import를 하면 네임스페이스가 충돌하므로 하지 마세요. 바로 `$color-primary`, `@include flex-center` 처럼 사용하면 됩니다.
- 색상·간격·폰트 크기는 하드코딩하지 말고 `_variables.scss`의 토큰을 사용합니다.
- 클래스 네이밍은 BEM(`block__element--modifier`)을 따릅니다.
- 반응형은 `@include respond-to('md') { ... }` (해당 폭 이하) 또는 `@include respond-from('md') { ... }` (초과)를 사용합니다.
- 경로 별칭 `@` → `src` 가 설정되어 있습니다.

## 협업 규칙

브랜치 전략, 커밋 메시지, PR 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
