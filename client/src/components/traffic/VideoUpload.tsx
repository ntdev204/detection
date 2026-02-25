"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { detectTraffic, TrafficDetectionResult } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onResult: (result: TrafficDetectionResult) => void;
  onLoading: (loading: boolean) => void;
}

export default function VideoUpload({ onResult, onLoading }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Extract the first frame of the video as a JPEG Blob. */
  const extractFrame = (videoUrl: string): Promise<File> =>
    new Promise((resolve, reject) => {
      const vid = document.createElement("video");
      vid.src = videoUrl;
      vid.crossOrigin = "anonymous";
      vid.onloadeddata = () => {
        vid.currentTime = 0.5;
      };
      vid.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        canvas.getContext("2d")?.drawImage(vid, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], "frame.jpg", { type: "image/jpeg" }));
          else reject(new Error("Failed to extract frame"));
        }, "image/jpeg", 0.9);
      };
      vid.onerror = reject;
    });

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Chỉ chấp nhận file ảnh hoặc video");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    setIsProcessing(true);
    onLoading(true);

    try {
      let analysisFile = file;
      if (file.type.startsWith("video/")) {
        analysisFile = await extractFrame(url);
      }
      const result = await detectTraffic(analysisFile);
      onResult(result);
      toast.success(`Phát hiện ${result.total_vehicles} phương tiện`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi xử lý file");
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  }, [onResult, onLoading]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/mpeg"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />

        <AnimatePresence mode="wait">
          {preview && fileName?.match(/\.(mp4|webm|mpeg)$/i) ? (
            <motion.video
              key="video-preview"
              ref={videoRef}
              src={preview}
              className="max-h-52 w-full rounded-lg object-contain"
              controls
              muted
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
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Kéo thả video / ảnh vào đây</p>
                <p className="mt-1 text-xs text-muted-foreground">hoặc click để chọn · MP4, WebM, JPEG, PNG</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Đang phân tích frame...</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
