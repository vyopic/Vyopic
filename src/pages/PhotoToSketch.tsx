import React, { useState, useEffect } from 'react';
import { Download, Pencil, Sliders, Eye, RotateCcw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

type SketchStyle = 'pencil' | 'color' | 'portrait' | 'cartoon' | 'bw';

export const PhotoToSketchPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'photo-to-sketch')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [sketchStyle, setSketchStyle] = useState<SketchStyle>('pencil');
  const [intensity, setIntensity] = useState<number>(75); // 20 to 100
  const [edgeStrength, setEdgeStrength] = useState<number>(60); // 10 to 100
  const [contrast, setContrast] = useState<number>(115); // 80 to 160

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

  // Sketch Algorithm: Sobel/Laplace gradient edge detection + color dodge inversion
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const generateSketch = async () => {
      const W = loadedImg.width;
      const H = loadedImg.height;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(loadedImg, 0, 0);

      const srcData = ctx.getImageData(0, 0, W, H);
      const src = srcData.data;

      // 1. Convert to grayscale & inverted copy
      const gray = new Uint8Array(W * H);
      for (let i = 0; i < src.length; i += 4) {
        gray[i / 4] = Math.round(0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2]);
      }

      // 2. High-pass / Sobel Edge gradient detection for pencil strokes
      const edges = new Uint8Array(W * H);
      const edgeWeight = (edgeStrength / 100) * 1.5;

      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const idx = y * W + x;
          const gx =
            -1 * gray[(y - 1) * W + (x - 1)] +
            1 * gray[(y - 1) * W + (x + 1)] +
            -2 * gray[y * W + (x - 1)] +
            2 * gray[y * W + (x + 1)] +
            -1 * gray[(y + 1) * W + (x - 1)] +
            1 * gray[(y + 1) * W + (x + 1)];

          const gy =
            -1 * gray[(y - 1) * W + (x - 1)] +
            -2 * gray[(y - 1) * W + x] +
            -1 * gray[(y - 1) * W + (x + 1)] +
            1 * gray[(y + 1) * W + (x - 1)] +
            2 * gray[(y + 1) * W + x] +
            1 * gray[(y + 1) * W + (x + 1)];

          const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * edgeWeight);
          edges[idx] = mag;
        }
      }

      // 3. Synthesize artistic sketch styles
      const outData = ctx.createImageData(W, H);
      const out = outData.data;

      const intRatio = intensity / 100;
      const contFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          const p = idx * 4;

          const g = gray[idx];
          const edge = edges[idx];

          if (sketchStyle === 'pencil') {
            // Classical Graphite Pencil: White background with dark pencil shading & edges
            let stroke = 255 - edge * 1.2 - (255 - g) * (0.35 * intRatio);
            stroke = Math.max(0, Math.min(255, stroke));
            stroke = contFactor * (stroke - 128) + 128;
            stroke = Math.max(0, Math.min(255, stroke));

            out[p] = stroke;
            out[p + 1] = stroke;
            out[p + 2] = stroke;
            out[p + 3] = 255;
          } else if (sketchStyle === 'color') {
            // Color Sketch: Retain vivid colors blended into pencil outlines
            const dark = (255 - edge * 1.1) / 255;
            out[p] = Math.min(255, src[p] * dark * 1.1);
            out[p + 1] = Math.min(255, src[p + 1] * dark * 1.1);
            out[p + 2] = Math.min(255, src[p + 2] * dark * 1.1);
            out[p + 3] = 255;
          } else if (sketchStyle === 'portrait') {
            // Warm sepia charcoal portrait sketch
            let stroke = 255 - edge - (255 - g) * (0.3 * intRatio);
            stroke = contFactor * (stroke - 128) + 128;
            stroke = Math.max(0, Math.min(255, stroke));

            out[p] = Math.min(255, stroke * 1.05); // slight warm reddish tint
            out[p + 1] = Math.min(255, stroke * 0.95);
            out[p + 2] = Math.min(255, stroke * 0.85);
            out[p + 3] = 255;
          } else if (sketchStyle === 'cartoon') {
            // Quantized cell-shading with bold inked outlines
            const bands = 5;
            const quant = (Math.round((g / 255) * bands) / bands) * 255;
            const dark = edge > 45 ? 0 : 1;

            out[p] = dark === 0 ? 30 : Math.min(255, src[p] * 0.7 + quant * 0.3);
            out[p + 1] = dark === 0 ? 30 : Math.min(255, src[p + 1] * 0.7 + quant * 0.3);
            out[p + 2] = dark === 0 ? 30 : Math.min(255, src[p + 2] * 0.7 + quant * 0.3);
            out[p + 3] = 255;
          } else {
            // Black & White Charcoal High Contrast
            let val = edge > 50 ? 0 : g > 130 ? 255 : 30;
            out[p] = val;
            out[p + 1] = val;
            out[p + 2] = val;
            out[p + 3] = 255;
          }
        }
      }

      ctx.putImageData(outData, 0, 0);

      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    generateSketch().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, sketchStyle, intensity, edgeStrength, contrast]);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_${sketchStyle}_sketch.jpg`);
  };

  const handleReset = () => {
    setSketchStyle('pencil');
    setIntensity(75);
    setEdgeStrength(60);
    setContrast(115);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image to convert to sketch"
          subtitle="Transform photos into Pencil Sketches, Color Drawings, Portrait Charcoal, and Cartoon illustrations in your browser."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                Select Sketch Effect Style
              </span>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Settings</span>
              </button>
            </div>

            {/* 5 Sketch Styles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'pencil', label: 'Pencil Sketch', desc: 'Classic graphite' },
                { id: 'color', label: 'Color Sketch', desc: 'Colored pencils' },
                { id: 'portrait', label: 'Portrait Sketch', desc: 'Warm charcoal' },
                { id: 'cartoon', label: 'Cartoon Sketch', desc: 'Cell-shaded ink' },
                { id: 'bw', label: 'Black & White', desc: 'High-contrast ink' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSketchStyle(s.id as SketchStyle)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sketchStyle === s.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{s.label}</p>
                  <p className={`text-[10px] mt-0.5 ${sketchStyle === s.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {s.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Effect Intensity:</span>
                  <span className="text-blue-600 font-mono">{intensity}%</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Pencil Line Edge Strength:</span>
                  <span className="text-blue-600 font-mono">{edgeStrength}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={edgeStrength}
                  onChange={(e) => setEdgeStrength(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Stroke Contrast:</span>
                  <span className="text-blue-600 font-mono">{contrast}%</span>
                </label>
                <input
                  type="range"
                  min="80"
                  max="160"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-600">
                {showOriginal ? 'Viewing Original Photo' : 'Artistic Sketch Result Preview'}
              </span>

              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs select-none"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Hold to Compare Original</span>
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
                  Tracing pencil strokes & edge gradients...
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Sketch"
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
              Convert Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download HD Sketch Drawing</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
