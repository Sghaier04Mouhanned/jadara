"use client"

import { useEffect, useRef, useState } from "react"

const COLORS = {
  surface: "#0D1117",
  border: "#1E2533",
  teal: "#4ECDC4",
  gold: "#FFE66D",
  success: "#44CF6C",
  danger: "#F85149",
  warning: "#FFA500",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

export interface QuestTask {
  id: number
  title: string
  description: string
  day: number
  xp: number
  blocking_level: string
  cost: string
  completed: boolean
  skill_added: string | null
}

export interface QuestChecklistProps {
  tasks?: QuestTask[]
  xp_total?: number
  deadline_days?: number
  onTaskComplete?: (taskId: number, skillAdded?: string | null, xpValue?: number) => void
}

const DEFAULT_TASKS: QuestTask[] = [
  {
    id: 1,
    title: "Add quantifiable achievements to CV",
    description: "Rewrite 3 bullet points with real numbers: percentages, time saved, users impacted.",
    day: 1,
    xp: 150,
    blocking_level: "Critical",
    cost: "Free",
    completed: false,
    skill_added: null,
  },
  {
    id: 2,
    title: "Complete Docker Getting Started tutorial",
    description: "Follow the official Docker tutorial and push a sample project to Docker Hub.",
    day: 3,
    xp: 200,
    blocking_level: "Critical",
    cost: "Free",
    completed: false,
    skill_added: "Docker",
  },
  {
    id: 3,
    title: "Update LinkedIn headline and summary",
    description: "Add your target role, key skills, and a clear value proposition.",
    day: 5,
    xp: 80,
    blocking_level: "Important",
    cost: "Free",
    completed: false,
    skill_added: null,
  },
  {
    id: 4,
    title: "Take Coursera Excel Skills course",
    description: "Complete the first two modules. Certificate adds credibility with SMEs.",
    day: 7,
    xp: 60,
    blocking_level: "Optional",
    cost: "Paid",
    completed: false,
    skill_added: "Excel",
  },
]

const LEVEL_NAMES = [
  { threshold: 0, name: "Applicant", next: "Contender", nextAt: 200 },
  { threshold: 200, name: "Contender", next: "Candidate", nextAt: 500 },
  { threshold: 500, name: "Candidate", next: "Shortlisted", nextAt: 800 },
  { threshold: 800, name: "Shortlisted", next: "Hired", nextAt: 1000 },
]

function getLevel(xp: number) {
  for (let i = LEVEL_NAMES.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_NAMES[i].threshold) return LEVEL_NAMES[i]
  }
  return LEVEL_NAMES[0]
}

