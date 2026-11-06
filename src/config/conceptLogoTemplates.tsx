import React from 'react';
import { LogoTemplate } from './logoTemplates';

// Helper to calculate responsive SVG font-size and letter-spacing based on text length
const getSvgFontMetrics = (text: string, baseSize: number = 56, maxChars: number = 8) => {
  const len = Math.max(1, text.length);
  if (len <= 4) return { fontSize: baseSize * 1.15, letterSpacing: 4 };
  if (len <= 6) return { fontSize: baseSize, letterSpacing: 3 };
  if (len <= 8) return { fontSize: baseSize * 0.88, letterSpacing: 2 };
  if (len <= 12) return { fontSize: Math.max(22, Math.round((baseSize * maxChars) / len)), letterSpacing: 1 };
  return { fontSize: Math.max(18, Math.round((baseSize * 7) / len)), letterSpacing: 0 };
};

export const CONCEPT_LOGO_TEMPLATES: LogoTemplate[] = [
  // ─── 1. GOLD LUXURY ──────────────────────────────────────────
  {
    id: 'concept-gold-luxury',
    name: 'Gold Luxury',
    category: 'Brand Concepts',
    defaultColor: '#c59b27',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif font-bold',
    shape: 'emblem',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M50 16 L53 22 L60 23 L55 28 L56 35 L50 31 L44 35 L45 28 L40 23 L47 22 Z" fill="#d4af37" />
        <path d="M22 68 C 16 48, 25 32, 42 26 C 36 34, 34 46, 38 60 Z" fill="#b8860b" opacity="0.85" />
        <path d="M78 68 C 84 48, 75 32, 58 26 C 64 34, 66 46, 62 60 Z" fill="#b8860b" opacity="0.85" />
        <circle cx="50" cy="54" r="16" stroke="#d4af37" strokeWidth="2.5" />
        <path d="M38 78 Q 50 86 62 78" stroke="#aa771c" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const displayTagline = (tagline || 'LUXURY').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 48, 7);

      return (
        <svg viewBox="0 0 500 420" className="w-full h-full max-h-[380px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gold-grad-rich" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff1b8" />
              <stop offset="30%" stopColor="#d4af37" />
              <stop offset="65%" stopColor="#aa771c" />
              <stop offset="85%" stopColor="#e5c158" />
              <stop offset="100%" stopColor="#875811" />
            </linearGradient>
            <filter id="gold-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#875811" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Top Filigree Crown & Star Flourish */}
          <g transform="translate(250, 75)" textAnchor="middle" filter="url(#gold-shadow)">
            <path d="M0 -32 L4 -20 L16 -20 L7 -12 L10 0 L0 -7 L-10 0 L-7 -12 L-16 -20 L-4 -20 Z" fill="url(#gold-grad-rich)" />
            <path d="M-50 -8 Q 0 -22 50 -8 Q 25 -2 0 -2 Q -25 -2 -50 -8 Z" fill="url(#gold-grad-rich)" />
            <circle cx="-65" cy="-8" r="3.5" fill="url(#gold-grad-rich)" />
            <circle cx="65" cy="-8" r="3.5" fill="url(#gold-grad-rich)" />
          </g>

          {/* Left Laurel Branch */}
          <g fill="url(#gold-grad-rich)" opacity="0.9" filter="url(#gold-shadow)">
            <path d="M120 220 C 105 160, 135 110, 180 85 C 160 105, 148 135, 155 180 C 158 200, 145 215, 120 220 Z" />
            <ellipse cx="140" cy="115" rx="14" ry="7" transform="rotate(-30 140 115)" />
            <ellipse cx="125" cy="145" rx="15" ry="7" transform="rotate(-15 125 145)" />
            <ellipse cx="118" cy="180" rx="16" ry="7" transform="rotate(5 118 180)" />
            <ellipse cx="120" cy="215" rx="16" ry="7" transform="rotate(25 120 215)" />
            <ellipse cx="132" cy="250" rx="16" ry="7" transform="rotate(45 132 250)" />
            <ellipse cx="155" cy="280" rx="15" ry="7" transform="rotate(65 155 280)" />
          </g>

          {/* Right Laurel Branch */}
          <g fill="url(#gold-grad-rich)" opacity="0.9" filter="url(#gold-shadow)">
            <path d="M380 220 C 395 160, 365 110, 320 85 C 340 105, 352 135, 345 180 C 342 200, 355 215, 380 220 Z" />
            <ellipse cx="360" cy="115" rx="14" ry="7" transform="rotate(30 360 115)" />
            <ellipse cx="375" cy="145" rx="15" ry="7" transform="rotate(15 375 145)" />
            <ellipse cx="382" cy="180" rx="16" ry="7" transform="rotate(-5 382 180)" />
            <ellipse cx="380" cy="215" rx="16" ry="7" transform="rotate(-25 380 215)" />
            <ellipse cx="368" cy="250" rx="16" ry="7" transform="rotate(-45 368 250)" />
            <ellipse cx="345" cy="280" rx="15" ry="7" transform="rotate(-65 345 280)" />
          </g>

          {/* Curved Header Tag: GOLD */}
          <text
            x="250"
            y="130"
            textAnchor="middle"
            fill="url(#gold-grad-rich)"
            fontFamily="Cinzel, serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="6"
          >
            PREMIUM
          </text>

          {/* Dynamic Brand Name in Serif Gold */}
          <text
            x="250"
            y="215"
            textAnchor="middle"
            fill="url(#gold-grad-rich)"
            fontFamily="Cinzel, 'Playfair Display', Georgia, serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="4"
            filter="url(#gold-shadow)"
          >
            {displayBrand}
          </text>

          {/* Horizontal Accent Line with Diamond */}
          <g transform="translate(250, 240)">
            <line x1="-80" y1="0" x2="-15" y2="0" stroke="url(#gold-grad-rich)" strokeWidth="1.5" />
            <polygon points="0,-4 4,0 0,4 -4,0" fill="url(#gold-grad-rich)" />
            <line x1="15" y1="0" x2="80" y2="0" stroke="url(#gold-grad-rich)" strokeWidth="1.5" />
          </g>

          {/* Tagline / Subtitle */}
          <text
            x="250"
            y="270"
            textAnchor="middle"
            fill="url(#gold-grad-rich)"
            fontFamily="Cinzel, 'Playfair Display', serif"
            fontSize="16"
            fontWeight="700"
            letterSpacing="8"
          >
            {displayTagline}
          </text>

          {/* Bottom Laurel Flourish Tie */}
          <g transform="translate(250, 310)" fill="url(#gold-grad-rich)">
            <circle cx="0" cy="0" r="5" />
            <path d="M-8 -2 Q -30 20 -45 5 Q -25 35 0 8 Q 25 35 45 5 Q 30 20 8 -2 Z" />
          </g>
        </svg>
      );
    }
  },

  // ─── 2. CHROME METALLIC ──────────────────────────────────────
  {
    id: 'concept-chrome-metallic',
    name: 'Chrome Metallic',
    category: 'Brand Concepts',
    defaultColor: '#64748b',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <defs>
          <linearGradient id="mini-chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>
        <polygon points="50,15 85,80 15,80" fill="url(#mini-chrome)" stroke="#334155" strokeWidth="3" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 64, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chrome-reflection" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e2e8f0" />
              <stop offset="48%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="53%" stopColor="#1e293b" />
              <stop offset="68%" stopColor="#64748b" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <linearGradient id="chrome-bevel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <filter id="chrome-3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Dynamic Chrome Brand Text */}
          <g filter="url(#chrome-3d-shadow)">
            {/* Dark Beveled Background Outlines */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fontFamily="Montserrat, 'Plus Jakarta Sans', sans-serif"
              fontSize={fontSize}
              fontWeight="900"
              letterSpacing="6"
              fill="none"
              stroke="#0f172a"
              strokeWidth="10"
              strokeLinejoin="miter"
            >
              {displayBrand}
            </text>

            <text
              x="250"
              y="180"
              textAnchor="middle"
              fontFamily="Montserrat, 'Plus Jakarta Sans', sans-serif"
              fontSize={fontSize}
              fontWeight="900"
              letterSpacing="6"
              fill="none"
              stroke="url(#chrome-bevel)"
              strokeWidth="5"
              strokeLinejoin="miter"
            >
              {displayBrand}
            </text>

            {/* Liquid Chrome Face */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fontFamily="Montserrat, 'Plus Jakarta Sans', sans-serif"
              fontSize={fontSize}
              fontWeight="900"
              letterSpacing="6"
              fill="url(#chrome-reflection)"
            >
              {displayBrand}
            </text>
          </g>

          {/* Optional Tagline */}
          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="14"
              fontWeight="700"
              letterSpacing="8"
              fill="#475569"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 3. NEON GLOW ────────────────────────────────────────────
  {
    id: 'concept-neon-glow',
    name: 'Neon Glow',
    category: 'Brand Concepts',
    defaultColor: '#00f0ff',
    defaultBg: '#080811',
    defaultFont: 'font-sans font-bold',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="32" stroke="#00f0ff" strokeWidth="5" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
        <circle cx="50" cy="50" r="16" stroke="#ff007f" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 6px #ff007f)' }} />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors, options) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const mid = Math.ceil(displayBrand.length / 2);
      const part1 = displayBrand.slice(0, mid);
      const part2 = displayBrand.slice(mid);
      const { fontSize } = getSvgFontMetrics(displayBrand, 62, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Cyan Neon Filters */}
            <filter id="neon-cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pink Neon Filters */}
            <filter id="neon-pink-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="pblur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="pblur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="pblur3" />
              <feMerge>
                <feMergeNode in="pblur3" />
                <feMergeNode in="pblur2" />
                <feMergeNode in="pblur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Floor Ambient Glow */}
            <radialGradient id="floor-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#ff007f" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#080811" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Wall/Floor Reflection */}
          <ellipse cx="250" cy="210" rx="200" ry="60" fill="url(#floor-glow)" />

          {/* Dual Cyan & Pink Tube Letters */}
          <g fontFamily="Plus Jakarta Sans, Montserrat, sans-serif" fontSize={fontSize} fontWeight="800" letterSpacing="4">
            {/* Outer Gas Glow Aura */}
            <text x="250" y="175" textAnchor="middle">
              <tspan fill="#00f0ff" stroke="#00f0ff" strokeWidth="8" filter="url(#neon-cyan-glow)" opacity="0.9">
                {part1}
              </tspan>
              <tspan fill="#ff007f" stroke="#ff007f" strokeWidth="8" filter="url(#neon-pink-glow)" opacity="0.9">
                {part2}
              </tspan>
            </text>

            {/* Bright White Hot Core Filament */}
            <text x="250" y="175" textAnchor="middle">
              <tspan fill="#ffffff" stroke="#ffffff" strokeWidth="2.5">
                {part1}
              </tspan>
              <tspan fill="#ffffff" stroke="#ffffff" strokeWidth="2.5">
                {part2}
              </tspan>
            </text>
          </g>

          {/* Optional Tagline with Subtle Cyan Glow */}
          {tagline.trim() && (
            <text
              x="250"
              y="225"
              textAnchor="middle"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="14"
              fontWeight="700"
              letterSpacing="6"
              fill="#00f0ff"
              filter="url(#neon-cyan-glow)"
              opacity="0.8"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 4. HANDWRITTEN SIGNATURE ────────────────────────────────
  {
    id: 'concept-handwritten-signature',
    name: 'Handwritten Signature',
    category: 'Brand Concepts',
    defaultColor: '#1e293b',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M15,60 Q35,20 50,45 T85,40" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <path d="M25,75 Q50,65 80,72" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = brandName || 'Vyopic';
      const len = displayBrand.length;
      const fontSize = len <= 6 ? 68 : len <= 10 ? 52 : Math.max(34, Math.round(520 / len));

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Flowing Cursive Signature */}
          <text
            x="240"
            y="170"
            textAnchor="middle"
            fontFamily="'Great Vibes', 'Caveat', cursive"
            fontSize={fontSize}
            fill="#18181b"
            fontWeight="500"
            style={{ transform: 'rotate(-4deg)', transformOrigin: '240px 170px' }}
          >
            {displayBrand}
          </text>

          {/* Expressive Underline Calligraphy Loop */}
          <path
            d="M 120 195 Q 220 225, 330 190 T 410 205 Q 360 225, 230 220 Q 140 215, 120 195 Z"
            fill="#18181b"
            opacity="0.9"
            style={{ transform: 'rotate(-4deg)', transformOrigin: '240px 190px' }}
          />

          {tagline.trim() && (
            <text
              x="250"
              y="245"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="6"
              fill="#64748b"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 5. BRUTALIST 3D ─────────────────────────────────────────
  {
    id: 'concept-brutalist',
    name: 'Brutalist 3D',
    category: 'Brand Concepts',
    defaultColor: '#475569',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="25" y="25" width="50" height="50" fill="#64748b" stroke="#0f172a" strokeWidth="5" />
        <rect x="35" y="35" width="40" height="40" fill="#0f172a" opacity="0.3" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'BRUTALIST').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 62, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stone-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Deep Chiseled Extruded Drop Layers */}
          <g fontFamily="'Russo One', 'Anton', sans-serif" fontSize={fontSize} fontWeight="900" letterSpacing="4">
            {/* Deepest base shadow */}
            <text x="256" y="184" textAnchor="middle" fill="#0f172a">
              {displayBrand}
            </text>
            <text x="254" y="182" textAnchor="middle" fill="#1e293b">
              {displayBrand}
            </text>
            <text x="252" y="180" textAnchor="middle" fill="#334155">
              {displayBrand}
            </text>

            {/* Chiseled Stone Face */}
            <text
              x="248"
              y="176"
              textAnchor="middle"
              fill="url(#stone-gradient)"
              stroke="#1e293b"
              strokeWidth="3"
            >
              {displayBrand}
            </text>

            {/* Inner chiseled crack highlight */}
            <text
              x="248"
              y="176"
              textAnchor="middle"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1"
              opacity="0.7"
            >
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="230"
              textAnchor="middle"
              fontFamily="'Russo One', sans-serif"
              fontSize="13"
              letterSpacing="6"
              fill="#334155"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 6. MINIMAL LINE ─────────────────────────────────────────
  {
    id: 'concept-minimal-line',
    name: 'Minimal Line',
    category: 'Brand Concepts',
    defaultColor: '#1e293b',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-light',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="3" />
        <circle cx="50" cy="50" r="24" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 58, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Double-Line Inline Typography */}
          <g fontFamily="'Poiret One', 'Montserrat', sans-serif" fontSize={fontSize} fontWeight="300" letterSpacing="10">
            {/* Outer crisp outline */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3.5"
            >
              {displayBrand}
            </text>

            {/* Inner fine parallel line */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="#64748b"
              strokeWidth="1"
            >
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="230"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="400"
              letterSpacing="8"
              fill="#94a3b8"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 7. 3D BUBBLE BALLOON ────────────────────────────────────
  {
    id: 'concept-3d-bubble',
    name: '3D Bubble Balloon',
    category: 'Brand Concepts',
    defaultColor: '#c084fc',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="45" cy="45" r="26" fill="#c084fc" />
        <ellipse cx="38" cy="35" rx="8" ry="4" fill="#ffffff" opacity="0.8" />
        <circle cx="65" cy="60" r="18" fill="#93c5fd" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'BUBBLE').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 62, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bubble-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="45%" stopColor="#c084fc" />
              <stop offset="85%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            <filter id="bubble-drop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="8" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Inflated 3D Bubble Text */}
          <g filter="url(#bubble-drop)" fontFamily="'Titan One', 'Fredoka', cursive" fontSize={fontSize} fontWeight="900" letterSpacing="4">
            {/* Dark Bevel Rim */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="8"
              strokeLinejoin="round"
            >
              {displayBrand}
            </text>

            {/* Candy Pastel Face */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="url(#bubble-gradient)"
              stroke="#ffffff"
              strokeWidth="2"
            >
              {displayBrand}
            </text>

            {/* Specular White Pillow Highlight */}
            <text
              x="247"
              y="176"
              textAnchor="middle"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.85"
            >
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Titan One, sans-serif"
              fontSize="14"
              letterSpacing="4"
              fill="#a855f7"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 8. GRAFFITI STREET TAG ──────────────────────────────────
  {
    id: 'concept-graffiti',
    name: 'Graffiti Street Tag',
    category: 'Brand Concepts',
    defaultColor: '#9333ea',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M20,60 Q30,20 50,45 Q70,20 80,60 Z" fill="#9333ea" stroke="#18042b" strokeWidth="5" />
        <circle cx="35" cy="75" r="4" fill="#18042b" />
        <circle cx="65" cy="80" r="3" fill="#ec4899" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'GRAFFITI').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 64, 7);

      return (
        <svg viewBox="0 0 500 340" className="w-full h-full max-h-[320px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="graffiti-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Spray paint mist blur */}
            <filter id="spray-aura" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
            </filter>
          </defs>

          {/* Ambient Purple Spray Aura */}
          <text
            x="250"
            y="180"
            textAnchor="middle"
            fontFamily="'Permanent Marker', cursive"
            fontSize={fontSize * 1.05}
            fill="#d946ef"
            filter="url(#spray-aura)"
            opacity="0.6"
          >
            {displayBrand}
          </text>

          {/* Urban Graffiti Letterforms */}
          <g fontFamily="'Permanent Marker', cursive" fontSize={fontSize} letterSpacing="4">
            {/* Thick Dark Outer Comic/Graffiti Shell */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="#18042b"
              strokeWidth="16"
              strokeLinejoin="round"
            >
              {displayBrand}
            </text>

            {/* Vivid Spray Gradient Fill */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="url(#graffiti-fill)"
            >
              {displayBrand}
            </text>

            {/* Inner White Shine Highlight */}
            <text
              x="248"
              y="176"
              textAnchor="middle"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              opacity="0.8"
            >
              {displayBrand}
            </text>
          </g>

          {/* Dripping Paint Splatters & Runs */}
          <g fill="#18042b">
            <path d="M190 195 Q 188 230 191 245 Q 192 250 190 250 Q 188 250 187 245 Z" />
            <circle cx="190" cy="256" r="3" />
            <path d="M310 195 Q 312 235 309 255 Q 308 260 310 260 Q 312 260 313 255 Z" fill="#ec4899" />
            <circle cx="310" cy="268" r="4" fill="#ec4899" />
            <circle cx="140" cy="235" r="3" fill="#a855f7" />
            <circle cx="370" cy="230" r="3.5" fill="#18042b" />
          </g>
        </svg>
      );
    }
  },

  // ─── 9. VINTAGE HERITAGE BADGE ───────────────────────────────
  {
    id: 'concept-vintage-badge',
    name: 'Vintage Heritage Badge',
    category: 'Brand Concepts',
    defaultColor: '#854d0e',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif font-black',
    shape: 'emblem',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M20,30 Q50,15 80,30 L80,65 Q50,85 20,65 Z" fill="#78350f" stroke="#b45309" strokeWidth="4" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#fef3c7" strokeWidth="3" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 46, 7);

      return (
        <svg viewBox="0 0 500 380" className="w-full h-full max-h-[350px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="badge-leather" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#290e02" />
            </linearGradient>

            <linearGradient id="badge-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            <filter id="badge-drop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Heritage Shield Plaque */}
          <g filter="url(#badge-drop)">
            <path
              d="M 120 100 Q 250 65 380 100 L 380 230 Q 250 290 120 230 Z"
              fill="url(#badge-leather)"
              stroke="url(#badge-gold)"
              strokeWidth="6"
            />
            {/* Inner Stitched Rim */}
            <path
              d="M 132 112 Q 250 82 368 112 L 368 220 Q 250 272 132 220 Z"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Corner Stud Rivets */}
            <circle cx="140" cy="120" r="4" fill="url(#badge-gold)" />
            <circle cx="360" cy="120" r="4" fill="url(#badge-gold)" />
            <circle cx="140" cy="215" r="4" fill="url(#badge-gold)" />
            <circle cx="360" cy="215" r="4" fill="url(#badge-gold)" />
          </g>

          {/* Arched Top Header */}
          <text
            x="250"
            y="135"
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="6"
            fill="#fef08a"
          >
            ORIGINAL TRADEMARK
          </text>

          {/* Center Brand Name in Heritage Serif */}
          <text
            x="250"
            y="185"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="4"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            paintOrder="stroke fill"
          >
            {displayBrand}
          </text>

          {/* Bottom Ribbon Banner */}
          <g transform="translate(250, 248)" filter="url(#badge-drop)">
            <path
              d="M -110 -15 L 110 -15 L 95 15 L -95 15 Z"
              fill="url(#badge-gold)"
              stroke="#451a03"
              strokeWidth="2"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fontFamily="'Cinzel', serif"
              fontSize="13"
              fontWeight="900"
              letterSpacing="4"
              fill="#451a03"
            >
              {tagline.trim() ? tagline.toUpperCase() : 'EST. 2024'}
            </text>
          </g>
        </svg>
      );
    }
  },

  // ─── 10. FUTURISTIC CYBERPUNK ────────────────────────────────
  {
    id: 'concept-futuristic-cyberpunk',
    name: 'Futuristic Cyberpunk',
    category: 'Brand Concepts',
    defaultColor: '#06b6d4',
    defaultBg: '#ffffff',
    defaultFont: 'font-mono font-bold',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="20,30 80,30 85,70 15,70" stroke="#06b6d4" strokeWidth="4" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#22d3ee" strokeWidth="3" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 54, 7);

      return (
        <svg viewBox="0 0 500 340" className="w-full h-full max-h-[310px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cyber-frame-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="100%" stopColor="#0c1829" />
            </linearGradient>

            <filter id="cyber-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#06b6d4" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Cyberpunk HUD Frame */}
          <g filter="url(#cyber-glow)">
            {/* Outer Dark Poly Frame */}
            <polygon
              points="100,90 120,70 380,70 400,90 400,230 380,250 120,250 100,230"
              fill="url(#cyber-frame-bg)"
              stroke="#06b6d4"
              strokeWidth="3.5"
            />

            {/* Corner Tech Brackets & Circuit Lines */}
            <line x1="85" y1="65" x2="115" y2="65" stroke="#38bdf8" strokeWidth="3" />
            <line x1="85" y1="65" x2="85" y2="95" stroke="#38bdf8" strokeWidth="3" />

            <line x1="415" y1="65" x2="385" y2="65" stroke="#38bdf8" strokeWidth="3" />
            <line x1="415" y1="65" x2="415" y2="95" stroke="#38bdf8" strokeWidth="3" />

            <line x1="85" y1="255" x2="115" y2="255" stroke="#38bdf8" strokeWidth="3" />
            <line x1="85" y1="255" x2="85" y2="225" stroke="#38bdf8" strokeWidth="3" />

            <line x1="415" y1="255" x2="385" y2="255" stroke="#38bdf8" strokeWidth="3" />
            <line x1="415" y1="255" x2="415" y2="225" stroke="#38bdf8" strokeWidth="3" />

            {/* Top Telemetry Data Marks */}
            <line x1="140" y1="78" x2="170" y2="78" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="330" y1="78" x2="360" y2="78" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* Central Glowing Cyberpunk Brand Name */}
          <text
            x="250"
            y="170"
            textAnchor="middle"
            fontFamily="'Orbitron', 'Syncopate', sans-serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="6"
            fill="#38bdf8"
            stroke="#082f49"
            strokeWidth="4"
            paintOrder="stroke fill"
            filter="url(#cyber-glow)"
          >
            {displayBrand}
          </text>

          {/* Subtitle Plate: CYBERPUNK */}
          <g transform="translate(250, 215)">
            <rect x="-80" y="-12" width="160" height="24" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fontFamily="'Orbitron', sans-serif"
              fontSize="12"
              fontWeight="800"
              letterSpacing="4"
              fill="#ffffff"
            >
              {tagline.trim() ? tagline.toUpperCase() : 'CYBERPUNK'}
            </text>
          </g>
        </svg>
      );
    }
  },

  // ─── 11. SERIF ELEGANT (EDITORIAL) ───────────────────────────
  {
    id: 'concept-serif-elegant',
    name: 'Serif Elegant',
    category: 'Brand Concepts',
    defaultColor: '#0f172a',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <text x="50" y="65" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="50" fontWeight="900" fill={color}>
          S
        </text>
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 66, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* High-Contrast Editorial Fashion Serif */}
          <text
            x="250"
            y="180"
            textAnchor="middle"
            fontFamily="'Playfair Display', 'Cinzel', serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="6"
            fill="#0f172a"
          >
            {displayBrand}
          </text>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="8"
              fill="#64748b"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 12. PIXEL ART 8-BIT ─────────────────────────────────────
  {
    id: 'concept-pixel-art',
    name: 'Pixel Art 8-Bit',
    category: 'Brand Concepts',
    defaultColor: '#ec4899',
    defaultBg: '#ffffff',
    defaultFont: 'font-mono font-bold',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="20" width="20" height="20" fill="#06b6d4" stroke="#000000" strokeWidth="3" />
        <rect x="40" y="20" width="20" height="20" fill="#ec4899" stroke="#000000" strokeWidth="3" />
        <rect x="60" y="20" width="20" height="20" fill="#3b82f6" stroke="#000000" strokeWidth="3" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 42, 6);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pixel-arcade-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Stepped Pixel Outline */}
          <g fontFamily="'Press Start 2P', monospace" fontSize={fontSize} letterSpacing="3">
            {/* Thick 8-bit black borders */}
            <text x="254" y="184" textAnchor="middle" fill="#000000">
              {displayBrand}
            </text>
            <text x="246" y="184" textAnchor="middle" fill="#000000">
              {displayBrand}
            </text>
            <text x="250" y="186" textAnchor="middle" fill="#000000">
              {displayBrand}
            </text>
            <text x="250" y="174" textAnchor="middle" fill="#000000">
              {displayBrand}
            </text>

            {/* Arcade Pixel Face */}
            <text x="250" y="180" textAnchor="middle" fill="url(#pixel-arcade-gradient)">
              {displayBrand}
            </text>
          </g>

          {/* 8-Bit Pixel Sparkles */}
          <g fill="#ec4899">
            <rect x="110" y="125" width="8" height="8" />
            <rect x="380" y="130" width="8" height="8" fill="#38bdf8" />
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="'Press Start 2P', monospace"
              fontSize="12"
              letterSpacing="4"
              fill="#000000"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 13. RAW BRUSH STROKE ────────────────────────────────────
  {
    id: 'concept-brush-stroke',
    name: 'Raw Brush Stroke',
    category: 'Brand Concepts',
    defaultColor: '#0a0a0a',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-bold',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M15,50 Q45,25 85,50" stroke="#0a0a0a" strokeWidth="12" strokeLinecap="round" />
        <circle cx="75" cy="70" r="4" fill="#0a0a0a" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 64, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Japanese Sumi-e Brush Typography */}
          <text
            x="245"
            y="175"
            textAnchor="middle"
            fontFamily="'Permanent Marker', cursive"
            fontSize={fontSize}
            fontWeight="bold"
            letterSpacing="6"
            fill="#09090b"
            style={{ transform: 'rotate(-2deg)', transformOrigin: '245px 175px' }}
          >
            {displayBrand}
          </text>

          {/* Vigorous Raw Brush Stroke Underline */}
          <path
            d="M 110 200 C 180 185, 300 215, 390 195 C 330 215, 200 205, 110 200 Z"
            fill="#09090b"
            style={{ transform: 'rotate(-2deg)', transformOrigin: '245px 200px' }}
          />

          {tagline.trim() && (
            <text
              x="250"
              y="245"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="700"
              letterSpacing="8"
              fill="#52525b"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 14. PAPER EMBOSSED 3D ───────────────────────────────────
  {
    id: 'concept-embossed',
    name: 'Paper Embossed 3D',
    category: 'Brand Concepts',
    defaultColor: '#94a3b8',
    defaultBg: '#ececec',
    defaultFont: 'font-serif font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="20" width="60" height="60" rx="8" fill="#ececec" stroke="#ffffff" strokeWidth="3" />
        <circle cx="50" cy="50" r="16" fill="#ececec" stroke="#cbd5e1" strokeWidth="2" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 62, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Textured Paper Plate */}
          <rect x="50" y="60" width="400" height="200" rx="8" fill="#ececec" stroke="#e2e8f0" strokeWidth="1" />

          {/* Letterpress Deboss / Emboss Effect: Dual Bevels */}
          <g fontFamily="'Cinzel', 'Playfair Display', serif" fontSize={fontSize} fontWeight="900" letterSpacing="6">
            {/* Soft Dark Bottom-Right Drop Shadow */}
            <text x="253" y="178" textAnchor="middle" fill="none" stroke="#94a3b8" strokeWidth="3" opacity="0.6">
              {displayBrand}
            </text>

            {/* Crisp Pure-White Top-Left Specular Bevel */}
            <text x="248" y="172" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.95">
              {displayBrand}
            </text>

            {/* Subtle Tonal Paper Fill */}
            <text x="250" y="175" textAnchor="middle" fill="#ececec">
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="225"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="12"
              fontWeight="700"
              letterSpacing="6"
              fill="#94a3b8"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 15. HOLOGRAPHIC FOIL ────────────────────────────────────
  {
    id: 'concept-holographic',
    name: 'Holographic Foil',
    category: 'Brand Concepts',
    defaultColor: '#c084fc',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,15 85,80 15,80" fill="url(#mini-holo)" stroke="#94a3b8" strokeWidth="2" />
        <defs>
          <linearGradient id="mini-holo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 64, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="holo-rainbow-prism" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="25%" stopColor="#c084fc" />
              <stop offset="45%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#facc15" />
              <stop offset="90%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <filter id="holo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#a855f7" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Prismatic Rainbow Hologram */}
          <g filter="url(#holo-glow)" fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif" fontSize={fontSize} fontWeight="900" letterSpacing="6">
            {/* Fine Silver Edge Rim */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinejoin="round"
            >
              {displayBrand}
            </text>

            {/* Iridescent Prism Foil */}
            <text
              x="250"
              y="180"
              textAnchor="middle"
              fill="url(#holo-rainbow-prism)"
            >
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="700"
              letterSpacing="8"
              fill="#94a3b8"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 16. MODERN OUTLINE ──────────────────────────────────────
  {
    id: 'concept-outline',
    name: 'Modern Outline',
    category: 'Brand Concepts',
    defaultColor: '#0f172a',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-bold',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="25" y="25" width="50" height="50" stroke="#0f172a" strokeWidth="4" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 64, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Clean Hollow Stroke Typography */}
          <text
            x="250"
            y="180"
            textAnchor="middle"
            fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="6"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          >
            {displayBrand}
          </text>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="8"
              fill="#64748b"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 17. STREETWEAR BOLD ─────────────────────────────────────
  {
    id: 'concept-streetwear-bold',
    name: 'Streetwear Bold',
    category: 'Brand Concepts',
    defaultColor: '#0a0a0a',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="20" width="60" height="60" fill="#0a0a0a" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#ffffff" strokeWidth="6" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 74, 6);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          {/* Condensed Massive Streetwear Block Lettering */}
          <text
            x="250"
            y="185"
            textAnchor="middle"
            fontFamily="'Anton', 'Russo One', sans-serif"
            fontSize={fontSize}
            letterSpacing="4"
            fill="#09090b"
          >
            {displayBrand}
          </text>

          {/* Distressed Stencil Slash Cuts */}
          <line x1="160" y1="140" x2="340" y2="140" stroke="#ffffff" strokeWidth="3" />

          {tagline.trim() && (
            <text
              x="250"
              y="245"
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontSize="12"
              fontWeight="800"
              letterSpacing="8"
              fill="#71717a"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 18. 3D OCEAN EXTRUDE ────────────────────────────────────
  {
    id: 'concept-3d-ocean',
    name: '3D Ocean Extrude',
    category: 'Brand Concepts',
    defaultColor: '#0284c7',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans font-black',
    shape: 'horizontal',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,15 85,80 15,80" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 62, 7);

      return (
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[300px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ocean-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <filter id="ocean-ambient-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="4" dy="12" stdDeviation="8" floodColor="#0c4a6e" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Deep 3D Extrusion Layers */}
          <g filter="url(#ocean-ambient-shadow)" fontFamily="'Russo One', sans-serif" fontSize={fontSize} letterSpacing="4">
            {/* Deepest Extrusion in Navy */}
            <text x="256" y="186" textAnchor="middle" fill="#082f49">
              {displayBrand}
            </text>
            <text x="254" y="184" textAnchor="middle" fill="#0c4a6e">
              {displayBrand}
            </text>
            <text x="252" y="182" textAnchor="middle" fill="#075985">
              {displayBrand}
            </text>

            {/* Ocean Blue Beveled Face */}
            <text
              x="248"
              y="178"
              textAnchor="middle"
              fill="url(#ocean-face)"
              stroke="#0284c7"
              strokeWidth="2"
            >
              {displayBrand}
            </text>

            {/* Specular White Top Ridge */}
            <text
              x="248"
              y="178"
              textAnchor="middle"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.8"
            >
              {displayBrand}
            </text>
          </g>

          {tagline.trim() && (
            <text
              x="250"
              y="235"
              textAnchor="middle"
              fontFamily="Russo One, sans-serif"
              fontSize="13"
              letterSpacing="6"
              fill="#0369a1"
            >
              {tagline.toUpperCase()}
            </text>
          )}
        </svg>
      );
    }
  },

  // ─── 19. VINTAGE EMBLEM LAUREL ───────────────────────────────
  {
    id: 'concept-vintage-emblem',
    name: 'Vintage Emblem Laurel',
    category: 'Brand Concepts',
    defaultColor: '#b48a43',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif font-black',
    shape: 'emblem',
    layout: 'custom-style',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="35" stroke="#b48a43" strokeWidth="4" />
        <circle cx="50" cy="50" r="28" stroke="#aa771c" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    ),
    renderCustomLogo: (brandName, tagline, colors) => {
      const displayBrand = (brandName || 'VYOPIC').trim().toUpperCase();
      const { fontSize } = getSvgFontMetrics(displayBrand, 44, 7);

      return (
        <svg viewBox="0 0 500 420" className="w-full h-full max-h-[380px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bronze-gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#d4af37" />
              <stop offset="80%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>

            <filter id="emblem-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#713f12" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Medallion Medallion Outer Laurel */}
          <g filter="url(#emblem-shadow)" fill="url(#bronze-gold-grad)">
            {/* Laurel branches encircling */}
            <circle cx="250" cy="210" r="130" fill="none" stroke="url(#bronze-gold-grad)" strokeWidth="8" />
            <circle cx="250" cy="210" r="115" fill="none" stroke="url(#bronze-gold-grad)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Sunburst Rays Top */}
            <g stroke="url(#bronze-gold-grad)" strokeWidth="2">
              <line x1="250" y1="130" x2="250" y2="145" />
              <line x1="235" y1="132" x2="238" y2="146" />
              <line x1="265" y1="132" x2="262" y2="146" />
              <line x1="220" y1="138" x2="226" y2="150" />
              <line x1="280" y1="138" x2="274" y2="150" />
            </g>
          </g>

          {/* Arched Ribbon Header: VINTAGE */}
          <text
            x="250"
            y="130"
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="16"
            fontWeight="900"
            letterSpacing="6"
            fill="url(#bronze-gold-grad)"
          >
            VINTAGE
          </text>

          {/* Dynamic Brand Name in Medallion Center */}
          <text
            x="250"
            y="215"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="4"
            fill="url(#bronze-gold-grad)"
            filter="url(#emblem-shadow)"
          >
            {displayBrand}
          </text>

          {/* Starburst Rays & Laurel Base */}
          <g transform="translate(250, 250)" stroke="url(#bronze-gold-grad)" strokeWidth="2">
            <line x1="0" y1="0" x2="0" y2="15" />
            <line x1="-15" y1="2" x2="-12" y2="14" />
            <line x1="15" y1="2" x2="12" y2="14" />
            <line x1="-30" y1="8" x2="-24" y2="18" />
            <line x1="30" y1="8" x2="24" y2="18" />
          </g>

          {/* Subtitle / Tagline */}
          <text
            x="250"
            y="295"
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="12"
            fontWeight="700"
            letterSpacing="6"
            fill="url(#bronze-gold-grad)"
          >
            {tagline.trim() ? tagline.toUpperCase() : 'QUALITY TRADEMARK'}
          </text>
        </svg>
      );
    }
  }
];
