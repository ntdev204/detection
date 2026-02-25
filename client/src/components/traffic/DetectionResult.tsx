"use client";

import { motion } from "motion/react";
import type { TrafficDetectionResult } from "@/lib/api";
import DensityBadge from "./DensityBadge";
import { Card, CardContent } from "@/components/ui/card";

const VEHICLE_LABELS: Record<string, string> = {
  car: "Ô tô",
  motorbike: "Xe máy",
  motorcycle: "Xe máy",
  truck: "Xe tải",
  bus: "Xe buýt",
  person: "Người",
  bicycle: "Xe đạp",
  van: "Van",
};

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-muted/60 p-4">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

interface DetectionResultProps {
  result: TrafficDetectionResult | null;
  isLoading?: boolean;
}

export default function TrafficDetectionResult({
  result,
  isLoading,
}: DetectionResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-36 rounded bg-muted animate-pulse" />
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const vehicleEntries = Object.entries(result.class_counts).filter(
    ([, v]) => v > 0,
  );

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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold leading-tight">
                  Phát hiện giao thông
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="currentColor"
                  >
                    <path d="M8 3.5a.5.5 0 00-1 0V9a.5.5 0 00.252.434l3.5 2a.5.5 0 00.496-.868L8 8.71V3.5z" />
                    <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm7-8A7 7 0 111 8a7 7 0 0114 0z" />
                  </svg>
                  {result.timestamp}
                </p>
              </div>
            </div>
            <DensityBadge density={result.density} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={result.total_vehicles} label="Tổng phương tiện" />
            <StatCard
              value={`${result.max_confidence}%`}
              label="Tin cậy cao nhất"
            />
            <StatCard value={`${result.avg_confidence}%`} label="Tin cậy TB" />
          </div>

          {/* Per-class breakdown */}
          {vehicleEntries.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {vehicleEntries.map(([cls, count]) => (
                <div
                  key={cls}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {VEHICLE_LABELS[cls] ?? cls}
                  </span>
                  <span className="font-semibold text-sm">{count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 px-4 py-3">
            <svg
              viewBox="0 0 16 16"
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
              fill="currentColor"
            >
              <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
              <path d="M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
            </svg>
            <div>
              <p className="text-sm font-medium leading-tight">
                {result.total_vehicles > 0
                  ? `Phát hiện ${result.total_vehicles} phương tiện trong khung hình`
                  : "Không phát hiện phương tiện"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {result.summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
