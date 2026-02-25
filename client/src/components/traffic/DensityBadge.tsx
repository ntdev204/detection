"use client";

import { cn } from "@/lib/utils";

type Density = "low" | "medium" | "high";

const config: Record<Density, { label: string; cls: string }> = {
  low: { label: "Thấp", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  medium: { label: "Trung bình", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  high: { label: "Cao", cls: "bg-red-500/15 text-red-400 border-red-500/20" },
};

interface DensityBadgeProps {
  density: Density;
  className?: string;
}

export default function DensityBadge({ density, className }: DensityBadgeProps) {
  const { label, cls } = config[density] ?? config.low;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", cls, className)}>
      {label}
    </span>
  );
}
