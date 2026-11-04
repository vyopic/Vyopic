import React, { useState, useEffect } from 'react';
import { Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, rotateAndFlip, downloadBlob } from '../utils/imageProcessing';

export const ImageRotatorPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-rotator')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [angle, setAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const [rotatedResult, setRotatedResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setRotatedResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
    });
  }, [selectedFile]);

  // Execute Rotation & Flip
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    rotateAndFlip(loadedImg, angle, flipH, flipV, 'image/png', 0.95)
      .then((res) => {
        if (isMounted) {
          setRotatedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Rotate error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, angle, flipH, flipV]);

  const handleRotateLeft = () => setAngle((prev) => (prev - 90) % 360);
  const handleRotateRight = () => setAngle((prev) => (prev + 90) % 360);

  const handleReset = () => {
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleDownload = () => {
    if (!rotatedResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(rotatedResult.blob, `${baseName}_rotated.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to rotate or flip"
          subtitle="Rotate 90° left or right, adjust custom rotation angles, or mirror flip photos."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800">Quick Actions:</span>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Reset Orientation
              </button>
            </div>

            {/* Rotation Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleRotateLeft}
                className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Rotate Left 90°</span>
              </button>

              <button
                onClick={handleRotateRight}
                className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <RotateCw className="w-4 h-4 text-blue-600" />
                <span>Rotate Right 90°</span>
              </button>

              <button
                onClick={() => setFlipH(!flipH)}
                className={`py-2.5 px-4 border font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  flipH ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>Flip Horizontal</span>
              </button>

              <button
                onClick={() => setFlipV(!flipV)}
                className={`py-2.5 px-4 border font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  flipV ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlipVertical className="w-4 h-4" />
                <span>Flip Vertical</span>
              </button>
            </div>

            {/* Custom Degree Slider */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                <span>Custom Rotation Angle:</span>
                <span className="text-blue-600 font-mono">{angle}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Rotated Result Preview</span>

            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Rotating photo canvas...
                </div>
              ) : rotatedResult ? (
                <img
                  src={rotatedResult.url}
                  alt="Rotated"
                  className="max-h-72 object-contain rounded-lg shadow-md"
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
              Rotate Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={!rotatedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Rotated Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
