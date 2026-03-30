import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

// ⚠️ PUT THESE NEAR THE TOP OF YOUR FILE (after imports)
const EMAILJS_SERVICE_ID  = "service_wo95a2q";   // from Step 1
const EMAILJS_TEMPLATE_ID = "template_mam3d9q";  // from Step 3
const EMAILJS_PUBLIC_KEY  = "vG4Pi1fyIDqj7YkO3"; // from Step 4

const CALLMEBOT_PHONE     = "919657093760";       // your number, no +
const CALLMEBOT_APIKEY    = "1234567";            // from CallMeBot reply

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Sora:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

/* ── THEMES ── */
body.dark {
  --bg:     #09090f;
  --bg2:    #0e0e18;
  --bg3:    #131320;
  --v:      #8B5CF6;
  --vl:     #A78BFA;
  --vd:     #6D28D9;
  --glow:   rgba(139,92,246,0.14);
  --text:   #e2e2ee;
  --muted:  #8888aa;
  --border: rgba(139,92,246,0.22);
  --card:   rgba(139,92,246,0.04);
  --nav-bg: rgba(9,9,15,0.82);
  --input-bg: rgba(139,92,246,0.04);
  --footer-bg: #09090f;
}
body.light {
  --bg:     #f5f4ff;
  --bg2:    #eeedf9;
  --bg3:    #e8e6f8;
  --v:      #7C3AED;
  --vl:     #6D28D9;
  --vd:     #5B21B6;
  --glow:   rgba(124,58,237,0.10);
  --text:   #1a1730;
  --muted:  #5a5580;
  --border: rgba(124,58,237,0.22);
  --card:   rgba(124,58,237,0.05);
  --nav-bg: rgba(245,244,255,0.88);
  --input-bg: rgba(124,58,237,0.05);
  --footer-bg: #eeedf9;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Sora', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  transition: background 0.4s, color 0.4s;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--v); border-radius: 2px; }

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 5rem;
  background: var(--nav-bg);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  transition: background 0.4s;
}
.nav-logo {
  font-family: 'Cormorant Garant', serif;
  font-size: 1.6rem; font-weight: 700; color: var(--vl);
  letter-spacing: 0.02em; cursor: pointer;
}
.nav-links { display: flex; gap: 2.2rem; list-style: none; align-items: center; }
.nav-links a {
  color: var(--muted); font-size: 0.72rem; font-weight: 600;
  text-decoration: none; letter-spacing: 0.14em; text-transform: uppercase;
  transition: color 0.25s;
}
.nav-links a:hover { color: var(--vl); }
.nav-right { display: flex; align-items: center; gap: 0.9rem; }

/* ── THEME TOGGLE ── */
.theme-toggle {
  width: 46px; height: 24px;
  background: var(--border); border: 1px solid var(--border);
  border-radius: 12px; cursor: pointer; position: relative;
  transition: background 0.35s; outline: none;
  flex-shrink: 0;
}
.theme-toggle-knob {
  position: absolute; top: 2px; left: 2px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--vl);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), background 0.3s;
  display: flex; align-items: center; justify-content: center; font-size: 10px;
}
body.light .theme-toggle-knob { transform: translateX(22px); background: var(--v); }

