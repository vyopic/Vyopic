import React, { useState, useEffect } from 'react';
import { Download, Camera, Sliders, Sparkles, Layout, Palette } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

type BoothStyle = 'vintage' | 'passport' | 'professional' | 'funny' | 'cartoon' | 'retro' | 'artistic';
type FrameType = 'strip' | 'polaroid' | 'single-border' | 'neon';

export const AIPhotoBoothPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'ai-photo-booth')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [style, setStyle] = useState<BoothStyle>('vintage');
  const [frameType, setFrameType] = useState<FrameType>('strip');
  const [frameColor, setFrameColor] = useState<string>('#FFFFFF');
  const [stampDate, setStampDate] = useState<boolean>(true);
  const [grainIntensity, setGrainIntensity] = useState<number>(35); // 0 to 100

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

  // Generate Photobooth Layout & Aesthetic Treatment
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const renderBooth = async () => {
      // If 'strip', render vertical 3-shot classic photobooth strip
      const isStrip = frameType === 'strip';
      const outW = isStrip ? 600 : 900;
      const outH = isStrip ? 1600 : 1050;

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Frame Background Fill
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, outW, outH);

      // Neon frame effect
      if (frameType === 'neon') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, outW, outH);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 14;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 30;
        ctx.strokeRect(20, 20, outW - 40, outH - 40);
        ctx.shadowBlur = 0;
      }

      // Filter settings helper based on selected style
      const applyStyleFilter = (context: CanvasRenderingContext2D) => {
        if (style === 'vintage') {
          context.filter = 'sepia(55%) contrast(110%) brightness(95%) saturate(85%)';
        } else if (style === 'retro') {
          context.filter = 'contrast(125%) saturate(140%) hue-rotate(-15deg)';
        } else if (style === 'passport') {
          context.filter = 'contrast(105%) brightness(102%) saturate(100%)';
        } else if (style === 'professional') {
          context.filter = 'contrast(115%) brightness(105%) saturate(110%)';
        } else if (style === 'funny') {
          context.filter = 'contrast(135%) saturate(170%) brightness(110%)';
        } else if (style === 'cartoon') {
          context.filter = 'contrast(140%) saturate(130%) brightness(105%)';
        } else if (style === 'artistic') {
          context.filter = 'grayscale(100%) contrast(145%) brightness(95%)';
        }
      };

      // 2. Render Photos into Frames
      if (isStrip) {
        // 3 Vertical Frames
        const marginX = 40;
        const topMargin = 50;
        const gap = 30;
        const photoW = outW - marginX * 2;
        const photoH = (outH - topMargin - 160 - gap * 2) / 3;

        for (let i = 0; i < 3; i++) {
          const photoY = topMargin + i * (photoH + gap);

          ctx.save();
          applyStyleFilter(ctx);

          // Calculate center cover crop
          const scale = Math.max(photoW / loadedImg.width, photoH / loadedImg.height);
          const drawW = loadedImg.width * scale;
          const drawH = loadedImg.height * scale;
          const drawX = marginX + (photoW - drawW) / 2;
          const drawY = photoY + (photoH - drawH) / 2;

          ctx.beginPath();
          ctx.rect(marginX, photoY, photoW, photoH);
          ctx.clip();
          ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
          ctx.restore();

          // Border line
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(marginX, photoY, photoW, photoH);
        }

        // Photobooth Strip Footer Text
        ctx.fillStyle = frameColor === '#FFFFFF' || frameColor === '#f8fafc' ? '#64748b' : '#cbd5e1';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VYOPIC PHOTO BOOTH', outW / 2, outH - 75);

        if (stampDate) {
          const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          ctx.font = '16px monospace';
          ctx.fillText(`★ ${today.toUpperCase()} ★`, outW / 2, outH - 45);
        }
      } else {
        // Polaroid / Single Frame Layout
        const margin = frameType === 'polaroid' ? 60 : 40;
        const bottomMargin = frameType === 'polaroid' ? 180 : 40;
        const photoW = outW - margin * 2;
        const photoH = outH - margin - bottomMargin;

        ctx.save();
        applyStyleFilter(ctx);

        const scale = Math.max(photoW / loadedImg.width, photoH / loadedImg.height);
        const drawW = loadedImg.width * scale;
        const drawH = loadedImg.height * scale;
        const drawX = margin + (photoW - drawW) / 2;
        const drawY = margin + (photoH - drawH) / 2;

        ctx.beginPath();
        ctx.rect(margin, margin, photoW, photoH);
        ctx.clip();
        ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
        ctx.restore();

        if (frameType === 'polaroid') {
          ctx.fillStyle = '#475569';
          ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Memories • Vyopic AI Studio', outW / 2, outH - 70);

          if (stampDate) {
            ctx.font = '16px monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(new Date().toDateString(), outW / 2, outH - 40);
          }
        }
      }

      // 3. Film Grain Overlay
      if (grainIntensity > 0) {
        const grainData = ctx.getImageData(0, 0, outW, outH);
        const pixels = grainData.data;
        const noiseFactor = (grainIntensity / 100) * 22;

        for (let i = 0; i < pixels.length; i += 4) {
          const noise = (Math.random() - 0.5) * noiseFactor;
          pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
          pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
          pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));
        }
        ctx.putImageData(grainData, 0, 0);
      }

      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.94);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    renderBooth().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, style, frameType, frameColor, stampDate, grainIntensity]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_photobooth_${style}.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload photo for AI Photo Booth"
          subtitle="Apply Vintage, Retro, Polaroid & Classic 3-shot photo strip themes with custom frames and date stamps."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Select Photo Booth Theme
              </span>

              {/* Layout Frame Type */}
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[
                  { id: 'strip', label: 'Classic Strip' },
                  { id: 'polaroid', label: 'Polaroid Frame' },
                  { id: 'single-border', label: 'Clean Border' },
                  { id: 'neon', label: 'Neon Glow' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrameType(f.id as FrameType)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      frameType === f.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 7 Signature Styles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { id: 'vintage', label: 'Vintage' },
                { id: 'retro', label: 'Retro Film' },
                { id: 'passport', label: 'Passport' },
                { id: 'professional', label: 'Studio Pro' },
                { id: 'funny', label: 'Funny Pop' },
                { id: 'cartoon', label: 'Cartoon' },
                { id: 'artistic', label: 'B&W Classic' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id as BoothStyle)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    style === s.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{s.label}</p>
                </button>
              ))}
            </div>

            {/* Options: Frame Color, Date Stamp & Film Grain */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Border & Frame Color</label>
                <div className="flex items-center gap-2">
                  {['#FFFFFF', '#f8fafc', '#0f172a', '#fbcfe8', '#fef08a'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setFrameColor(col)}
                      className={`w-7 h-7 rounded-lg border transition-transform ${
                        frameColor === col ? 'scale-110 ring-2 ring-blue-600' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                  <input
                    type="color"
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Analog Film Grain:</span>
                  <span className="text-blue-600 font-mono">{grainIntensity}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grainIntensity}
                  onChange={(e) => setGrainIntensity(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 self-end">
                <span className="text-xs font-bold text-slate-700">Photobooth Date Stamp</span>
                <input
                  type="checkbox"
                  checked={stampDate}
                  onChange={(e) => setStampDate(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Result Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 mb-4 block">
              Photo Booth Result Preview ({frameType.toUpperCase()})
            </span>

            <div className="max-h-[520px] overflow-hidden rounded-2xl bg-slate-200/40 p-3 flex items-center justify-center">
              {isProcessing ? (
                <div className="py-20 text-slate-500 font-bold text-xs animate-pulse">
                  Developing photobooth prints...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Photo Booth Output"
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
              Take Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Photo Booth Print</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
