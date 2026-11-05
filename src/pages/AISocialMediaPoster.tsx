import React, { useState, useEffect } from 'react';
import { Download, LayoutTemplate, Type, Palette, Image as ImageIcon, Sliders, Check } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

interface PosterPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  ratioLabel: string;
}

const POSTER_PRESETS: PosterPreset[] = [
  { id: 'insta-post', name: 'Instagram Post', width: 1080, height: 1080, ratioLabel: '1:1 Square' },
  { id: 'insta-story', name: 'Instagram Story', width: 1080, height: 1920, ratioLabel: '9:16 Vertical' },
  { id: 'fb-post', name: 'Facebook Post', width: 1200, height: 630, ratioLabel: '1.91:1 Landscape' },
  { id: 'yt-thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, ratioLabel: '16:9 HD' },
  { id: 'banner', name: 'Social Media Banner', width: 1200, height: 500, ratioLabel: '2.4:1 Header' }
];

export const AISocialMediaPosterPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'ai-poster-maker')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Logo Overlay File
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loadedLogo, setLoadedLogo] = useState<HTMLImageElement | null>(null);

  // Preset Size
  const [preset, setPreset] = useState<PosterPreset>(POSTER_PRESETS[0]);

  // Typography
  const [headingText, setHeadingText] = useState<string>('BIG SUMMER SALE');
  const [subheadingText, setSubheadingText] = useState<string>('UP TO 50% OFF • LIMITED TIME ONLY');
  const [badgeText, setBadgeText] = useState<string>('NEW ARRIVAL');
  const [ctaText, setCtaText] = useState<string>('SHOP NOW →');

  // Styling
  const [primaryColor, setPrimaryColor] = useState<string>('#FFFFFF');
  const [accentColor, setAccentColor] = useState<string>('#FACC15'); // Yellow
  const [badgeColor, setBadgeColor] = useState<string>('#EF4444'); // Red
  const [overlayDarkness, setOverlayDarkness] = useState<number>(45); // 0 to 90%
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');

  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResult(null);
      return;
    }
    loadImage(selectedFile).then((img) => setLoadedImg(img));
  }, [selectedFile]);

  useEffect(() => {
    if (!logoFile) {
      setLoadedLogo(null);
      return;
    }
    loadImage(logoFile).then((img) => setLoadedLogo(img));
  }, [logoFile]);

  // Render Poster Canvas
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const renderPoster = async () => {
      const W = preset.width;
      const H = preset.height;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background Photo (Center cover crop)
      const scale = Math.max(W / loadedImg.width, H / loadedImg.height);
      const drawW = loadedImg.width * scale;
      const drawH = loadedImg.height * scale;
      const drawX = (W - drawW) / 2;
      const drawY = (H - drawH) / 2;

      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);

      // 2. Cinematic Gradient Darkness Overlay for High Legibility
      if (overlayDarkness > 0) {
        ctx.fillStyle = `rgba(15, 23, 42, ${overlayDarkness / 100})`;
        ctx.fillRect(0, 0, W, H);
      }

      // 3. Render Brand Logo if uploaded
      if (loadedLogo) {
        const logoTargetW = Math.round(W * 0.16);
        const logoTargetH = (logoTargetW * loadedLogo.height) / loadedLogo.width;
        ctx.drawImage(loadedLogo, 50, 50, logoTargetW, logoTargetH);
      }

      // 4. Calculate Text Anchors & Alignment
      let textX = W / 2;
      let canvasAlign: CanvasTextAlign = 'center';
      if (textAlignment === 'left') {
        textX = 70;
        canvasAlign = 'left';
      } else if (textAlignment === 'right') {
        textX = W - 70;
        canvasAlign = 'right';
      }
      ctx.textAlign = canvasAlign;

      // Top Badge
      let currentY = H * 0.32;
      if (badgeText.trim()) {
        ctx.font = `bold ${Math.round(W * 0.024)}px "Plus Jakarta Sans", sans-serif`;
        const badgeMetrics = ctx.measureText(badgeText.toUpperCase());
        const badgePadX = 22;
        const badgeH = Math.round(W * 0.045);
        const badgeW = badgeMetrics.width + badgePadX * 2;
        const badgeX = textAlignment === 'center' ? (W - badgeW) / 2 : textAlignment === 'left' ? 70 : W - 70 - badgeW;

        ctx.fillStyle = badgeColor;
        ctx.beginPath();
        ctx.roundRect(badgeX, currentY - badgeH * 0.75, badgeW, badgeH, 10);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(badgeText.toUpperCase(), badgeX + badgeW / 2, currentY);
        currentY += Math.round(W * 0.06);
      }

      // Main Heading
      if (headingText.trim()) {
        const headingSize = Math.round(W * 0.068);
        ctx.font = `900 ${headingSize}px "Plus Jakarta Sans", Impact, sans-serif`;
        ctx.fillStyle = primaryColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillText(headingText.toUpperCase(), textX, currentY + headingSize);
        ctx.shadowBlur = 0;
        currentY += headingSize * 1.25;
      }

      // Subheading
      if (subheadingText.trim()) {
        const subSize = Math.round(W * 0.028);
        ctx.font = `600 ${subSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = accentColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(subheadingText, textX, currentY + subSize);
        ctx.shadowBlur = 0;
        currentY += subSize * 1.8;
      }

      // Call to Action (CTA) Button
      if (ctaText.trim()) {
        const ctaFontSize = Math.round(W * 0.026);
        ctx.font = `bold ${ctaFontSize}px "Plus Jakarta Sans", sans-serif`;
        const ctaMetrics = ctx.measureText(ctaText);
        const ctaPadX = 35;
        const btnH = Math.round(W * 0.052);
        const btnW = ctaMetrics.width + ctaPadX * 2;
        const btnX = textAlignment === 'center' ? (W - btnW) / 2 : textAlignment === 'left' ? 70 : W - 70 - btnW;
        const btnY = currentY + 15;

        // Button background
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 14);
        ctx.fill();

        // Button text
        ctx.fillStyle = '#0f172a';
        ctx.fillText(ctaText, btnX + btnW / 2, btnY + btnH * 0.68);
      }

      const blob = await canvasToBlob(canvas, exportFormat, 0.95);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    renderPoster().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, loadedLogo, preset, headingText, subheadingText, badgeText, ctaText, primaryColor, accentColor, badgeColor, overlayDarkness, textAlignment, exportFormat]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_poster_${preset.id}.${ext}`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload background image for poster"
          subtitle="Design viral social media flyers and posters for Instagram, Facebook, and YouTube with custom typography & branding."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            {/* Dimensions selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-blue-600" />
                Select Platform Dimension Preset:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {POSTER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      preset.id === p.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className={`text-[10px] mt-0.5 ${preset.id === p.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {p.width}×{p.height} ({p.ratioLabel})
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag / Announcement</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. FLASH SALE"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. SHOP NOW →"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={headingText}
                  onChange={(e) => setHeadingText(e.target.value)}
                  placeholder="Headline..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-headline / Details</label>
                <input
                  type="text"
                  value={subheadingText}
                  onChange={(e) => setSubheadingText(e.target.value)}
                  placeholder="Offer details..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Color & Dark Overlay Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Color</label>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accent / CTA Color</label>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Photo Darkness Filter:</span>
                  <span className="text-blue-600 font-mono">{overlayDarkness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={overlayDarkness}
                  onChange={(e) => setOverlayDarkness(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alignment</label>
                <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setTextAlignment(align)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg uppercase transition-colors ${
                        textAlignment === align ? 'bg-blue-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Logo Upload */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Add Brand Logo Overlay</p>
                <p className="text-[11px] text-slate-500">Stamp your transparent PNG logo in top-left corner</p>
              </div>
              <input
                type="file"
                accept="image/png,image/svg+xml"
                onChange={(e) => e.target.files?.[0] && setLogoFile(e.target.files[0])}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-xl mb-3">
              <span className="text-xs font-bold text-slate-500">
                Live Poster Preview ({preset.name} • {preset.width}×{preset.height}px)
              </span>

              {/* Format selection */}
              <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 text-xs">
                <button
                  onClick={() => setExportFormat('image/png')}
                  className={`px-2.5 py-1 rounded font-bold ${
                    exportFormat === 'image/png' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setExportFormat('image/jpeg')}
                  className={`px-2.5 py-1 rounded font-bold ${
                    exportFormat === 'image/jpeg' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  JPG
                </button>
              </div>
            </div>

            <div className="max-h-[520px] max-w-2xl overflow-hidden rounded-2xl bg-slate-200/40 p-2 flex items-center justify-center">
              {isProcessing ? (
                <div className="py-20 text-slate-500 font-bold text-xs animate-pulse">
                  Rendering typography & design...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Poster Preview"
                  className="max-h-[480px] object-contain rounded-xl shadow-lg"
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
              Choose Another Background
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download {preset.name}</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
