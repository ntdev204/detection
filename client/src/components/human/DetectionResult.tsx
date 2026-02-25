"use client";

import { motion } from "motion/react";
import { HumanDetectionResult } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface DetectionResultProps {
  result: HumanDetectionResult | null;
  isLoading?: boolean;
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-muted/60 p-4">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function DetectionResult({ result, isLoading }: DetectionResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const level = result.count === 0 ? "none" : result.avg_confidence > 70 ? "high" : "medium";

  const levelConfig = {
    none: { label: "—", cls: "text-muted-foreground", dot: "bg-muted" },
    medium: { label: "Trung bình", cls: "text-amber-500", dot: "bg-amber-500" },
    high: { label: "Cao", cls: "text-emerald-400", dot: "bg-emerald-400" },
  }[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              result.count > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"
            )}>
              {result.count > 0 ? (
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold leading-tight">Phát hiện người</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
                  <path d="M8 3.5a.5.5 0 00-1 0V9a.5.5 0 00.252.434l3.5 2a.5.5 0 00.496-.868L8 8.71V3.5z" />
                  <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm7-8A7 7 0 111 8a7 7 0 0114 0z" />
                </svg>
                {result.timestamp}
              </p>
            </div>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", levelConfig.cls, "border-current/20")}>
            {levelConfig.label}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={result.count} label="Số người" />
          <StatCard value={`${result.max_confidence}%`} label="Tin cậy cao nhất" />
          <StatCard value={`${result.avg_confidence}%`} label="Tin cậy TB" />
        </div>

        {/* Summary */}
        <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 px-4 py-3">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" fill="currentColor">
            <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
            <path d="M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
          </svg>
          <div>
            <p className="text-sm font-medium leading-tight">
              {result.count > 0
                ? `Đã xác định ${result.count} người trong khung hình`
                : "Không phát hiện người"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{result.summary}</p>
          </div>
        </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
