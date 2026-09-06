"use client";

import { useParallax } from "@/lib/motion";

/** Decorative warm glow at a parallax depth. Sits under content, over the ground. */
export default function Orb({
  speed,
  className = "",
  style,
}: {
  speed: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 rounded-full blur-[14px] will-change-transform ${className}`}
      style={{
        background: "radial-gradient(circle, rgba(201,155,76,.15), transparent 68%)",
        ...style,
      }}
    />
  );
}
