"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { detectTraffic, endpoints, TrafficDetectionResult } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CLASS_COLORS: Record<string, string> = {
  car: "#3b82f6",
  motorbike: "#f59e0b",
  motorcycle: "#f59e0b",
  truck: "#ef4444",
  bus: "#a855f7",
  person: "#10b981",
  default: "#6366f1",
};

/* ── Draw bounding boxes on a static image (for image uploads) ── */
function drawAnnotatedImage(
  imageUrl: string,
  result: TrafficDetectionResult,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const scale = Math.min(canvas.width, canvas.height);

      result.detections.forEach(({ bbox, label, confidence }) => {
        const [x1, y1, x2, y2] = bbox;
        const px = x1 * canvas.width;
        const py = y1 * canvas.height;
        const pw = (x2 - x1) * canvas.width;
        const ph = (y2 - y1) * canvas.height;
        const color = CLASS_COLORS[label.toLowerCase()] ?? CLASS_COLORS.default;

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, scale * 0.003);
        ctx.strokeRect(px, py, pw, ph);

        const fontSize = Math.max(12, scale * 0.022);
        const text = `${label} ${confidence.toFixed(1)}%`;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textW = ctx.measureText(text).width + 8;
        const textH = fontSize + 8;
        ctx.fillStyle = color;
        ctx.fillRect(px, py - textH, textW, textH);
        ctx.fillStyle = "#fff";
        ctx.fillText(text, px + 4, py - 5);
      });

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

interface VideoUploadProps {
  onResult: (result: TrafficDetectionResult) => void;
  onLoading: (loading: boolean) => void;
}

