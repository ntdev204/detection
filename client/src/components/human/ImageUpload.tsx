"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { detectHuman, HumanDetectionResult } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onResult: (result: HumanDetectionResult) => void;
  onLoading: (loading: boolean) => void;
}

export default function ImageUpload({ onResult, onLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsProcessing(true);
    onLoading(true);

    try {
      const result = await detectHuman(file);
      onResult(result);
      toast.success(`Phát hiện ${result.count} người`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi xử lý ảnh");
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
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
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.img
              key="preview"
              src={preview}
              alt="Preview"
              className="max-h-52 w-full rounded-lg object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
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
                <p className="text-sm font-medium">Kéo thả ảnh vào đây</p>
                <p className="mt-1 text-xs text-muted-foreground">hoặc click để chọn file · JPEG, PNG, WebP</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Đang phân tích...</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
