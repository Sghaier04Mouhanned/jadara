"use client"

import { useEffect, useRef, useState } from "react"

const COLORS = {
  bg: "#080B14",
  surface: "#0D1117",
  border: "#1E2533",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

function getScoreColor(score: number): string {
  if (score <= 49) return "#F85149"
  if (score <= 69) return "#FFA500"
  if (score <= 84) return "#FFE66D"
  return "#44CF6C"
}

function getStatusStyle(label: string): { bg: string; color: string } {
  switch (label) {
    case "ATS-Ready":
      return { bg: "rgba(68,207,108,0.15)", color: "#44CF6C" }
    case "Optimizable":
      return { bg: "rgba(255,230,109,0.15)", color: "#FFE66D" }
    case "At Risk":
      return { bg: "rgba(255,165,0,0.15)", color: "#FFA500" }
    case "Failing":
    default:
      return { bg: "rgba(248,81,73,0.15)", color: "#F85149" }
  }
}

export interface ATSGaugeProps {
  score: number
  label: string
  breakdown: {
    keyword_match: { score: number; feedback: string; missing?: string[] }
    keyword_placement: { score: number; feedback: string }
    sections: { score: number; feedback: string }
    experience: { score: number; feedback: string }
    formatting: { score: number; feedback: string }
  }
}

const BREAKDOWN_ROWS: { key: keyof ATSGaugeProps["breakdown"]; label: string; max: number }[] = [
  { key: "keyword_match", label: "Keyword Match", max: 40 },
  { key: "keyword_placement", label: "Keyword Placement", max: 20 },
  { key: "sections", label: "Sections", max: 20 },
  { key: "experience", label: "Experience", max: 10 },
  { key: "formatting", label: "Formatting", max: 10 },
]

const SIZE = 220
const STROKE_WIDTH = 14
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ANIMATION_DURATION = 1500

export default function ATSGauge({
  score = 67,
  label = "Optimizable",
  breakdown = {
    keyword_match: { score: 28, feedback: "Good keyword match but missing some key frameworks." },
    keyword_placement: { score: 14, feedback: "Place core skills higher up." },
    sections: { score: 16, feedback: "Missing a professional summary." },
    experience: { score: 6, feedback: "Need more quantified impact." },
    formatting: { score: 3, feedback: "Too long, condense to one page." },
  },
}: ATSGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const t = Math.min(elapsed / ANIMATION_DURATION, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3)

      setProgress(eased)
      setDisplayScore(Math.round(eased * score))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [score])

  const strokeColor = getScoreColor(score)
  const statusStyle = getStatusStyle(label)
  const dashOffset = CIRCUMFERENCE - progress * (score / 100) * CIRCUMFERENCE
  const cx = SIZE / 2
  const cy = SIZE / 2

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      {/* Circular Gauge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            style={{ transform: "rotate(-90deg)", display: "block" }}
            aria-hidden="true"
          >
            {/* Background track */}
            <circle
              cx={cx}
              cy={cy}
              r={RADIUS}
              fill="none"
              stroke={COLORS.border}
              strokeWidth={STROKE_WIDTH}
            />
            {/* Progress arc */}
            <circle
              cx={cx}
              cy={cy}
              r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ filter: `drop-shadow(0 0 8px ${strokeColor}80)` }}
            />
          </svg>

          {/* Center label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontWeight: 800,
                fontSize: "3rem",
                color: strokeColor,
                lineHeight: 1,
                letterSpacing: "-2px",
                transition: "color 0.3s ease",
              }}
            >
              {displayScore}
            </span>
            <span
              style={{
                fontSize: 14,
                color: COLORS.textMuted,
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              / 100
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: "0.06em",
            borderRadius: 100,
            padding: "5px 18px",
            border: `1px solid ${statusStyle.color}30`,
          }}
        >
          {label}
        </span>
      </div>

      {/* Breakdown rows */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {BREAKDOWN_ROWS.map((row) => {
          const item = breakdown[row.key] || { score: 0, feedback: "" }
          const value = typeof item === "number" ? item : item.score
          const feedback = typeof item === "object" ? item.feedback : ""
          const max = row.max
          const pct = (value / max) * 100
          const barColor = getScoreColor(Math.round((value / max) * 100))

          return (
            <div key={row.key} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 12.5,
                    color: COLORS.textMuted,
                    flexShrink: 0,
                    width: 148,
                    letterSpacing: "0.01em",
                  }}
                >
                  {row.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 100,
                    backgroundColor: COLORS.border,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 100,
                      backgroundColor: barColor,
                      width: `${progress * pct}%`,
                      boxShadow: `0 0 6px ${barColor}60`,
                      transition: "none",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: barColor,
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    fontWeight: 800,
                    flexShrink: 0,
                    width: 44,
                    textAlign: "right",
                  }}
                >
                  {value} pts
                </span>
              </div>
              {feedback && (
                <div style={{ paddingLeft: 160, fontSize: 11, color: "rgba(232, 232, 232, 0.6)", lineHeight: 1.4 }}>
                  {feedback}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
