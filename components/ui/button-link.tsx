import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A link that looks like a button.
 *
 * Deliberately NOT `<Button render={<Link/>}>`. shadcn's Button wraps Base UI's
 * button primitive, which keeps native button semantics on whatever it renders
 * - so pushing an anchor through it produces a control that announces as a
 * button but navigates like a link, and Base UI warns about exactly this.
 *
 * Navigation must stay an anchor: it belongs in the browser's link affordances
 * (open in new tab, copy address, screen-reader link lists). So we borrow the
 * styling via `buttonVariants` and leave the semantics alone.
 */
export function ButtonLink({
  className,
  variant,
  size,
  external = false,
  children,
  ...props
}: ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { external?: boolean }) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in new tab)</span> : null}
    </Link>
  );
}
