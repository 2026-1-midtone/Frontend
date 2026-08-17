/**
 * 공용 아이콘 세트.
 *
 * `<img src="*.svg">` 대신 인라인 SVG 컴포넌트로 두는 이유는
 * 하단 네비게이션의 활성/비활성처럼 상태에 따라 색이 바뀌는 아이콘이 있어
 * `fill="currentColor"`로 CSS에서 색을 제어해야 하기 때문이다.
 */

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  focusable: 'false',
  'aria-hidden': true,
}

export function IconSettings({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M11.05 2h1.9a1.6 1.6 0 0 1 1.57 1.29l.2 1.02c.4.16.78.38 1.13.63l.98-.34a1.6 1.6 0 0 1 1.91.7l.95 1.65a1.6 1.6 0 0 1-.34 2l-.78.68c.03.22.04.44.04.67s-.01.45-.04.67l.78.68a1.6 1.6 0 0 1 .34 2l-.95 1.65a1.6 1.6 0 0 1-1.91.7l-.98-.34c-.35.25-.73.47-1.13.63l-.2 1.02A1.6 1.6 0 0 1 12.95 22h-1.9a1.6 1.6 0 0 1-1.57-1.29l-.2-1.02c-.4-.16-.78-.38-1.13-.63l-.98.34a1.6 1.6 0 0 1-1.91-.7l-.95-1.65a1.6 1.6 0 0 1 .34-2l.78-.68A5.6 5.6 0 0 1 5.39 12c0-.23.01-.45.04-.67l-.78-.68a1.6 1.6 0 0 1-.34-2l.95-1.65a1.6 1.6 0 0 1 1.91-.7l.98.34c.35-.25.73-.47 1.13-.63l.2-1.02A1.6 1.6 0 0 1 11.05 2Zm.95 6.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"
      />
    </svg>
  )
}

export function IconHome({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M11.36 2.76a1 1 0 0 1 1.28 0l8 6.67c.23.19.36.47.36.77V20a2 2 0 0 1-2 2h-4v-6h-4v6H6a2 2 0 0 1-2-2v-9.8c0-.3.13-.58.36-.77l7-5.83Z"
      />
    </svg>
  )
}

export function IconSchedule({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm14 8v3.1l-1.9-.02a2 2 0 0 0-1.43.58l-4.2 4.2a2 2 0 0 0-.55 1.03L12.5 22H5a2 2 0 0 1-2-2V10h18Zm-14 3a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H7Z"
      />
      <path
        fill="currentColor"
        d="m21.7 13.9 1.1 1.1a1 1 0 0 1 0 1.41l-.86.86-2.51-2.51.86-.86a1 1 0 0 1 1.41 0ZM18.02 15.9l2.51 2.51-3.76 3.76a1 1 0 0 1-.5.27l-2.2.44.44-2.2c.04-.19.13-.37.27-.5l3.24-4.28Z"
      />
    </svg>
  )
}

export function IconEdit({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M17.85 2.85a2.9 2.9 0 0 1 4.1 4.1l-1.2 1.2-4.1-4.1 1.2-1.2ZM15.23 5.47l4.1 4.1-9.4 9.4a2 2 0 0 1-.98.54l-4.4.98a1 1 0 0 1-1.2-1.19l.98-4.4a2 2 0 0 1 .54-.99l10.36-8.44Z"
      />
    </svg>
  )
}

export function IconGrid({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M4 3h5.5a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm10.5 0H20a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1h-5.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM4 13.5h5.5a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1Zm10.5 0H20a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1h-5.5a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1Z"
      />
    </svg>
  )
}

/** 오늘의 루틴 제목 옆 네 잎 아이콘 */
export function IconClover({ size = 16, ...rest }) {
  return (
    <svg {...baseProps} viewBox="0 0 16 16" width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M4.6 1.4a3.2 3.2 0 0 1 3.2 3.2v.6h-.6a3.2 3.2 0 1 1-2.6-3.8ZM11.4 1.4a3.2 3.2 0 1 1-3.2 3.8h-.6v-.6a3.2 3.2 0 0 1 3.8-3.2ZM4.6 8.2h.6a3.2 3.2 0 1 1-3.8 3.2 3.2 3.2 0 0 1 3.2-3.2ZM11.4 8.2a3.2 3.2 0 1 1-3.2 3.2v-.6h.6a3.2 3.2 0 0 1 2.6-2.6Z"
      />
    </svg>
  )
}

export function IconChevronDown({ size = 20, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 9 7 6 7-6"
      />
    </svg>
  )
}

export function IconClose({ size = 16, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  )
}

/** 리듬코치 카드 - 카페인 중단 */
export function IconCoffee({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Zm11 1.5V13a3.5 3.5 0 0 0 0-7 1 1 0 1 0 0 2 1.5 1.5 0 0 1 0 3.5Z"
      />
      <path
        fill="currentColor"
        d="M7.2 3.6a1 1 0 0 1 1.5 1.3c-.5.6-.5 1 0 1.6a1 1 0 1 1-1.5 1.3c-1.1-1.3-1.1-2.9 0-4.2Zm4 0a1 1 0 0 1 1.5 1.3c-.5.6-.5 1 0 1.6a1 1 0 1 1-1.5 1.3c-1.1-1.3-1.1-2.9 0-4.2Z"
      />
    </svg>
  )
}

/** 리듬코치 카드 - 권장 낮잠 */
export function IconSun({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
      />
    </svg>
  )
}

/** 리듬코치 카드 - 빛 차단 */
export function IconEyeOff({ size = 24, ...rest }) {
  return (
    <svg {...baseProps} width={size} height={size} {...rest}>
      <path
        fill="currentColor"
        d="M12 5c-5 0-8.6 3.3-9.9 6.1a1 1 0 0 0 0 .8C2.6 13.6 4.6 16 7.6 17.2l-1.9 1.9a1 1 0 1 0 1.4 1.4l14-14a1 1 0 0 0-1.4-1.4l-2.1 2.1A9.9 9.9 0 0 0 12 5Zm0 3.6c.4 0 .8.05 1.2.14l-4.46 4.46A3.6 3.6 0 0 1 12 8.6Zm-3.5 6.87 1.1-1.1a3.6 3.6 0 0 0 4.87-4.87l1.27-1.27A8.2 8.2 0 0 1 20 12c-.72 1.5-2.55 3.85-5.7 5.02l-1.5-1.5c-.25.05-.51.08-.8.08a5.6 5.6 0 0 1-3.5-1.13Z"
      />
    </svg>
  )
}
