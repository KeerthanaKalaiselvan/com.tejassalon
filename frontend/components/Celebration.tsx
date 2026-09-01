const CONFETTI_COLORS = ["#C9A24B", "#F0C869", "#FBF3E3", "#0F1D36"];

function ConfettiField() {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((i) => {
        const left = (i * 47) % 100;
        const delay = (i % 12) * 0.18;
        const duration = 2.6 + (i % 5) * 0.35;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const size = 6 + (i % 4) * 3;
        return (
          <span
            key={i}
            className="absolute top-0 animate-confetti rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function CelebratingGirl() {
  return (
    <svg viewBox="0 0 200 220" className="mx-auto h-44 w-44" role="img" aria-label="Illustration celebrating your booking">
      <circle cx="100" cy="110" r="95" fill="#0F1D36" fillOpacity="0.06" />
      <path d="M60 210 Q60 150 100 150 Q140 150 140 210 Z" fill="#C9A24B" />
      <circle cx="100" cy="100" r="38" fill="#F4CFA0" />
      <path
        d="M62 95 Q64 55 100 55 Q136 55 138 95 Q120 78 100 82 Q80 78 62 95 Z"
        fill="#3B2417"
      />
      <path d="M60 96 Q55 130 68 140" stroke="#3B2417" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M140 96 Q145 130 132 140" stroke="#3B2417" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="86" cy="102" r="4" fill="#14110F" />
      <circle cx="114" cy="102" r="4" fill="#14110F" />
      <path d="M86 116 Q100 128 114 116" stroke="#14110F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 150 L20 110" stroke="#F4CFA0" strokeWidth="10" strokeLinecap="round" />
      <path d="M160 150 L180 110" stroke="#F4CFA0" strokeWidth="10" strokeLinecap="round" />
      <g fontFamily="Georgia, serif" fontSize="26" fill="#0F1D36">
        <rect x="128" y="10" width="72" height="34" rx="17" fill="#FBF3E3" stroke="#C9A24B" />
        <text x="164" y="33" textAnchor="middle" fontSize="16">Hurray!</text>
      </g>
    </svg>
  );
}

export default function Celebration({ onDone }: { onDone?: () => void }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-card border border-gold/25 bg-navy px-6 py-14 text-center text-cream">
      <ConfettiField />
      <div className="relative">
        <CelebratingGirl />
        <p className="eyebrow mt-4 text-glow">Booking Received</p>
        <h2 className="section-heading mt-2 text-cream">You&apos;re All Set!</h2>
        <p className="mx-auto mt-4 max-w-md text-cream/75">
          Our specialist will get back to you shortly to confirm the best slot. Happy to have
          you as our valued customer.
        </p>
        {onDone && (
          <button type="button" onClick={onDone} className="gold-button mt-8">
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
