import { useState, useEffect, useRef } from "react";
import API from "../services/api";

/* ── Animated canvas background ── */
function HexGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const HEX_R = 36, cols = Math.ceil(window.innerWidth / (HEX_R * 1.75)) + 2;
    const rows = Math.ceil(window.innerHeight / (HEX_R * 1.52)) + 2;

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c % 2 === 0 ? 0 : HEX_R * 0.87;
          const x = c * HEX_R * 1.75 - HEX_R;
          const y = r * HEX_R * 1.52 + ox - HEX_R;
          const wave = Math.sin(t + c * 0.4 + r * 0.3) * 0.5 + 0.5;
          const alpha = wave * 0.07 + 0.02;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + HEX_R * 0.9 * Math.cos(angle);
            const py = y + HEX_R * 0.9 * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          if (wave > 0.88) {
            ctx.fillStyle = `rgba(52,211,153,${alpha * 0.4})`;
            ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ── Floating orbs ── */
function Orbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
    </div>
  );
}

/* ── Feature card data ── */
const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Real-time Monitoring",
    desc: "Live bin fill-level data streamed from IoT sensors across the city grid.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "Route Optimization",
    desc: "Collection paths that cut fuel costs and reduce carbon emissions.",
  },
//   {
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
//       </svg>
//     ),
//     title: "Predictive Analytics",
//     desc: "Forecast overflow before it happens using historical patterns and ML models.",
//   },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: "Smart Alerts",
    desc: "Instant notifications when bins hit critical thresholds or sensors go offline.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Live Dashboard",
    desc: "Interactive maps, charts and heatmaps giving operators total situational awareness.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Arduino Integration",
    desc: "Plug-and-play with HC-SR04 ultrasonic sensors.",
  },
];

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