export default function QuestChecklist({
  tasks: propTasks = DEFAULT_TASKS,
  xp_total: propXP = 200,
  deadline_days = 18,
  onTaskComplete,
}: QuestChecklistProps) {
  const [tasks, setTasks] = useState<QuestTask[]>(propTasks)
  const [xp, setXp] = useState(propXP)
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalDeadline = 30
  const criticalRemaining = tasks.filter((t) => t.blocking_level === "Critical" && !t.completed).length
  const allCriticalDone = criticalRemaining === 0

  const levelInfo = getLevel(xp)
  const xpInLevel = xp - levelInfo.threshold
  const xpToNext = levelInfo.nextAt - levelInfo.threshold
  const xpPct = Math.min(100, Math.round((xpInLevel / xpToNext) * 100))
  const nearMax = xpPct >= 90

  function handleToggle(task: QuestTask) {
    if (task.completed) return
    const newXP = xp + task.xp
    setXp(newXP)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)))
    onTaskComplete?.(task.id, task.skill_added, task.xp)

    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg: `+${task.xp} XP! Task complete!`, visible: true })
    toastTimer.current = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2000)
  }

  // Sync with prop changes (live agent data)
  useEffect(() => {
    setTasks(propTasks)
  }, [propTasks])

  useEffect(() => {
    setXp(propXP)
  }, [propXP])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820, position: "relative" }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastFadeOut {
          0%   { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes barPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(78,205,196,0.5); }
          50% { box-shadow: 0 0 12px 4px rgba(78,205,196,0.15); }
        }
      `}</style>

      {/* Toast */}
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            backgroundColor: "#0D1117",
            border: `1px solid ${COLORS.teal}`,
            borderRadius: 10,
            padding: "12px 20px",
            fontSize: 13,
            color: COLORS.teal,
            fontWeight: 400,
            boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
            animation: "toastFadeOut 2s ease forwards",
            pointerEvents: "none",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* XP Bar */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: "1.3rem",
              color: COLORS.teal,
              letterSpacing: "-0.3px",
            }}
          >
            {levelInfo.name}
          </span>
          <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: "monospace" }}>
            {xpInLevel} / {xpToNext} XP
          </span>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 100,
            backgroundColor: COLORS.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 100,
              background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.success})`,
              width: `${xpPct}%`,
              transition: "width 0.5s ease",
              animation: nearMax ? "barPulse 1.4s ease-in-out infinite" : "none",
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted }}>
          Next level: {levelInfo.next} — {xpToNext - xpInLevel} XP remaining
        </div>
      </div>

      {/* Deadline */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: COLORS.textPrimary, fontWeight: 400 }}>
            Job closes in{" "}
            <span style={{ color: COLORS.danger, fontFamily: "var(--font-syne, 'Syne', sans-serif)", fontWeight: 800 }}>
              {deadline_days} days
            </span>
          </span>
          <span style={{ color: COLORS.textMuted }}>{deadline_days}/{totalDeadline} days left</span>
        </div>
        <div
          style={{
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
              backgroundColor: COLORS.danger,
              width: `${(deadline_days / totalDeadline) * 100}%`,
              transition: "width 0.5s ease",
              boxShadow: `0 0 8px rgba(248,81,73,0.4)`,
            }}
          />
        </div>
        {criticalRemaining > 0 && (
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>
            Complete your Critical tasks first —{" "}
            <span style={{ color: COLORS.danger }}>{criticalRemaining} remaining</span>
          </div>
        )}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((task) => {
          const levelColor =
            task.blocking_level === "Critical"
              ? COLORS.danger
              : task.blocking_level === "Important"
                ? COLORS.warning
                : COLORS.teal

          return (
            <div
              key={task.id}
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderLeft: `3px solid ${task.completed ? COLORS.success : levelColor}`,
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                opacity: task.completed ? 0.65 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(task)}
                aria-label={task.completed ? "Task completed" : "Mark task complete"}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${task.completed ? COLORS.success : COLORS.teal}`,
                  backgroundColor: task.completed ? COLORS.success : "transparent",
                  flexShrink: 0,
                  cursor: task.completed ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  marginTop: 1,
                }}
              >
                {task.completed && (
                  <span style={{ fontSize: 12, color: "#080B14", fontWeight: 800, lineHeight: 1 }}>✓</span>
                )}
              </button>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: task.completed ? COLORS.textMuted : COLORS.textPrimary,
                    textDecoration: task.completed ? "line-through" : "none",
                    marginBottom: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  {task.title}
                </div>
                <div
                  onClick={() => {
                    if (!task.completed) onTaskComplete?.(task.id)
                  }}
                  style={{
                    fontSize: 12,
                    color: COLORS.textMuted,
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </div>
              </div>

              {/* Right badges */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: COLORS.textMuted,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 5,
                    padding: "2px 7px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Day {task.day}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: COLORS.teal,
                    backgroundColor: "rgba(78,205,196,0.08)",
                    border: `1px solid rgba(78,205,196,0.2)`,
                    borderRadius: 5,
                    padding: "2px 7px",
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  +{task.xp} XP
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: task.cost === "Free" ? COLORS.success : COLORS.warning,
                    backgroundColor:
                      task.cost === "Free" ? "rgba(68,207,108,0.08)" : "rgba(255,165,0,0.08)",
                    border: `1px solid ${task.cost === "Free" ? "rgba(68,207,108,0.2)" : "rgba(255,165,0,0.2)"}`,
                    borderRadius: 5,
                    padding: "2px 7px",
                  }}
                >
                  {task.cost}
                </span>
                {task.completed && (
                  <span style={{ fontSize: 10, color: COLORS.textMuted, opacity: 0.5 }}>completed</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Apply trigger — only when all critical done */}
      {allCriticalDone && (
        <div
          style={{
            backgroundColor: "rgba(255,230,109,0.06)",
            border: `1px solid rgba(255,230,109,0.35)`,
            borderRadius: 14,
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            animation: "slideUp 0.4s ease forwards",
            boxShadow: `0 0 32px rgba(255,230,109,0.08)`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 15,
              color: COLORS.gold,
            }}
          >
            You're ready. Your match score is now 83%.
          </div>
          <button
            style={{
              padding: "14px 0",
              borderRadius: 10,
              border: `1px solid ${COLORS.gold}`,
              backgroundColor: COLORS.gold,
              color: "#080B14",
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              letterSpacing: "0.02em",
              boxShadow: `0 0 20px rgba(255,230,109,0.25)`,
              transition: "all 0.2s ease",
            }}
          >
            Apply Now →
          </button>
        </div>
      )}
    </div>
  )
}
