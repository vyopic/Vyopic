import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Crown,
  Type,
  Palette,
  Sliders,
  RotateCcw,
  Undo2,
  Redo2,
  Sparkles,
  Check,
  Search,
  Eye,
  Layers,
  Maximize2
} from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import {
  LOGO_TEMPLATES,
  LOGO_SIZES,
  LogoTemplate,
  LogoCategory,
  LogoSizeOption
} from '../config/logoTemplates';
import { downloadBlob, canvasToBlob } from '../utils/imageProcessing';

interface EditorState {
  brandName: string;
  tagline: string;
  template: LogoTemplate;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  isTransparent: boolean;
  fontFamily: string;
  fontSize: number; // relative modifier
  letterSpacing: number; // px
  alignment: 'center' | 'left' | 'right';
  iconScale: number; // 0.6 to 1.5
  borderShape: 'none' | 'circle' | 'rounded' | 'square' | 'shield';
  borderWidth: number;
  includeVyopicLink: boolean;
}

export const NameBrandLogoPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'name-brand-logo')!;

  // Templates Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Editor State
  const defaultState: EditorState = {
    brandName: 'VYOPIC',
    tagline: 'SMART PHOTO STUDIO',
    template: LOGO_TEMPLATES[0],
    primaryColor: LOGO_TEMPLATES[0].defaultColor,
    accentColor: '#2563eb',
    backgroundColor: LOGO_TEMPLATES[0].defaultBg,
    isTransparent: false,
    fontFamily: 'font-sans font-black',
    fontSize: 48,
    letterSpacing: 2,
    alignment: 'center',
    iconScale: 1.0,
    borderShape: 'none',
    borderWidth: 0,
    includeVyopicLink: true
  };

  const [state, setState] = useState<EditorState>(defaultState);

  // Undo / Redo History
  const [history, setHistory] = useState<EditorState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Download export configuration
  const [selectedSize, setSelectedSize] = useState<LogoSizeOption>(LOGO_SIZES[1]); // Standard 512x512
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Preview canvas ref for export
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Push state to history
  const updateState = (updater: (prev: EditorState) => EditorState) => {
    setState((prev) => {
      const next = updater(prev);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setState(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setState(history[historyIndex + 1]);
    }
  };

  const handleReset = () => {
    updateState(() => ({
      ...defaultState,
      template: state.template,
      primaryColor: state.template.defaultColor,
      backgroundColor: state.template.defaultBg,
      isTransparent: false
    }));
  };

  const selectTemplate = (t: LogoTemplate) => {
    updateState((prev) => ({
      ...prev,
      template: t,
      primaryColor: t.defaultColor,
      backgroundColor: t.defaultBg,
      isTransparent: false
    }));
  };

  // Filter templates
  const categories: string[] = [
    'All',
    'Brand Concepts',
    'Minimal',
    'Lettermark',
    'Luxury',
    'Gaming',
    'Business',
    'Modern',
    'Creative',
    'Vintage',
    'Signature',
    'Emblem'
  ];

  const filteredTemplates = LOGO_TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Export high-resolution logo via HTML5 Canvas
  const handleDownload = async () => {
    setIsExporting(true);

    try {
      const W = selectedSize.width;
      const H = selectedSize.height;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Fill background (or leave transparent for PNG)
      if (!state.isTransparent || exportFormat === 'jpg') {
        ctx.fillStyle = state.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
      }

      // 2. Draw border frame if configured
      if (state.borderShape !== 'none' && state.borderWidth > 0) {
        ctx.strokeStyle = state.primaryColor;
        ctx.lineWidth = Math.max(2, (state.borderWidth * W) / 500);

        const pad = Math.round(W * 0.08);
        const frameW = W - pad * 2;
        const frameH = H - pad * 2;

        if (state.borderShape === 'circle') {
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, Math.min(frameW, frameH) / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (state.borderShape === 'rounded') {
          ctx.beginPath();
          ctx.roundRect(pad, pad, frameW, frameH, Math.round(W * 0.06));
          ctx.stroke();
        } else if (state.borderShape === 'square') {
          ctx.strokeRect(pad, pad, frameW, frameH);
        } else if (state.borderShape === 'shield') {
          ctx.beginPath();
          ctx.moveTo(W / 2, pad);
          ctx.lineTo(W - pad, pad + frameH * 0.2);
          ctx.lineTo(W - pad, pad + frameH * 0.6);
          ctx.quadraticCurveTo(W / 2, pad + frameH, W / 2, pad + frameH);
          ctx.quadraticCurveTo(pad, pad + frameH * 0.6, pad, pad + frameH * 0.6);
          ctx.lineTo(pad, pad + frameH * 0.2);
          ctx.closePath();
          ctx.stroke();
        }
      }

      // 3. Render graphic / custom logo to an offscreen image
      const svgContainer = document.getElementById('vyopic-logo-svg-src');
      if (svgContainer) {
        const svgElement = svgContainer.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const URLObj = window.URL || window.webkitURL || window;
          const blobURL = URLObj.createObjectURL(svgBlob);

          const iconImg = new Image();
          await new Promise((resolve) => {
            iconImg.onload = () => resolve(true);
            iconImg.onerror = () => resolve(false);
            iconImg.src = blobURL;
          });

          const isCustomStyle = state.template.layout === 'custom-style' || !!state.template.renderCustomLogo;

          if (isCustomStyle) {
            // Draw the entire custom styled SVG centered on the canvas
            const padW = W * 0.06;
            const padH = H * 0.08;
            const targetW = W - padW * 2;
            const targetH = H - padH * 2;

            const naturalW = iconImg.naturalWidth || 500;
            const naturalH = iconImg.naturalHeight || 350;
            const imgAspect = naturalW / naturalH;
            const targetAspect = targetW / targetH;

            let drawW = targetW;
            let drawH = targetH;
            if (imgAspect > targetAspect) {
              drawH = drawW / imgAspect;
            } else {
              drawW = drawH * imgAspect;
            }

            const drawX = (W - drawW) / 2;
            const drawY = (H - drawH) / 2;
            ctx.drawImage(iconImg, drawX, drawY, drawW, drawH);
            URLObj.revokeObjectURL(blobURL);
          } else {
            // Standard icon layout
            const isHorizontalLayout = W > H * 1.5;
            const isLeftIcon = state.template.layout === 'left-icon' || isHorizontalLayout;

            const baseIconDim = Math.min(W, H) * (isLeftIcon ? 0.45 : 0.32) * state.iconScale;

            let iconX = (W - baseIconDim) / 2;
            let iconY = H * 0.22 - baseIconDim / 2;

            let textAnchorX = W / 2;
            let textAnchorY = H * 0.62;

            if (isLeftIcon) {
              iconX = W * 0.15;
              iconY = (H - baseIconDim) / 2;
              textAnchorX = W * 0.58;
              textAnchorY = H * 0.48;
            }

            ctx.drawImage(iconImg, iconX, iconY, baseIconDim, baseIconDim);
            URLObj.revokeObjectURL(blobURL);

            // 4. Render Brand Name & Tagline Text
            const brandText = state.brandName.trim() || 'BRAND';
            const calculatedFontSize = Math.max(
              12,
              Math.round(((state.fontSize * Math.min(W, H)) / 500) * (isLeftIcon ? 0.9 : 1))
            );

            ctx.textAlign = isLeftIcon ? 'left' : 'center';
            ctx.fillStyle = state.primaryColor;

            // Font mapping
            let canvasFontFamily = 'Plus Jakarta Sans, sans-serif';
            if (state.fontFamily.includes('serif')) canvasFontFamily = 'Georgia, serif';
            if (state.fontFamily.includes('mono')) canvasFontFamily = 'Courier New, monospace';

            ctx.font = `bold ${calculatedFontSize}px ${canvasFontFamily}`;
            ctx.fillText(brandText, textAnchorX, textAnchorY);

            // Tagline
            if (state.tagline.trim()) {
              const taglineSize = Math.max(9, Math.round(calculatedFontSize * 0.38));
              ctx.font = `600 ${taglineSize}px ${canvasFontFamily}`;
              ctx.fillStyle = state.accentColor;
              ctx.fillText(state.tagline.toUpperCase(), textAnchorX, textAnchorY + calculatedFontSize * 0.7);
            }
          }
        }
      }

      // 5. Draw discreet Vyopic link at the bottom of the downloaded logo
      if (state.includeVyopicLink) {
        const linkText = 'vyopic.pages.dev';
        const linkFontSize = Math.max(10, Math.round(W * 0.024));
        ctx.font = `600 ${linkFontSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';

        const isDark =
          state.backgroundColor === '#080811' ||
          state.backgroundColor === '#000000' ||
          state.backgroundColor === '#0f172a' ||
          state.backgroundColor === '#18181b';

        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.4)';
        ctx.fillText(linkText, W / 2, H - Math.round(H * 0.035));
      }

      const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const blob = await canvasToBlob(canvas, mimeType, 0.96);
      const cleanBrand = (state.brandName.trim() || 'logo').toLowerCase().replace(/\s+/g, '_');
      const filename = `${cleanBrand}_${selectedSize.id}.${exportFormat}`;

      downloadBlob(blob, filename);
    } catch (err) {
      console.error('Logo export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* TOP CONTROLS & LIVE EDITOR BAR */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Name Brand Logo Generator</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                69 Templates (19 Concepts + 50 Presets)
              </span>
            </div>

            {/* Undo, Redo, Reset Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-colors shadow-2xs"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-colors shadow-2xs"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Name & Tagline Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name / Text</label>
              <input
                type="text"
                value={state.brandName}
                onChange={(e) => updateState((p) => ({ ...p, brandName: e.target.value }))}
                placeholder="Enter Brand Name (e.g. Apex, Horizon)..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Optional Tagline / Slogan</label>
              <input
                type="text"
                value={state.tagline}
                onChange={(e) => updateState((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="Enter Tagline (e.g. Innovate Together)..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Styling Options: Colors, Typography & Frame */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logo Color</label>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="color"
                  value={state.primaryColor}
                  onChange={(e) => updateState((p) => ({ ...p, primaryColor: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-0"
                />
                <span className="text-xs font-mono font-bold text-slate-700 truncate">{state.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Accent Color</label>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="color"
                  value={state.accentColor}
                  onChange={(e) => updateState((p) => ({ ...p, accentColor: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-0"
                />
                <span className="text-xs font-mono font-bold text-slate-700 truncate">{state.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Background</label>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="color"
                  value={state.backgroundColor}
                  disabled={state.isTransparent}
                  onChange={(e) => updateState((p) => ({ ...p, backgroundColor: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-0 disabled:opacity-30"
                />
                <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.isTransparent}
                    onChange={(e) => updateState((p) => ({ ...p, isTransparent: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-blue-600 rounded"
                  />
                  <span>No BG</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Font Style</label>
              <select
                value={state.fontFamily}
                onChange={(e) => updateState((p) => ({ ...p, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
              >
                <option value="font-sans font-black">Modern Sans</option>
                <option value="font-serif font-bold">Classic Serif</option>
                <option value="font-mono font-bold">Cyber Mono</option>
                <option value="font-serif italic font-bold">Luxury Italic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Outer Frame</label>
              <select
                value={state.borderShape}
                onChange={(e) =>
                  updateState((p) => ({
                    ...p,
                    borderShape: e.target.value as any,
                    borderWidth: e.target.value === 'none' ? 0 : Math.max(3, p.borderWidth)
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
              >
                <option value="none">No Frame</option>
                <option value="circle">Circular Ring</option>
                <option value="rounded">Squircle</option>
                <option value="square">Square Frame</option>
                <option value="shield">Shield Badge</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                <span>Icon Scale:</span>
                <span className="text-blue-600 font-mono">{Math.round(state.iconScale * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={state.iconScale}
                onChange={(e) => updateState((p) => ({ ...p, iconScale: Number(e.target.value) }))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>

        {/* WORKSPACE & LIVE PREVIEW HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Preview Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">
                  Live Preview • {state.template.name} ({state.template.category})
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">100% Vector Precision</span>
            </div>

            {/* The Logo Preview Stage */}
            <div
              className={`w-full max-w-md aspect-square rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center p-6 transition-all relative overflow-hidden shadow-inner ${
                state.isTransparent
                  ? 'bg-[repeating-conic-gradient(#cbd5e1_0%_25%,#f1f5f9_0%_50%)_50%/16px_16px]'
                  : ''
              }`}
              style={{
                backgroundColor: state.isTransparent ? undefined : state.backgroundColor
              }}
            >
              {/* Outer decorative frame */}
              {state.borderShape !== 'none' && state.borderWidth > 0 && (
                <div
                  className={`absolute inset-6 pointer-events-none transition-all ${
                    state.borderShape === 'circle'
                      ? 'rounded-full'
                      : state.borderShape === 'rounded'
                      ? 'rounded-3xl'
                      : state.borderShape === 'shield'
                      ? 'rounded-b-full rounded-t-xl'
                      : 'rounded-none'
                  }`}
                  style={{
                    border: `${state.borderWidth}px solid ${state.primaryColor}`
                  }}
                />
              )}

              {/* Conditional render: Custom Style Template vs Standard Graphic + Text */}
              {state.template.renderCustomLogo ? (
                <div
                  id="vyopic-logo-svg-src"
                  className="w-full h-full flex items-center justify-center transition-transform p-2"
                  style={{ transform: `scale(${state.iconScale})` }}
                >
                  {state.template.renderCustomLogo(
                    state.brandName,
                    state.tagline,
                    {
                      primary: state.primaryColor,
                      accent: state.accentColor,
                      bg: state.backgroundColor
                    },
                    { isTransparent: state.isTransparent, scale: state.iconScale }
                  )}
                </div>
              ) : (
                <>
                  {/* Graphic Icon Source for SVG serialization */}
                  <div
                    id="vyopic-logo-svg-src"
                    className="flex items-center justify-center transition-transform mb-3"
                    style={{ transform: `scale(${state.iconScale})` }}
                  >
                    {state.template.renderGraphic(state.primaryColor, state.accentColor)}
                  </div>

                  {/* Brand Typography */}
                  <div className={`text-center max-w-full px-4 ${state.fontFamily}`}>
                    <h1
                      className="font-black tracking-wider uppercase transition-colors break-words leading-tight"
                      style={{
                        color: state.primaryColor,
                        fontSize: `${Math.max(16, state.fontSize * 0.65)}px`,
                        letterSpacing: `${state.letterSpacing}px`
                      }}
                    >
                      {state.brandName.trim() || 'BRAND NAME'}
                    </h1>

                    {state.tagline.trim() && (
                      <p
                        className="font-semibold tracking-widest uppercase transition-colors mt-1.5 opacity-90"
                        style={{
                          color: state.accentColor,
                          fontSize: `${Math.max(10, state.fontSize * 0.25)}px`
                        }}
                      >
                        {state.tagline}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Bottom discreet link indicator in live preview */}
              {state.includeVyopicLink && (
                <div className="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none select-none">
                  <span
                    className="text-[10px] font-bold tracking-wider opacity-60"
                    style={{
                      color:
                        state.backgroundColor === '#080811' ||
                        state.backgroundColor === '#000000' ||
                        state.backgroundColor === '#0f172a'
                          ? '#94a3b8'
                          : '#64748b'
                    }}
                  >
                    vyopic.pages.dev
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Export & Sizes Configuration Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-blue-600" />
                Select Output Dimension (16 Sizes)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimized presets for print, website headers, and social media.
              </p>
            </div>

            {/* Size Options Grid */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/60">
              {LOGO_SIZES.map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    selectedSize.id === sz.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{sz.label}</p>
                    <p
                      className={`text-[10px] ${
                        selectedSize.id === sz.id ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {sz.width} × {sz.height} px • {sz.category}
                    </p>
                  </div>
                  {selectedSize.id === sz.id && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Format Selector: PNG vs JPG */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">File Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExportFormat('png')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    exportFormat === 'png'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  PNG (Crisp & Transparent)
                </button>
                <button
                  onClick={() => setExportFormat('jpg')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    exportFormat === 'jpg'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  JPG (Compact Standard)
                </button>
              </div>
            </div>

            {/* Vyopic Link Bottom Watermark Option */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/90 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-800">Add Vyopic Link to Download</p>
                <p className="text-[11px] text-slate-500">Includes subtle vyopic.pages.dev credit at bottom</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.includeVyopicLink}
                  onChange={(e) => updateState((p) => ({ ...p, includeVyopicLink: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Download CTA Button */}
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? 'Rendering HD Logo...'
                  : `Download ${selectedSize.label} (${selectedSize.width}×${selectedSize.height})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>✓ Instant HD Vector Export</span>
              <span>•</span>
              <span>✓ 100% Free Forever</span>
              <span>•</span>
              <span>✓ Commercial Ready</span>
            </div>
          </div>
        </div>

        {/* 69 TEMPLATES GALLERY SECTION */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Browse Logo Templates & Concepts ({filteredTemplates.length})
              </h3>
              <p className="text-xs text-slate-500">
                Type your brand name above — all logo templates update in real-time. Click any style to apply.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates or styles..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isBrandConcepts = cat === 'Brand Concepts';
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : isBrandConcepts
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isBrandConcepts && <Crown className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{cat}</span>
                  {isBrandConcepts && (
                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-extrabold">
                      19
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Templates Grid with Live Name Updating */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between group text-center ${
                  state.template.id === t.id
                    ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/20 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:border-blue-500 hover:bg-white hover:shadow-md'
                }`}
              >
                {/* Badge Category */}
                <div className="w-full flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    t.category === 'Brand Concepts' ? 'bg-amber-100 text-amber-800' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {t.category}
                  </span>
                  {state.template.id === t.id && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>

                {/* SVG Live Graphic / Dynamic Styled Logo */}
                <div className="w-full h-24 flex items-center justify-center my-1.5 transition-transform group-hover:scale-105 overflow-hidden">
                  {t.renderCustomLogo ? (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none p-1">
                      {t.renderCustomLogo(
                        state.brandName || 'VYOPIC',
                        '',
                        {
                          primary: state.template.id === t.id ? state.primaryColor : t.defaultColor,
                          accent: state.template.id === t.id ? state.accentColor : '#2563eb',
                          bg: state.template.id === t.id ? state.backgroundColor : t.defaultBg
                        }
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center mb-1">
                        {t.renderGraphic(
                          state.template.id === t.id ? state.primaryColor : t.defaultColor,
                          state.template.id === t.id ? state.accentColor : '#2563eb'
                        )}
                      </div>
                      <span className="text-[11px] font-black tracking-wider text-slate-800 truncate max-w-[110px]">
                        {state.brandName || 'VYOPIC'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Template Name & Action */}
                <div className="w-full pt-1.5 border-t border-slate-200/60 mt-1">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {t.name}
                  </p>
                  <span className="text-[10px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply Design →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No logo templates found matching "{searchQuery}". Try selecting "All".
            </div>
          )}
        </section>
      </div>
    </ToolLayout>
  );
};
