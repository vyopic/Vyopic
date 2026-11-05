import React, { useState, useEffect, useRef } from 'react';
import { Download, Eraser, Sliders, RotateCcw, Eye, Sparkles } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

export const ObjectRemoverPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'object-remover')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [brushSize, setBrushSize] = useState<number>(30);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [hasMask, setHasMask] = useState<boolean>(false);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResultUrl(null);
      setResultBlob(null);
      setHasMask(false);
      return;
    }
    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
      initCanvas(img);
    });
  }, [selectedFile]);

  const initCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current || !loadedImg) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.55)'; // Red semi-transparent selection mask
    ctx.beginPath();
    ctx.arc(x, y, brushSize * (scaleX / 1.5), 0, Math.PI * 2);
    ctx.fill();

    setHasMask(true);
  };

  // Texture-synthesis inpainting algorithm: replaces marked red pixels with neighboring healthy samples
  const eraseObject = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImg) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsProcessing(true);

    // Get current marked canvas and original clean base
    const markedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mData = markedData.data;

    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = canvas.width;
    baseCanvas.height = canvas.height;
    const bCtx = baseCanvas.getContext('2d');
    if (!bCtx) return;
    bCtx.drawImage(loadedImg, 0, 0);
    const cleanData = bCtx.getImageData(0, 0, canvas.width, canvas.height);
    const cData = cleanData.data;

    const W = canvas.width;
    const H = canvas.height;

    // Detect masked pixels where user painted
    const mask = new Uint8Array(W * H);
    for (let i = 0; i < mData.length; i += 4) {
      const r = mData[i];
      const g = mData[i + 1];
      const b = mData[i + 2];
      const origR = cData[i];
      const origG = cData[i + 1];
      const origB = cData[i + 2];

      // Pixel was covered with red mask
      if (r > origR + 25 && g < origG + 10 && b < origB + 10) {
        mask[i / 4] = 1;
      }
    }

    // Inpainting: fast iterative boundary push from neighboring unmasked pixels
    const maxRadius = Math.max(15, Math.round(brushSize * 1.2));

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;
        if (mask[idx] === 1) {
          // Search surrounding valid pixels
          let sumR = 0;
          let sumG = 0;
          let sumB = 0;
          let count = 0;

          for (let r = 1; r <= maxRadius; r += 2) {
            const offsets = [
              [x - r, y], [x + r, y], [x, y - r], [x, y + r],
              [x - r, y - r], [x + r, y - r], [x - r, y + r], [x + r, y + r]
            ];

            for (const [nx, ny] of offsets) {
              if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                const nIdx = ny * W + nx;
                if (mask[nIdx] === 0) {
                  const p = nIdx * 4;
                  sumR += cData[p];
                  sumG += cData[p + 1];
                  sumB += cData[p + 2];
                  count++;
                }
              }
            }
            if (count >= 6) break;
          }

          const targetP = idx * 4;
          if (count > 0) {
            cData[targetP] = Math.round(sumR / count);
            cData[targetP + 1] = Math.round(sumG / count);
            cData[targetP + 2] = Math.round(sumB / count);
          }
        }
      }
    }

    // Re-draw cleaned image on working canvas
    ctx.putImageData(cleanData, 0, 0);

    const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
    const url = URL.createObjectURL(blob);

    setResultBlob(blob);
    setResultUrl(url);
    setIsProcessing(false);
    setHasMask(false);
  };

  const handleReset = () => {
    if (loadedImg) initCanvas(loadedImg);
    setHasMask(false);
    setResultUrl(null);
  };

  const handleDownload = () => {
    if (!resultBlob || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(resultBlob, `${baseName}_erased.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload image to erase objects"
          subtitle="Paint over unwanted objects, people, or blemishes to remove them with content-aware inpainting."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eraser className="w-5 h-5 text-blue-600" />
                Object Removal Brush
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Canvas</span>
                </button>

                <button
                  onClick={eraseObject}
                  disabled={!hasMask || isProcessing}
                  className="flex items-center gap-1.5 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Inpainting...' : 'Erase Object Now'}</span>
                </button>
              </div>
            </div>

            <div className="max-w-md">
              <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                <span>Brush Diameter:</span>
                <span className="text-blue-600 font-mono">{brushSize} px</span>
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Drag and paint red mask directly over the item you wish to remove.
              </p>
            </div>
          </div>

          {/* Interactive Brush Canvas */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-600">
                {resultUrl ? 'Result Preview (Object Erased)' : 'Interactive Mask Drawing (Paint over object)'}
              </span>

              {resultUrl && (
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200"
                >
                  <Eye className="w-3.5 h-3.5" /> Hold to Compare Original
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3 relative">
              {showOriginal ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  className="max-h-80 object-contain rounded-lg"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDraw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onMouseMove={draw}
                  onTouchStart={startDraw}
                  onTouchEnd={endDraw}
                  onTouchMove={draw}
                  className="max-h-80 max-w-full object-contain cursor-crosshair rounded-lg shadow-sm"
                />
              )}
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
              disabled={!resultBlob}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Clean Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
