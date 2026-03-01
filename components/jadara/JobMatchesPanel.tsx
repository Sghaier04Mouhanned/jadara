"use client"

import { useState } from "react"
import { useCountUp } from "@/hooks/use-count-up"

const COLORS = {
  surface: "#0D1117",
  border: "#1E2533",
  teal: "#4ECDC4",
  success: "#44CF6C",
  warning: "#FFA500",
  danger: "#F85149",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

export interface Job {
  title: string
  company: string
  city: string
  salary_range_tnd: string
  match_score: number
  required_skills: string
  alignment_reasoning?: string // NEW
}

const DEFAULT_JOBS: Job[] = [
  {
    title: "Full-Stack Engineer",
    company: "Vermeg",
    city: "Tunis",
    salary_range_tnd: "2,800 – 4,200 TND",
    match_score: 91,
    required_skills: "React;Node.js;PostgreSQL",
  },
  {
    title: "Frontend Developer",
    company: "Talan Tunisia",
    city: "Tunis",
    salary_range_tnd: "2,200 – 3,500 TND",
    match_score: 73,
    required_skills: "React;TypeScript;REST APIs",
  },
  {
    title: "Backend Developer",
    company: "Expensya",
    city: "Ariana",
    salary_range_tnd: "2,500 – 3,800 TND",
    match_score: 58,
    required_skills: "Java;Spring Boot;Docker",
  },
  {
    title: "DevOps Engineer",
    company: "Sofrecom Tunisia",
    city: "La Marsa",
    salary_range_tnd: "3,000 – 5,000 TND",
    match_score: 31,
    required_skills: "Kubernetes;Terraform;CI/CD",
  },
]

function scoreColor(score: number) {
  if (score >= 85) return COLORS.success
  if (score >= 50) return COLORS.warning
  return COLORS.danger
}

export interface JobMatchesPanelProps {
  jobs?: Job[]
  onApply?: (job: Job) => void
}

function AnimatedMatchScore({ score, color }: { score: number; color: string }) {
  const displayScore = useCountUp(score, 1200)

  return (
    <div
      style={{
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-syne, 'Syne', sans-serif)",
          fontWeight: 800,
          fontSize: "1.4rem",
          color,
          lineHeight: 1,
        }}
      >
        {displayScore}%
      </span>
      <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.05em" }}>Match</span>
    </div>
  )
}

export default function JobMatchesPanel({ jobs = DEFAULT_JOBS, onApply }: JobMatchesPanelProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const autoApply = jobs.filter((j) => j.match_score >= 85).length
  const withGaps = jobs.filter((j) => j.match_score >= 50 && j.match_score < 85).length
  const outOfReach = jobs.filter((j) => j.match_score < 50).length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 820 }}>
      {/* Summary bar */}
      <div
        style={{
          marginBottom: 16,
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 300,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span>
          Found <span style={{ color: COLORS.textPrimary, fontWeight: 400 }}>{jobs.length} matches</span>
        </span>
        <span style={{ opacity: 0.4 }}>—</span>
        <span style={{ color: COLORS.success }}>{autoApply} auto-apply ready</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span style={{ color: COLORS.warning }}>{withGaps} with gaps</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span style={{ color: COLORS.danger }}>{outOfReach} out of reach</span>
      </div>

      {/* Job cards */}
      {jobs.map((job, i) => {
        const color = scoreColor(job.match_score)
        const skillsString = job.required_skills || ""
        const skills = skillsString ? skillsString.split(";").map((s) => s.trim()) : []
        const isHovered = hovered === i

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              borderTop: `1px solid ${isHovered ? `${color}50` : COLORS.border}`,
              borderRight: `1px solid ${isHovered ? `${color}50` : COLORS.border}`,
              borderBottom: `1px solid ${isHovered ? `${color}50` : COLORS.border}`,
              borderLeft: `4px solid ${color}`,
              padding: "16px 20px",
              marginBottom: 12,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              transform: isHovered ? "translateY(-3px)" : "translateY(0)",
              boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px ${color}20` : "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              cursor: "default",
            }}
          >
            {/* Main content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Row 1: title + company */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: COLORS.textPrimary,
                    marginBottom: 3,
                  }}
                >
                  {job.title}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 300 }}>{job.company}</div>
              </div>

              {/* Row 2: city + salary pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[job.city, job.salary_range_tnd].map((val, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 11,
                      color: COLORS.textMuted,
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 6,
                      padding: "3px 10px",
                    }}
                  >
                    {val}
                  </span>
                ))}
              </div>

              {/* Row 3: skills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {skills.map((skill, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 11,
                      color: COLORS.teal,
                      backgroundColor: "rgba(78,205,196,0.08)",
                      border: `1px solid rgba(78,205,196,0.2)`,
                      borderRadius: 6,
                      padding: "3px 10px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Row 4: Reasoning (NEW) */}
              {job.alignment_reasoning && (
                <div
                  style={{
                    fontSize: 12,
                    color: COLORS.teal,
                    fontStyle: "italic",
                    backgroundColor: "rgba(78,205,196,0.03)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    borderLeft: `2px solid ${COLORS.teal}40`,
                    marginTop: 4
                  }}
                >
                  “{job.alignment_reasoning}”
                </div>
              )}
            </div>

            {/* Score badge + action */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
                minWidth: 80,
              }}
            >
              {/* Score badge */}
              <AnimatedMatchScore score={job.match_score} color={color} />

              {/* Action button */}
              {job.match_score >= 85 ? (
                <button
                  onClick={() => onApply?.(job)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: COLORS.teal,
                    color: "#080B14",
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                  }}
                >
                  Auto-Apply
                </button>
              ) : job.match_score >= 50 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <button
                    onClick={() => onApply?.(job)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 7,
                      border: `1px solid ${COLORS.warning}`,
                      backgroundColor: "transparent",
                      color: COLORS.warning,
                      fontSize: 11,
                      fontWeight: 400,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Apply Anyway
                  </button>
                  <button
                    style={{
                      padding: "5px 10px",
                      borderRadius: 7,
                      border: "none",
                      backgroundColor: "transparent",
                      color: COLORS.textMuted,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <button
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: `1px solid rgba(248,81,73,0.4)`,
                    backgroundColor: "transparent",
                    color: COLORS.danger,
                    fontSize: 11,
                    fontWeight: 300,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Req. →
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
