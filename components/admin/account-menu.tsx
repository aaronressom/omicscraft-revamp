"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleUserRound, LogOut, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/admin/use-auth";
import { cn } from "@/lib/utils";

/**
 * Header account control: an icon that opens either a sign-in form or, once
 * signed in, who you are and a way out.
 *
 * It replaced the "Get in touch" button in the top-right, and Contact went
 * back into the nav in the same round — see NAV in lib/content.ts.
 *
 * The icon is always visible, to everyone. There is no secret entrance to the
 * editor, because there is nothing secret behind it (lib/admin-auth.ts). Two
 * states, one dialog: signed out shows the form, signed in shows the account.
 */
export function AccountMenu() {
  const { user, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            // aria-label rather than a visible one: the header is tight at the
            // lg breakpoint, and this sits beside a nav that is already six
            // items wide.
            aria-label={user ? `Account — signed in as ${user}` : "Sign in"}
            className={cn(
              "grid size-11 place-items-center rounded-xl border transition-colors",
              // `user` is null through hydration and correct immediately
              // after — useSyncExternalStore guarantees that, so the signed-in
              // styling can be driven straight off it without a mounted flag.
              user
                ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
                : "border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white",
            )}
          />
        }
      >
        <CircleUserRound className="size-5" aria-hidden />
      </DialogTrigger>

      <DialogContent className="gap-5 p-6 sm:max-w-sm">
        {user ? (
          <AccountPanel
            user={user}
            onSignOut={() => {
              signOut();
              setOpen(false);
            }}
          />
        ) : (
          <SignInPanel onSignIn={signIn} onSuccess={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Nothing resets this form on close, because nothing needs to: Base UI
 * unmounts a closed dialog's contents, so the fields — password included — are
 * gone from memory and from the DOM the moment it shuts.
 */
function SignInPanel({
  onSignIn,
  onSuccess,
}: {
  onSignIn: (username: string, password: string) => string | null;
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const message = onSignIn(username, password);
        if (message) {
          setError(message);
          setPassword("");
          return;
        }
        onSuccess();
      }}
      className="flex flex-col gap-5"
    >
      <DialogHeader>
        <DialogTitle className="font-display text-lg font-semibold text-navy-900">
          Sign in
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-username" className="text-sm font-medium text-navy-900">
          Username
        </Label>
        <Input
          id="admin-username"
          name="username"
          autoComplete="username"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-11"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password" className="text-sm font-medium text-navy-900">
          Password
        </Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-11"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error ? (
        // role="alert" so it is announced when it appears, not only when the
        // field is next visited.
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <Button type="submit" size="xl" className="w-full">
        Login
      </Button>

      <p className="text-center text-sm text-slate-500">
        {/* There is no self-serve registration, and pretending otherwise would
            send someone into a dead end. The link goes where an account
            actually comes from: asking the team. */}
        Don&apos;t have an account?{" "}
        <Link
          href="/contact"
          className="font-semibold text-cyan-ink hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

function AccountPanel({
  user,
  onSignOut,
}: {
  user: string;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle className="font-display text-lg font-semibold text-navy-900">
          Signed in as {user}
        </DialogTitle>
      </DialogHeader>

      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
        onClick={onSignOut}
      >
        <LogOut aria-hidden />
        Sign out
      </Button>
    </div>
  );
}
