import type { ReactNode } from "react";
import { useState } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Home, ListTodo, Menu, Settings, X } from "lucide-react";
import { SignalButton } from "@/components/home/SignalButton";
import { HomeLanguageSwitcher } from "@/components/home/HomeLanguageSwitcher";
import { MOCK_PRODUCT_ID } from "@app-template/db/mockProductId";
import { m } from "@/paraglide/messages.js";
import { appName } from "@/utils/appName";
import { getTextDirection } from "@/paraglide/runtime.js";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  params?: Record<string, string>;
  active?: boolean;
}

interface Props {
  session: { user: { name: string; email: string } } | null;
  children: ReactNode;
}

function getMobileDrawerSide() {
  return getTextDirection() === "rtl" ? "right" : "left";
}

function HomeSidebarNav({
  items,
  onNavigate,
}: {
  items: Array<NavItem>;
  onNavigate: (() => void) | null;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          params={item.params}
          onClick={() => {
            onNavigate?.();
          }}
          className={clsx(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            item.active === true
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white",
          )}
        >
          <item.icon className="size-4 shrink-0 stroke-[1.5]" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function HomeSidebarContent({
  session,
  onNavigate,
}: {
  session: Props["session"];
  onNavigate: (() => void) | null;
}) {
  const navItems: Array<NavItem> = [
    { to: "/", label: m.home(), icon: Home, active: true },
  ];

  if (session?.user != null) {
    navItems.push(
      {
        to: "/products/$productId/tasks",
        label: "Marketing Tasks",
        icon: ListTodo,
        params: { productId: MOCK_PRODUCT_ID },
      },
      {
        to: "/settings/$path",
        label: m.account(),
        icon: Settings,
        params: { path: "account" },
      },
    );
  }

  return (
    <div className="flex h-full flex-col gap-8 p-7">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] font-semibold tracking-[0.3px] text-white/40 uppercase">
          Signal
        </p>
        <p className="text-lg font-semibold tracking-[-0.2px] text-white">{appName()}</p>
      </div>

      <HomeSidebarNav items={navItems} onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-4">
        <HomeLanguageSwitcher />

        {session?.user == null ? (
          <div className="flex flex-col gap-2">
            <Link
              to="/auth/login"
              onClick={() => {
                onNavigate?.();
              }}
            >
              <SignalButton variant="sidebarSecondary">{m.sign_in()}</SignalButton>
            </Link>
            <Link
              to="/auth/sign-up"
              onClick={() => {
                onNavigate?.();
              }}
            >
              <SignalButton variant="sidebarAccent">{m.sign_up()}</SignalButton>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-lg bg-white/5 p-3">
            <p className="truncate text-sm font-medium text-white" dir="auto">
              {session.user.name}
            </p>
            <p className="truncate font-mono text-[11px] text-white/40" dir="auto">
              {session.user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function HomePageLayout({ session, children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerSide = getMobileDrawerSide();

  return (
    <div className="signal-home min-h-screen bg-[#f7f5f1] font-sans text-[#17140f]">
      <aside className="fixed inset-y-0 inset-s-0 z-30 hidden w-[248px] bg-[#17140f] lg:block">
        <HomeSidebarContent session={session} onNavigate={null} />
      </aside>

      <div className="flex min-h-screen flex-col lg:ps-[248px]">
        <header className="flex items-center justify-between gap-3 border-b border-[rgba(23,20,15,0.1)] bg-[#f7f5f1]/90 px-5 py-4 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[10.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
              Signal
            </p>
            <p className="text-base font-semibold tracking-[-0.2px]">{appName()}</p>
          </div>

          <Drawer.Root
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
            swipeDirection={drawerSide}
          >
            <Drawer.Trigger
              render={
                <SignalButton variant="secondary" size="sm" aria-label={m.menu_open()} />
              }
            >
              <Menu className="size-4" />
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Backdrop className="fixed inset-0 z-50 bg-[#17140f]/40 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
              <Drawer.Viewport
                className={clsx(
                  "fixed inset-0 z-50 flex p-0",
                  drawerSide === "right" ? "justify-end" : "justify-start",
                )}
              >
                <Drawer.Popup
                  className={clsx(
                    "flex h-full w-[min(460px,100vw)] flex-col bg-[#17140f] text-white shadow-lg transition-transform data-ending-style:duration-200",
                    drawerSide === "right"
                      ? "data-ending-style:translate-x-full data-starting-style:translate-x-full"
                      : "data-ending-style:-translate-x-full data-starting-style:-translate-x-full",
                  )}
                >
                  <div className="flex items-center justify-end p-4">
                    <Drawer.Close
                      render={
                        <SignalButton
                          variant="sidebarSecondary"
                          size="sm"
                          aria-label={m.menu_close()}
                        />
                      }
                    >
                      <X className="size-4" />
                    </Drawer.Close>
                  </div>
                  <HomeSidebarContent
                    session={session}
                    onNavigate={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </header>

        <main className="flex flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10 lg:p-12">
          <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">{children}</div>
        </main>

        <footer className="border-t border-[rgba(23,20,15,0.1)] p-5 sm:px-8 lg:px-12">
          <div className="mx-auto flex w-full max-w-[960px] flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-[rgba(23,20,15,0.4)]">{appName()}</p>
            <nav className="flex flex-wrap items-center gap-4">
              <Link
                to="/accessibility-statement"
                className="font-mono text-[11px] text-[rgba(23,20,15,0.4)] transition-colors hover:text-[#17140f]"
              >
                {m.accessibility_statement()}
              </Link>
              <Link
                to="/privacy-policy"
                className="font-mono text-[11px] text-[rgba(23,20,15,0.4)] transition-colors hover:text-[#17140f]"
              >
                {m.privacy_policy()}
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