/* ── HAMBURGER ── */
.hamburger {
  display: none; flex-direction: column; gap: 5px; cursor: pointer;
  background: none; border: none; padding: 0.2rem;
}
.hamburger span {
  display: block; width: 24px; height: 2px;
  background: var(--vl); border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── MOBILE MENU ── */
.mobile-menu {
  display: none;
  position: fixed; top: 64px; left: 0; right: 0; z-index: 190;
  background: var(--nav-bg);
  backdrop-filter: blur(28px);
  border-bottom: 1px solid var(--border);
  flex-direction: column; gap: 0;
  transform: translateY(-12px); opacity: 0; pointer-events: none;
  transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s;
}
.mobile-menu.open {
  transform: translateY(0); opacity: 1; pointer-events: all;
}
.mobile-menu a {
  padding: 1rem 2rem; color: var(--muted); font-size: 0.82rem;
  font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  text-decoration: none; border-bottom: 1px solid var(--border);
  transition: color 0.2s, background 0.2s;
}
.mobile-menu a:hover { color: var(--vl); background: var(--glow); }

.btn-hire {
  background: linear-gradient(135deg, var(--vd), var(--v));
  color: #fff; border: none;
  padding: 0.55rem 1.3rem; border-radius: 4px;
  font-family: 'Sora'; font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  transition: opacity 0.25s, transform 0.2s;
  white-space: nowrap;
}
.btn-hire:hover { opacity: 0.82; transform: translateY(-1px); }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 9rem 5rem 5rem;
  position: relative; overflow: hidden;
}
.hero-mesh {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 65% 55% at 75% 35%, rgba(109,40,217,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 45% 45% at 15% 75%, rgba(139,92,246,0.09) 0%, transparent 55%);
  transition: opacity 0.4s;
}
body.light .hero-mesh {
  background:
    radial-gradient(ellipse 65% 55% at 75% 35%, rgba(124,58,237,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 45% 45% at 15% 75%, rgba(124,58,237,0.06) 0%, transparent 55%);
}
.hero-grid-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%);
}
.hero-orb {
  position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none;
  width: 520px; height: 520px;
  background: rgba(109,40,217,0.1);
  top: -8%; right: -4%; z-index: 0;
  animation: orbPulse 7s ease-in-out infinite;
}
@keyframes orbPulse {
  0%,100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.12); opacity: 1; }
}
.hero-content { position: relative; z-index: 1; max-width: 740px; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: rgba(139,92,246,0.1); border: 1px solid var(--border);
  border-radius: 20px; padding: 0.4rem 1rem; margin-bottom: 1.8rem;
  font-size: 0.72rem; font-weight: 600; color: var(--vl);
  letter-spacing: 0.1em; text-transform: uppercase;
  animation: fadeUp 0.7s 0.1s both;
}
.hero-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4ade80; box-shadow: 0 0 8px #4ade80;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.hero-name {
  font-family: 'Cormorant Garant', serif;
  font-size: clamp(3.8rem, 7.5vw, 6.5rem);
  font-weight: 300; line-height: 1.02;
  letter-spacing: -0.01em; margin-bottom: 0.4rem;
  animation: fadeUp 0.7s 0.25s both;
}
.hero-name strong {
  font-weight: 700; display: block;
  background: linear-gradient(135deg, var(--vl) 0%, #C4B5FD 60%, var(--v) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-role {
  font-size: 1rem; font-weight: 500; color: var(--muted);
  letter-spacing: 0.06em; margin-bottom: 1.4rem;
  animation: fadeUp 0.7s 0.4s both;
}
.hero-role span { color: var(--vl); }
.hero-tagline {
  font-size: 1.05rem; line-height: 1.78; color: var(--text);
  opacity: 0.82; max-width: 580px; margin-bottom: 2.4rem;
  animation: fadeUp 0.7s 0.55s both;
}
.hero-stats {
  display: flex; gap: 2.8rem; margin-bottom: 2.4rem;
  animation: fadeUp 0.7s 0.7s both;
}
.stat-num {
  font-family: 'Cormorant Garant', serif;
  font-size: 2.4rem; font-weight: 700; color: var(--vl); line-height: 1;
}
.stat-label {
  font-size: 0.68rem; color: var(--muted); text-transform: uppercase;
  letter-spacing: 0.14em; margin-top: 0.35rem;
}
.hero-btns {
  display: flex; gap: 1rem; flex-wrap: wrap;
  animation: fadeUp 0.7s 0.85s both;
}
.btn-primary {
  background: linear-gradient(135deg, var(--vd), var(--v));
  color: #fff; border: none; padding: 0.9rem 2.2rem;
  border-radius: 5px; font-family: 'Sora'; font-size: 0.83rem;
  font-weight: 700; letter-spacing: 0.06em; cursor: pointer;
  box-shadow: 0 0 32px rgba(139,92,246,0.35);
  transition: transform 0.2s, box-shadow 0.3s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 52px rgba(139,92,246,0.55); }
.btn-ghost {
  background: transparent; color: var(--vl);
  border: 1px solid var(--border); padding: 0.9rem 2.2rem;
  border-radius: 5px; font-family: 'Sora'; font-size: 0.83rem;
  font-weight: 600; letter-spacing: 0.06em; cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
}
.btn-ghost:hover { background: var(--glow); border-color: var(--v); }

/* ── RESUME DOWNLOAD BTN ── */
.btn-resume {
  display: inline-flex; align-items: center; gap: 0.55rem;
  background: transparent; color: var(--vl);
  border: 1px dashed var(--border); padding: 0.9rem 2rem;
  border-radius: 5px; font-family: 'Sora'; font-size: 0.83rem;
  font-weight: 600; letter-spacing: 0.04em; cursor: pointer;
  transition: all 0.3s; text-decoration: none;
}
.btn-resume:hover {
  background: var(--glow); border-style: solid;
  border-color: var(--v); transform: translateY(-2px);
}
.btn-resume-icon { font-size: 1rem; animation: bounceDown 2s ease-in-out infinite; }
@keyframes bounceDown {
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(3px); }
}

