import React, { useState, useEffect } from 'react';
import { Download, Stamp, Type, Image as ImageIcon, Sliders } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const ImageWatermarkPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-watermark')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Watermark Settings
  const [watermarkType, setWatermarkType] = useState<'text' | 'logo'>('text');
  const [text, setText] = useState<string>('© Vyopic Watermark');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(70); // 0 to 100
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'tile'>('bottom-right');
  const [rotation, setRotation] = useState<number>(0);

  // Logo file
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loadedLogo, setLoadedLogo] = useState<HTMLImageElement | null>(null);

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

  useEffect(() => {
    if (!logoFile) {
      setLoadedLogo(null);
      return;
    }
    loadImage(logoFile).then((img) => setLoadedLogo(img));
  }, [logoFile]);

  // Render watermark
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const applyWatermark = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw base photo
      ctx.drawImage(loadedImg, 0, 0);

      const alpha = opacity / 100;
      ctx.globalAlpha = alpha;

      const W = canvas.width;
      const H = canvas.height;

      if (watermarkType === 'text') {
        const scaledFontSize = Math.max(14, Math.round((fontSize * W) / 1000));
        ctx.font = `bold ${scaledFontSize}px sans-serif`;
        ctx.fillStyle = textColor;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        if (position === 'tile') {
          ctx.save();
          ctx.translate(W / 2, H / 2);
          ctx.rotate((-30 * Math.PI) / 180);
          ctx.textAlign = 'center';

          const stepX = scaledFontSize * 8;
          const stepY = scaledFontSize * 4;

          for (let y = -H; y < H * 2; y += stepY) {
            for (let x = -W; x < W * 2; x += stepX) {
              ctx.fillText(text, x, y);
            }
          }
          ctx.restore();
        } else {
          ctx.save();
          let posX = W - 40;
          let posY = H - 40;
          let align: CanvasTextAlign = 'right';

          if (position === 'center') {
            posX = W / 2;
            posY = H / 2;
            align = 'center';
          } else if (position === 'bottom-left') {
            posX = 40;
            posY = H - 40;
            align = 'left';
          } else if (position === 'top-right') {
            posX = W - 40;
            posY = scaledFontSize + 30;
            align = 'right';
          }

          ctx.textAlign = align;
          ctx.translate(posX, posY);
          if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      } else if (watermarkType === 'logo' && loadedLogo) {
        // Logo size scaled relative to photo
        const logoTargetW = Math.round(W * 0.2);
        const logoTargetH = (logoTargetW * loadedLogo.height) / loadedLogo.width;

        if (position === 'tile') {
          const stepX = logoTargetW * 1.8;
          const stepY = logoTargetH * 1.8;
          for (let y = 40; y < H; y += stepY) {
            for (let x = 40; x < W; x += stepX) {
              ctx.drawImage(loadedLogo, x, y, logoTargetW, logoTargetH);
            }
          }
        } else {
          let posX = W - logoTargetW - 30;
          let posY = H - logoTargetH - 30;

          if (position === 'center') {
            posX = (W - logoTargetW) / 2;
            posY = (H - logoTargetH) / 2;
          } else if (position === 'bottom-left') {
            posX = 30;
            posY = H - logoTargetH - 30;
          } else if (position === 'top-right') {
            posX = W - logoTargetW - 30;
            posY = 30;
          }

          ctx.drawImage(loadedLogo, posX, posY, logoTargetW, logoTargetH);
        }
      }

      ctx.globalAlpha = 1.0;

      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    applyWatermark().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, watermarkType, text, textColor, fontSize, opacity, position, rotation, loadedLogo]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_watermarked.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image to watermark"
          subtitle="Add customizable copyright text, logo stamps, position alignment, and tile patterns."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stamp className="w-5 h-5 text-blue-600" />
                Watermark Mode
              </span>

              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                <button
                  onClick={() => setWatermarkType('text')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                    watermarkType === 'text' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text Watermark
                </button>
                <button
                  onClick={() => setWatermarkType('logo')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                    watermarkType === 'logo' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Logo Overlay
                </button>
              </div>
            </div>

            {/* Text options */}
            {watermarkType === 'text' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. © 2026 Your Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700">{textColor}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Upload Watermark Logo / PNG</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => e.target.files?.[0] && setLogoFile(e.target.files[0])}
                  className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}

            {/* Position & Opacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Position Placement</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="bottom-right">Bottom Right Corner</option>
                  <option value="bottom-left">Bottom Left Corner</option>
                  <option value="top-right">Top Right Corner</option>
                  <option value="center">Centered</option>
                  <option value="tile">Repeating Tile / Pattern</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Watermark Opacity:</span>
                  <span className="text-blue-600 font-mono">{opacity}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {watermarkType === 'text' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                    <span>Font Scale:</span>
                    <span className="text-blue-600 font-mono">{fontSize} pt</span>
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Watermarked Image Preview</span>
            <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-16 text-slate-500 font-bold text-xs animate-pulse">
                  Stamping watermark...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Watermarked"
                  className="max-h-80 object-contain rounded-lg shadow-sm"
                />
              ) : null}
            </div>
          </div>

          {/* Download Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Watermark Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Watermarked Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
