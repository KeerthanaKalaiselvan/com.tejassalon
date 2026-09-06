"use client";

import { useReveal } from "@/lib/motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: any;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ ["--d" as any]: `${delay}s` }}>
      {children}
    </Tag>
  );
}