/* ── SECTION BASE ── */
section { padding: 6rem 5rem; position: relative; z-index: 1; transition: background 0.4s; }
.section-label {
  font-size: 0.68rem; font-weight: 700; color: var(--v);
  letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 0.8rem;
}
.section-title {
  font-family: 'Cormorant Garant', serif;
  font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; line-height: 1.15;
}
.section-title em { font-style: italic; font-weight: 300; color: var(--vl); }
.section-line {
  width: 2.5rem; height: 2px; margin: 1rem auto 0;
  background: linear-gradient(90deg, var(--v), transparent);
}
.section-header { text-align: center; margin-bottom: 4rem; }

/* ── ABOUT ── */
.about-section { background: var(--bg2); }
.about-text {
  max-width: 680px; margin: 0 auto; text-align: center;
  font-size: 0.95rem; line-height: 1.92; color: var(--text); opacity: 0.84;
}

/* ── SKILLS ── */
.skills-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.4rem; max-width: 1080px; margin: 0 auto 3.5rem;
}
.skill-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 1.8rem;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.skill-card:hover {
  border-color: var(--v); transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(139,92,246,0.12);
}
.skill-icon { font-size: 1.6rem; margin-bottom: 1rem; }
.skill-title {
  font-size: 0.68rem; font-weight: 700; color: var(--v);
  letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 1rem;
}
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag {
  background: rgba(139,92,246,0.1); color: var(--vl);
  border: 1px solid rgba(139,92,246,0.2);
  padding: 0.28rem 0.8rem; border-radius: 20px;
  font-size: 0.73rem; font-weight: 500;
}

/* ── SKILL BARS ── */
.skill-bars { max-width: 780px; margin: 0 auto; }
.skill-bars-title {
  font-size: 0.68rem; font-weight: 700; color: var(--v);
  letter-spacing: 0.2em; text-transform: uppercase;
  text-align: center; margin-bottom: 2rem;
}
.skill-bar-row { margin-bottom: 1.4rem; }
.skill-bar-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 0.55rem;
}
.skill-bar-name { font-size: 0.82rem; font-weight: 600; color: var(--text); }
.skill-bar-pct { font-size: 0.72rem; font-weight: 700; color: var(--vl); }
.skill-bar-track {
  height: 5px; background: var(--border); border-radius: 10px; overflow: hidden;
}
.skill-bar-fill {
  height: 100%; border-radius: 10px;
  background: linear-gradient(90deg, var(--vd), var(--vl));
  width: 0%; transition: width 1.2s cubic-bezier(.4,0,.2,1);
  position: relative; overflow: hidden;
}
.skill-bar-fill::after {
  content: '';
  position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
  background: rgba(255,255,255,0.25);
  animation: shimmer 2.2s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { left: -60%; }
  100% { left: 140%; }
}
.skill-bar-fill.animate { width: var(--target); }

