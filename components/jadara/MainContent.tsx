"use client"

import { useState } from "react"
import ATSGauge from "./ATSGauge"
import AgentReasoning from "./AgentReasoning"
import SkillGapPanel from "./SkillGapPanel"
import JobMatchesPanel from "./JobMatchesPanel"
import QuestChecklist from "./QuestChecklist"

const COLORS = {
  bg: "#080B14",
  surface: "#0D1117",
  border: "#1E2533",
  teal: "#4ECDC4",
  gold: "#FFE66D",
  success: "#44CF6C",
  warning: "#FFA500",
  danger: "#F85149",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

const STATS = [
  { number: "306,000", label: "Students Graduated", sublabel: "annually in Tunisia" },
  { number: "~40%",    label: "Youth Unemployed",   sublabel: "among graduates" },
  { number: "80",      label: "Jobs Indexed",        sublabel: "live opportunities" },
]

interface MainContentProps {
  tier: "free" | "premium"
  analyzed: boolean
  cv: string
  role: string
  city: string
  level: string
}

export default function MainContent({ tier, analyzed, cv, role, city, level }: MainContentProps) {
  return (
    <main
      style={{
        flex: 1,
        padding: "40px 48px",
        overflowY: "auto",
        minHeight: "100vh",
      }}
    >
      {analyzed ? (
        <AnalysisView tier={tier} cv={cv} role={role} city={city} level={level} />
      ) : (
        <HomeView />
      )}
    </main>
  )
}

// ─── Home ────────────────────────────────────────────────────────────────────

function HomeView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 820 }}>
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(78,205,196,0.08)",
            border: `1px solid rgba(78,205,196,0.2)`,
            borderRadius: 100,
            padding: "5px 14px",
            marginBottom: 20,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.teal, display: "inline-block" }} />
          <span style={{ fontSize: 12, color: COLORS.teal, letterSpacing: "0.08em", fontWeight: 400 }}>
            AI Career Intelligence
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-syne, 'Syne', sans-serif)",
            fontWeight: 800,
            fontSize: 42,
            margin: 0,
            lineHeight: 1.15,
            color: COLORS.textPrimary,
            letterSpacing: "-0.5px",
          }}
        >
          The Tunisian job market
          <br />
          <span style={{ color: COLORS.teal }}>is brutal.</span>
          <span style={{ color: COLORS.textMuted }}> We're not.</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "22px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                backgroundColor: i === 0 ? COLORS.teal : i === 1 ? COLORS.danger : COLORS.success,
                opacity: 0.6,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontWeight: 800,
                fontSize: 30,
                color: i === 0 ? COLORS.teal : i === 1 ? COLORS.danger : COLORS.success,
                lineHeight: 1,
              }}
            >
              {stat.number}
            </span>
            <span style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 400, lineHeight: 1.4 }}>
              {stat.label}
            </span>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{stat.sublabel}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -1, left: 36,
            width: 48, height: 3,
            backgroundColor: COLORS.teal,
            borderRadius: "0 0 4px 4px",
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontSize: 22,
            fontStyle: "italic",
            color: COLORS.textPrimary,
            lineHeight: 1.55,
            fontWeight: 300,
            textAlign: "center",
          }}
        >
          {'"600 applications. 1 interview. Then ghosted."'}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", letterSpacing: "0.03em" }}>
          — r/Tunisia, 2024
        </div>
        <div style={{ textAlign: "center", fontSize: 15, color: COLORS.teal, fontWeight: 400, lineHeight: 1.5 }}>
          Jadara tells you exactly why. And what to do next.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "20px 0",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <span style={{ fontSize: 20, opacity: 0.5 }}>←</span>
        <span style={{ fontSize: 14, color: COLORS.textMuted, fontStyle: "italic", letterSpacing: "0.03em" }}>
          Paste your CV to begin
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: "◈",
    title: "CV Gap Analysis",
    desc: "Identifies missing keywords, weak bullet points, and ATS red flags instantly.",
    color: COLORS.teal,
  },
  {
    icon: "◉",
    title: "Role Match Score",
    desc: "Scores your CV against real job postings in Tunisia for your target role.",
    color: COLORS.success,
  },
  {
    icon: "◆",
    title: "Market Intelligence",
    desc: "Live demand data: which skills are employers actually searching for this month.",
    color: COLORS.warning,
    premium: true,
  },
  {
    icon: "◇",
    title: "Rewrite Suggestions",
    desc: "AI-rewritten bullet points tailored to Tunisian hiring standards.",
    color: COLORS.gold,
    premium: true,
  },
]

function FeatureCard({ icon, title, desc, color, premium }: {
  icon: string; title: string; desc: string; color: string; premium?: boolean
}) {
  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
      }}
    >
      {premium && (
        <span
          style={{
            position: "absolute",
            top: 14, right: 14,
            fontSize: 10,
            color: COLORS.gold,
            border: `1px solid rgba(255,230,109,0.3)`,
            borderRadius: 100,
            padding: "2px 8px",
            letterSpacing: "0.08em",
            fontWeight: 400,
          }}
        >
          PREMIUM
        </span>
      )}
      <span style={{ fontSize: 22, color }}>{icon}</span>
      <span
        style={{
          fontFamily: "var(--font-syne, 'Syne', sans-serif)",
          fontWeight: 800,
          fontSize: 15,
          color: COLORS.textPrimary,
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{desc}</span>
    </div>
  )
}

