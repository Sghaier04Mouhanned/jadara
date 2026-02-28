"use client"

import { useState } from "react"
import { useAgent } from "@/hooks/use-agent"
import { sendEmail } from "@/lib/api"

import ATSGauge from "@/components/jadara/ATSGauge"
import AgentReasoning from "@/components/jadara/AgentReasoning"
import JobMatchesPanel from "@/components/jadara/JobMatchesPanel"
import SkillGapPanel from "@/components/jadara/SkillGapPanel"
import QuestChecklist from "@/components/jadara/QuestChecklist"

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

const CITIES = ["Any", "Tunis", "Sfax", "Sousse", "Monastir", "Bizerte"]

const DEMO_CV = `Yassine Chaari — yassine.chaari@esprit.tn
4th year Software Engineering student, INSAT Tunis

EDUCATION
BSc Software Engineering, INSAT, expected 2026

EXPERIENCE
No formal internship experience yet.

PROJECTS
Student Grade Calculator — HTML, CSS, JavaScript app on GitHub Pages.

SKILLS
Python, SQL, Git, HTML, CSS, JavaScript basics, Microsoft Office

LANGUAGES
Arabic (native), French (fluent), English (intermediate)`

const STATS = [
  { number: "306,000", label: "Students in Tunisia", color: COLORS.teal },
  { number: "~40%", label: "Youth Unemployment", color: COLORS.danger },
  { number: "80", label: "Jobs Indexed", color: COLORS.success },
]

const TABS = ["🔍 ATS Report", "💼 Job Matches", "📊 Gap Analysis", "📅 Action Plan"]

