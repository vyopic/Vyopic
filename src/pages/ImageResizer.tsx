import React, { useState, useEffect } from 'react';
import { Download, Lock, Unlock, Maximize2, RefreshCw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, resizeImage, downloadBlob } from '../utils/imageProcessing';

export const ImageResizerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-resizer')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [width, setWidth] = useState<number>(1080);
  const [height, setHeight] = useState<number>(1080);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const [resizedResult, setResizedResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image object
  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setResizedResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    });
  }, [selectedFile]);

  // Handle dimension changes with aspect lock
  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (lockAspect && aspectRatio > 0) {
      setHeight(Math.round(newW / aspectRatio));
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (lockAspect && aspectRatio > 0) {
      setWidth(Math.round(newH * aspectRatio));
    }
  };

  const applyPreset = (presetW: number, presetH: number) => {
    setLockAspect(false);
    setWidth(presetW);
    setHeight(presetH);
  };

  // Execute Resize
  useEffect(() => {
    if (!loadedImg || width <= 0 || height <= 0) return;

    let isMounted = true;
    setIsProcessing(true);

    resizeImage(loadedImg, width, height, 'image/jpeg', 0.92)
      .then((res) => {
        if (isMounted) {
          setResizedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Resize error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, width, height]);

  const handleDownload = () => {
    if (!resizedResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(resizedResult.blob, `${baseName}_resized_${width}x${height}.jpg`);
  };

  const presets = [
    { label: 'Instagram Post', w: 1080, h: 1080 },
    { label: 'Instagram Story', w: 1080, h: 1920 },
    { label: 'YouTube Banner', w: 1280, h: 720 },
    { label: 'FB Cover', w: 820, h: 312 },
    { label: 'LinkedIn Banner', w: 1584, h: 396 },
    { label: 'Profile Avatar', w: 500, h: 500 }
  ];

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to resize"
          subtitle="Change pixel dimensions or choose standard social media presets."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-blue-600" />
                Custom Dimension Controls
              </h3>

              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  lockAspect ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
              </button>
            </div>

            {/* Width and Height Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Width (pixels)
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Height (pixels)
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Preset Dimensions:</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      width === p.w && height === p.h
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label} ({p.w}x{p.h})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">
              Resize Preview ({width} × {height} px)
            </span>

            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Resizing image canvas...
                </div>
              ) : resizedResult ? (
                <img
                  src={resizedResult.url}
                  alt="Resized"
                  className="max-h-72 object-contain rounded-lg shadow-2xs"
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
              Resize Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={!resizedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