/* ── Main component ── */
const Landing = ({ setAuth }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        await API.post("/auth/register", { email, password });
        alert("Account created! Login now.");
        setIsSignup(false);
      } else {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setAuth(true);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Clash+Display:wght@500;600;700&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }

        /* Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: drift 18s ease-in-out infinite alternate;
        }
        .orb1 { width: 520px; height: 520px; background: radial-gradient(circle, #059669, transparent); top: -120px; left: -100px; animation-delay: 0s; }
        .orb2 { width: 380px; height: 380px; background: radial-gradient(circle, #34d399, transparent); bottom: 60px; right: -60px; animation-delay: -6s; }
        .orb3 { width: 260px; height: 260px; background: radial-gradient(circle, #065f46, transparent); top: 40%; left: 55%; animation-delay: -12s; }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(40px, 30px) scale(1.08); }
        }

        /* Hero entrance */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(52,211,153,0.15); }
          50% { border-color: rgba(52,211,153,0.35); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .hero-badge { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-h1 { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-sub { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .hero-cta { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .hero-stats { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .features-section { animation: fadeIn 1s ease 0.8s both; }

        .feat-card {
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          animation: borderPulse 4s ease infinite;
        }
        .feat-card:nth-child(2) { animation-delay: 0.7s; }
        .feat-card:nth-child(3) { animation-delay: 1.4s; }
        .feat-card:nth-child(4) { animation-delay: 2.1s; }
        .feat-card:nth-child(5) { animation-delay: 2.8s; }
        .feat-card:nth-child(6) { animation-delay: 3.5s; }
        .feat-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(52,211,153,0.4) !important;
          background: rgba(52,211,153,0.07) !important;
        }
        .cta-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(52,211,153,0.35) !important;
        }
        .cta-btn:active { transform: translateY(0); }
        .nav-login {
          transition: all 0.2s ease;
        }
        .nav-login:hover {
          background: rgba(52,211,153,0.15) !important;
          border-color: rgba(52,211,153,0.5) !important;
        }
        .modal-card { animation: modalIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        input::placeholder { color: rgba(240,253,244,0.22); }
        input:focus { outline: none; border-color: rgba(52,211,153,0.45) !important; box-shadow: 0 0 0 3px rgba(52,211,153,0.08) !important; }

        /* Shimmer text */
        .shimmer-text {
          background: linear-gradient(90deg, #34d399 0%, #a7f3d0 40%, #34d399 60%, #059669 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070d0b; }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.3); border-radius: 4px; }
      `}</style>

      {/* Root */}
      <div style={{
        minHeight: "100vh",
        background: "#070d0b",
        color: "#f0fdf4",
        fontFamily: "'IBM Plex Mono', monospace",
        position: "relative",
        overflowX: "hidden",
      }}>

        {/* Background layers */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 10% 20%, rgba(6,78,59,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 85% 75%, rgba(5,46,37,0.2) 0%, transparent 65%)
          `,
        }} />
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }} />
        <Orbs />
        <HexGrid />

        {/* ── NAVBAR ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          height: "64px",
          background: "rgba(7,13,11,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(52,211,153,0.08)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em", color: "#f0fdf4" }}>
              Smart<span style={{ color: "#34d399" }}>Waste</span>
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {["Features", "How It Works", "Docs"].map(l => (
              <a key={l} href="#" style={{
                color: "rgba(240,253,244,0.45)", fontSize: "12px",
                textDecoration: "none", letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "#34d399"}
                onMouseLeave={e => e.target.style.color = "rgba(240,253,244,0.45)"}
              >{l}</a>
            ))}
          </div>

          <button
            className="nav-login"
            onClick={() => { setIsSignup(false); setShowModal(true); }}
            style={{
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: "8px",
              color: "#34d399",
              padding: "8px 20px",
              fontSize: "12px",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >Sign In</button>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          position: "relative", zIndex: 10,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
        }}>

          {/* Status badge */}
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(52,211,153,0.07)",
            border: "1px solid rgba(52,211,153,0.18)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "32px",
            fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
            color: "#34d399",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#34d399",
              animation: "pulse2 2s infinite",
              flexShrink: 0,
            }} />
            System Online — v2.4.1
          </div>

          {/* Headline */}
          <h1 className="hero-h1" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "860px",
            marginBottom: "28px",
          }}>
            <span style={{ color: "#f0fdf4" }}>Smart Waste</span>
            <br />
            <span className="shimmer-text">Management System</span>
          </h1>

          {/* Subheading */}
          <p className="hero-sub" style={{
            color: "rgba(240,253,244,0.5)",
            fontSize: "clamp(13px, 2vw, 16px)",
            lineHeight: 1.8,
            maxWidth: "560px",
            marginBottom: "44px",
          }}>
            Monitor dustbins in real-time using IoT sensors, optimize garbage
            collection routes, and make cities cleaner and smarter with
            intelligent data-driven decisions.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta" style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "64px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="cta-btn"
              onClick={() => { setIsSignup(false); setShowModal(true); }}
              style={{
                background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                border: "none",
                borderRadius: "10px",
                color: "#022c22",
                padding: "14px 32px",
                fontSize: "13px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.5px",
                cursor: "pointer",
                boxShadow: "0 4px 28px rgba(52,211,153,0.28)",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Get Started
            </button>
            <button
              className="cta-btn"
              onClick={() => { setIsSignup(true); setShowModal(true); }}
              style={{
                background: "transparent",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "10px",
                color: "rgba(240,253,244,0.7)",
                padding: "14px 28px",
                fontSize: "13px",
                fontFamily: "'IBM Plex Mono', monospace",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Create Account
            </button>
          </div>

          {/* Scroll hint */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(240,253,244,0.2)", fontSize: "10px", letterSpacing: "2px" }}>
            <span>SCROLL TO EXPLORE</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "drift 1.5s ease-in-out infinite alternate" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section" style={{
          position: "relative", zIndex: 10,
          padding: "80px 48px 120px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}>
          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ color: "#34d399", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
              ◈ Platform Capabilities
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800, letterSpacing: "-0.02em",
              color: "#f0fdf4",
            }}>
              Everything you need to manage<br />
              <span style={{ color: "rgba(240,253,244,0.35)" }}>urban waste at scale</span>
            </h2>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card" style={{
                background: "rgba(52,211,153,0.03)",
                border: "1px solid rgba(52,211,153,0.12)",
                borderRadius: "12px",
                padding: "28px",
                cursor: "default",
              }}>
                <div style={{
                  width: "42px", height: "42px",
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.18)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#34d399",
                  marginBottom: "18px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "15px", fontWeight: 700,
                  color: "#f0fdf4",
                  marginBottom: "8px",
                }}>{f.title}</h3>
                <p style={{
                  color: "rgba(240,253,244,0.42)",
                  fontSize: "12px", lineHeight: 1.75,
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          position: "relative", zIndex: 10,
          borderTop: "1px solid rgba(52,211,153,0.07)",
          padding: "28px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ color: "rgba(240,253,244,0.2)", fontSize: "11px", letterSpacing: "1px" }}>
            
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" style={{ color: "rgba(240,253,244,0.2)", fontSize: "11px", textDecoration: "none", letterSpacing: "0.5px" }}
                onMouseEnter={e => e.target.style.color = "#34d399"}
                onMouseLeave={e => e.target.style.color = "rgba(240,253,244,0.2)"}
              >{l}</a>
            ))}
          </div>
        </footer>

        {/* ── MODAL ── */}
        {showModal && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
          >
            <div className="modal-card" style={{
              width: "100%", maxWidth: "380px",
              background: "rgba(9,18,13,0.92)",
              border: "1px solid rgba(52,211,153,0.18)",
              borderRadius: "16px",
              padding: "36px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(52,211,153,0.05)",
              position: "relative",
            }}>

              {/* Corner dots */}
              <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", gap: "5px" }}>
                {["#34d399", "#059669", "#064e3b"].map((c, i) => (
                  <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: c }} />
                ))}
              </div>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#34d399",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0fdf4" }}>
                    {isSignup ? "Create Account" : "Welcome back"}
                  </p>
                  <p style={{ color: "rgba(240,253,244,0.35)", fontSize: "11px" }}>
                    {isSignup ? "Join the SWMS platform" : "Sign in to your dashboard"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", color: "rgba(240,253,244,0.4)", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "7px" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(52,211,153,0.45)", pointerEvents: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(52,211,153,0.04)",
                      border: "1px solid rgba(52,211,153,0.14)",
                      borderRadius: "8px",
                      padding: "12px 14px 12px 38px",
                      color: "#f0fdf4",
                      fontSize: "13px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label style={{ color: "rgba(240,253,244,0.4)", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Password
                  </label>
                  {!isSignup && (
                    <a href="#" style={{ color: "rgba(52,211,153,0.55)", fontSize: "10px", textDecoration: "none" }}
                      onMouseEnter={e => e.target.style.color = "#34d399"}
                      onMouseLeave={e => e.target.style.color = "rgba(52,211,153,0.55)"}
                    >Forgot?</a>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(52,211,153,0.45)", pointerEvents: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(52,211,153,0.04)",
                      border: "1px solid rgba(52,211,153,0.14)",
                      borderRadius: "8px",
                      padding: "12px 40px 12px 38px",
                      color: "#f0fdf4",
                      fontSize: "13px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(52,211,153,0.5)", cursor: "pointer", padding: "2px" }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="cta-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: loading ? "rgba(52,211,153,0.12)" : "linear-gradient(135deg, #059669, #34d399)",
                  border: "none",
                  borderRadius: "8px",
                  color: loading ? "#34d399" : "#022c22",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(52,211,153,0.22)",
                  transition: "all 0.2s",
                  marginBottom: "18px",
                }}
              >
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {isSignup ? "Creating..." : "Signing in..."}
                  </>
                ) : (isSignup ? "Create Account" : "Access Dashboard")}
              </button>

              {/* Toggle */}
              <p style={{ textAlign: "center", color: "rgba(240,253,244,0.3)", fontSize: "11px" }}>
                {isSignup ? "Already have an account? " : "New operator? "}
                <span
                  onClick={() => setIsSignup(!isSignup)}
                  style={{ color: "#34d399", cursor: "pointer", fontWeight: 600 }}
                >
                  {isSignup ? "Sign in →" : "Create account →"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Landing;