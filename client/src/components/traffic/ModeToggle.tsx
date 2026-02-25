"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModeToggleProps {
  mode: "upload" | "webcam";
  onChange: (mode: "upload" | "webcam") => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as "upload" | "webcam")}>
      <TabsList className="h-9">
        <TabsTrigger value="upload" className="gap-1.5 text-xs cursor-pointer">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M6.002 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M2.002 1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2h-12zm12 1a1 1 0 011 1v6.5l-3.777-1.947a.5.5 0 00-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 00-.63.062L1.002 12V3a1 1 0 011-1h12z" />
          </svg>
          Video
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
