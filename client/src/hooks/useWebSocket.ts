"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WsStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  enabled?: boolean;
}

export function useWebSocket<T>({ url, onMessage, enabled = false }: UseWebSocketOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WsStatus>("idle");
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setStatus("connecting");
    const ws = new WebSocket(url);

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");
    ws.onmessage = (event) => {
      try {
        const data: T = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch {
        // ignore parse errors
      }
    };

    wsRef.current = ws;
  }, [url]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
  }, []);

  const sendFrame = useCallback((dataUrl: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(dataUrl);
    }
  }, []);

  useEffect(() => {
    if (enabled) connect();
    else disconnect();
    return () => { wsRef.current?.close(); };
  }, [enabled, connect, disconnect]);

  return { status, connect, disconnect, sendFrame };
}
