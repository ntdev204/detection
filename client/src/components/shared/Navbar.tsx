"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeIcon from "@/assets/ThemeIcon";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/human", label: "Human" },
  { href: "/traffic", label: "Traffic" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            AI
          </span>
          <span className="hidden sm:inline">Detection</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-md transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground
                     hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          <ThemeIcon />
        </button>
      </div>
    </header>
  );
}
