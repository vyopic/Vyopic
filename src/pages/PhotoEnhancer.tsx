import React, { useState, useEffect } from 'react';
import { Download, Wand2, Sliders, RotateCcw, Eye } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const PhotoEnhancerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'photo-enhancer')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [vibrance, setVibrance] = useState<number>(30); // 0 to 100
  const [dynamicContrast, setDynamicContrast] = useState<number>(25); // 0 to 100
  const [shadowLift, setShadowLift] = useState<number>(20); // 0 to 100
  const [clarity, setClarity] = useState<number>(25); // 0 to 100

  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResult(null);
      return;
    }
    loadImage(selectedFile).then((img) => setLoadedImg(img));
  }, [selectedFile]);

  // Execute smart enhancement
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const enhance = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(loadedImg, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Factors
      const contFactor = (259 * (dynamicContrast + 255)) / (255 * (259 - dynamicContrast));
      const vibFactor = vibrance / 100;
      const shadowFactor = shadowLift / 100;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // 1. Shadow lift: boost underexposed dark areas without blowing out highlights
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 128) {
          const shadowBoost = (1 - lum / 128) * shadowFactor * 45;
          r += shadowBoost;
          g += shadowBoost;
          b += shadowBoost;
        }

        // 2. Dynamic contrast
        r = contFactor * (r - 128) + 128;
        g = contFactor * (g - 128) + 128;
        b = contFactor * (b - 128) + 128;

        // 3. Vibrance: boost muted colors more than already saturated colors
        const max = Math.max(r, Math.max(g, b));
        const avg = (r + g + b) / 3;
        const amt = ((Math.abs(max - avg) * 2) / 255) * vibFactor;

        if (r !== max) r += (max - r) * amt;
        if (g !== max) g += (max - g) * amt;
        if (b !== max) b += (max - b) * amt;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imgData, 0, 0);

      // 4. Clarity / micro-contrast unsharp mask
      if (clarity > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.filter = `blur(${Math.max(1, Math.round(canvas.width / 500))}px)`;
          tempCtx.drawImage(canvas, 0, 0);
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = (clarity / 100) * 0.4;
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.94);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    enhance().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, vibrance, dynamicContrast, shadowLift, clarity]);

  const handleReset = () => {
    setVibrance(30);
    setDynamicContrast(25);
    setShadowLift(20);
    setClarity(25);
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_enhanced.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload photo for AI auto-enhancement"
          subtitle="Automatically balances lighting, dynamic contrast, vibrance, and shadow details with 100% browser privacy."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-600" />
                Intelligent Exposure & Color Tuning
              </span>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to Balanced Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Color Vibrance:</span>
                  <span className="text-blue-600 font-mono">{vibrance}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={vibrance}
                  onChange={(e) => setVibrance(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Dynamic Contrast:</span>
                  <span className="text-blue-600 font-mono">{dynamicContrast}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={dynamicContrast}
                  onChange={(e) => setDynamicContrast(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Shadow Recovery:</span>
                  <span className="text-blue-600 font-mono">{shadowLift}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowLift}
                  onChange={(e) => setShadowLift(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Clarity & Texture:</span>
                  <span className="text-blue-600 font-mono">{clarity}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={clarity}
                  onChange={(e) => setClarity(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-600">
                {showOriginal ? 'Viewing Original Photo' : 'Enhanced Photo Preview'}
              </span>
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" /> Hold to Compare Original
              </button>
            </div>

            <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {showOriginal ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  className="max-h-80 object-contain rounded-lg"
                />
              ) : isProcessing ? (
                <div className="py-16 text-slate-500 font-bold text-xs animate-pulse">
                  Applying tone mapping and dynamic balance...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Enhanced"
                  className="max-h-80 object-contain rounded-lg shadow-md"
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
              Enhance Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Enhanced Photo</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
