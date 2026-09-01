export default function CenteredCardBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy px-6 py-16">
      <img
        src="/images/login-gate.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-navy/50" />
      <div className="relative w-full max-w-lg rounded-card border border-gold/20 bg-cream p-8 shadow-glow sm:p-10">
        {children}
      </div>
    </section>
  );
}
