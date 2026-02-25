const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const WS_BASE = API_BASE.replace(/^http/, "ws");

export const endpoints = {
  humanDetect: `${API_BASE}/api/human/detect`,
  trafficDetect: `${API_BASE}/api/traffic/detect`,
  humanWs: `${WS_BASE}/api/human/ws`,
  trafficWs: `${WS_BASE}/api/traffic/ws`,
} as const;

// ─── Human Detection ─────────────────────────────────────────────────────────

export interface HumanDetectionBox {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] normalized 0-1
}

export interface HumanDetectionResult {
  success: boolean;
  timestamp: string;
  count: number;
  max_confidence: number;
  avg_confidence: number;
  detections: HumanDetectionBox[];
  summary: string;
}

export async function detectHuman(file: File): Promise<HumanDetectionResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(endpoints.humanDetect, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Human detection failed");
  }
  return res.json();
}

// ─── Traffic Detection ────────────────────────────────────────────────────────

export interface TrafficDetectionBox {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface TrafficDetectionResult {
  success: boolean;
  timestamp: string;
  total_vehicles: number;
  density: "low" | "medium" | "high";
  class_counts: Record<string, number>;
  max_confidence: number;
  avg_confidence: number;
  detections: TrafficDetectionBox[];
  summary: string;
  supported_classes: string[];
}

export async function detectTraffic(file: File): Promise<TrafficDetectionResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(endpoints.trafficDetect, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Traffic detection failed");
  }
  return res.json();
}
