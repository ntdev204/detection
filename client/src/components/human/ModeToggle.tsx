"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";

interface ModeToggleProps {
  mode: "upload" | "webcam";
  onChange: (mode: "upload" | "webcam") => void;
  uploadLabel?: string;
}

export default function ModeToggle({ mode, onChange, uploadLabel = "Upload" }: ModeToggleProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as "upload" | "webcam")}>
      <TabsList className="h-9">
        <TabsTrigger value="upload" className="gap-1.5 text-xs cursor-pointer">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M7.646 5.146a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L8.5 6.707V10.5a.5.5 0 01-1 0V6.707L6.354 7.854a.5.5 0 11-.708-.708l2-2z" />
            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
          </svg>
          {uploadLabel}
        </TabsTrigger>
        <TabsTrigger value="webcam" className="gap-1.5 text-xs cursor-pointer">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M0 5a2 2 0 012-2h7.5a2 2 0 011.983 1.738l3.11-1.382A1 1 0 0116 4.269v7.462a1 1 0 01-1.406.913l-3.111-1.382A2 2 0 019.5 13H2a2 2 0 01-2-2V5z" />
          </svg>
          Webcam
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
