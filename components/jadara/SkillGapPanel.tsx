"use client"

import { useState } from "react"

const COLORS = {
  surface: "#0D1117",
  border: "#1E2533",
  teal: "#4ECDC4",
  gold: "#FFE66D",
  danger: "#F85149",
  warning: "#FFA500",
  success: "#44CF6C",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

export interface SkillGap {
  skill: string
  blocking_level: "Critical" | "Important" | "Optional"
  fastest_path: string
  time_weeks: number
  cost: "Free" | "Paid"
  unlocks: string
  market_reality: string
}

const DEFAULT_GAPS: SkillGap[] = [
  {
    skill: "Docker",
    blocking_level: "Critical",
    fastest_path: "docker.com/get-started — official tutorial, ~8 hours",
    time_weeks: 2,
    cost: "Free",
    unlocks: "Backend / DevOps roles",
    market_reality: "71% of Tunisian backend job postings require containerization knowledge.",
  },
  {
    skill: "React",
    blocking_level: "Important",
    fastest_path: "react.dev/learn — official docs are the fastest path",
    time_weeks: 4,
    cost: "Free",
    unlocks: "Frontend / Full-stack roles",
    market_reality: "React appears in 64% of frontend listings in Tunis this quarter.",
  },
  {
    skill: "Excel / Google Sheets",
    blocking_level: "Optional",
    fastest_path: "Coursera: Excel Skills for Business (free audit)",
    time_weeks: 1,
    cost: "Free",
    unlocks: "Business analyst / operations roles",
    market_reality: "Still required by SMEs and government-adjacent companies.",
  },
]

function getBadgeStyle(level: SkillGap["blocking_level"]) {
  switch (level) {
    case "Critical":
      return {
        bg: "rgba(248,81,73,0.12)",
        border: "rgba(248,81,73,0.35)",
        color: COLORS.danger,
      }
    case "Important":
      return {
        bg: "rgba(255,165,0,0.12)",
        border: "rgba(255,165,0,0.35)",
        color: COLORS.warning,
      }
    case "Optional":
      return {
        bg: "rgba(78,205,196,0.1)",
        border: "rgba(78,205,196,0.3)",
        color: COLORS.teal,
      }
  }
}

function matchImprovement(level: SkillGap["blocking_level"]) {
  return level === "Critical" ? 15 : level === "Important" ? 8 : 3
}

export interface SkillGapPanelProps {
  gaps?: SkillGap[]
  currentMatchPct?: number
}

export default function SkillGapPanel({ gaps = DEFAULT_GAPS, currentMatchPct = 58 }: SkillGapPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const critical = gaps.filter((g) => g.blocking_level === "Critical").length
  const important = gaps.filter((g) => g.blocking_level === "Important").length
  const optional = gaps.filter((g) => g.blocking_level === "Optional").length
  const totalImprovement = gaps
    .filter((g) => g.blocking_level === "Critical")
    .reduce((sum) => sum + 15, 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 820 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-syne, 'Syne', sans-serif)",
            fontWeight: 800,
            fontSize: 22,
            color: COLORS.textPrimary,
            letterSpacing: "-0.3px",
          }}
        >
          Skill Gap Report
        </h3>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: COLORS.textMuted,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Ordered by market impact. Be honest with yourself.
        </p>
      </div>

      {/* Gap cards */}
      {gaps.map((gap, i) => {
        const badge = getBadgeStyle(gap.blocking_level)
        const isOpen = expanded === gap.skill
        const barWidth = Math.min(100, (gap.time_weeks / 5) * 100)
        const improvement = matchImprovement(gap.blocking_level)

        return (
          <div
            key={i}
            onClick={() => setExpanded(isOpen ? null : gap.skill)}
            style={{
              backgroundColor: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "20px",
              marginBottom: 12,
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(78,205,196,0.3)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border
            }}
          >
            {/* Top: badge + skill name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  padding: "3px 10px",
                  borderRadius: 100,
                  backgroundColor: badge.bg,
                  border: `1px solid ${badge.border}`,
                  color: badge.color,
                  flexShrink: 0,
                }}
              >
                {gap.blocking_level.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: COLORS.textPrimary,
                }}
              >
                {gap.skill}
              </span>
            </div>

            {/* Middle: info pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                { icon: "◈", text: gap.fastest_path.split(" ")[0] },
                { icon: "⏱", text: `${gap.time_weeks} week${gap.time_weeks !== 1 ? "s" : ""}` },
                { icon: "◆", text: gap.cost },
                { icon: "◇", text: `Unlocks: ${gap.unlocks}` },
              ].map((pill, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ fontSize: 10 }}>{pill.icon}</span>
                  {pill.text}
                </span>
              ))}
            </div>

            {/* Bottom: market reality + time bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: COLORS.teal,
                  fontWeight: 300,
                  lineHeight: 1.5,
                }}
              >
                ◉ {gap.market_reality}
              </span>
              <div style={{ flexShrink: 0, width: 80 }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4, textAlign: "right" }}>
                  {gap.time_weeks}w
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 100,
                    backgroundColor: COLORS.border,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      borderRadius: 100,
                      backgroundColor: badge.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded section */}
            {isOpen && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${COLORS.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  animation: "none",
                }}
              >
                {/* Next action box */}
                <div
                  style={{
                    backgroundColor: "rgba(78,205,196,0.06)",
                    border: `1px solid rgba(78,205,196,0.25)`,
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.teal,
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                      fontWeight: 400,
                    }}
                  >
                    NEXT ACTION
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 300, lineHeight: 1.6 }}>
                    Start here: {gap.fastest_path}
                  </div>
                </div>

                {/* Match improvement */}
                <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 300 }}>
                  Adding{" "}
                  <span style={{ color: COLORS.textPrimary, fontWeight: 400 }}>{gap.skill}</span> raises
                  your top match from{" "}
                  <span style={{ color: COLORS.warning }}>{currentMatchPct}%</span> to{" "}
                  <span style={{ color: COLORS.success }}>{Math.min(99, currentMatchPct + improvement)}%</span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Summary */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <span>
            <span style={{ color: COLORS.danger, fontWeight: 400 }}>{critical} Critical</span>
            <span style={{ color: COLORS.textMuted }}> gap{critical !== 1 ? "s" : ""}</span>
          </span>
          <span>
            <span style={{ color: COLORS.warning, fontWeight: 400 }}>{important} Important</span>
            <span style={{ color: COLORS.textMuted }}> gap{important !== 1 ? "s" : ""}</span>
          </span>
          <span>
            <span style={{ color: COLORS.teal, fontWeight: 400 }}>{optional} Optional</span>
            <span style={{ color: COLORS.textMuted }}> gap{optional !== 1 ? "s" : ""}</span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 300 }}>
          Close all Critical gaps{" "}
          <span style={{ color: COLORS.success }}>→ estimated match improvement: +{totalImprovement}%</span>
        </div>
      </div>
    </div>
  )
}
