import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/landing.scss";

const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,255,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
};

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  // ✅ FIX: hero is visible immediately on mount — no waiting for observer
  const [heroReady, setHeroReady] = useState(false);
  const obsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FIX: Set heroReady on first frame so animations start immediately
  useEffect(() => {
    // requestAnimationFrame ensures DOM is painted before we trigger animations
    const raf = requestAnimationFrame(() => {
      setHeroReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // ✅ FIX: Only observe non-hero sections (features, steps, cta)
    // Hero is never hidden — it's always visible
    const timer = setTimeout(() => {
      obsRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setVisible((prev) => ({ ...prev, [e.target.dataset.id]: true }));
            }
          });
        },
        { threshold: 0.1 } // ✅ lowered from 0.15 so sections appear sooner
      );
      document
        .querySelectorAll("[data-id]")
        .forEach((el) => obsRef.current.observe(el));
    }, 100); // small delay so hero renders first

    return () => {
      clearTimeout(timer);
      obsRef.current?.disconnect();
    };
  }, []);

  const v = (id) => (visible[id] ? "visible" : "");

  const features = [
    {
      icon: "📄",
      title: "Resume Analysis",
      desc: "Upload your resume and get AI-driven insights tailored to your target role.",
      color: "purple",
    },
    {
      icon: "🎯",
      title: "Job Matching",
      desc: "Paste the job description and receive hyper-targeted interview preparation.",
      color: "pink",
    },
    {
      icon: "🧠",
      title: "Smart Interview Plan",
      desc: "Personalized day-by-day strategy built around your unique profile.",
      color: "cyan",
    },
    {
      icon: "⚡",
      title: "Fast Results",
      desc: "Full interview playbook generated in seconds, not hours.",
      color: "amber",
    },
  ];

  const steps = [
    { num: "01", label: "Paste Job Description", detail: "Any role, any company" },
    { num: "02", label: "Upload Your Resume", detail: "Or write a self-description" },
    { num: "03", label: "Generate Strategy", detail: "AI builds your full plan" },
  ];

  return (
    <div className="landing">
      <ParticleField />

      {/* BG ORBS */}
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
      <div className="orb orb--4" />

      {/* BG GRID */}
      <div className="bg-grid" />

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar__brand">
          <div className="brand-gem">⚡</div>
          <span className="brand-text">InterviewAI</span>
        </div>
        <div className="navbar__links">
          <Link to="/login" className="btn btn--ghost">Login</Link>
          <Link to="/register" className="btn btn--primary">Get Started</Link>
        </div>
      </nav>

      {/* ✅ HERO — always rendered, heroReady class triggers CSS animations */}
      <section className={`hero ${heroReady ? "hero--ready" : ""}`}>
        <div className="hero__badge">
          <span className="badge-dot" />
          AI-Powered · Personalized · Instant
        </div>

        <h1 className="hero__headline">
          Crack Your Dream Job<br />
          with <span className="gradient-text">AI-Powered</span><br />
          Preparation
        </h1>

        <p className="hero__sub">
          Get personalized interview strategies using your resume and job
          description. Land offers at top companies.
        </p>

        <div className="hero__cta">
          <Link to="/register" className="btn btn--primary btn--xl">
            <span>Get Started Free</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/login" className="btn btn--glass btn--xl">Login</Link>
        </div>

        <div className="hero__stats">
          {[["10k+", "Interviews Prepped"], ["94%", "Success Rate"], ["2s", "Generation Time"]].map(([val, label]) => (
            <div className="stat-pill" key={label}>
              <span className="stat-val">{val}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* HERO CARD FLOAT */}
        <div className="hero__card-wrap">
          <div className="hero-card glass-card">
            <div className="hero-card__header">
              <div className="hc-dot red" /><div className="hc-dot amber" /><div className="hc-dot green" />
              <span className="hc-title">interview_plan.ai</span>
            </div>
            <div className="hero-card__body">
              <div className="code-line"><span className="c-key">role</span><span className="c-sep"> → </span><span className="c-val">Senior Backend Engineer</span></div>
              <div className="code-line"><span className="c-key">match</span><span className="c-sep"> → </span><span className="c-val c-green">88% ✓</span></div>
              <div className="code-line"><span className="c-key">questions</span><span className="c-sep"> → </span><span className="c-val">12 generated</span></div>
              <div className="code-line"><span className="c-key">plan</span><span className="c-sep"> → </span><span className="c-val c-purple">7-day roadmap</span></div>
              <div className="code-line typing"><span className="c-key">status</span><span className="c-sep"> → </span><span className="c-val c-cyan">ready_to_prep<span className="cursor">_</span></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" data-id="features">
        <div className={`section-wrap ${v("features")}`}>
          <div className="section-badge">Features</div>
          <h2 className="section-title">Why Use <span className="gradient-text">InterviewAI?</span></h2>
          <p className="section-sub">Everything you need to walk into your interview fully prepared.</p>

          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card glass-card color--${f.color}`}
                data-id={`feat-${i}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="fc-icon">{f.icon}</div>
                <h3 className="fc-title">{f.title}</h3>
                <p className="fc-desc">{f.desc}</p>
                <div className="fc-glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps" data-id="steps">
        <div className={`section-wrap ${v("steps")}`}>
          <div className="section-badge">Process</div>
          <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card glass-card" key={s.num} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-num">{s.num}</div>
                <div className="step-connector" />
                <h3 className="step-label">{s.label}</h3>
                <p className="step-detail">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" data-id="cta">
        <div className={`cta-inner glass-card ${v("cta")}`}>
          <div className="cta-orb" />
          <div className="section-badge">Ready?</div>
          <h2 className="cta-title">Start Preparing <span className="gradient-text">Today 🚀</span></h2>
          <p className="cta-sub">Join thousands of engineers who landed their dream jobs.</p>
          <Link to="/register" className="btn btn--primary btn--xl">
            Create Free Account
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="brand-gem">⚡</div>
            <span>InterviewAI</span>
          </div>
          <p className="footer__copy">© 2026 InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;