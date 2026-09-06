/** The Tejas radiance mark - flame petal inside a radiant ring.
 *  Ray geometry generated from the source logo.svg, not hand-authored. */
export default function Mark({
  className = "",
  id = "tejas-mark",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tejas">
      <defs>
        <linearGradient id={id} x1="14" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6DFAE" />
          <stop offset=".45" stopColor="#D8A94F" />
          <stop offset="1" stopColor="#A9762C" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M32.48 8.40L32.00 1.60L31.52 8.40ZM41.36 10.33L42.41 6.87L40.70 10.06ZM49.02 15.65L53.50 10.50L48.35 14.98ZM53.94 23.30L57.13 21.59L53.67 22.64ZM55.60 32.48L62.40 32.00L55.60 31.52ZM53.67 41.36L57.13 42.41L53.94 40.70ZM48.35 49.02L53.50 53.50L49.02 48.35ZM40.70 53.94L42.41 57.13L41.36 53.67ZM31.52 55.60L32.00 62.40L32.48 55.60ZM22.64 53.67L21.59 57.13L23.30 53.94ZM14.98 48.35L10.50 53.50L15.65 49.02ZM10.06 40.70L6.87 42.41L10.33 41.36ZM8.40 31.52L1.60 32.00L8.40 32.48ZM10.33 22.64L6.87 21.59L10.06 23.30ZM15.65 14.98L10.50 10.50L14.98 15.65ZM23.30 10.06L21.59 6.87L22.64 10.33Z" />
      <circle cx="32" cy="32" r="20.4" fill="none" stroke={`url(#${id})`} strokeWidth="1.35" opacity=".85" />
      <path d="M32 15.4C41.2 24.6 41.2 39.4 32 48.6 22.8 39.4 22.8 24.6 32 15.4Z" fill={`url(#${id})`} />
      <path d="M32 21.4C34.9 27.4 34.9 36.6 32 42.6 29.1 36.6 29.1 27.4 32 21.4Z" fill="#150E13" opacity=".66" />
    </svg>
  );
}
