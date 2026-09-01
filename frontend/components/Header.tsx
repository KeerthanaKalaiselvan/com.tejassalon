"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/#craft", label: "Our Craft" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#team", label: "Team" },
  { href: "/products", label: "Products" },
  { href: "/#support", label: "Support" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-navy/95 backdrop-blur-sm transition-shadow duration-500 ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-serif text-2xl tracking-wide text-cream transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_rgba(240,200,105,0.85)] md:text-3xl"
        >
          <span className="text-gold">Tejas</span> Salon
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm tracking-wide text-cream/85 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/book" className="outline-button">
            Reserve Your Spot
          </Link>
          {user ? (
            <div className="group relative">
              <button type="button" className="gold-button">
                {user.name || user.mobile}
              </button>
              <div className="invisible absolute right-0 mt-2 w-44 rounded-2xl border border-gold/20 bg-navy p-2 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <Link
                  href="/history"
                  className="block rounded-xl px-3 py-2 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  My History
                </Link>
                <Link
                  href="/cart"
                  className="block rounded-xl px-3 py-2 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Cart
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="gold-button">
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-pill border border-cream/30 px-4 py-2 text-sm text-cream lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream/10 bg-navy px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl border border-gold/50 px-3 py-3 text-center text-sm text-cream"
            >
              Reserve Your Spot
            </Link>
            {user ? (
              <>
                <Link
                  href="/history"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  My History
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Cart
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="rounded-xl px-3 py-3 text-left text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="gold-button mt-2 text-center"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
