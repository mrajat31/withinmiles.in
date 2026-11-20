/** WM mountain logo mark (matches the brand t-shirt print).
 *  Draws in currentColor so it adapts to light/dark backgrounds. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      {/* Solid mountain silhouette with ridge cut */}
      <path d="M22 40 L44 12 L50 19 L61 2 L90 40 L72 40 L60 26 L50 38 L41 29 L33 40 Z" />
      {/* Heavy WM letters */}
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fontFamily="'Inter', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="52"
        letterSpacing="-3"
      >
        WM
      </text>
    </svg>
  )
}