export default function JadaraApp() {
  const { view, result, nodes, progress, xpTotal, analyze, completeTaskAction, reset, triggerEmail } = useAgent()

  const [tier, setTier] = useState<"free" | "premium">("premium")
  const [cvText, setCvText] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [city, setCity] = useState("Tunis")
  const [level, setLevel] = useState("Entry Level")
  const [email, setEmail] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false })

  const showToast = (msg: string) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000)
  }

  const handleAnalyze = () => {
    if (!cvText.trim()) return
    analyze({
      cv_text: cvText,
      job_preferences: { title: jobTitle || "Junior Developer", city, level, deadline_days: 21 },
      tier,
      additional_context: "",
      student_email: email,
    })
  }

  const handleApply = async (job: any) => {
    showToast("✉️ Generating application email...")
    await triggerEmail({
      cv_text: result?.cv_final || cvText,
      job,
      student_name: result?.student_profile?.name || "Candidate",
    })
    setActiveTab(4) // specific to Email tab
  }

  const handleTaskComplete = async (taskId: number, skillAdded?: string, xpValue: number = 75) => {
    const task = result?.task_plan?.find((t) => t.id === taskId)
    if (!task || !result) return

    const res = await completeTaskAction(taskId, skillAdded || task.skill_added, xpValue, result.cv_final || cvText)
    if (!res) return

    if (res.apply_ready && res.apply_ready_jobs?.length > 0) {
      const job = res.apply_ready_jobs[0]
      showToast(`🎯 You're ready to apply! ${job.company}: ${job.match_score}%`)
    } else {
      const improved = res.new_scores?.find((s: any) => s.delta > 0)
      if (improved) {
        showToast(`+${xpValue} XP! ${improved.company}: ${improved.old_score}% → ${improved.new_score}% ⬆️`)
      } else {
        showToast(`+${xpValue} XP! Task complete!`)
      }
    }
  }

  const handleSendEmail = async (job: any) => {
    if (!result?.student_profile || !email) {
      showToast("Please enter your email in the sidebar")
      return
    }
    try {
      await sendEmail({
        cv_text: result.cv_final,
        job,
        student_name: result.student_profile.name,
        student_email: email,
      })
      showToast(`✉️ Application sent to ${job.company}!`)
    } catch {
      showToast("Failed to send email — is n8n running?")
    }
  }

  const tabs = [...TABS]
  if (result?.application_email) tabs.push("✉️ Email")

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: COLORS.bg,
        color: COLORS.textPrimary,
        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        fontWeight: 300,
      }}
    >
      {/* TOAST */}
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.teal}`,
            borderRadius: 10,
            padding: "12px 20px",
            fontSize: 13,
            color: COLORS.teal,
            fontWeight: 400,
            boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
            pointerEvents: "none",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ─── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 320,
          minWidth: 320,
          backgroundColor: COLORS.surface,
          borderRight: `1px solid ${COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "28px 20px",
          gap: 16,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 4 }}>
          <h1
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 36,
              margin: 0,
              lineHeight: 1,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.success}, ${COLORS.gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            Jadara
          </h1>
          <p
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontSize: 13,
              color: COLORS.gold,
              margin: "4px 0 0",
              letterSpacing: "0.08em",
              opacity: 0.85,
            }}
          >
            جدارة · Your AI Career Agent
          </p>
        </div>

        {/* Tier selector */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["free", "premium"] as const).map((t) => {
            const isSelected = tier === t
            const isFree = t === "free"
            const borderColor = isFree ? COLORS.teal : COLORS.gold
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 100,
                  border: `1.5px solid ${isSelected ? borderColor : COLORS.border}`,
                  backgroundColor: isSelected
                    ? isFree
                      ? "rgba(78,205,196,0.08)"
                      : "rgba(255,230,109,0.07)"
                    : "transparent",
                  color: isSelected ? borderColor : COLORS.textMuted,
                  fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected && !isFree ? `0 0 14px 0 rgba(255,230,109,0.22)` : "none",
                }}
              >
                {isFree ? "Free" : "✦ Premium"}
              </button>
            )
          })}
        </div>

        {/* CV Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Paste Your CV
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV or resume text here..."
            style={{
              height: 160,
              resize: "none",
              backgroundColor: COLORS.bg,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 10,
              color: COLORS.textPrimary,
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 300,
              fontSize: 13,
              padding: "12px 14px",
              outline: "none",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Load Demo CV */}
        <button
          onClick={() => setCvText(DEMO_CV)}
          style={{
            background: "none",
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 6,
            color: COLORS.textMuted,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Load demo CV (Yassine Chaari)
        </button>

        {/* Target Role + City */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              Target Role
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Backend Dev"
              style={{
                backgroundColor: COLORS.bg,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.textPrimary,
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontWeight: 300,
                fontSize: 13,
                padding: "9px 12px",
                outline: "none",
                width: "100%",
              }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                backgroundColor: COLORS.bg,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.textPrimary,
                fontSize: 13,
                padding: "9px 12px",
                outline: "none",
                cursor: "pointer",
                width: "100%",
                appearance: "none",
              }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: COLORS.surface }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Your Email (for applications)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{
              backgroundColor: COLORS.bg,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.textPrimary,
              fontSize: 13,
              padding: "9px 12px",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Analyze CTA */}
        <button
          onClick={handleAnalyze}
          disabled={!cvText.trim() || view === "analyzing"}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 10,
            border: "none",
            backgroundColor: COLORS.teal,
            color: "#080B14",
            fontFamily: "var(--font-syne, 'Syne', sans-serif)",
            fontWeight: 800,
            fontSize: 15,
            cursor: cvText.trim() ? "pointer" : "not-allowed",
            opacity: cvText.trim() ? 1 : 0.5,
            letterSpacing: "0.02em",
            boxShadow: `0 0 12px 0 rgba(78,205,196,0.2)`,
          }}
        >
          {view === "analyzing" ? "Analyzing…" : "Analyze My Profile →"}
        </button>

        {view === "results" && (
          <button
            onClick={reset}
            style={{
              padding: "8px",
              borderRadius: 8,
              background: "none",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textMuted,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ↩ Start Over
          </button>
        )}
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto", minHeight: "100vh" }}>
        {/* HOME VIEW */}
        {view === "home" && (
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
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: COLORS.teal,
                    display: "inline-block",
                  }}
                />
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
                <span style={{ color: COLORS.textMuted }}> We&apos;re not.</span>
              </h2>
            </div>

            {/* Stats */}
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
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: stat.color,
                      opacity: 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                      fontWeight: 800,
                      fontSize: 30,
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.number}
                  </span>
                  <span style={{ fontSize: 14, color: COLORS.textPrimary, fontWeight: 400, lineHeight: 1.4 }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "32px 36px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontStyle: "italic",
                  color: COLORS.textPrimary,
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}
              >
                {'"600 applications. 1 interview. Then ghosted."'}
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, margin: "8px 0 16px" }}>— r/Tunisia, 2024</div>
              <div style={{ fontSize: 15, color: COLORS.teal, fontWeight: 400 }}>
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
              <span style={{ fontSize: 14, color: COLORS.textMuted, fontStyle: "italic" }}>
                Paste your CV to begin
              </span>
            </div>
          </div>
        )}

        {/* ANALYZING VIEW */}
        {view === "analyzing" && (
          <div style={{ maxWidth: 620 }}>
            <h2
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontWeight: 800,
                fontSize: 30,
                margin: "0 0 24px",
                color: COLORS.textPrimary,
              }}
            >
              Profile Analysis
            </h2>
            <AgentReasoning nodes={nodes} progress={progress} />
          </div>
        )}

        {/* ERROR VIEW */}
        {view === "error" && (
          <div
            style={{
              background: "rgba(248,81,73,0.1)",
              border: `1px solid ${COLORS.danger}`,
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
            }}
          >
            <h3 style={{ color: COLORS.danger, margin: "0 0 12px" }}>Analysis failed</h3>
            <p style={{ color: COLORS.textMuted, margin: "0 0 16px", lineHeight: 1.6 }}>
              Check that the Python backend is running:
              <br />
              <code style={{ color: COLORS.teal }}>uvicorn backend.main:app --reload --port 8000</code>
            </p>
            <button
              onClick={reset}
              style={{
                padding: "10px 20px",
                background: COLORS.danger,
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === "results" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 820 }}>
            {/* Header */}
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
                {jobTitle ? `${level} · ${jobTitle}` : level}
                {city !== "Any" ? ` · ${city}` : ""}
              </p>
            </div>

            {/* Metrics row */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "ATS Score", val: `${result.ats_result?.total ?? 0}/100`, color: COLORS.teal },
                { label: "Status", val: result.ats_result?.label ?? "—", color: COLORS.warning },
                { label: "Jobs Found", val: String(result.job_matches?.length ?? 0), color: COLORS.success },
                {
                  label: "Top Match",
                  val: `${result.job_matches?.[0]?.match_score ?? 0}%`,
                  color: COLORS.gold,
                },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                      color,
                      fontSize: "1.4rem",
                      fontWeight: 800,
                    }}
                  >
                    {val}
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: "0.78rem" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                borderBottom: `1px solid ${COLORS.border}`,
                paddingBottom: 0,
              }}
            >
              {tabs.map((tab, i) => {
                const isActive = activeTab === i
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
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
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div>
              {/* ATS Tab */}
              {activeTab === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <ATSGauge
                    score={result.ats_result?.total ?? 0}
                    label={result.ats_result?.label ?? "—"}
                    breakdown={result.ats_result.breakdown || {
                      keyword_match: { score: 0, feedback: "" },
                      keyword_placement: { score: 0, feedback: "" },
                      sections: { score: 0, feedback: "" },
                      experience: { score: 0, feedback: "" },
                      formatting: { score: 0, feedback: "" },
                    }}
                  />
                  {result.ats_corrections?.length > 0 && (
                    <div
                      style={{
                        backgroundColor: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 14,
                        padding: 24,
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
                        Suggested Corrections
                      </h3>
                      {result.ats_corrections.map((c: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            padding: "10px 14px",
                            backgroundColor: COLORS.bg,
                            borderRadius: 8,
                            borderLeft: `3px solid ${COLORS.teal}`,
                            fontSize: 13.5,
                            color: COLORS.textPrimary,
                            fontWeight: 300,
                            lineHeight: 1.6,
                          }}
                        >
                          ⚡ {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Jobs Tab */}
              {activeTab === 1 && (
                <JobMatchesPanel
                  jobs={result.job_matches?.map((j: any) => ({
                    title: j.title,
                    company: j.company,
                    city: j.city,
                    salary_range_tnd: j.salary_range_tnd || "—",
                    match_score: j.match_score,
                    required_skills: j.required_skills || "",
                  }))}
                  onApply={handleApply}
                />
              )}

              {/* Gap Analysis Tab */}
              {activeTab === 2 && (
                <SkillGapPanel
                  gaps={result.gap_report?.prioritized_gaps ?? []}
                  currentMatchPct={result.job_matches?.[0]?.match_score ?? 50}
                />
              )}

              {/* Quest Board Tab */}
              {activeTab === 3 && (
                <QuestChecklist
                  tasks={result.task_plan ?? []}
                  xp_total={xpTotal}
                  deadline_days={21}
                  onTaskComplete={handleTaskComplete}
                />
              )}

              {/* Email Tab */}
              {activeTab === 4 && result.application_email && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                      fontWeight: 800,
                      fontSize: 18,
                      color: COLORS.teal,
                    }}
                  >
                    Generated Application Email
                  </h3>
                  <pre
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                      padding: 24,
                      whiteSpace: "pre-wrap",
                      fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                      lineHeight: 1.7,
                      color: COLORS.textPrimary,
                      fontSize: "0.9rem",
                      fontWeight: 300,
                    }}
                  >
                    {result.application_email}
                  </pre>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.application_email)
                        showToast("📋 Email copied to clipboard!")
                      }}
                      style={{
                        padding: "12px 24px",
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 8,
                        color: COLORS.textPrimary,
                        cursor: "pointer",
                        fontWeight: 400,
                        fontSize: 13,
                      }}
                    >
                      📋 Copy Email
                    </button>
                    {result.job_matches?.[0] && (
                      <button
                        onClick={() => handleSendEmail(result.job_matches[0])}
                        style={{
                          padding: "12px 24px",
                          background: COLORS.teal,
                          border: "none",
                          borderRadius: 8,
                          color: "#080B14",
                          cursor: "pointer",
                          fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        Send via n8n →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
