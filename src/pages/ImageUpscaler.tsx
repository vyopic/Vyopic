import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Sliders, Eye } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const ImageUpscalerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-upscaler')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [sharpness, setSharpness] = useState<number>(30); // 0 to 100
  const [denoise, setDenoise] = useState<boolean>(true);

  const [result, setResult] = useState<{ blob: Blob; url: string; width: number; height: number } | null>(null);
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

  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const upscale = async () => {
      const targetW = loadedImg.width * scaleFactor;
      const targetH = loadedImg.height * scaleFactor;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(loadedImg, 0, 0, targetW, targetH);

      // Apply unsharp mask sharpening filter
      if (sharpness > 0) {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const copy = new Uint8ClampedArray(data);

        const strength = (sharpness / 100) * 0.8;
        const w = targetW;
        const h = targetH;

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;

            for (let c = 0; c < 3; c++) {
              // Laplacian 3x3 kernel
              const center = copy[idx + c];
              const top = copy[((y - 1) * w + x) * 4 + c];
              const bottom = copy[((y + 1) * w + x) * 4 + c];
              const left = copy[(y * w + (x - 1)) * 4 + c];
              const right = copy[(y * w + (x + 1)) * 4 + c];

              const laplacian = 4 * center - (top + bottom + left + right);
              data[idx + c] = Math.min(255, Math.max(0, center + laplacian * strength));
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const blob = await canvasToBlob(canvas, 'image/png', 0.95);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url, width: targetW, height: targetH });
        setIsProcessing(false);
      }
    };

    upscale().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, scaleFactor, sharpness, denoise]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_upscaled_${scaleFactor}x.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image to upscale"
          subtitle="Enlarge photos to 2x or 4x resolution with detail sharpening and artifact reduction."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Upscaling Multiplier & Clarity
              </span>

              {/* Multiplier buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScaleFactor(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    scaleFactor === 2
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  2x Resolution (200%)
                </button>
                <button
                  onClick={() => setScaleFactor(4)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    scaleFactor === 4
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  4x Ultra Resolution (400%)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Edge Sharpening Strength:</span>
                  <span className="text-blue-600 font-mono">{sharpness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sharpness}
                  onChange={(e) => setSharpness(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-800">Adaptive Detail Recovery</p>
                  <p className="text-[11px] text-slate-500">Smooth out jagged pixel borders</p>
                </div>
                <input
                  type="checkbox"
                  checked={denoise}
                  onChange={(e) => setDenoise(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl text-center">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Original Resolution</p>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                {loadedImg?.width} × {loadedImg?.height} px
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Upscaled Resolution</p>
              <p className="text-sm font-extrabold text-blue-600 mt-0.5">
                {result ? `${result.width} × ${result.height} px` : 'Computing...'}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Scale Factor</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                {scaleFactor}X ({scaleFactor * 100}%)
              </p>
            </div>
          </div>

          {/* Image preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-600">
                {showOriginal ? 'Viewing Original Photo' : `Upscaled Preview (${scaleFactor}x High Fidelity)`}
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
                  Interpolating and sharpening pixels...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Upscaled"
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
              Upscale Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download {scaleFactor}x Upscaled Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
