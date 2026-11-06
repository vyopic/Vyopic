import React from 'react';

export type LogoCategory =
  | 'Minimal'
  | 'Lettermark'
  | 'Luxury'
  | 'Gaming'
  | 'Business'
  | 'Modern'
  | 'Creative'
  | 'Vintage'
  | 'Signature'
  | 'Emblem';

export interface LogoTemplate {
  id: string;
  name: string;
  category: LogoCategory;
  defaultColor: string;
  defaultBg: string;
  defaultFont: string;
  shape: 'square' | 'circle' | 'horizontal' | 'emblem';
  renderGraphic: (color: string, accent: string) => React.ReactNode;
  layout: 'top-icon' | 'left-icon' | 'badge' | 'stacked' | 'framed' | 'lettermark';
}

// 50 Handcrafted Unique Logo Templates
export const LOGO_TEMPLATES: LogoTemplate[] = [
  // ─── 1. MINIMAL LOGO (6 TEMPLATES) ──────────────────────────
  {
    id: 'min-1',
    name: 'Zenith Peak',
    category: 'Minimal',
    defaultColor: '#0f172a',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,15 85,80 15,80" stroke={color} strokeWidth="6" strokeLinejoin="round" />
        <circle cx="50" cy="55" r="9" fill={accent} />
      </svg>
    )
  },
  {
    id: 'min-2',
    name: 'Intersect Circles',
    category: 'Minimal',
    defaultColor: '#1e293b',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="40" cy="50" r="28" stroke={color} strokeWidth="5" />
        <circle cx="60" cy="50" r="28" stroke={accent} strokeWidth="5" />
      </svg>
    )
  },
  {
    id: 'min-3',
    name: 'Prism Line',
    category: 'Minimal',
    defaultColor: '#09090b',
    defaultBg: '#ffffff',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="25" y="25" width="50" height="50" rx="10" stroke={color} strokeWidth="5" transform="rotate(45 50 50)" />
        <line x1="50" y1="20" x2="50" y2="80" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'min-4',
    name: 'Nordic Wave',
    category: 'Minimal',
    defaultColor: '#172554',
    defaultBg: '#f8fafc',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M20,50 Q35,25 50,50 T80,50" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M20,65 Q35,40 50,65 T80,65" stroke={accent} strokeWidth="7" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: 'min-5',
    name: 'Hex Core',
    category: 'Minimal',
    defaultColor: '#18181b',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" stroke={color} strokeWidth="5" />
        <circle cx="50" cy="50" r="10" fill={accent} />
      </svg>
    )
  },
  {
    id: 'min-6',
    name: 'Aura Dot',
    category: 'Minimal',
    defaultColor: '#0f172a',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="4" strokeDasharray="6 6" />
        <circle cx="50" cy="50" r="14" fill={accent} />
      </svg>
    )
  },

  // ─── 2. LETTERMARK LOGO (6 TEMPLATES) ───────────────────────
  {
    id: 'let-1',
    name: 'Monogram Shield',
    category: 'Lettermark',
    defaultColor: '#1d4ed8',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M50,12 L85,25 C85,62 50,88 50,88 C50,88 15,62 15,25 Z" stroke={color} strokeWidth="5" fill="none" />
      </svg>
    )
  },
  {
    id: 'let-2',
    name: 'Dual Ring Letter',
    category: 'Lettermark',
    defaultColor: '#0369a1',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="4" />
        <circle cx="50" cy="50" r="32" stroke={accent} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: 'let-3',
    name: 'Diamond Initial',
    category: 'Lettermark',
    defaultColor: '#b45309',
    defaultBg: '#fffbeb',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="22" y="22" width="56" height="56" rx="4" stroke={color} strokeWidth="5" transform="rotate(45 50 50)" />
      </svg>
    )
  },
  {
    id: 'let-4',
    name: 'Badge Monogram',
    category: 'Lettermark',
    defaultColor: '#4338ca',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="18" y="18" width="64" height="64" rx="20" stroke={color} strokeWidth="6" />
        <circle cx="50" cy="18" r="4" fill={accent} />
        <circle cx="50" cy="82" r="4" fill={accent} />
      </svg>
    )
  },
  {
    id: 'let-5',
    name: 'Octa Initial',
    category: 'Lettermark',
    defaultColor: '#047857',
    defaultBg: '#ffffff',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="30,12 70,12 88,30 88,70 70,88 30,88 12,70 12,30" stroke={color} strokeWidth="5" />
      </svg>
    )
  },
  {
    id: 'let-6',
    name: 'Symmetric Split',
    category: 'Lettermark',
    defaultColor: '#be123c',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M50,15 L82,50 L50,85" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <path d="M50,15 L18,50 L50,85" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      </svg>
    )
  },

  // ─── 3. LUXURY LOGO (5 TEMPLATES) ───────────────────────────
  {
    id: 'lux-1',
    name: 'Royal Crown',
    category: 'Luxury',
    defaultColor: '#b45309',
    defaultBg: '#0f172a',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M20,68 L28,38 L42,52 L50,26 L58,52 L72,38 L80,68 Z" stroke={color} strokeWidth="4" strokeLinejoin="round" fill="none" />
        <line x1="16" y1="74" x2="84" y2="74" stroke={color} strokeWidth="4" />
        <circle cx="50" cy="22" r="3.5" fill={accent} />
        <circle cx="28" cy="34" r="3" fill={accent} />
        <circle cx="72" cy="34" r="3" fill={accent} />
      </svg>
    )
  },
  {
    id: 'lux-2',
    name: 'Golden Crest',
    category: 'Luxury',
    defaultColor: '#d97706',
    defaultBg: '#18181b',
    defaultFont: 'font-serif',
    shape: 'circle',
    layout: 'framed',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M25,50 C25,32 36,20 50,20 C64,20 75,32 75,50 C75,68 62,78 50,82 C38,78 25,68 25,50 Z" stroke={color} strokeWidth="4" />
        <path d="M35,50 L50,35 L65,50 L50,65 Z" stroke={accent} strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'lux-3',
    name: 'Jewel Facet',
    category: 'Luxury',
    defaultColor: '#ca8a04',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="30,28 70,28 85,46 50,80 15,46" stroke={color} strokeWidth="4" strokeLinejoin="round" />
        <polyline points="15,46 50,46 85,46" stroke={color} strokeWidth="3" />
        <polyline points="30,28 50,46 70,28" stroke={accent} strokeWidth="3" />
        <polyline points="30,28 50,80 70,28" stroke={color} strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'lux-4',
    name: 'Laurel Ribbon',
    category: 'Luxury',
    defaultColor: '#d4af37',
    defaultBg: '#0b0f19',
    defaultFont: 'font-serif',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M25,75 C18,50 25,30 45,20 C42,28 40,38 42,48" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M75,75 C82,50 75,30 55,20 C58,28 60,38 58,48" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="55" r="6" fill={accent} />
      </svg>
    )
  },
  {
    id: 'lux-5',
    name: 'Grand Fleur',
    category: 'Luxury',
    defaultColor: '#c2410c',
    defaultBg: '#fefce8',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="3" />
        <path d="M50,22 C44,35 44,45 50,58 C56,45 56,35 50,22 Z" fill={color} />
        <path d="M30,50 C40,44 46,46 56,50 C46,54 40,56 30,50 Z" fill={accent} />
        <path d="M70,50 C60,44 54,46 44,50 C54,54 60,56 70,50 Z" fill={accent} />
      </svg>
    )
  },

  // ─── 4. GAMING LOGO (5 TEMPLATES) ───────────────────────────
  {
    id: 'gam-1',
    name: 'Cyber Sword',
    category: 'Gaming',
    defaultColor: '#ef4444',
    defaultBg: '#09090b',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,12 56,42 66,46 56,54 50,86 44,54 34,46 44,42" fill={color} />
        <circle cx="50" cy="50" r="6" fill={accent} />
      </svg>
    )
  },
  {
    id: 'gam-2',
    name: 'Neon Shield',
    category: 'Gaming',
    defaultColor: '#06b6d4',
    defaultBg: '#030712',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,14 84,28 72,74 50,88 28,74 16,28" stroke={color} strokeWidth="6" strokeLinejoin="round" />
        <polyline points="40,48 50,58 64,42" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'gam-3',
    name: 'Viper Strike',
    category: 'Gaming',
    defaultColor: '#10b981',
    defaultBg: '#052e16',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M22,35 L50,18 L78,35 L68,75 L50,86 L32,75 Z" stroke={color} strokeWidth="5" />
        <polygon points="50,30 62,54 38,54" fill={accent} />
      </svg>
    )
  },
  {
    id: 'gam-4',
    name: 'Phoenix Wing',
    category: 'Gaming',
    defaultColor: '#f97316',
    defaultBg: '#1c1917',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M15,65 Q30,30 50,20 Q70,30 85,65 Q50,45 15,65 Z" fill={color} />
        <circle cx="50" cy="50" r="7" fill={accent} />
      </svg>
    )
  },
  {
    id: 'gam-5',
    name: 'Gamer Pad',
    category: 'Gaming',
    defaultColor: '#a855f7',
    defaultBg: '#18181b',
    defaultFont: 'font-mono',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="32" width="60" height="38" rx="14" stroke={color} strokeWidth="5" />
        <circle cx="35" cy="51" r="5" fill={accent} />
        <circle cx="65" cy="46" r="3.5" fill={color} />
        <circle cx="71" cy="53" r="3.5" fill={color} />
      </svg>
    )
  },

  // ─── 5. BUSINESS LOGO (5 TEMPLATES) ─────────────────────────
  {
    id: 'biz-1',
    name: 'Capital Pillar',
    category: 'Business',
    defaultColor: '#1e3a8a',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <line x1="20" y1="26" x2="80" y2="26" stroke={color} strokeWidth="6" />
        <line x1="32" y1="26" x2="32" y2="74" stroke={color} strokeWidth="6" />
        <line x1="50" y1="26" x2="50" y2="74" stroke={accent} strokeWidth="6" />
        <line x1="68" y1="26" x2="68" y2="74" stroke={color} strokeWidth="6" />
        <line x1="16" y1="74" x2="84" y2="74" stroke={color} strokeWidth="6" />
      </svg>
    )
  },
  {
    id: 'biz-2',
    name: 'Growth Arrow',
    category: 'Business',
    defaultColor: '#0f766e',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'left-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="55" width="14" height="28" rx="2" fill={color} />
        <rect x="42" y="42" width="14" height="41" rx="2" fill={color} />
        <rect x="64" y="26" width="14" height="57" rx="2" fill={accent} />
        <polyline points="26,45 48,32 72,16" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <polygon points="76,14 66,14 74,22" fill={color} />
      </svg>
    )
  },
  {
    id: 'biz-3',
    name: 'Globe Network',
    category: 'Business',
    defaultColor: '#0284c7',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="5" />
        <ellipse cx="50" cy="50" rx="14" ry="32" stroke={accent} strokeWidth="3" />
        <line x1="18" y1="50" x2="82" y2="50" stroke={color} strokeWidth="4" />
      </svg>
    )
  },
  {
    id: 'biz-4',
    name: 'Summit Edge',
    category: 'Business',
    defaultColor: '#1e293b',
    defaultBg: '#f8fafc',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,20 78,72 50,60" fill={color} />
        <polygon points="50,20 22,72 50,60" fill={accent} />
      </svg>
    )
  },
  {
    id: 'biz-5',
    name: 'Apex Cube',
    category: 'Business',
    defaultColor: '#334155',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,18 80,34 50,50 20,34" fill={accent} stroke={color} strokeWidth="2" />
        <polygon points="50,50 80,34 80,68 50,84" fill={color} />
        <polygon points="50,50 20,34 20,68 50,84" fill="#64748b" />
      </svg>
    )
  },

  // ─── 6. MODERN LOGO (5 TEMPLATES) ───────────────────────────
  {
    id: 'mod-1',
    name: 'Infinity Loop',
    category: 'Modern',
    defaultColor: '#6366f1',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path
          d="M32,38 C22,38 18,45 18,50 C18,55 22,62 32,62 C44,62 56,38 68,38 C78,38 82,45 82,50 C82,55 78,62 68,62 C56,62 44,38 32,38 Z"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="5" fill={accent} />
      </svg>
    )
  },
  {
    id: 'mod-2',
    name: 'Gradient Orb',
    category: 'Modern',
    defaultColor: '#0ea5e9',
    defaultBg: '#0f172a',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="6" />
        <circle cx="50" cy="50" r="16" fill={accent} />
        <line x1="20" y1="50" x2="80" y2="50" stroke={color} strokeWidth="4" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: 'mod-3',
    name: 'Nexus Cross',
    category: 'Modern',
    defaultColor: '#8b5cf6',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="42" y="16" width="16" height="68" rx="8" fill={color} />
        <rect x="16" y="42" width="68" height="16" rx="8" fill={accent} />
      </svg>
    )
  },
  {
    id: 'mod-4',
    name: 'Aero Wings',
    category: 'Modern',
    defaultColor: '#ec4899',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M18,36 C38,36 50,48 50,72 C50,48 62,36 82,36" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <circle cx="50" cy="24" r="7" fill={accent} />
      </svg>
    )
  },
  {
    id: 'mod-5',
    name: 'Quantum Ring',
    category: 'Modern',
    defaultColor: '#14b8a6',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <ellipse cx="50" cy="50" rx="34" ry="14" stroke={color} strokeWidth="5" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="34" ry="14" stroke={accent} strokeWidth="5" transform="rotate(30 50 50)" />
        <circle cx="50" cy="50" r="7" fill={color} />
      </svg>
    )
  },

  // ─── 7. CREATIVE LOGO (5 TEMPLATES) ─────────────────────────
  {
    id: 'cre-1',
    name: 'Spark Bulb',
    category: 'Creative',
    defaultColor: '#eab308',
    defaultBg: '#1e1b4b',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M36,44 C36,32 44,24 50,24 C56,24 64,32 64,44 C64,52 58,58 58,66 L42,66 C42,58 36,52 36,44 Z" stroke={color} strokeWidth="5" fill="none" />
        <line x1="44" y1="74" x2="56" y2="74" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="47" y1="80" x2="53" y2="80" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="42" r="5" fill={color} />
      </svg>
    )
  },
  {
    id: 'cre-2',
    name: 'Artist Quill',
    category: 'Creative',
    defaultColor: '#d946ef',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M72,18 C64,28 46,45 38,62 L32,82 L42,76 C54,66 70,50 82,38 C86,22 82,16 72,18 Z" stroke={color} strokeWidth="5" fill="none" />
        <circle cx="34" cy="80" r="4" fill={accent} />
      </svg>
    )
  },
  {
    id: 'cre-3',
    name: 'Color Palette',
    category: 'Creative',
    defaultColor: '#f43f5e',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M50,18 C28,18 16,30 16,52 C16,70 30,82 46,82 C52,82 56,78 56,72 C56,66 62,64 68,64 C76,64 84,56 84,46 C84,30 70,18 50,18 Z" stroke={color} strokeWidth="5" fill="none" />
        <circle cx="32" cy="40" r="5" fill="#3b82f6" />
        <circle cx="48" cy="32" r="5" fill="#eab308" />
        <circle cx="66" cy="38" r="5" fill={accent} />
      </svg>
    )
  },
  {
    id: 'cre-4',
    name: 'Origami Bird',
    category: 'Creative',
    defaultColor: '#f97316',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="18,60 50,20 62,45" fill={color} opacity="0.9" />
        <polygon points="50,20 84,35 62,45" fill={accent} />
        <polygon points="62,45 76,75 42,65" fill={color} />
      </svg>
    )
  },
  {
    id: 'cre-5',
    name: 'Camera Shutter',
    category: 'Creative',
    defaultColor: '#0284c7',
    defaultBg: '#ffffff',
    defaultFont: 'font-sans',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="5" />
        <line x1="50" y1="16" x2="68" y2="50" stroke={color} strokeWidth="3" />
        <line x1="84" y1="50" x2="50" y2="68" stroke={color} strokeWidth="3" />
        <line x1="50" y1="84" x2="32" y2="50" stroke={color} strokeWidth="3" />
        <line x1="16" y1="50" x2="50" y2="32" stroke={color} strokeWidth="3" />
        <circle cx="50" cy="50" r="9" fill={accent} />
      </svg>
    )
  },

  // ─── 8. VINTAGE LOGO (4 TEMPLATES) ──────────────────────────
  {
    id: 'vin-1',
    name: 'Retro Stamp',
    category: 'Vintage',
    defaultColor: '#78350f',
    defaultBg: '#fef3c7',
    defaultFont: 'font-serif',
    shape: 'circle',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="4" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="2" />
        <polygon points="50,32 54,44 66,44 56,52 60,64 50,56 40,64 44,52 34,44 46,44" fill={accent} />
      </svg>
    )
  },
  {
    id: 'vin-2',
    name: 'Industrial Gear',
    category: 'Vintage',
    defaultColor: '#451a03',
    defaultBg: '#fff7ed',
    defaultFont: 'font-serif',
    shape: 'circle',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="24" stroke={color} strokeWidth="6" />
        <circle cx="50" cy="50" r="10" stroke={accent} strokeWidth="4" />
        <line x1="50" y1="14" x2="50" y2="26" stroke={color} strokeWidth="7" />
        <line x1="50" y1="74" x2="50" y2="86" stroke={color} strokeWidth="7" />
        <line x1="14" y1="50" x2="26" y2="50" stroke={color} strokeWidth="7" />
        <line x1="74" y1="50" x2="86" y2="50" stroke={color} strokeWidth="7" />
      </svg>
    )
  },
  {
    id: 'vin-3',
    name: 'Barber Anchor',
    category: 'Vintage',
    defaultColor: '#1e3a8a',
    defaultBg: '#f1f5f9',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'top-icon',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="28" r="8" stroke={color} strokeWidth="4" />
        <line x1="50" y1="36" x2="50" y2="78" stroke={color} strokeWidth="6" />
        <line x1="32" y1="46" x2="68" y2="46" stroke={accent} strokeWidth="5" />
        <path d="M22,62 C22,82 78,82 78,62" stroke={color} strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'vin-4',
    name: 'Artisan Ribbon',
    category: 'Vintage',
    defaultColor: '#831843',
    defaultBg: '#fff1f2',
    defaultFont: 'font-serif',
    shape: 'square',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="12,35 24,50 12,65 88,65 76,50 88,35" stroke={color} strokeWidth="4" fill="none" />
        <line x1="26" y1="50" x2="74" y2="50" stroke={accent} strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    )
  },

  // ─── 9. SIGNATURE LOGO (4 TEMPLATES) ────────────────────────
  {
    id: 'sig-1',
    name: 'Script Flourish',
    category: 'Signature',
    defaultColor: '#0f172a',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif italic',
    shape: 'horizontal',
    layout: 'stacked',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M15,62 C35,28 65,30 85,55 C70,75 35,75 22,58" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="85" cy="55" r="4" fill={accent} />
      </svg>
    )
  },
  {
    id: 'sig-2',
    name: 'Cursive Initial',
    category: 'Signature',
    defaultColor: '#374151',
    defaultBg: '#f9fafb',
    defaultFont: 'font-serif italic',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="3" strokeDasharray="8 4" />
        <path d="M35,68 Q50,15 65,68" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'sig-3',
    name: 'Pen Stroke Underline',
    category: 'Signature',
    defaultColor: '#1e1b4b',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif italic',
    shape: 'horizontal',
    layout: 'stacked',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M12,58 Q50,75 88,48" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="38" r="7" fill={color} />
      </svg>
    )
  },
  {
    id: 'sig-4',
    name: 'Autograph Monogram',
    category: 'Signature',
    defaultColor: '#1c1917',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif italic',
    shape: 'square',
    layout: 'lettermark',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <rect x="20" y="20" width="60" height="60" rx="8" stroke={color} strokeWidth="4" />
        <line x1="20" y1="80" x2="80" y2="20" stroke={accent} strokeWidth="3" />
      </svg>
    )
  },

  // ─── 10. EMBLEM LOGO (5 TEMPLATES) ──────────────────────────
  {
    id: 'emb-1',
    name: 'University Crest',
    category: 'Emblem',
    defaultColor: '#1e3a8a',
    defaultBg: '#f8fafc',
    defaultFont: 'font-serif',
    shape: 'emblem',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M50,12 L82,24 C82,62 50,88 50,88 C50,88 18,62 18,24 Z" stroke={color} strokeWidth="5" fill="none" />
        <line x1="50" y1="24" x2="50" y2="76" stroke={color} strokeWidth="3" />
        <line x1="26" y1="48" x2="74" y2="48" stroke={color} strokeWidth="3" />
        <circle cx="38" cy="36" r="4" fill={accent} />
        <circle cx="62" cy="60" r="4" fill={accent} />
      </svg>
    )
  },
  {
    id: 'emb-2',
    name: 'Hero Medallion',
    category: 'Emblem',
    defaultColor: '#991b1b',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'emblem',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="5" />
        <polygon points="50,22 58,40 78,40 62,52 68,70 50,60 32,70 38,52 22,40 42,40" fill={accent} />
      </svg>
    )
  },
  {
    id: 'emb-3',
    name: 'Shield of Valor',
    category: 'Emblem',
    defaultColor: '#15803d',
    defaultBg: '#ffffff',
    defaultFont: 'font-serif',
    shape: 'emblem',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <path d="M22,22 L78,22 L78,54 C78,72 50,86 50,86 C50,86 22,72 22,54 Z" stroke={color} strokeWidth="5" />
        <polygon points="50,34 60,60 40,60" fill={accent} />
      </svg>
    )
  },
  {
    id: 'emb-4',
    name: 'Vintage Seal',
    category: 'Emblem',
    defaultColor: '#7c2d12',
    defaultBg: '#fffbeb',
    defaultFont: 'font-serif',
    shape: 'emblem',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="4" />
        <circle cx="50" cy="50" r="32" stroke={accent} strokeWidth="2" strokeDasharray="6 3" />
        <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'emb-5',
    name: 'Prestige Banner',
    category: 'Emblem',
    defaultColor: '#312e81',
    defaultBg: '#f8fafc',
    defaultFont: 'font-serif',
    shape: 'emblem',
    layout: 'badge',
    renderGraphic: (color, accent) => (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
        <polygon points="50,14 84,30 84,70 50,86 16,70 16,30" stroke={color} strokeWidth="5" />
        <line x1="30" y1="50" x2="70" y2="50" stroke={accent} strokeWidth="4" />
        <circle cx="50" cy="36" r="5" fill={color} />
      </svg>
    )
  }
];

