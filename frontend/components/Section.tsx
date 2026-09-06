/** Magazine folio: a narrow rail of tracked eyebrow, a wide content column. */
export default function Section({
  id,
  eyebrow,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-parallax-host
      className={`relative py-[clamp(76px,11vw,148px)] ${className}`}
    >
      <div className="relative z-[1] mx-auto max-w-[1160px] px-[clamp(20px,5.2vw,72px)]">
        <div className="grid gap-[clamp(26px,4vw,44px)] md:grid-cols-[190px_minmax(0,1fr)] md:items-start md:gap-[clamp(40px,5vw,80px)]">
          <p className="eyebrow">{eyebrow}</p>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