/* ── EXPERIENCE ── */
.exp-section { background: var(--bg2); }
.timeline { max-width: 860px; margin: 0 auto; position: relative; padding-left: 2px; }
.timeline::before {
  content: ''; position: absolute;
  left: 0; top: 8px; bottom: 8px; width: 1px;
  background: linear-gradient(to bottom, transparent, var(--v) 15%, var(--v) 85%, transparent);
}
.exp-item { padding-left: 2.8rem; margin-bottom: 3rem; position: relative; }
.exp-dot {
  position: absolute; left: -4px; top: 6px;
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--v); box-shadow: 0 0 14px var(--v);
}
.exp-period {
  font-size: 0.68rem; font-weight: 700; color: var(--v);
  letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 0.45rem;
}
.exp-company {
  font-family: 'Cormorant Garant', serif;
  font-size: 1.55rem; font-weight: 700; margin-bottom: 0.2rem;
}
.exp-role { font-size: 0.84rem; color: var(--muted); margin-bottom: 0.9rem; }
.exp-desc { font-size: 0.83rem; line-height: 1.75; color: var(--text); opacity: 0.78; }

/* ── PROJECTS ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 1.4rem; max-width: 1080px; margin: 0 auto;
}
.project-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 2rem; position: relative; overflow: hidden;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; cursor: default;
}
.project-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--vd), var(--v), var(--vl));
  transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
}
.project-card:hover::before { transform: scaleX(1); }
.project-card:hover { border-color: var(--v); transform: translateY(-6px); box-shadow: 0 16px 50px rgba(139,92,246,0.14); }
.project-domain {
  font-size: 0.64rem; font-weight: 700; color: var(--v);
  letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.7rem;
}
.project-name {
  font-family: 'Cormorant Garant', serif;
  font-size: 1.65rem; font-weight: 700; margin-bottom: 0.75rem;
}
.project-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.2rem; }
.tech-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tech-chip {
  background: rgba(139,92,246,0.08); color: var(--vl);
  border: 1px solid rgba(139,92,246,0.18);
  padding: 0.22rem 0.7rem; border-radius: 3px;
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.04em;
}

/* ── CERTS ── */
.certs-section { background: var(--bg2); }
.certs-row { display: flex; flex-wrap: wrap; gap: 1.4rem; justify-content: center; max-width: 920px; margin: 0 auto; }
.cert-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 1.8rem 2.2rem;
  display: flex; align-items: center; gap: 1.4rem;
  transition: border-color 0.3s, transform 0.3s; min-width: 260px;
}
.cert-card:hover { border-color: var(--v); transform: translateY(-3px); }
.cert-icon { font-size: 1.9rem; }
.cert-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.3rem; }
.cert-issuer { font-size: 0.72rem; color: var(--muted); }

/* ── TESTIMONIALS ── */
.testi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.4rem; max-width: 1080px; margin: 0 auto;
}
.testi-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 2rem;
  transition: border-color 0.3s, transform 0.3s;
}
.testi-card:hover { border-color: var(--v); transform: translateY(-4px); }
.testi-quote {
  font-family: 'Cormorant Garant', serif;
  font-size: 3.5rem; color: var(--v); opacity: 0.25; line-height: 1; margin-bottom: 0.5rem;
}
.testi-text {
  font-size: 0.85rem; line-height: 1.8; color: var(--text);
  opacity: 0.82; font-style: italic; margin-bottom: 1.4rem;
}
.testi-author { display: flex; align-items: center; gap: 1rem; }
.testi-avatar {
  width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--vd), var(--v));
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem; color: #fff;
}
.testi-name { font-weight: 600; font-size: 0.84rem; }
.testi-role { font-size: 0.7rem; color: var(--muted); margin-top: 0.15rem; }