export interface LogoSizeOption {
  id: string;
  label: string;
  width: number;
  height: number;
  category: 'Standard' | 'Web' | 'Social' | 'Print';
}

export const LOGO_SIZES: LogoSizeOption[] = [
  { id: 'small', label: 'Small Logo', width: 256, height: 256, category: 'Standard' },
  { id: 'standard', label: 'Standard Logo', width: 512, height: 512, category: 'Standard' },
  { id: 'hd', label: 'HD Logo', width: 1024, height: 1024, category: 'Standard' },
  { id: 'ultra-hd', label: 'Ultra HD Logo', width: 2048, height: 2048, category: 'Standard' },
  { id: 'website', label: 'Website Logo', width: 500, height: 200, category: 'Web' },
  { id: 'web-header', label: 'Website Header', width: 800, height: 300, category: 'Web' },
  { id: 'horizontal', label: 'Horizontal Logo', width: 1200, height: 400, category: 'Web' },
  { id: 'square', label: 'Square Logo', width: 1080, height: 1080, category: 'Standard' },
  { id: 'fb-profile', label: 'Facebook Profile', width: 1080, height: 1080, category: 'Social' },
  { id: 'insta-profile', label: 'Instagram Profile', width: 1080, height: 1080, category: 'Social' },
  { id: 'yt-channel', label: 'YouTube Channel Logo', width: 800, height: 800, category: 'Social' },
  { id: 'yt-watermark', label: 'YouTube Watermark', width: 150, height: 150, category: 'Social' },
  { id: 'linkedin', label: 'LinkedIn Logo', width: 400, height: 400, category: 'Social' },
  { id: 'favicon', label: 'Favicon', width: 32, height: 32, category: 'Web' },
  { id: 'app-icon', label: 'App Icon', width: 512, height: 512, category: 'Social' },
  { id: 'business-card', label: 'Business Card Logo', width: 1000, height: 600, category: 'Print' }
];
