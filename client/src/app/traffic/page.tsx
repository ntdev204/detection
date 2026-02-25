"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ModeToggle from "@/components/traffic/ModeToggle";
import VideoUpload from "@/components/traffic/VideoUpload";
import WebcamCaptureTraffic from "@/components/traffic/WebcamCapture";
import TrafficDetectionResult from "@/components/traffic/DetectionResult";
import { TrafficDetectionResult as TResult } from "@/lib/api";

export default function TrafficPage() {
  const [mode, setMode] = useState<"upload" | "webcam">("upload");
  const [result, setResult] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeChange = (newMode: "upload" | "webcam") => {
    setMode(newMode);
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <motion.div
        className="mb-8 space-y-1"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Traffic Detection</h1>
            <p className="text-sm text-muted-foreground">Phân tích giao thông với YOLOv8</p>
          </div>
        </div>
      </motion.div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Left — Input panel */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex h-9 items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Nguồn dữ liệu</p>
            <ModeToggle mode={mode} onChange={handleModeChange} />
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {mode === "upload" ? (
                <motion.div
                  key="upload"
                  className="h-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <VideoUpload onResult={setResult} onLoading={setIsLoading} />
                </motion.div>
              ) : (
                <motion.div
                  key="webcam"
                  className="h-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <WebcamCaptureTraffic onResult={setResult} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right — Result panel */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex h-9 items-center">
            <p className="text-sm font-medium text-muted-foreground">Kết quả phân tích</p>
          </div>

          <div className="flex-1">
            {!result && !isLoading ? (
              <div className="flex h-full min-h-48 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  {mode === "upload" ? "Upload video để xem kết quả" : "Bật camera để bắt đầu"}
                </p>
              </div>
            ) : (
              <TrafficDetectionResult result={result} isLoading={isLoading} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