/* ── CONTACT ── */
.contact-section { background: var(--bg2); }
.contact-inner { max-width: 680px; margin: 0 auto; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label {
  font-size: 0.66rem; font-weight: 700; color: var(--muted);
  letter-spacing: 0.14em; text-transform: uppercase;
}
.form-group input, .form-group textarea {
  background: var(--input-bg); border: 1px solid var(--border);
  border-radius: 6px; padding: 0.85rem 1rem;
  color: var(--text); font-family: 'Sora'; font-size: 0.83rem;
  transition: border-color 0.3s, box-shadow 0.3s; outline: none; resize: vertical;
}
.form-group input::placeholder, .form-group textarea::placeholder { color: var(--muted); opacity: 0.6; }
.form-group input:focus, .form-group textarea:focus {
  border-color: var(--v); box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
}
.form-group textarea { min-height: 140px; }
.btn-send {
  width: 100%; margin-top: 0.5rem;
  background: linear-gradient(135deg, var(--vd), var(--v));
  color: #fff; border: none; padding: 1rem;
  border-radius: 6px; font-family: 'Sora'; font-size: 0.85rem;
  font-weight: 700; letter-spacing: 0.06em; cursor: pointer;
  transition: opacity 0.25s, transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 0 28px rgba(139,92,246,0.3);
}
.btn-send:hover { opacity: 0.85; transform: translateY(-2px); box-shadow: 0 0 48px rgba(139,92,246,0.5); }
.btn-send.sent { background: linear-gradient(135deg, #059669, #10b981); box-shadow: none; }
.contact-links { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 2rem; }
.contact-link {
  display: flex; align-items: center; gap: 0.6rem;
  color: var(--muted); font-size: 0.78rem; text-decoration: none;
  padding: 0.6rem 1.1rem; border: 1px solid var(--border); border-radius: 5px;
  transition: all 0.3s;
}
.contact-link:hover { color: var(--vl); border-color: var(--v); background: var(--glow); }

/* ── FOOTER ── */
footer {
  padding: 2rem 5rem; background: var(--footer-bg);
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.4s;
}
.footer-copy { font-size: 0.76rem; color: var(--muted); }
.footer-right { font-size: 0.7rem; color: var(--muted); opacity: 0.55; }

/* ── ANIMATIONS ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  nav { padding: 1rem 1.5rem; }
  .nav-links { display: none !important; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
  section { padding: 4.5rem 1.5rem; }
  .hero { padding: 7.5rem 1.5rem 4rem; }
  .form-row { grid-template-columns: 1fr; }
  .hero-stats { gap: 1.8rem; }
  footer { flex-direction: column; gap: 0.5rem; text-align: center; padding: 1.8rem; }
  .hero-btns { flex-direction: column; }
  .btn-primary, .btn-ghost, .btn-resume { width: 100%; justify-content: center; }
}
`;

/* ─────────────── DATA ─────────────── */
const NAV_ITEMS = ["about", "skills", "experience", "projects", "certifications", "testimonials", "contact"];

const SKILL_CATEGORIES = [
  { icon: "⚛️", title: "Core Frontend",    tags: ["React 18", "TypeScript", "JavaScript ES2023", "HTML5", "CSS3 / SCSS"] },
  { icon: "🏗️", title: "Architecture",     tags: ["Micro Frontends", "Webpack Module Federation", "Redux Toolkit", "Context API", "React Router v6"] },
  { icon: "🧪", title: "Testing",          tags: ["Jest", "React Testing Library", "Vitest", "Unit Testing", "Integration Testing"] },
  { icon: "⚙️", title: "Tools & Workflow", tags: ["Git / GitHub", "Webpack 5", "Vite", "REST APIs", "Agile / Scrum", "JIRA"] },
];

const SKILL_BARS = [
  { name: "React & TypeScript",          pct: 95 },
  { name: "Micro Frontend Architecture", pct: 90 },
  { name: "Redux / State Management",    pct: 88 },
  { name: "Testing (Jest / RTL)",        pct: 82 },
  { name: "Webpack & Build Tools",       pct: 80 },
  { name: "REST API Integration",        pct: 85 },
];

const EXPERIENCE = [
  {
    period: "2023 — Present",
    company: "eInfochips (An Arrow Company)",
    role: "Senior Frontend Developer",
    desc: "Leading frontend architecture for a global wealth management platform (UBS Bank). Designing and implementing Micro Frontend solutions with Webpack Module Federation, mentoring engineers, and establishing scalable UI patterns across distributed teams.",
  },
  {
    period: "2021 — 2023",
    company: "LTIMindtree",
    role: "Frontend Developer",
    desc: "Delivered production React applications for CitiBank, Deutsche Bank, and HSBC. Built shared component libraries, implemented Redux state management, and improved performance by 40% through strategic code-splitting and lazy loading.",
  },
  {
    period: "2019 — 2021",
    company: "Accenture",
    role: "Frontend Developer",
    desc: "Developed enterprise web applications for Allstate Insurance. Focused on responsive UI components, REST API integration, cross-browser compatibility, and building a strong foundation in React within agile delivery teams.",
  },
];

const PROJECTS = [
  {
    domain: "Wealth Management",
    name: "UBS Bank",
    desc: "Multi-module Micro Frontend portal for one of the world's leading private banks. Independently deployable React apps using Webpack Module Federation for a seamless, enterprise-grade user experience.",
    tech: ["React 18", "TypeScript", "Micro Frontend", "Webpack", "Redux"],
  },
  {
    domain: "Retail Banking",
    name: "CitiBank",
    desc: "High-traffic retail banking dashboard with real-time data feeds, complex state management, and WCAG 2.1 AA accessibility compliance for millions of customers globally.",
    tech: ["React", "Redux Toolkit", "TypeScript", "REST APIs", "Jest"],
  },
  {
    domain: "Investment Banking",
    name: "Deutsche Bank",
    desc: "Trading and investment analytics platform for Deutsche Bank's digital division. Built reusable charting components, data visualization modules, and performance-optimized data tables.",
    tech: ["React", "JavaScript", "D3.js", "RTL", "SCSS"],
  },
  {
    domain: "Global Banking",
    name: "HSBC",
    desc: "Led frontend modernization of HSBC's legacy banking portals — migrating to a React SPA. Defined the migration strategy, component architecture, and refactoring roadmap.",
    tech: ["React", "TypeScript", "Webpack 5", "Redux", "Vitest"],
  },
  {
    domain: "Insurance",
    name: "Allstate Insurance",
    desc: "Policy management interfaces for one of America's largest insurers — multi-step workflows, complex form validation, and data persistence patterns built for millions of policyholders.",
    tech: ["React", "JavaScript", "Context API", "REST APIs", "SCSS"],
  },
];

const CERTS = [
  { icon: "📜", name: "React Advanced Patterns", issuer: "Udemy · Frontend Engineering" },
  { icon: "⚛️", name: "TypeScript for React Developers", issuer: "Continuous Learning · 2024" },
  { icon: "🏗️", name: "Micro Frontend Architecture", issuer: "Enterprise Project Expertise" },
];

const TESTIMONIALS = [
  {
    text: "Ayushi brought exceptional technical depth to our team. Her Micro Frontend architecture expertise completely transformed how we structure React applications — clean, scalable, and genuinely maintainable.",
    name: "Rohan Mehta",
    role: "Engineering Manager, eInfochips",
    initials: "RM",
  },
  {
    text: "One of the most detail-oriented developers I've had the pleasure of working with. Ayushi's ability to translate complex banking requirements into elegant, performant UI components is remarkable.",
    name: "Priya Sharma",
    role: "Tech Lead, LTIMindtree",
    initials: "PS",
  },
  {
    text: "Ayushi consistently delivered high-quality work under tight deadlines. Her TypeScript discipline and testing culture raised the bar for our entire frontend team at Accenture.",
    name: "Ankit Verma",
    role: "Senior Developer, Accenture",
    initials: "AV",
  },
];

/* ── SKILL BAR with Intersection Observer ── */
function SkillBar({ name, pct, animate }) {
  return (
    <div className="skill-bar-row">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-pct">{pct}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className={`skill-bar-fill${animate ? " animate" : ""}`}
          style={{ "--target": `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────── COMPONENT ─────────────── */
export default function AyushiPortfolio() {
  const [darkMode, setDarkMode]     = useState(true);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [form, setForm]             = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent]             = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState("");
  const [barsVisible, setBarsVisible] = useState(false);
  const barsRef = useRef(null);

  // Apply theme class
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  // Intersection observer for skill bars
  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const send = async () => {
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in Name, Email and Message.");
      return;
    }
    setSending(true);
    setError("");

    try {
      // ── 1. Send Email via EmailJS ──
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          reply_to:   form.email,
          subject:    form.subject || "Portfolio Contact",
          message:    form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      // ── 2. Send WhatsApp via CallMeBot ──
      const whatsappText = encodeURIComponent(
        `📬 New Portfolio Message!\n\nFrom: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject || "—"}\n\nMessage:\n${form.message}` 
      );
      const callMeBotURL = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${whatsappText}&apikey=${CALLMEBOT_APIKEY}`;

      // Fire and forget — WhatsApp delivery doesn't block the success state
      fetch(callMeBotURL).catch(() => {});

      // ── 3. Success ──
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);

    } catch (err) {
      console.error("Send error:", err);
      setError("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAVBAR ── */}
      <nav>
        <div className="nav-logo" onClick={() => scrollTo("home")}>AB.</div>

        <ul className="nav-links">
          {NAV_ITEMS.map((s) => (
            <li key={s}>
              <a href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
                {s}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {/* Dark / Light toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="theme-toggle-knob">{darkMode ? "🌙" : "☀️"}</div>
          </button>

          <button className="btn-hire" onClick={() => scrollTo("contact")}>Hire Me</button>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_ITEMS.map((s) => (
          <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
            {s}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-mesh" />
        <div className="hero-grid-bg" />
        <div className="hero-orb" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for new opportunities
          </div>
          <h1 className="hero-name">
            Ayushi
            <strong>Bobde</strong>
          </h1>
          <p className="hero-role">
            Senior Frontend Developer ·{" "}
            <span>React &amp; Micro Frontend Specialist</span>
          </p>
          <p className="hero-tagline">
            Architecting enterprise-grade React experiences for global financial
            institutions — where performance, precision, and scalability are
            non-negotiable.
          </p>
          <div className="hero-stats">
            <div>
              <div className="stat-num">5.5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div>
              <div className="stat-num">5</div>
              <div className="stat-label">Enterprise Clients</div>
            </div>
            <div>
              <div className="stat-num">3</div>
              <div className="stat-label">Companies</div>
            </div>
          </div>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>
              View My Work
            </button>
            <button className="btn-ghost" onClick={() => scrollTo("contact")}>
              Get in Touch
            </button>
            {/* ── RESUME DOWNLOAD BUTTON ── */}
            <a className="btn-resume" href="/resume-ayushi-bobde.pdf" download>
              <span className="btn-resume-icon">⬇</span>
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section">
        <div className="section-header">
          <div className="section-label">About Me</div>
          <h2 className="section-title">
            Building for the <em>world's most</em>
            <br />demanding industries
          </h2>
          <div className="section-line" />
        </div>
        <p className="about-text">
          I'm a Senior Frontend Developer based in Nagpur, India, with 5.5 years
          of experience crafting high-performance web applications for global
          financial and insurance institutions. I specialize in React, TypeScript,
          and Micro Frontend architecture — building systems that are not just
          functional, but engineered for scale. From CitiBank to UBS Bank, my
          work has served millions of users in regulated, high-stakes environments
          where every pixel and every millisecond matters.
        </p>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills">
        <div className="section-header">
          <div className="section-label">Technical Skills</div>
          <h2 className="section-title">My <em>Tech Stack</em></h2>
          <div className="section-line" />
        </div>

        {/* Skill category cards */}
        <div className="skills-top">
          {SKILL_CATEGORIES.map((s) => (
            <div key={s.title} className="skill-card">
              <div className="skill-icon">{s.icon}</div>
              <div className="skill-title">{s.title}</div>
              <div className="tags">
                {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Animated skill bars */}
        <div ref={barsRef} className="skill-bars">
          <div className="skill-bars-title">Proficiency Overview</div>
          {SKILL_BARS.map((b) => (
            <SkillBar key={b.name} name={b.name} pct={b.pct} animate={barsVisible} />
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="exp-section">
        <div className="section-header">
          <div className="section-label">Work History</div>
          <h2 className="section-title">5.5 Years of <em>Enterprise</em> Impact</h2>
          <div className="section-line" />
        </div>
        <div className="timeline">
          {EXPERIENCE.map((e) => (
            <div key={e.company} className="exp-item">
              <div className="exp-dot" />
              <div className="exp-period">{e.period}</div>
              <div className="exp-company">{e.company}</div>
              <div className="exp-role">{e.role}</div>
              <div className="exp-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="section-header">
          <div className="section-label">Featured Work</div>
          <h2 className="section-title">Enterprise <em>Client</em> Projects</h2>
          <div className="section-line" />
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div key={p.name} className="project-card">
              <div className="project-domain">{p.domain}</div>
              <div className="project-name">{p.name}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="tech-chips">
                {p.tech.map((t) => <span key={t} className="tech-chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" className="certs-section">
        <div className="section-header">
          <div className="section-label">Credentials</div>
          <h2 className="section-title">Certifications &amp; <em>Learning</em></h2>
          <div className="section-line" />
        </div>
        <div className="certs-row">
          {CERTS.map((c) => (
            <div key={c.name} className="cert-card">
              <div className="cert-icon">{c.icon}</div>
              <div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-issuer">{c.issuer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials">
        <div className="section-header">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What <em>Colleagues</em> Say</h2>
          <div className="section-line" />
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Let's <em>Work</em> Together</h2>
          <div className="section-line" />
        </div>
        <div className="contact-inner">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text" placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Subject</label>
            <input
              type="text" placeholder="Freelance project / Full-time opportunity"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Message</label>
            <textarea
              placeholder="Tell me about your project or opportunity..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          {/* Add error message above button */}
          {error && (
            <p style={{ color: "#f87171", fontSize: "0.78rem", marginBottom: "0.5rem" }}>
              ⚠ {error}
            </p>
          )}

          <button
            className={`btn-send${sent ? " sent" : ""}`}
            onClick={send}
            disabled={sending || sent}
          >
            {sending ? "Sending..." : sent ? "✓ Sent! Check your WhatsApp 📱" : "Send Message →"}
          </button>
          <div className="contact-links">
            <a className="contact-link" href="mailto:ayushibobde1234567@gmail.com">
              ✉ ayushibobde1234567@gmail.com
            </a>
            <a className="contact-link" href="https://www.linkedin.com/in/ayushi-bobde-8b66b1129/" target="_blank" rel="noreferrer">
              in LinkedIn
            </a>
            <a className="contact-link" href="https://github.com/ayushibobde" target="_blank" rel="noreferrer">
              ⌥ GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-copy">© 2025 Ayushi Bobde · Senior Frontend Developer</div>
        <div className="footer-right">Built with React &amp; passion ✦</div>
      </footer>
    </>
  );
}
