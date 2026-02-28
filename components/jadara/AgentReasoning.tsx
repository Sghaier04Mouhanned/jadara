"use client"

import { useEffect, useRef, useState } from "react"

const COLORS = {
  bg: "#080B14",
  surface: "#0D1117",
  border: "#1E2533",
  teal: "#4ECDC4",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
  success: "#44CF6C",
}

const NODE_LOGS: Record<string, string[]> = {
  "read-profile": [
    "[READ_PROFILE] Parsing CV structure...",
    "[READ_PROFILE] Extracting education sections...",
    "[READ_PROFILE] Found 3 work experiences.",
    "[READ_PROFILE] Identified 8 listed skills.",
  ],
  "ats-score": [
    "[ATS_SCORE] Loading ATS ruleset v2.4...",
    "[ATS_SCORE] Checking keyword density...",
    "[ATS_SCORE] Found 12 matching requirements.",
    "[ATS_SCORE] Calculating compatibility scores...",
  ],
  "market-search": [
    "[MARKET_SEARCH] Querying Tunisian job index...",
    "[MARKET_SEARCH] Retrieved 80 live postings.",
    "[MARKET_SEARCH] Cross-referencing skill demand...",
    "[MARKET_SEARCH] Top skill gaps identified: Docker, Agile.",
  ],
  "strategy": [
    "[STRATEGY] Evaluating profile tier...",
    "[STRATEGY] Comparing against market benchmarks...",
    "[STRATEGY] Selecting optimal application strategy.",
  ],
  "skill-gaps": [
    "[SKILL_GAPS] Analyzing missing competencies...",
    "[SKILL_GAPS] Critical gap: containerization.",
    "[SKILL_GAPS] Estimating upskilling timelines.",
  ],
  "action-plan": [
    "[ACTION_PLAN] Building 30-day sprint plan...",
    "[ACTION_PLAN] Assigning XP weights to tasks...",
    "[ACTION_PLAN] Action plan finalized.",
  ],
  "email": [
    "[EMAIL_GEN] Loading role context...",
    "[EMAIL_GEN] Generating cover letter draft...",
    "[EMAIL_GEN] Email ready for review.",
  ],
}

const DEFAULT_NODES = [
  { id: "read-profile",  label: "Reading your profile",            status: "pending" as const },
  { id: "ats-score",     label: "Scoring your CV against ATS",     status: "pending" as const },
  { id: "market-search", label: "Searching Tunisian job market",   status: "pending" as const },
  { id: "strategy",      label: "Determining your strategy",       status: "pending" as const },
  { id: "skill-gaps",    label: "Analyzing skill gaps",            status: "pending" as const },
  { id: "action-plan",   label: "Building your action plan",       status: "pending" as const },
  { id: "email",         label: "Generating your email",           status: "pending" as const },
]

export interface ReasoningNode {
  id: string
  label: string
  status: "pending" | "active" | "complete"
  timestamp?: string
}

export interface AgentReasoningProps {
  nodes?: ReasoningNode[]
  progress?: number
}

