/** WM mountain logo mark (matches the brand t-shirt print).
 *  Draws in currentColor so it adapts to light/dark backgrounds. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 86" className={className} aria-hidden="true" fill="currentColor">
      <path
        d="M50 2 L84 40 H16 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M37 18 L55 40 H20 Z" />
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="42"
        letterSpacing="-2"
      >
        WM
      </text>
    </svg>
  )
}