// ─── Analysis ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "CV Score"    },
  { id: "jobs",      label: "Job Matches" },
  { id: "gaps",      label: "Skill Gaps"  },
  { id: "quest",     label: "Action Plan" },
]

function AnalysisView({ tier, cv, role, city, level }: {
  tier: "free" | "premium"; cv: string; role: string; city: string; level: string
}) {
  const [phase, setPhase] = useState<"loading" | "done">("loading")
  const [activeTab, setActiveTab] = useState("overview")

  const wordCount = cv.trim().split(/\s+/).length
  const score = Math.min(95, Math.max(32, Math.floor((wordCount / 4) + 28)))
  const atsLabel = score >= 85 ? "ATS-Ready" : score >= 70 ? "Optimizable" : score >= 50 ? "At Risk" : "Failing"
  const breakdown = {
    keyword_match:   Math.min(40, Math.round(score * 0.40)),
    keyword_placement: Math.min(20, Math.round(score * 0.20)),
    sections:        Math.min(20, Math.round(score * 0.20)),
    experience:      Math.min(10, Math.round(score * 0.10)),
    formatting:      Math.min(10, Math.round(score * 0.10)),
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 820 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 30,
              margin: 0,
              color: COLORS.textPrimary,
            }}
          >
            Profile Analysis
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: COLORS.textMuted }}>
            {role ? `${level} · ${role}` : level}{city !== "Any" ? ` · ${city}` : ""}
          </p>
        </div>
        {phase === "done" && (
          <button
            onClick={() => setPhase("loading")}
            style={{
              fontSize: 12,
              color: COLORS.textMuted,
              background: "none",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Re-analyze
          </button>
        )}
      </div>

      {/* Loading phase */}
      {phase === "loading" ? (
        <AgentReasoningPhase onComplete={() => setPhase("done")} />
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 0 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: isActive ? 400 : 300,
                    color: isActive ? COLORS.teal : COLORS.textMuted,
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? `2px solid ${COLORS.teal}` : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    marginBottom: -1,
                    letterSpacing: "0.02em",
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <ATSGauge score={score} label={atsLabel} breakdown={breakdown} />
              <FindingsCard />
              {tier === "free" && <PremiumCard />}
            </div>
          )}

          {activeTab === "jobs" && <JobMatchesPanel />}
          {activeTab === "gaps" && <SkillGapPanel currentMatchPct={score - 12} />}
          {activeTab === "quest" && <QuestChecklist />}
        </>
      )}
    </div>
  )
}

// Wraps AgentReasoning and fires onComplete after all nodes done
function AgentReasoningPhase({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false)

  // 7 nodes × ~1.5s each ≈ 12s total; use a simple timer
  useState(() => {
    const t = setTimeout(() => {
      setDone(true)
      onComplete()
    }, 12500)
    return () => clearTimeout(t)
  })

  if (done) return null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AgentReasoning />
    </div>
  )
}

// ─── Findings ────────────────────────────────────────────────────────────────

const MOCK_FINDINGS = [
  { type: "danger",  text: "No quantifiable achievements found — add metrics (%, numbers, impact)" },
  { type: "warning", text: "Skills section is generic — missing in-demand keywords for your role" },
  { type: "success", text: "Work experience section is well-structured with clear timeline" },
  { type: "warning", text: "Summary/objective is missing or too short (under 40 words)" },
  { type: "danger",  text: "No LinkedIn or GitHub profile linked — reduces trust signal" },
]

function FindingsCard() {
  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-syne, 'Syne', sans-serif)",
          fontWeight: 800,
          fontSize: 16,
          color: COLORS.textPrimary,
        }}
      >
        Key Findings
      </h3>
      {MOCK_FINDINGS.map((f, i) => (
        <FindingRow key={i} {...f} />
      ))}
    </div>
  )
}

function FindingRow({ type, text }: { type: string; text: string }) {
  const color = type === "danger" ? COLORS.danger : type === "warning" ? COLORS.warning : COLORS.success
  const icon  = type === "danger" ? "✕" : type === "warning" ? "!" : "✓"
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span
        style={{
          width: 22, height: 22,
          borderRadius: 6,
          backgroundColor: `${color}18`,
          border: `1px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 11,
          color,
          fontWeight: 800,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 13.5, color: COLORS.textPrimary, lineHeight: 1.6, fontWeight: 300 }}>{text}</span>
    </div>
  )
}

function PremiumCard() {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,230,109,0.04)",
        border: `1px solid rgba(255,230,109,0.2)`,
        borderRadius: 14,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <span style={{ fontSize: 32 }}>✦</span>
      <div>
        <div
          style={{
            fontFamily: "var(--font-syne, 'Syne', sans-serif)",
            fontWeight: 800,
            fontSize: 16,
            color: COLORS.gold,
            marginBottom: 4,
          }}
        >
          Unlock Premium Analysis
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Get AI-rewritten bullet points, market demand data, and a full interview
          preparation guide tailored to Tunisian hiring managers.
        </div>
      </div>
    </div>
  )
}
