import type * as React from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { MobileSideMenu } from "@/components/layout/MobileSideMenu";
import { PageBackButton } from "@/components/ui/PageBackButton";
import { m } from "@/paraglide/messages.js";

interface Props {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  headerAction?: React.ReactNode;
  headerControls?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  subtitle,
  onBack,
  headerAction,
  headerControls,
  children,
}: Props) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/88 backdrop-blur-md">
          <div className="container mx-auto flex items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <MobileSideMenu
                headerAction={headerAction ?? null}
                headerControls={headerControls ?? null}
              />
              {onBack == null ? null : <PageBackButton onBack={onBack} />}
              <div className="min-w-0">
                {title == null ? (
                  <Link
                    to="/"
                    className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
                  >
                    {m.app_name()}
                  </Link>
                ) : (
                  <h1
                    className="truncate text-lg font-semibold tracking-tight md:text-2xl"
                    dir="auto"
                  >
                    {title}
                  </h1>
                )}
                {subtitle == null ? null : (
                  <p className="truncate text-sm text-muted-foreground" dir="auto">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div
              className={clsx(
                "hidden shrink-0 items-center gap-2 md:flex",
                headerAction == null && headerControls == null && "md:hidden",
              )}
            >
              {headerAction}
              {headerControls}
            </div>
          </div>
        </header>

        <main className="container mx-auto flex-1 px-3 py-5 sm:px-4 sm:py-8">{children}</main>

        <footer className="border-t border-border bg-background/88">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 p-4 text-xs text-muted-foreground sm:justify-between">
            <p>{m.app_name()}</p>
            <nav className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/accessibility-statement"
                className="transition-colors hover:text-foreground"
              >
                {m.accessibility_statement()}
              </Link>
              <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
                {m.privacy_policy()}
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