export default function AgentReasoning({ nodes: propNodes, progress: propProgress }: AgentReasoningProps) {
  // Self-demo mode if no controlled props
  const selfDemo = propNodes === undefined

  const [nodes, setNodes] = useState<ReasoningNode[]>(
    propNodes ?? DEFAULT_NODES.map((n) => ({ ...n }))
  )
  const [progress, setProgress] = useState(propProgress ?? 0)
  const [logs, setLogs] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeIndexRef = useRef(0)

  // Sync controlled props
  useEffect(() => {
    if (!selfDemo && propNodes) setNodes(propNodes)
  }, [selfDemo, propNodes])
  useEffect(() => {
    if (!selfDemo && propProgress !== undefined) setProgress(propProgress)
  }, [selfDemo, propProgress])

  // Self-demo: advance nodes every 1.5s
  useEffect(() => {
    if (!selfDemo) return

    const tick = () => {
      const idx = activeIndexRef.current
      if (idx >= DEFAULT_NODES.length) return

      setNodes((prev) => {
        const next = prev.map((n, i) => {
          if (i === idx) return { ...n, status: "active" as const }
          return n
        })
        return next
      })

      const nodeId = DEFAULT_NODES[idx].id
      const nodeLogs = NODE_LOGS[nodeId] ?? []

      let logIdx = 0
      const logInterval = setInterval(() => {
        if (logIdx >= nodeLogs.length) {
          clearInterval(logInterval)
          // Complete this node
          setNodes((prev) =>
            prev.map((n, i) => {
              if (i === idx)
                return {
                  ...n,
                  status: "complete" as const,
                  timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
                }
              return n
            })
          )
          setProgress(Math.round(((idx + 1) / DEFAULT_NODES.length) * 100))
          activeIndexRef.current = idx + 1
          demoRef.current = setTimeout(tick, 600)
          return
        }
        setLogs((prev) => [...prev.slice(-12), nodeLogs[logIdx]])
        logIdx++
      }, 380)
    }

    demoRef.current = setTimeout(tick, 400)
    return () => {
      if (demoRef.current) clearTimeout(demoRef.current)
    }
  }, [selfDemo])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  return (
    <div
      style={{
        backgroundColor: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "24px",
        fontFamily: "'DM Sans', var(--font-dm-sans, sans-serif)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 620,
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(78,205,196,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(78,205,196,0); }
        }
        @keyframes logFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Title row */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.teal,
              flexShrink: 0,
              animation: "blink 1s step-end infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontWeight: 800,
              fontSize: 13,
              color: COLORS.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Agent Reasoning
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: COLORS.textMuted,
            fontStyle: "italic",
            fontWeight: 300,
            paddingLeft: 16,
          }}
        >
          Jadara is analyzing your profile...
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            height: 6,
            borderRadius: 100,
            backgroundColor: COLORS.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 100,
              backgroundColor: COLORS.teal,
              width: `${progress}%`,
              transition: "width 0.5s ease",
              boxShadow: `0 0 10px rgba(78,205,196,0.5)`,
            }}
          />
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, fontFamily: "monospace" }}>
          {progress}%
        </div>
      </div>

      {/* Node list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {nodes.map((node) => (
          <NodeRow key={node.id} node={node} />
        ))}
      </div>

      {/* Log area */}
      <div
        ref={logRef}
        style={{
          height: 100,
          overflowY: "hidden",
          backgroundColor: "#020407",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontFamily: "monospace",
        }}
      >
        {logs.length === 0 ? (
          <span style={{ fontSize: 11, color: COLORS.textMuted, opacity: 0.5 }}>Waiting for agent...</span>
        ) : (
          logs.map((line, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                color: i === logs.length - 1 ? COLORS.teal : COLORS.textMuted,
                lineHeight: 1.5,
                animation: i === logs.length - 1 ? "logFadeIn 0.25s ease forwards" : "none",
                opacity: i === logs.length - 1 ? 1 : 0.55,
              }}
            >
              {line}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

function NodeRow({ node }: { node: ReasoningNode }) {
  const isActive = node.status === "active"
  const isDone = node.status === "complete"

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        borderRadius: 8,
        borderLeft: isActive ? `2px solid ${COLORS.teal}` : "2px solid transparent",
        backgroundColor: isActive ? "rgba(78,205,196,0.05)" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {/* Icon */}
      {isDone ? (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: COLORS.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 11,
            color: "#080B14",
            fontWeight: 800,
          }}
        >
          ✓
        </span>
      ) : isActive ? (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${COLORS.teal}`,
            backgroundColor: "rgba(78,205,196,0.15)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "nodeGlow 1.2s ease-in-out infinite",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: COLORS.teal,
            }}
          />
        </span>
      ) : (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${COLORS.border}`,
            flexShrink: 0,
          }}
        />
      )}

      {/* Label */}
      <span
        style={{
          flex: 1,
          fontSize: 13.5,
          fontWeight: 300,
          color: isDone ? COLORS.teal : isActive ? COLORS.textPrimary : COLORS.textMuted,
          fontFamily: "monospace",
          transition: "color 0.3s ease",
        }}
      >
        {node.label}
      </span>

      {/* Timestamp */}
      {isDone && node.timestamp && (
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "monospace", flexShrink: 0 }}>
          {node.timestamp}
        </span>
      )}
    </div>
  )
}
