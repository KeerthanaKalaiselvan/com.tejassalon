"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Mark from "./Mark";
import { SITE, telHref } from "@/lib/site";
import { ShopIcon, PersonCircleIcon } from "./Icons";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#products", label: "Take Home" },
  { href: "/#gallery", label: "The Studio" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit" },
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
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled || mobileOpen
          ? "border-b border-cream/[0.09] bg-ink/[0.86] backdrop-blur-[14px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label={`${SITE.name}, home`}>
          <Mark className="w-7 shrink-0" id="nav-mark" />
          <b className="font-serif text-lg font-normal tracking-[0.2em] text-cream">TEJAS</b>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[0.78rem] uppercase tracking-[0.14em] text-cream/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a href={telHref} className="outline-button !px-4 !py-2 !text-[0.68rem]">
            {SITE.phoneDisplay}
          </a>
          <Link href="/book" className="gold-button !px-5 !py-2 !text-[0.68rem]">
            Book
          </Link>
          {user ? (
            <div className="group relative">
              <button
                type="button"
                title={user.name || user.mobile}
                aria-label={`Account: ${user.name || user.mobile}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold-light transition-all duration-300 hover:border-gold/60 hover:bg-gold/15 hover:text-white"
              >
                <PersonCircleIcon className="h-[1.15rem] w-[1.15rem]" />
              </button>
              <div className="invisible absolute right-0 mt-2 w-44 rounded-card border border-gold/20 bg-ink-soft p-2 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <Link href="/history" className="block rounded-card px-3 py-2 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold">
                  My history
                </Link>
                <Link href="/cart" className="block rounded-card px-3 py-2 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold">
                  Cart
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="block w-full rounded-card px-3 py-2 text-left text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              title="Log in"
              aria-label="Log in"
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold-light transition-all duration-300 hover:border-gold/60 hover:bg-gold/15 hover:text-white"
            >
              <PersonCircleIcon className="h-[1.15rem] w-[1.15rem]" />
            </Link>
          )}

          <Link
            href="/products"
            title="Shop take-home products"
            aria-label="Shop take-home products"
            className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold-light transition-all duration-300 hover:border-gold/60 hover:bg-gold/15 hover:text-white"
          >
            <ShopIcon className="h-[1.05rem] w-[1.05rem]" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/products"
            aria-label="Shop take-home products"
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold-light"
          >
            <ShopIcon className="h-[1.05rem] w-[1.05rem]" />
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            className="rounded-pill border border-cream/25 px-4 py-2 font-sans text-[0.68rem] uppercase tracking-[0.16em] text-cream"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream/10 bg-ink px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-card px-3 py-3 font-sans text-sm uppercase tracking-[0.12em] text-cream/90 hover:bg-gold/10 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <Link href="/book" onClick={() => setMobileOpen(false)} className="gold-button mt-3 text-center">
              Book an appointment
            </Link>
            <a href={telHref} onClick={() => setMobileOpen(false)} className="outline-button mt-2 text-center">
              Call {SITE.phoneDisplay}
            </a>
            {user ? (
              <>
                <Link href="/history" onClick={() => setMobileOpen(false)} className="mt-2 rounded-card px-3 py-3 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold">
                  My history
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="rounded-card px-3 py-3 text-sm text-cream/90 hover:bg-gold/10 hover:text-gold">
                  Cart
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="rounded-card px-3 py-3 text-left text-sm text-cream/90 hover:bg-gold/10 hover:text-gold"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-2 rounded-card px-3 py-3 text-center text-sm text-cream/90 hover:bg-gold/10 hover:text-gold">
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
