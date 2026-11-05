import React, { useState, useEffect, useRef } from 'react';
import { Download, Scissors, Sliders, RefreshCw, Eye, Check } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const BackgroundRemoverPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'background-remover')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [tolerance, setTolerance] = useState<number>(35);
  const [edgeSmoothness, setEdgeSmoothness] = useState<number>(2);
  const [customKeyColor, setCustomKeyColor] = useState<string | null>(null);
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);

  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResult(null);
      setCustomKeyColor(null);
      return;
    }
    loadImage(selectedFile).then((img) => setLoadedImg(img));
  }, [selectedFile]);

  // Remove background processing
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    const runSegmentation = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(loadedImg, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample key color: either user selected or top-left corner
      let targetR = data[0];
      let targetG = data[1];
      let targetB = data[2];

      if (customKeyColor) {
        const hex = customKeyColor.replace('#', '');
        targetR = parseInt(hex.substring(0, 2), 16);
        targetG = parseInt(hex.substring(2, 4), 16);
        targetB = parseInt(hex.substring(4, 6), 16);
      }

      const tolSq = Math.pow((tolerance / 100) * 255, 2) * 3;
      const smoothWindow = edgeSmoothness;

      // Primary color distance pass
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distSq = Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2);

        if (distSq <= tolSq) {
          // Soft edge feathering near boundary
          const ratio = distSq / tolSq;
          if (ratio > 0.8 && smoothWindow > 0) {
            data[i + 3] = Math.round(((ratio - 0.8) / 0.2) * 255);
          } else {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const blob = await canvasToBlob(canvas, 'image/png', 1.0);
      const url = URL.createObjectURL(blob);

      if (isMounted) {
        setResult({ blob, url });
        setIsProcessing(false);
      }
    };

    runSegmentation().catch((err) => {
      console.error(err);
      if (isMounted) setIsProcessing(false);
    });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, tolerance, edgeSmoothness, customKeyColor]);

  // Click on image to sample background color
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isEyedropperActive || !imgRef.current || !loadedImg) return;

    const rect = imgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = loadedImg.width / rect.width;
    const scaleY = loadedImg.height / rect.height;

    const pixelX = Math.floor(clickX * scaleX);
    const pixelY = Math.floor(clickY * scaleY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = loadedImg.width;
    tempCanvas.height = loadedImg.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(loadedImg, 0, 0);
    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
    setCustomKeyColor(hex);
    setIsEyedropperActive(false);
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(result.blob, `${baseName}_transparent_bg.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image to remove background"
          subtitle="Isolate subjects and export transparent PNG cutouts in your browser with zero server uploads."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Background Removal Controls</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEyedropperActive(!isEyedropperActive)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isEyedropperActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isEyedropperActive ? 'Click Image to Pick Color' : 'Pick Color from Image'}
                </button>
                {customKeyColor && (
                  <button
                    onClick={() => setCustomKeyColor(null)}
                    className="text-xs text-slate-500 hover:text-red-600 underline"
                  >
                    Reset Color
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Removal Tolerance / Sensitivity:</span>
                  <span className="text-blue-600 font-mono">{tolerance}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Strict (Less Cut)</span>
                  <span>Aggressive (More Cut)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Edge Feathering & Smoothing:</span>
                  <span className="text-blue-600 font-mono">{edgeSmoothness}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={edgeSmoothness}
                  onChange={(e) => setEdgeSmoothness(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Hard Edge</span>
                  <span>Soft Feather</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side by side / Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-500 mb-2 block">
                Original Image {isEyedropperActive && '(Click any point to select background)'}
              </span>
              <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-2">
                <img
                  ref={imgRef}
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  onClick={handleImageClick}
                  className={`max-h-72 object-contain rounded-lg ${
                    isEyedropperActive ? 'cursor-crosshair ring-2 ring-blue-500' : ''
                  }`}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-blue-600">Transparent PNG Preview</span>
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Hold to View Original
                </button>
              </div>

              <div
                className="max-h-80 overflow-hidden rounded-xl flex items-center justify-center p-3 relative"
                style={{
                  backgroundImage:
                    'repeating-conic-gradient(#cbd5e1 0% 25%, #f1f5f9 0% 50%) 50% / 16px 16px'
                }}
              >
                {showOriginal ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Original Preview"
                    className="max-h-72 object-contain rounded-lg shadow-sm"
                  />
                ) : isProcessing ? (
                  <div className="py-16 text-slate-600 font-bold text-xs bg-white/80 px-4 py-2 rounded-xl backdrop-blur-xs">
                    Segmenting background...
                  </div>
                ) : result ? (
                  <img
                    src={result.url}
                    alt="Transparent"
                    className="max-h-72 object-contain rounded-lg shadow-sm"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Choose Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Transparent PNG</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
