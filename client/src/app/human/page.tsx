"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ModeToggle from "@/components/human/ModeToggle";
import ImageUpload from "@/components/human/ImageUpload";
import WebcamCaptureHuman from "@/components/human/WebcamCapture";
import DetectionResult from "@/components/human/DetectionResult";
import { HumanDetectionResult } from "@/lib/api";

export default function HumanPage() {
  const [mode, setMode] = useState<"upload" | "webcam">("upload");
  const [result, setResult] = useState<HumanDetectionResult | null>(null);
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Human Detection</h1>
            <p className="text-sm text-muted-foreground">Phát hiện người với YOLOv8</p>
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
          {/* Label row — fixed height to align with right panel */}
          <div className="flex h-9 items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Nguồn dữ liệu</p>
            <ModeToggle mode={mode} onChange={handleModeChange} uploadLabel="Ảnh" />
          </div>

          {/* Content — fills remaining height */}
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
                  <ImageUpload onResult={setResult} onLoading={setIsLoading} />
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
                  <WebcamCaptureHuman onResult={setResult} />
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
          {/* Label row — same h-9 as left to align */}
          <div className="flex h-9 items-center">
            <p className="text-sm font-medium text-muted-foreground">Kết quả phân tích</p>
          </div>

          {/* Content — fills remaining height */}
          <div className="flex-1">
            {!result && !isLoading ? (
              <div className="flex h-full min-h-56 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  {mode === "upload" ? "Upload ảnh để xem kết quả" : "Bật camera để bắt đầu"}
                </p>
              </div>
            ) : (
              <DetectionResult result={result} isLoading={isLoading} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
