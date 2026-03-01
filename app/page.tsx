import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070C14] text-[#E8EDF5] overflow-x-hidden relative">
      {/* SECTION 1 — Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7,12,20,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #1C2A3A",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo SVG fallback in case image not ready, but we use image if available per instruction. We'll use the raw <img> tag since Image requires width/height. */}
          <img src="/fynd-logo.png" alt="Fynd.tn" style={{ height: 36 }} />
        </div>

        <div style={{ display: "flex", gap: "32px", fontSize: "0.95rem" }} className="text-[#5A7A9A]">
          <a href="#features" className="hover:text-[#4ECDC4] transition-colors duration-200">Features</a>
          <a href="#process" className="hover:text-[#4ECDC4] transition-colors duration-200">How It Works</a>
          <a href="#pricing" className="hover:text-[#4ECDC4] transition-colors duration-200">Pricing</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/app"
            style={{
              color: "#4ECDC4",
              background: "transparent",
              border: "1px solid transparent",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "border 0.2s",
            }}
            className="hover:border-[#4ECDC4] text-sm font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            style={{
              background: "#4ECDC4",
              color: "#070C14",
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              padding: "10px 24px",
              borderRadius: "99px",
              transition: "box-shadow 0.2s",
            }}
            className="hover:shadow-[0_0_20px_rgba(78,205,196,0.25)] text-sm"
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* SECTION 2 — Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "80px",
          position: "relative",
          paddingLeft: "48px",
          paddingRight: "48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(ellipse at 30% 50%, rgba(78,205,196,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(30,58,95,0.3) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between relative z-10">
          {/* Left Column (55%) */}
          <div style={{ width: "55%", paddingRight: "40px" }}>
            <div
              style={{
                display: "inline-flex",
                background: "rgba(78,205,196,0.08)",
                border: "1px solid rgba(78,205,196,0.3)",
                color: "#4ECDC4",
                fontSize: "12px",
                borderRadius: "99px",
                padding: "6px 16px",
                fontWeight: 500,
                marginBottom: "24px",
                alignItems: "center",
                gap: "8px"
              }}
            >
              ↑ Built for Tunisian Students · Powered by AI
            </div>

            <h1
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "3.8rem",
                lineHeight: 1.1,
                letterSpacing: "-2px",
                marginBottom: "24px",
              }}
            >
              <div style={{ color: "#E8EDF5" }}>Find Your Path.</div>
              <div
                style={{
                  background: "linear-gradient(135deg, #4ECDC4 0%, #2E9E96 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Close the Gap.
              </div>
            </h1>

            <p
              style={{
                fontWeight: 300,
                fontSize: "1.05rem",
                color: "#A8B8CC",
                maxWidth: "460px",
                lineHeight: 1.75,
                marginBottom: "28px"
              }}
            >
              Fynd analyzes your CV, finds your exact skill gaps, builds your
              personalized action plan, and applies automatically the moment
              you&apos;re competitive.
              <br /><br />
              The feedback the Tunisian market refuses to give — finally available.
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
              <div style={{ background: "#0C1220", border: "1px solid #1C2A3A", color: "#A8B8CC", fontSize: "14px", padding: "8px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📊</span> 306,000 students
              </div>
              <div style={{ background: "#0C1220", border: "1px solid #1C2A3A", color: "#A8B8CC", fontSize: "14px", padding: "8px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚡</span> ~40% youth unemployment
              </div>
            </div>

            <div
              style={{
                borderLeft: "3px solid #4ECDC4",
                paddingLeft: "16px",
                fontStyle: "italic",
                fontWeight: 300,
                color: "#5A7A9A",
                marginTop: "28px",
                marginBottom: "36px"
              }}
            >
              &quot;600 applications. 1 interview. Then ghosted.&quot;
              <br />
              — r/Tunisia, 2024
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "36px", marginBottom: "24px" }}>
              <Link href="/app"
                style={{
                  height: "52px",
                  background: "#4ECDC4",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  color: "#070C14",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 32px",
                  boxShadow: "0 8px 32px rgba(78,205,196,0.3)",
                  transition: "transform 0.2s"
                }}
                className="hover:-translate-y-[2px]"
              >
                Get Started Free →
              </Link>
              <button
                style={{
                  height: "52px",
                  background: "transparent",
                  border: "1px solid #2E9E96",
                  color: "#A8B8CC",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 32px",
                  transition: "color 0.2s"
                }}
                className="hover:text-[#4ECDC4]"
              >
                ▶ Watch How It Works
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", color: "#5A7A9A", marginTop: "24px" }}>
              <span>✓ LangGraph Agent</span>
              <span>·</span>
              <span>✓ Tunisian Job Database</span>
              <span>·</span>
              <span>✓ Auto-Apply via Gmail</span>
            </div>
          </div>

          {/* Right Column (45%) */}
          <div style={{ width: "45%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              background: "rgba(78,205,196,0.08)", color: "#4ECDC4", fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 600, fontSize: "13px", padding: "6px 14px", borderRadius: "20px", marginBottom: "16px"
            }}>
              ↓ This is what your CV looks like to ATS systems
            </div>

            <div style={{
              width: "480px",
              background: "#0C1220",
              borderRadius: "16px",
              border: "1px solid #1C2A3A",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
              padding: "24px",
              position: "relative",
              zIndex: 10
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 500 }}>Profile Analysis</span>
                <span style={{ color: "#A8B8CC", fontSize: "14px" }}>Entry Level</span>
              </div>
              <div style={{ color: "#5A7A9A", fontSize: "14px", marginBottom: "32px" }}>Backend dev · Tunis</div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "4px solid #FFA500", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "24px", color: "#FFA500" }}>52</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "18px", color: "#FFA500" }}>At Risk</div>
                  <div style={{ color: "#5A7A9A", fontSize: "13px" }}>ATS Score · Out of 100</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "monospace", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E8EDF5" }}>
                  <span>Keyword Match</span>
                  <span style={{ color: "#FFA500" }}>████░░░░░░░░ <span style={{ color: "#5A7A9A", marginLeft: "12px" }}>13 pts</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E8EDF5" }}>
                  <span>Placement</span>
                  <span style={{ color: "#44CF6C" }}>██████░░░░░░ <span style={{ color: "#5A7A9A", marginLeft: "12px" }}> 6 pts</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E8EDF5" }}>
                  <span>Sections</span>
                  <span style={{ color: "#44CF6C" }}>██████░░░░░░ <span style={{ color: "#5A7A9A", marginLeft: "12px" }}> 6 pts</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E8EDF5" }}>
                  <span>Experience</span>
                  <span style={{ color: "#F85149" }}>█████░░░░░░░ <span style={{ color: "#5A7A9A", marginLeft: "12px" }}> 3 pts</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E8EDF5" }}>
                  <span>Formatting</span>
                  <span style={{ color: "#F85149" }}>█████░░░░░░░ <span style={{ color: "#5A7A9A", marginLeft: "12px" }}> 3 pts</span></span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <div style={{ border: "1px solid #44CF6C", color: "#A8B8CC", padding: "4px 12px", borderRadius: "99px", fontSize: "13px" }}>Vermeg <span style={{ color: "#44CF6C", fontWeight: 500 }}>91% ✓</span></div>
              <div style={{ border: "1px solid #FFA500", color: "#A8B8CC", padding: "4px 12px", borderRadius: "99px", fontSize: "13px" }}>Talan <span style={{ color: "#FFA500", fontWeight: 500 }}>73%</span></div>
              <div style={{ border: "1px solid #F85149", color: "#A8B8CC", padding: "4px 12px", borderRadius: "99px", fontSize: "13px" }}>Orange TN <span style={{ color: "#F85149", fontWeight: 500 }}>45%</span></div>
            </div>

            {/* Geometric arrow SVG decorative element */}
            <svg style={{ position: "absolute", top: -40, right: -40, opacity: 0.06, transform: "rotate(15deg)", zIndex: 0, width: "300px", height: "300px" }} viewBox="0 0 32 32">
              <polygon points="14,2 28,2 28,16 22,10 14,18 10,14 18,6" fill="#4ECDC4" />
              <polygon points="14,2 28,2 22,8" fill="#2E9E96" />
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Stats Strip */}
      <section style={{ backgroundColor: "#0C1220", borderTop: "1px solid #1C2A3A", borderBottom: "1px solid #1C2A3A", padding: "40px" }}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center text-center">
          <div style={{ flex: 1, borderRight: "1px solid #1C2A3A", padding: "0 20px" }}>
            <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#4ECDC4" }}>306,000</div>
            <div style={{ color: "#5A7A9A", fontSize: "0.85rem" }}>Students across<br />286 institutions</div>
          </div>
          <div style={{ flex: 1, borderRight: "1px solid #1C2A3A", padding: "0 20px" }}>
            <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#4ECDC4" }}>~40%</div>
            <div style={{ color: "#5A7A9A", fontSize: "0.85rem" }}>Youth<br />Unemployed</div>
          </div>
          <div style={{ flex: 1, borderRight: "1px solid #1C2A3A", padding: "0 20px" }}>
            <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#4ECDC4" }}>80+</div>
            <div style={{ color: "#5A7A9A", fontSize: "0.85rem" }}>Tunisian<br />Companies</div>
          </div>
          <div style={{ flex: 1, padding: "0 20px" }}>
            <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#4ECDC4" }}>Fynd.tn</div>
            <div style={{ color: "#5A7A9A", fontSize: "0.85rem" }}>Your Guided<br />Path.</div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Bento Feature Grid */}
      <section id="features" style={{ padding: "120px 48px" }} className="max-w-[1200px] mx-auto">
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ color: "#4ECDC4", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Everything You Need</div>
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#E8EDF5", lineHeight: 1.2 }}>
            Your Entire Career Journey<br />In One Intelligent Agent.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: "16px" }}>
          {/* Cell 1 (row-span-2) */}
          <div className="hover:border-[#2E9E96] hover:shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all duration-200" style={{ background: "#0C1220", border: "1px solid #1C2A3A", padding: "28px", borderRadius: "14px", gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: "48px", height: "48px", background: "rgba(78,205,196,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "20px" }}>🔍</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "12px", color: "#E8EDF5" }}>CV Scored Like a Machine</h3>
              <p style={{ color: "#A8B8CC", fontSize: "15px", lineHeight: 1.6 }}>Fynd simulates how ATS systems actually read your profile. 5-component breakdown: keywords, placement, sections, experience validation, formatting. Score 0–100.</p>
            </div>
            <div style={{ marginTop: "40px", padding: "16px", background: "#070C14", border: "1px solid #1C2A3A", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#FFE66D" }}>67<span style={{ fontSize: "1rem", color: "#5A7A9A" }}>/100</span></div>
                <div style={{ background: "rgba(255,230,109,0.1)", color: "#FFE66D", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>Optimizable</div>
              </div>
            </div>
          </div>

          {/* Cell 2 */}
          <div className="hover:border-[#2E9E96] hover:shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all duration-200" style={{ background: "#0C1220", border: "1px solid #1C2A3A", padding: "28px", borderRadius: "14px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>🎯</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px", color: "#E8EDF5" }}>Matched to Real Tunisian Jobs</h3>
            <p style={{ color: "#A8B8CC", fontSize: "14px", lineHeight: 1.6 }}>Semantic search over 80+ local postings. Not keywords — understanding what you offer and what companies actually need.</p>
          </div>

          {/* Cell 3 */}
          <div className="hover:border-[#2E9E96] hover:shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all duration-200" style={{ background: "#0C1220", border: "1px solid #1C2A3A", padding: "28px", borderRadius: "14px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>📊</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px", color: "#E8EDF5" }}>Brutal Honesty. Finally.</h3>
            <p style={{ color: "#A8B8CC", fontSize: "14px", lineHeight: 1.6 }}>&quot;Docker appears in 73% of backend postings in Tunis. Here is the fastest free path to close this gap. This single skill unlocks 4 more companies.&quot;</p>
          </div>

          {/* Cell 4 */}
          <div className="hover:border-[#2E9E96] hover:shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all duration-200" style={{ background: "#0C1220", border: "1px solid #1C2A3A", padding: "28px", borderRadius: "14px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>✉️</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "12px", color: "#E8EDF5" }}>إكبس — One Click to Apply</h3>
            <p style={{ color: "#A8B8CC", fontSize: "14px", lineHeight: 1.6 }}>When your score hits 85%, Fynd generates a personalized French application email and sends it automatically via Gmail. You just confirm.</p>
          </div>

          {/* Cell 5 (row-span-2, moved up via layout flow or grid positioning) */}
          <div className="hover:border-[#2E9E96] hover:shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all duration-200" style={{ background: "#0C1220", border: "1px solid #1C2A3A", padding: "28px", borderRadius: "14px", gridRow: "span 2", gridColumn: 3, gridRowStart: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "24px", marginBottom: "20px" }}>📬</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginBottom: "12px", color: "#E8EDF5" }}>Track Every Application</h3>
              <p style={{ color: "#A8B8CC", fontSize: "15px", lineHeight: 1.6 }}>Every sent email logged automatically. Status updates, follow-up reminders, interview tracking.</p>
            </div>
            <div style={{ marginTop: "40px", padding: "0", background: "#070C14", border: "1px solid #1C2A3A", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1C2A3A", borderLeft: "3px solid #44CF6C" }}>
                <div style={{ fontSize: "13px", color: "#E8EDF5", fontWeight: 500 }}><span style={{ color: "#44CF6C", marginRight: "6px" }}>●</span> Vermeg · Frontend Dev</div>
                <div style={{ fontSize: "12px", color: "#5A7A9A", marginLeft: "14px" }}>Applied · Mar 1 · 91% · ✓</div>
              </div>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1C2A3A", borderLeft: "3px solid #FFA500" }}>
                <div style={{ fontSize: "13px", color: "#E8EDF5", fontWeight: 500 }}><span style={{ color: "#FFA500", marginRight: "6px" }}>●</span> Talan · Backend Dev</div>
                <div style={{ fontSize: "12px", color: "#5A7A9A", marginLeft: "14px" }}>Awaiting Response · 78%</div>
              </div>
              <div style={{ padding: "12px 16px", borderLeft: "3px solid #F85149" }}>
                <div style={{ fontSize: "13px", color: "#E8EDF5", fontWeight: 500 }}><span style={{ color: "#F85149", marginRight: "6px" }}>●</span> Orange TN · DevOps</div>
                <div style={{ fontSize: "12px", color: "#5A7A9A", marginLeft: "14px" }}>Follow-up Due · 62%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — How It Works */}
      <section id="process" style={{ padding: "80px 48px", background: "#0C1220", borderTop: "1px solid #1C2A3A" }}>
        <div className="max-w-[1200px] mx-auto">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{ color: "#4ECDC4", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>The Process</div>
            <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#E8EDF5", lineHeight: 1.2 }}>
              From CV to Competitive<br />in 3 Guided Steps.
            </h2>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: "24px", left: "100px", right: "100px", borderTop: "1px dashed #1C2A3A", zIndex: 0 }}></div>

            <div style={{ width: "30%", textAlign: "center", position: "relative", zIndex: 10, background: "#0C1220", padding: "0 20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #4ECDC4", background: "#070C14", color: "#4ECDC4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "18px", margin: "0 auto 24px" }}>01</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 600, fontSize: "1.2rem", color: "#E8EDF5", marginBottom: "16px" }}>Paste Your CV</h3>
              <p style={{ color: "#5A7A9A", fontSize: "14px", lineHeight: 1.6 }}>Fynd reads your profile, scores it against ATS criteria, finds matching Tunisian opportunities, and maps your position in the local market.</p>
            </div>

            <div style={{ width: "30%", textAlign: "center", position: "relative", zIndex: 10, background: "#0C1220", padding: "0 20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #4ECDC4", background: "#070C14", color: "#4ECDC4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "18px", margin: "0 auto 24px" }}>02</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 600, fontSize: "1.2rem", color: "#E8EDF5", marginBottom: "16px" }}>Close Your Gaps</h3>
              <p style={{ color: "#5A7A9A", fontSize: "14px", lineHeight: 1.6 }}>See exactly what the market wants that you don&apos;t have yet. Ranked by impact. Fastest path provided. Market data confirmed.</p>
            </div>

            <div style={{ width: "30%", textAlign: "center", position: "relative", zIndex: 10, background: "#0C1220", padding: "0 20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #4ECDC4", background: "#070C14", color: "#4ECDC4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "18px", margin: "0 auto 24px" }}>03</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 600, fontSize: "1.2rem", color: "#E8EDF5", marginBottom: "16px" }}>إكبس</h3>
              <p style={{ color: "#5A7A9A", fontSize: "14px", lineHeight: 1.6 }}>Your tasks are done. Your score hit 85%. One click sends a personalized email. You&apos;re hired.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Tier Comparison */}
      <section id="pricing" style={{ padding: "120px 48px", borderTop: "1px solid #1C2A3A" }}>
        <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.8rem", color: "#E8EDF5", textAlign: "center", marginBottom: "80px" }}>Choose Your Path</h2>

        <div className="max-w-[1000px] mx-auto flex gap: 32px" style={{ gap: "32px", alignItems: "center", justifyContent: "center" }}>
          {/* Free Card */}
          <div style={{ width: "45%", background: "#0C1220", border: "1px solid #1C2A3A", borderRadius: "16px", padding: "40px", position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", color: "#A8B8CC", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", display: "inline-block", marginBottom: "24px" }}>FREE</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#E8EDF5", marginBottom: "8px" }}>Scan & Apply</h3>
            <div style={{ color: "#A8B8CC", fontSize: "15px", marginBottom: "32px" }}>0 TND / month</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px", fontSize: "14px", color: "#A8B8CC" }}>
              <div><span style={{ color: "#44CF6C", marginRight: "12px" }}>✓</span> ATS score & corrections</div>
              <div><span style={{ color: "#44CF6C", marginRight: "12px" }}>✓</span> Job matching</div>
              <div><span style={{ color: "#44CF6C", marginRight: "12px" }}>✓</span> 85%+ auto-apply emails</div>
              <div style={{ color: "#5A7A9A" }}><span style={{ marginRight: "12px" }}>✗</span> Gap analysis</div>
              <div style={{ color: "#5A7A9A" }}><span style={{ marginRight: "12px" }}>✗</span> Action plan</div>
              <div style={{ color: "#5A7A9A" }}><span style={{ marginRight: "12px" }}>✗</span> CV auto-updates</div>
              <div style={{ color: "#5A7A9A" }}><span style={{ marginRight: "12px" }}>✗</span> Application tracker</div>
            </div>

            <Link href="/app" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "12px", border: "1px solid #4ECDC4", color: "#4ECDC4", fontWeight: 600, transition: "all 0.2s" }} className="hover:bg-[#4ECDC4] hover:text-[#070C14]">
              Start Free →
            </Link>
          </div>

          {/* Premium Card */}
          <div style={{ width: "55%", background: "#0C1220", border: "1px solid #FFE66D", borderRadius: "16px", padding: "48px", position: "relative", boxShadow: "0 0 40px rgba(255,230,109,0.1)", transform: "scale(1.05)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #4ECDC4, #FFE66D)", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}></div>

            <div style={{ background: "rgba(255,230,109,0.15)", color: "#FFE66D", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", display: "inline-block", marginBottom: "24px" }}>COMING SOON ⭐</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#E8EDF5", marginBottom: "8px" }}>Build & Become</h3>
            <div style={{ color: "#5A7A9A", fontSize: "15px", marginBottom: "32px", fontStyle: "italic" }}>Soon</div>

            <div style={{ marginBottom: "24px", color: "#E8EDF5", fontSize: "15px", fontWeight: 500 }}>Everything in Free, plus:</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px", fontSize: "14px", color: "#A8B8CC" }}>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Deep gap prioritization</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Personalized action plan</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> CV auto-updates on completion</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Application tracker + follow-ups</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Interview prep questions</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Deadline-aware scheduling</div>
              <div><span style={{ color: "#FFE66D", marginRight: "12px" }}>✓</span> Agent self-critique loop</div>
            </div>

            <button style={{ display: "block", width: "100%", textAlign: "center", padding: "16px", borderRadius: "12px", background: "#FFE66D", color: "#070C14", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, transition: "box-shadow 0.2s" }} className="hover:shadow-[0_0_24px_rgba(255,230,109,0.3)]">
              Join Waitlist →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7 — The m3aref Reality Check */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ background: "#0C1220", border: "1px solid #1C2A3A", borderRadius: "24px", padding: "48px", maxWidth: "680px", margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", left: "20px", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "8rem", color: "#4ECDC4", opacity: 0.08, lineHeight: 1 }}>&quot;</div>

          <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <h4 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#5A7A9A", letterSpacing: "2px", marginBottom: "24px" }}>THE QUESTION EVERYONE ASKS:</h4>

            <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#E8EDF5", marginBottom: "32px", lineHeight: 1.4 }}>
              &quot;But doesn&apos;t nepotism<br />dominate hiring in Tunisia?&quot;
            </div>

            <div style={{ fontWeight: 300, fontSize: "1.05rem", color: "#A8B8CC", lineHeight: 1.8, marginBottom: "40px" }}>
              Yes. And that&apos;s exactly why students without connections<br />need a sharper competitive edge.
              <br /><br />
              Fynd gives them what nepotism gives connected students:<br />insider knowledge about what it actually takes to get hired.
            </div>

            <div style={{ width: "40px", height: "3px", background: "#4ECDC4", margin: "0 auto 24px" }}></div>

            <div style={{ color: "#E8EDF5", fontStyle: "italic", fontSize: "14px" }}>
              Your Guided Path to the Perfect Job.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA Banner */}
      <section style={{ background: "linear-gradient(135deg, rgba(78,205,196,0.06) 0%, rgba(30,58,95,0.15) 50%, rgba(255,230,109,0.04) 100%)", borderTop: "1px solid #1C2A3A", borderBottom: "1px solid #1C2A3A", padding: "100px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Large faint logo behind */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0.03, pointerEvents: "none" }}>
          <svg width="400" height="400" viewBox="0 0 32 32">
            <polygon points="14,2 28,2 28,16 22,10 14,18 10,14 18,6" fill="#4ECDC4" />
            <polygon points="14,2 28,2 22,8" fill="#2E9E96" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "3rem", color: "#E8EDF5", marginBottom: "16px", lineHeight: 1.1 }}>
            You&apos;ve done the work.<br />Now <span style={{ background: "linear-gradient(135deg, #4ECDC4 0%, #2E9E96 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>إكبس.</span>
          </h2>

          <p style={{ color: "#A8B8CC", fontSize: "1.1rem", fontWeight: 300, marginBottom: "48px", lineHeight: 1.6 }}>
            Paste your CV. Find your gaps. Close them.<br />Your guided path starts here.
          </p>

          <Link href="/app" style={{ display: "inline-block", background: "#4ECDC4", color: "#070C14", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "18px", padding: "18px 40px", borderRadius: "12px", boxShadow: "0 0 30px rgba(78,205,196,0.25)", transition: "transform 0.2s", marginBottom: "16px" }} className="hover:scale-105">
            Analyze My CV for Free →
          </Link>

          <div>
            <a href="#features" style={{ color: "#5A7A9A", fontSize: "12px", display: "inline-block", padding: "8px" }} className="hover:text-[#4ECDC4] transition-colors">or learn more ↓</a>
          </div>

          <div style={{ color: "#5A7A9A", fontSize: "13px", marginTop: "48px" }}>
            Built at INNOVARA Hackathon 2026 · Tunisia
          </div>
        </div>
      </section>

      {/* SECTION 9 — Footer */}
      <footer style={{ background: "#070C14", padding: "60px 48px 40px", borderTop: "1px solid #1C2A3A" }}>
        <div className="max-w-[1200px] mx-auto flex justify-between" style={{ marginBottom: "60px" }}>
          {/* Left */}
          <div style={{ width: "33%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "16px" }}>
              <img src="/fynd-logo.png" alt="Fynd.tn" style={{ height: 28 }} />
              <div className="fynd-logo-text" style={{ fontSize: "1.2rem", marginTop: "2px" }}>Fynd<span style={{ color: "#5A7A9A", fontSize: "14px", fontWeight: 400 }}>.tn</span></div>
            </div>
            <p style={{ color: "#5A7A9A", fontSize: "14px", fontWeight: 300, lineHeight: 1.6 }}>
              &quot;Your Guided Path to<br />the Perfect Job.&quot;
            </p>
          </div>

          {/* Center */}
          <div style={{ width: "33%", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ color: "#E8EDF5", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Features</div>
            <a href="#features" style={{ color: "#5A7A9A", fontSize: "14px", transition: "color 0.2s" }} className="hover:text-[#4ECDC4]">CV Analysis</a>
            <a href="#process" style={{ color: "#5A7A9A", fontSize: "14px", transition: "color 0.2s" }} className="hover:text-[#4ECDC4]">How It Works</a>
            <a href="#pricing" style={{ color: "#5A7A9A", fontSize: "14px", transition: "color 0.2s" }} className="hover:text-[#4ECDC4]">Pricing</a>
            <a href="#" style={{ color: "#5A7A9A", fontSize: "14px", transition: "color 0.2s" }} className="hover:text-[#4ECDC4]">Privacy Policy</a>
          </div>

          {/* Right */}
          <div style={{ width: "33%" }}>
            <div style={{ color: "#E8EDF5", fontWeight: 600, marginBottom: "16px", fontSize: "14px" }}>Partners</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#5A7A9A", fontSize: "14px", fontWeight: 500 }}>
              <div>SIROCCO</div>
              <div>JobInterview</div>
              <div>Secret</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1C2A3A", paddingTop: "24px", display: "flex", justifyContent: "space-between", color: "#5A7A9A", fontSize: "13px" }}>
          <div>© 2026 Fynd.tn — All rights reserved</div>
          <div>Built with ❤️ in Tunisia</div>
        </div>
      </footer>
    </div>
  );
}
