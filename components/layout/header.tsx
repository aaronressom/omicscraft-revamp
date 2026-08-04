"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Sticky header.
 *
 * Transparent while at the top of the page, glass-on-navy once scrolled.
 * This relies on every page opening with a dark band - see the shared page
 * header in `components/layout/page-hero.tsx`. If a page ever starts on a
 * light background, white nav text would vanish against it.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-navy-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        {/* h-24: the official lockup is wider and taller than the previous
            mark-plus-text approximation and needs the extra room. */}
        <div className="flex h-24 items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg"
            aria-label="OmicsCraft — home"
          >
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // whitespace-nowrap: "Software Platform" otherwise
                        // wraps to two lines at the lg breakpoint, leaving its
                        // active underline stranded below the other items.
                        // Tighter padding buys back the width that costs, and
                        // relaxes again at xl where there is room.
                        "relative flex h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-sm font-medium transition-colors xl:px-4",
                        active
                          ? "text-white"
                          : "text-slate-300 hover:text-white",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cyan-400"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* h-11 keeps the header CTA at a 44px tap target. */}
            <ButtonLink
              href="/contact"
              className="hidden h-11 rounded-xl px-5 text-sm font-semibold lg:inline-flex"
            >
              Get in touch
            </ButtonLink>

            {/* Mobile drawer */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className="size-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent
                side="right"
                className="on-dark w-full border-white/10 bg-navy-950 sm:max-w-sm"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <nav aria-label="Mobile" className="px-4 pb-8">
                  <ul className="flex flex-col gap-1">
                    {NAV.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          {/* Closing via state rather than <SheetClose> keeps
                              these as plain anchors - wrapping them in the
                              close primitive would layer button semantics
                              over a navigation link. */}
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                              active
                                ? "bg-cyan-500/12 text-cyan-400"
                                : "text-slate-300 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <ButtonLink
                    href="/contact"
                    size="xl"
                    className="mt-6 w-full"
                    onClick={() => setOpen(false)}
                  >
                    Get in touch
                  </ButtonLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
