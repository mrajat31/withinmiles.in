/** WM mountain logo mark (recreated from brand asset as scalable SVG). */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect width="100" height="100" rx="24" fill="#0b0b0f" />
      <path
        d="M50 13 L81 47 H19 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M39 28 L55 47 H24 Z" fill="#fff" />
      <text
        x="50"
        y="84"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="37"
        letterSpacing="-2"
        fill="#fff"
      >
        WM
      </text>
    </svg>
  )
}
