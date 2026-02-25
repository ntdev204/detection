"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const cards = [
  {
    href: "/human",
    title: "Human Detection",
    subtitle: "Phát hiện người",
    accent: "from-emerald-500/20 to-emerald-500/5",
    border: "hover:border-emerald-500/40",
    badge: "bg-emerald-500/15 text-emerald-400",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
    stat: "YOLOv8",
  },
  {
    href: "/traffic",
    title: "Traffic Detection",
    subtitle: "Phân tích giao thông",
    accent: "from-blue-500/20 to-blue-500/5",
    border: "hover:border-blue-500/40",
    badge: "bg-blue-500/15 text-blue-400",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    stat: "Car · Motorbike · Truck · Bus",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-15">
      {/* Hero */}
      <div className="mb-20 space-y-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            Powered by YOLOv8
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AI Detection & Tracking
        </motion.h1>

        <motion.p
          className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nhận diện người và phân tích giao thông theo thời gian thực với độ chính xác cao.
          Hỗ trợ upload file và webcam trực tiếp.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Link href={card.href} className={`group block transition-all duration-300 ${card.border}`}>
              <Card>
                <CardContent className="flex flex-col gap-5 p-6">
                  {/* Header */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-foreground`}>
                    {card.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{card.title}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${card.badge}`}>
                        {card.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="font-mono text-xs text-muted-foreground">{card.stat}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      Bắt đầu
                      <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="currentColor">
                        <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" />
                      </svg>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
