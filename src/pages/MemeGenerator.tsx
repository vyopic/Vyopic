import React, { useState, useEffect } from 'react';
import { Download, Smile, Type, Sliders, RefreshCw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const MemeGeneratorPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'meme-generator')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [topText, setTopText] = useState<string>('WHEN YOU CODE IN TYPESCRIPT');
  const [bottomText, setBottomText] = useState<string>('AND IT COMPILES ON FIRST TRY');
  const [fontSize, setFontSize] = useState<number>(44);
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState<string>('#000000');

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

  // Generate meme
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const renderMeme = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(loadedImg, 0, 0);

      const W = canvas.width;
      const H = canvas.height;

      // Font size proportional to image width
      const scaledSize = Math.max(16, Math.round((fontSize * W) / 800));
      ctx.font = `900 ${scaledSize}px Impact, "Arial Black", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = Math.max(3, Math.round(scaledSize / 8));
      ctx.lineJoin = 'round';

      const renderTextLines = (rawText: string, yPos: number, baseline: CanvasTextBaseline) => {
        ctx.textBaseline = baseline;
        const textToDraw = isUppercase ? rawText.toUpperCase() : rawText;
        if (!textToDraw.trim()) return;

        // Auto wrap if long
        const words = textToDraw.split(' ');
        let line = '';
        const lines: string[] = [];
        const maxW = W * 0.9;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxW && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = scaledSize * 1.15;
        const startY = baseline === 'bottom' ? yPos - (lines.length - 1) * lineHeight : yPos;

        lines.forEach((l, idx) => {
          const currentY = startY + idx * lineHeight;
          ctx.strokeText(l.trim(), W / 2, currentY);
          ctx.fillText(l.trim(), W / 2, currentY);
        });
      };

      // Draw Top Text
      if (topText) {
        renderTextLines(topText, scaledSize + 15, 'top');
      }

      // Draw Bottom Text
      if (bottomText) {
        renderTextLines(bottomText, H - 20, 'bottom');
      }

      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    renderMeme().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, topText, bottomText, fontSize, isUppercase, textColor, outlineColor]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_meme.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image or template to create meme"
          subtitle="Add top and bottom impact text with thick outlines, custom fonts, and colors."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smile className="w-5 h-5 text-blue-600" />
                Meme Text Caption Generator
              </span>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUppercase}
                  onChange={(e) => setIsUppercase(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span>ALL CAPS (Classic Meme Style)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Top Caption Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="TOP TEXT..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bottom Caption Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="BOTTOM TEXT..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Font Size:</span>
                  <span className="text-blue-600 font-mono">{fontSize} pt</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Text Color</label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outline Border Color</label>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700">{outlineColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Meme Output Preview</span>
            <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-16 text-slate-500 font-bold text-xs animate-pulse">
                  Rendering meme text...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Meme"
                  className="max-h-80 object-contain rounded-lg shadow-md"
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
              Make Another Meme
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res Meme</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
