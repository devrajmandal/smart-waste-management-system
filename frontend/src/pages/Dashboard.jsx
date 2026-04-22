import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import BinCard from "../components/BinCard";
import MapView from "../components/MapView";

/* ── Animated hex background (same as Landing) ── */
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
    const HEX_R = 36;
    const draw = () => {
      t += 0.006;
      const cols = Math.ceil(canvas.width / (HEX_R * 1.75)) + 2;
      const rows = Math.ceil(canvas.height / (HEX_R * 1.52)) + 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c % 2 === 0 ? 0 : HEX_R * 0.87;
          const x = c * HEX_R * 1.75 - HEX_R;
          const y = r * HEX_R * 1.52 + ox - HEX_R;
          const wave = Math.sin(t + c * 0.4 + r * 0.3) * 0.5 + 0.5;
          const alpha = wave * 0.06 + 0.015;
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
          if (wave > 0.9) { ctx.fillStyle = `rgba(52,211,153,${alpha * 0.35})`; ctx.fill(); }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ── Stat pill shown in the navbar ── */
function StatPill({ label, value, color = "#34d399" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      background: "rgba(52,211,153,0.05)",
      border: "1px solid rgba(52,211,153,0.12)",
      borderRadius: "8px", padding: "7px 14px",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
      <span style={{ color: "rgba(240,253,244,0.35)", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: "#f0fdf4", fontSize: "13px", fontFamily: "'Syne',sans-serif", fontWeight: 700, marginLeft: "4px" }}>{value}</span>
    </div>
  );
}

const Dashboard = ({ setAuth }) => {
  const [bins, setBins] = useState([]);
  const [prevBins, setPrevBins] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0); // for live pulse

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await API.get("/bins");
        setPrevBins((prev) => (prev.length ? bins : res.data));
        setBins(res.data);
        setTick((n) => n + 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBins();
    const interval = setInterval(fetchBins, 3000);
    return () => clearInterval(interval);
  }, []);

  const fullCount     = bins.filter((b) => b.status === "FULL").length;
  const moderateCount = bins.filter((b) => b.status === "MODERATE").length;
  const emptyCount    = bins.filter((b) => b.status === "EMPTY").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }

        @keyframes pulse2 {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50% { opacity:0.6; box-shadow: 0 0 0 5px rgba(52,211,153,0); }
        }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,20px) scale(1.06); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes borderPulse {
          0%,100% { border-color: rgba(52,211,153,0.1); }
          50%     { border-color: rgba(52,211,153,0.28); }
        }

        .dash-card-wrap {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .dash-card-wrap:nth-child(1) { animation-delay: 0.05s; }
        .dash-card-wrap:nth-child(2) { animation-delay: 0.12s; }
        .dash-card-wrap:nth-child(3) { animation-delay: 0.19s; }
        .dash-card-wrap:nth-child(4) { animation-delay: 0.26s; }
        .dash-card-wrap:nth-child(5) { animation-delay: 0.33s; }
        .dash-card-wrap:nth-child(6) { animation-delay: 0.40s; }

        .dash-card-wrap:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.2) !important;
        }

        .changed-ring {
          box-shadow: 0 0 0 2px #60a5fa, 0 0 24px rgba(96,165,250,0.35) !important;
          animation: borderPulse 1s ease 3;
        }

        .logout-btn {
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.15) !important;
          border-color: rgba(239,68,68,0.5) !important;
          box-shadow: 0 0 20px rgba(239,68,68,0.15);
        }

        .map-section {
          animation: fadeIn 0.8s ease 0.5s both;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070d0b; }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.3); border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#070d0b",
        color: "#f0fdf4",
        fontFamily: "'IBM Plex Mono', monospace",
        position: "relative",
        overflowX: "hidden",
      }}>

        {/* ── Background layers ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 65% 50% at 5% 15%, rgba(6,78,59,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 90% 80%, rgba(5,46,37,0.18) 0%, transparent 65%)
          `,
        }} />
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }} />
        {/* Floating orbs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle,#059669,transparent)", filter: "blur(80px)", opacity: 0.15, top: "-100px", left: "-80px", animation: "drift 18s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle,#34d399,transparent)", filter: "blur(80px)", opacity: 0.12, bottom: "80px", right: "-40px", animation: "drift 22s ease-in-out infinite alternate-reverse" }} />
        </div>
        <HexGrid />

        {/* ── NAVBAR ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px",
          height: "64px",
          background: "rgba(7,13,11,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(52,211,153,0.08)",
          flexWrap: "wrap", gap: "12px",
        }}>
          {/* Logo + title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "34px", height: "34px",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em", color: "#f0fdf4" }}>
                Smart<span style={{ color: "#34d399" }}>Waste</span>
              </span>
              <span style={{ color: "rgba(240,253,244,0.25)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", marginLeft: "10px" }}>
                Dashboard
              </span>
            </div>
          </div>

          {/* Live stats */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StatPill label="Total Bins" value={bins.length} />
            <StatPill label="Full"     value={fullCount}     color="#f87171" />
            <StatPill label="Moderate" value={moderateCount} color="#fbbf24" />
            <StatPill label="Empty"    value={emptyCount}    color="#34d399" />
            {/* Live pulse */}
            <div style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.12)",
              borderRadius: "8px", padding: "7px 14px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", animation: "pulse2 2s infinite", flexShrink: 0 }} />
              <span style={{ color: "#34d399", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>Live · 3s</span>
            </div>
          </div>

          {/* Logout */}
          <button
            className="logout-btn"
            onClick={() => { localStorage.removeItem("token"); setAuth(false); }}
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "8px",
              color: "#f87171",
              padding: "8px 20px",
              fontSize: "11px",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "7px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main style={{ position: "relative", zIndex: 10, padding: "36px 40px 60px" }}>

          {/* Section header */}
          <div style={{ marginBottom: "28px", opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <p style={{ color: "#34d399", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase" }}>◈ IoT Network</p>
              <div style={{ flex: 1, height: "1px", background: "rgba(52,211,153,0.1)" }} />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 700, color: "#f0fdf4", letterSpacing: "-0.01em" }}>
              Bin Status Monitor
            </h2>
          </div>

          {/* ── BIN CARDS GRID — untouched inner content ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "52px",
          }}>
            {bins.map((bin, idx) => {
              const prev = prevBins.find((b) => b._id === bin._id);
              const changed = prev && prev.status !== bin.status;
              return (
                <div
                  key={bin._id}
                  className={`dash-card-wrap ${changed ? "changed-ring" : ""}`}
                  style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(52,211,153,0.1)",
                    overflow: "hidden",
                    background: "rgba(10,20,15,0.6)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                    transform: changed ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.5s ease, box-shadow 0.3s ease",
                  }}
                >
                  <BinCard bin={bin} />
                </div>
              );
            })}
          </div>

          {/* ── MAP SECTION ── */}
          <div className="map-section">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <p style={{ color: "#34d399", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase" }}>◈ Route Planning</p>
              <div style={{ flex: 1, height: "1px", background: "rgba(52,211,153,0.1)" }} />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 700, color: "#f0fdf4", letterSpacing: "-0.01em", marginBottom: "20px" }}>
              Route Overview
            </h2>

            {/* Map wrapper — styled frame, MapView untouched */}
            <div style={{
              borderRadius: "16px",
              border: "1px solid rgba(52,211,153,0.12)",
              overflow: "hidden",
              background: "rgba(10,20,15,0.5)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.05)",
              position: "relative",
            }}>
              {/* Top bar decoration */}
              <div style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(52,211,153,0.08)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(7,13,11,0.6)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", animation: "pulse2 2s infinite" }} />
                  <span style={{ color: "rgba(240,253,244,0.35)", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Live Map · Bhubaneswar
                  </span>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {["#34d399", "#059669", "#064e3b"].map((c, i) => (
                    <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: c }} />
                  ))}
                </div>
              </div>
              <MapView bins={bins} />
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer style={{
          position: "relative", zIndex: 10,
          borderTop: "1px solid rgba(52,211,153,0.07)",
          padding: "20px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <span style={{ color: "rgba(240,253,244,0.15)", fontSize: "10px", letterSpacing: "1px" }}>
            SWMS © 2025 · Silicon University · Dev Mandal
          </span>
          <span style={{ color: "rgba(240,253,244,0.15)", fontSize: "10px", letterSpacing: "1px" }}>
            Refreshing every 3s · {bins.length} bins online
          </span>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;