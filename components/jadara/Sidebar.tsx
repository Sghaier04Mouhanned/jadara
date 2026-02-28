"use client"

import { useState } from "react"
import type React from "react"

const COLORS = {
  bg: "#080B14",
  surface: "#0D1117",
  surfaceHover: "#111827",
  border: "#1E2533",
  teal: "#4ECDC4",
  gold: "#FFE66D",
  textPrimary: "#E8E8E8",
  textMuted: "#6B7A8D",
}

const CITIES = ["Any", "Tunis", "Sfax", "Sousse", "Monastir", "Bizerte"]
const LEVELS = ["Entry Level", "Mid Level", "Senior"]

interface SidebarProps {
  tier: "free" | "premium"
  setTier: (t: "free" | "premium") => void
  cv: string
  setCv: (v: string) => void
  role: string
  setRole: (v: string) => void
  city: string
  setCity: (v: string) => void
  level: string
  setLevel: (v: string) => void
  onAnalyze: () => void
}

export default function Sidebar({
  tier,
  setTier,
  cv,
  setCv,
  role,
  setRole,
  city,
  setCity,
  level,
  setLevel,
  onAnalyze,
}: SidebarProps) {
  const [cvFocused, setCvFocused] = useState(false)
  const [roleFocused, setRoleFocused] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <aside
      style={{
        width: 320,
        minWidth: 320,
        backgroundColor: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "28px 24px",
        gap: 24,
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
            background: `linear-gradient(90deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
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
          جدارة
        </p>
      </div>

      {/* Tier Selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        {(["free", "premium"] as const).map((t) => {
          const isSelected = tier === t
          const isFree = t === "free"
          const borderColor = isFree ? COLORS.teal : COLORS.gold
          const glowColor = isFree ? "rgba(78,205,196,0.18)" : "rgba(255,230,109,0.22)"

          return (
            <button
              key={t}
              onClick={() => setTier(t)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 100,
                border: `1.5px solid ${isSelected ? borderColor : COLORS.border}`,
                backgroundColor: isSelected ? (isFree ? "rgba(78,205,196,0.08)" : "rgba(255,230,109,0.07)") : "transparent",
                color: isSelected ? borderColor : COLORS.textMuted,
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                transition: "all 0.2s ease",
                boxShadow: isSelected && !isFree ? `0 0 14px 0 ${glowColor}` : "none",
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
          value={cv}
          onChange={(e) => setCv(e.target.value)}
          onFocus={() => setCvFocused(true)}
          onBlur={() => setCvFocused(false)}
          placeholder="Paste your CV or resume text here..."
          rows={7}
          style={{
            height: 180,
            resize: "none",
            backgroundColor: COLORS.bg,
            border: `1.5px solid ${cvFocused ? COLORS.teal : COLORS.border}`,
            borderRadius: 10,
            color: COLORS.textPrimary,
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontWeight: 300,
            fontSize: 13,
            padding: "12px 14px",
            outline: "none",
            lineHeight: 1.6,
            transition: "border-color 0.2s ease",
            boxShadow: cvFocused ? `0 0 0 3px rgba(78,205,196,0.1)` : "none",
          }}
        />
      </div>

      {/* Role + City */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Target Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onFocus={() => setRoleFocused(true)}
            onBlur={() => setRoleFocused(false)}
            placeholder="e.g. Frontend Dev"
            style={{
              backgroundColor: COLORS.bg,
              border: `1.5px solid ${roleFocused ? COLORS.teal : COLORS.border}`,
              borderRadius: 8,
              color: COLORS.textPrimary,
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 300,
              fontSize: 13,
              padding: "9px 12px",
              outline: "none",
              transition: "border-color 0.2s ease",
              boxShadow: roleFocused ? `0 0 0 3px rgba(78,205,196,0.1)` : "none",
              width: "100%",
            }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
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
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 300,
              fontSize: 13,
              padding: "9px 12px",
              outline: "none",
              cursor: "pointer",
              width: "100%",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7A8D' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
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

      {/* Level */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Level
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
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
            cursor: "pointer",
            width: "100%",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7A8D' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l} style={{ backgroundColor: COLORS.surface }}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Analyze CTA */}
      <button
        onClick={onAnalyze}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
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
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 0.2s ease",
          boxShadow: hovering
            ? `0 0 24px 0 rgba(78,205,196,0.45), 0 4px 16px rgba(78,205,196,0.2)`
            : `0 0 12px 0 rgba(78,205,196,0.2)`,
          transform: hovering ? "translateY(-1px)" : "translateY(0)",
        }}
      >
        Analyze My Profile →
      </button>
    </aside>
  )
}