export default function VideoUpload({ onResult, onLoading }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [annotatedPreview, setAnnotatedPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  /* video continuous detection */
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendingRef = useRef(false);
  const playingRef = useRef(false);

  /* ── Compute where `object-contain` renders the video inside its container ── */
  const getVideoRenderArea = useCallback(() => {
    const video = videoRef.current;
    const container = canvasRef.current?.parentElement;
    if (!video || !container || !video.videoWidth || !video.videoHeight)
      return null;

    const containerRect = container.getBoundingClientRect();
    const cw = containerRect.width;
    const ch = containerRect.height;
    const videoAR = video.videoWidth / video.videoHeight;
    const containerAR = cw / ch;

    let renderW: number, renderH: number, offsetX: number, offsetY: number;
    if (videoAR > containerAR) {
      renderW = cw;
      renderH = cw / videoAR;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderH = ch;
      renderW = ch * videoAR;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }
    return { cw, ch, renderW, renderH, offsetX, offsetY };
  }, []);

  /* ── Draw bounding boxes on the canvas overlay (for video) ── */
  const drawBoxes = useCallback(
    (result: TrafficDetectionResult) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const area = getVideoRenderArea();
      if (!area) return;

      canvas.width = area.cw;
      canvas.height = area.ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(area.renderW, area.renderH);

      result.detections.forEach(({ bbox, label, confidence }) => {
        const [x1, y1, x2, y2] = bbox;
        const px = area.offsetX + x1 * area.renderW;
        const py = area.offsetY + y1 * area.renderH;
        const pw = (x2 - x1) * area.renderW;
        const ph = (y2 - y1) * area.renderH;
        const color = CLASS_COLORS[label.toLowerCase()] ?? CLASS_COLORS.default;

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, scale * 0.004);
        ctx.strokeRect(px, py, pw, ph);

        const fontSize = Math.max(11, scale * 0.025);
        const text = `${label} ${confidence.toFixed(1)}%`;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textW = ctx.measureText(text).width + 8;
        const textH = fontSize + 8;
        ctx.fillStyle = color;
        ctx.fillRect(px, py - textH, textW, textH);
        ctx.fillStyle = "#fff";
        ctx.fillText(text, px + 4, py - 5);
      });
    },
    [getVideoRenderArea],
  );

  /* ── Ref-based send to break circular dependency ── */
  const sendFrameRef = useRef<(dataUrl: string) => void>(() => {});

  /** Capture the current video frame and send it */
  const captureAndSend = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended || video.readyState < 2) return;
    if (pendingRef.current) return;
    pendingRef.current = true;

    // Downscale to max 640px for faster transfer & inference
    const MAX_DIM = 640;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const ratio = Math.min(1, MAX_DIM / Math.max(vw, vh));
    const tw = Math.round(vw * ratio);
    const th = Math.round(vh * ratio);

    const tmp = document.createElement("canvas");
    tmp.width = tw;
    tmp.height = th;
    tmp.getContext("2d")?.drawImage(video, 0, 0, tw, th);
    sendFrameRef.current(tmp.toDataURL("image/jpeg", 0.5));
  }, []);
  const captureAndSendRef = useRef(captureAndSend);
  captureAndSendRef.current = captureAndSend;

  /* ── WebSocket for continuous video detection ── */
  const { status, sendFrame } = useWebSocket<TrafficDetectionResult>({
    url: endpoints.trafficWs,
    onMessage: (data) => {
      pendingRef.current = false;
      if (data.success) {
        drawBoxes(data);
        onResult(data);
      }
      // Immediately capture & send next frame (round-trip)
      if (playingRef.current) {
        captureAndSendRef.current();
      }
    },
    enabled: isVideoPlaying,
  });
  sendFrameRef.current = sendFrame;

  /* Kick off the first frame once WebSocket connects */
  useEffect(() => {
    if (isVideoPlaying && status === "connected") {
      pendingRef.current = false;
      captureAndSendRef.current();
    }
  }, [isVideoPlaying, status]);

  const startVideoDetection = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    playingRef.current = true;
    setIsVideoPlaying(true);
  }, []);

  const stopVideoDetection = useCallback(() => {
    const video = videoRef.current;
    if (video) video.pause();
    playingRef.current = false;
    pendingRef.current = false;
    setIsVideoPlaying(false);
    const canvas = canvasRef.current;
    if (canvas)
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  /* When video ends, stop detection */
  const handleVideoEnded = useCallback(() => {
    stopVideoDetection();
  }, [stopVideoDetection]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Chỉ chấp nhận file ảnh hoặc video");
        return;
      }

      // Clean up previous video detection
      stopVideoDetection();

      const url = URL.createObjectURL(file);
      setPreview(url);
      setAnnotatedPreview(null);
      const isVideo = file.type.startsWith("video/");
      setIsVideoMode(isVideo);
      setFileName(file.name);

      if (isVideo) {
        // For video: just set preview, user clicks play to start continuous detection
        setIsProcessing(false);
        onLoading(false);
        return;
      }

      // For images: single detection via REST API
      setIsProcessing(true);
      onLoading(true);

      try {
        const result = await detectTraffic(file);
        onResult(result);

        const annotated = await drawAnnotatedImage(url, result);
        setAnnotatedPreview(annotated);

        toast.success(`Phát hiện ${result.total_vehicles} phương tiện`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lỗi xử lý file");
      } finally {
        setIsProcessing(false);
        onLoading(false);
      }
    },
    [onResult, onLoading, stopVideoDetection],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <div className="space-y-4">
      {/* Drop zone / upload area — shown when no video is loaded */}
      {!isVideoMode && (
        <div
          className={cn(
            "relative flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/mpeg"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />

          <AnimatePresence mode="wait">
            {annotatedPreview ? (
              <motion.img
                key="annotated-preview"
                src={annotatedPreview}
                alt="Detection result"
                className="max-h-52 w-full rounded-lg object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            ) : preview ? (
              <motion.img
                key="img-preview"
                src={preview}
                alt="Preview"
                className="max-h-52 w-full rounded-lg object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            ) : (
              <motion.div
                key="placeholder"
                className="flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Kéo thả video / ảnh vào đây
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    hoặc click để chọn · MP4, WebM, JPEG, PNG
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">
                  Đang phân tích...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video player with bounding-box overlay — shown when a video is loaded */}
      {isVideoMode && preview && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-xl bg-muted/30 border border-border aspect-video">
            <video
              ref={videoRef}
              src={preview}
              className="h-full w-full object-contain"
              muted
              playsInline
              loop
              onEnded={handleVideoEnded}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full pointer-events-none"
            />

            {/* Status badge */}
            {isVideoPlaying && (
              <motion.div
                className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    status === "connected"
                      ? "bg-blue-400 animate-pulse"
                      : "bg-amber-400",
                  )}
                />
                <span className="text-xs text-white">
                  {status === "connected"
                    ? "Đang phân tích"
                    : "Đang kết nối..."}
                </span>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isVideoPlaying ? (
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                onClick={startVideoDetection}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Phát &amp; nhận diện
              </button>
            ) : (
              <button
                className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
                onClick={stopVideoDetection}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M6 6h12v12H6z" />
                </svg>
                Dừng
              </button>
            )}
            <button
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {
                stopVideoDetection();
                setIsVideoMode(false);
                setPreview(null);
                setFileName(null);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Chọn file khác
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for video mode */}
      {isVideoMode && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/mpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
          }}
        />
      )}
    </div>
  );
}
