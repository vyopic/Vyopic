import React, { useState, useEffect } from 'react';
import { Download, User, Sparkles, Sliders, Shield, Palette, Check } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

interface BackgroundStyle {
  id: string;
  name: string;
  category: 'Professional' | 'Business' | 'Gaming' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'Creative';
  gradient: string; // CSS or canvas gradient description
  colors: [string, string];
}

const BG_STYLES: BackgroundStyle[] = [
  // Professional & LinkedIn
  { id: 'pro-blue', name: 'Executive Blue', category: 'Professional', gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', colors: ['#1e3a8a', '#3b82f6'] },
  { id: 'pro-gray', name: 'Studio Slate', category: 'Professional', gradient: 'linear-gradient(135deg, #1f2937, #4b5563)', colors: ['#1f2937', '#4b5563'] },
  { id: 'linkedin-navy', name: 'LinkedIn Navy', category: 'LinkedIn', gradient: 'linear-gradient(135deg, #0a66c2, #004182)', colors: ['#0a66c2', '#004182'] },
  { id: 'pro-clean', name: 'Minimal White', category: 'LinkedIn', gradient: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', colors: ['#f8fafc', '#e2e8f0'] },

  // Business
  { id: 'biz-charcoal', name: 'Charcoal Black', category: 'Business', gradient: 'linear-gradient(135deg, #0f172a, #334155)', colors: ['#0f172a', '#334155'] },
  { id: 'biz-gold', name: 'Champagne Luxury', category: 'Business', gradient: 'linear-gradient(135deg, #78350f, #d97706)', colors: ['#78350f', '#d97706'] },

  // Gaming
  { id: 'game-neon', name: 'Cyberpunk Neon', category: 'Gaming', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', colors: ['#ec4899', '#8b5cf6'] },
  { id: 'game-dark', name: 'Dark Emerald', category: 'Gaming', gradient: 'linear-gradient(135deg, #064e3b, #10b981)', colors: ['#064e3b', '#10b981'] },
  { id: 'game-toxic', name: 'Toxic Purple', category: 'Gaming', gradient: 'linear-gradient(135deg, #3b0764, #a855f7)', colors: ['#3b0764', '#a855f7'] },

  // Instagram & Creative
  { id: 'insta-sunset', name: 'Sunset Glow', category: 'Instagram', gradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)', colors: ['#f43f5e', '#f59e0b'] },
  { id: 'insta-cotton', name: 'Pastel Dream', category: 'Instagram', gradient: 'linear-gradient(135deg, #fbcfe8, #bfdbfe)', colors: ['#fbcfe8', '#bfdbfe'] },
  { id: 'cre-aurora', name: 'Nordic Aurora', category: 'Creative', gradient: 'linear-gradient(135deg, #059669, #0284c7)', colors: ['#059669', '#0284c7'] },
  { id: 'cre-vibrant', name: 'Electric Violet', category: 'Creative', gradient: 'linear-gradient(135deg, #6366f1, #d946ef)', colors: ['#6366f1', '#d946ef'] },

  // Facebook
  { id: 'fb-classic', name: 'Classic Social', category: 'Facebook', gradient: 'linear-gradient(135deg, #1877f2, #42b72a)', colors: ['#1877f2', '#42b72a'] },
  { id: 'fb-warm', name: 'Warm Amber', category: 'Facebook', gradient: 'linear-gradient(135deg, #ea580c, #facc15)', colors: ['#ea580c', '#facc15'] }
];

export const AIProfilePicturePage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'ai-profile-picture')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBg, setSelectedBg] = useState<BackgroundStyle>(BG_STYLES[0]);
  const [frameShape, setFrameShape] = useState<'circle' | 'square' | 'rounded'>('circle');
  const [borderWidth, setBorderWidth] = useState<number>(8); // px
  const [borderColor, setBorderColor] = useState<string>('#ffffff');
  const [zoom, setZoom] = useState<number>(1.0); // 0.8 to 2.0
  const [offsetY, setOffsetY] = useState<number>(0); // -100 to 100
  const [hasShadow, setHasShadow] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(105);

  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResult(null);
      return;
    }
    loadImage(selectedFile).then((img) => setLoadedImg(img));
  }, [selectedFile]);

  // Generate HD 1:1 Profile Picture (1000x1000 px)
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const renderPfp = async () => {
      const size = 1000;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, selectedBg.colors[0]);
      grad.addColorStop(1, selectedBg.colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // 2. Setup Clipping Mask based on frame shape
      ctx.save();
      const margin = 50;
      const innerSize = size - margin * 2;
      const centerX = size / 2;
      const centerY = size / 2;

      ctx.beginPath();
      if (frameShape === 'circle') {
        ctx.arc(centerX, centerY, innerSize / 2, 0, Math.PI * 2);
      } else if (frameShape === 'rounded') {
        ctx.roundRect(margin, margin, innerSize, innerSize, 120);
      } else {
        ctx.rect(margin, margin, innerSize, innerSize);
      }
      ctx.clip();

      // Redraw background inside clipped frame
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Draw portrait subject centered with zoom & offsetY
      const scale = Math.max(innerSize / loadedImg.width, innerSize / loadedImg.height) * zoom;
      const drawW = loadedImg.width * scale;
      const drawH = loadedImg.height * scale;
      const drawX = centerX - drawW / 2;
      const drawY = centerY - drawH / 2 + offsetY * 2;

      if (brightness !== 100) {
        ctx.filter = `brightness(${brightness}%)`;
      }

      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 3. Draw Aesthetic Outer Border & Ring
      if (borderWidth > 0) {
        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth * 2;

        if (hasShadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetY = 10;
        }

        ctx.beginPath();
        if (frameShape === 'circle') {
          ctx.arc(centerX, centerY, innerSize / 2, 0, Math.PI * 2);
        } else if (frameShape === 'rounded') {
          ctx.roundRect(margin, margin, innerSize, innerSize, 120);
        } else {
          ctx.rect(margin, margin, innerSize, innerSize);
        }
        ctx.stroke();
        ctx.restore();
      }

      const blob = await canvasToBlob(canvas, 'image/png', 0.96);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    renderPfp().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, selectedBg, frameShape, borderWidth, borderColor, zoom, offsetY, hasShadow, brightness]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_pfp_hd.png`);
  };

  const filteredBgs =
    activeCategory === 'All'
      ? BG_STYLES
      : BG_STYLES.filter((b) => b.category === activeCategory);

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload portrait or selfie photo"
          subtitle="Generate high-converting avatars for LinkedIn, Business, Gaming, Instagram & Facebook with aesthetic frames."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Style & Background Presets
              </span>

              {/* Frame Shape Selectors */}
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Squircle' },
                  { id: 'square', label: 'Square' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFrameShape(s.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      frameShape === s.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200/80 pb-3">
              {['All', 'Professional', 'Business', 'LinkedIn', 'Instagram', 'Gaming', 'Creative', 'Facebook'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Background Style Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Curated Backdrop:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filteredBgs.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      selectedBg.id === bg.id
                        ? 'border-blue-600 ring-2 ring-blue-600/30 bg-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 shadow-2xs flex items-center justify-center text-white"
                      style={{ background: bg.gradient }}
                    >
                      {selectedBg.id === bg.id && <Check className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{bg.name}</p>
                      <p className="text-[10px] text-slate-400">{bg.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Zoom, Head Position, Border */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Photo Zoom / Scale:</span>
                  <span className="text-blue-600 font-mono">{Math.round(zoom * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.8"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Vertical Shift:</span>
                  <span className="text-blue-600 font-mono">{offsetY}px</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Ring Border Width:</span>
                  <span className="text-blue-600 font-mono">{borderWidth}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Preview & Result */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 mb-4 block">
              1:1 HD Avatar Live Preview (1000 × 1000 px)
            </span>

            <div className="w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center p-2 rounded-2xl bg-slate-200/40">
              {isProcessing ? (
                <div className="py-16 text-slate-500 font-bold text-xs animate-pulse">
                  Styling avatar portrait...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Profile Avatar"
                  className="max-h-full max-w-full object-contain drop-shadow-md rounded-2xl"
                />
              ) : null}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Choose Another Portrait
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download HD Profile Picture</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
