"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { endpoints, HumanDetectionResult } from "@/lib/api";
import { cn } from "@/lib/utils";

const FRAME_INTERVAL_MS = 400;
const BBOX_COLOR = "#10b981"; // emerald-500

interface WebcamCaptureProps {
  onResult: (result: HumanDetectionResult) => void;
}

export default function WebcamCaptureHuman({ onResult }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastResultRef = useRef<HumanDetectionResult | null>(null);

  const drawBoxes = useCallback((result: HumanDetectionResult) => {
    lastResultRef.current = result;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    result.detections.forEach(({ bbox, label, confidence }) => {
      const [x1, y1, x2, y2] = bbox;
      // Mirror x-coords to match the CSS scaleX(-1) on video
      const px = (1 - x2) * canvas.width;
      const py = y1 * canvas.height;
      const pw = (x2 - x1) * canvas.width;
      const ph = (y2 - y1) * canvas.height;

      ctx.strokeStyle = BBOX_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      const text = `${label} ${confidence.toFixed(1)}%`;
      ctx.font = "bold 12px sans-serif";
      const textW = ctx.measureText(text).width + 8;
      ctx.fillStyle = BBOX_COLOR;
      ctx.fillRect(px, py - 20, textW, 20);
      ctx.fillStyle = "#fff";
      ctx.fillText(text, px + 4, py - 5);
    });
  }, []);

  const { status, sendFrame } = useWebSocket<HumanDetectionResult>({
    url: endpoints.humanWs,
    onMessage: (data) => {
      if (data.success) {
        drawBoxes(data);
        onResult(data);
      }
    },
    enabled: isActive,
  });

  const captureAndSend = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = video.videoWidth;
    tmpCanvas.height = video.videoHeight;
    tmpCanvas.getContext("2d")?.drawImage(video, 0, 0);
    sendFrame(tmpCanvas.toDataURL("image/jpeg", 0.7));
  }, [sendFrame]);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsActive(true);
    } catch {
      setError("Không thể truy cập camera. Hãy kiểm tra quyền truy cập.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    setIsActive(false);
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(captureAndSend, FRAME_INTERVAL_MS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, captureAndSend]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="space-y-2">
      {/* Clickable frame */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted/30 border border-border aspect-video",
          !isActive && "cursor-pointer hover:bg-muted/50 transition-colors"
        )}
        onClick={!isActive ? startCamera : undefined}
      >
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover [transform:scaleX(-1)]" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

        {/* Idle state — click to start */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-muted-foreground" fill="currentColor">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM18.75 8.25l-2.74 2.37a.75.75 0 000 1.12l2.74 2.37a.75.75 0 001.25-.56V8.81a.75.75 0 00-1.25-.56z" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Bấm để bật camera</p>
          </div>
        )}

        {/* Active — status badge top-left + stop button top-right */}
        {isActive && (
          <>
            <motion.div
              className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className={cn(
                "h-2 w-2 rounded-full",
                status === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              )} />
              <span className="text-xs text-white">
                {status === "connected" ? "Realtime" : "Đang kết nối..."}
              </span>
            </motion.div>

            <motion.button
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md
                         bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer"
              onClick={stopCamera}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-label="Tắt camera"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <path d="M2.146 2.854a.5.5 0 11.708-.708L8 7.293l5.146-5.147a.5.5 0 01.708.708L8.707 8l5.147 5.146a.5.5 0 01-.708.708L8 8.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 8 2.146 2.854z" />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
