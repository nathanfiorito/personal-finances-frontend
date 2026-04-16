import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth/use-auth";
import { useTheme } from "@/lib/theme/use-theme";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transactions", label: "Transactions" },
  { to: "/cards", label: "Cards" },
  { to: "/categories", label: "Categories" },
  { to: "/reports", label: "Reports" },
];

const CONTENT = "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8";

export function AppShell() {
  const { logout } = useAuth();
  const { resolvedTheme, toggle } = useTheme();

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-10 w-full border-b backdrop-blur">
        <div className={cn(CONTENT, "flex h-14 items-center justify-between gap-4")}>
          <span className="text-base font-semibold">Personal Finances</span>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="border-border hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1.5 text-xs"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="border-border hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1.5 text-xs"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className={cn(CONTENT, "flex gap-1 overflow-x-auto pb-2 md:hidden")}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex w-full flex-1 flex-col">
        <div className={cn(CONTENT, "flex-1 py-6 lg:py-10")}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
