import Link from "next/link";
import CenteredCardBackdrop from "@/components/CenteredCardBackdrop";

export default function LoginGate({
  eyebrow,
  title,
  subtitle,
  next,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  next: string;
}) {
  return (
    <CenteredCardBackdrop>
      <div className="text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-heading mt-3 text-2xl md:text-3xl">{title}</h1>
        <p className="mt-4 text-ink/65">{subtitle}</p>
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="gold-button mt-8 inline-flex"
        >
          Log In / Sign Up
        </Link>
      </div>
    </CenteredCardBackdrop>
  );
}
