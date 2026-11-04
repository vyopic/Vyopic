import React, { useState, useEffect } from 'react';
import { Download, Crop, RefreshCw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, cropImage, downloadBlob } from '../utils/imageProcessing';

export const ImageCropperPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-cropper')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Aspect Ratio Option: 'free' | '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
  const [selectedRatio, setSelectedRatio] = useState<string>('free');

  // Crop percentage boxes relative to original image dimensions (0 to 1)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8
  });

  const [croppedResult, setCroppedResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setCroppedResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
      setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
    });
  }, [selectedFile]);

  // Apply Ratio preset to cropBox
  const applyRatio = (ratio: string) => {
    setSelectedRatio(ratio);
    if (!loadedImg) return;

    const imgW = loadedImg.width;
    const imgH = loadedImg.height;

    let targetW = 0.8;
    let targetH = 0.8;

    if (ratio === '1:1') {
      const minDim = Math.min(imgW, imgH) * 0.8;
      targetW = minDim / imgW;
      targetH = minDim / imgH;
    } else if (ratio === '16:9') {
      const w = 0.8;
      const h = (w * imgW * (9 / 16)) / imgH;
      targetW = w;
      targetH = Math.min(0.9, h);
    } else if (ratio === '4:3') {
      const w = 0.8;
      const h = (w * imgW * (3 / 4)) / imgH;
      targetW = w;
      targetH = Math.min(0.9, h);
    } else if (ratio === '3:4') {
      const h = 0.8;
      const w = (h * imgH * (3 / 4)) / imgW;
      targetH = h;
      targetW = Math.min(0.9, w);
    } else if (ratio === '9:16') {
      const h = 0.8;
      const w = (h * imgH * (9 / 16)) / imgW;
      targetH = h;
      targetW = Math.min(0.9, w);
    }

    setCropBox({
      x: (1 - targetW) / 2,
      y: (1 - targetH) / 2,
      w: targetW,
      h: targetH
    });
  };

  // Perform crop calculation
  useEffect(() => {
    if (!loadedImg) return;

    const pxX = Math.round(cropBox.x * loadedImg.width);
    const pxY = Math.round(cropBox.y * loadedImg.height);
    const pxW = Math.round(cropBox.w * loadedImg.width);
    const pxH = Math.round(cropBox.h * loadedImg.height);

    if (pxW <= 0 || pxH <= 0) return;

    let isMounted = true;
    setIsProcessing(true);

    cropImage(loadedImg, { x: pxX, y: pxY, width: pxW, height: pxH }, 'image/png', 0.95)
      .then((res) => {
        if (isMounted) {
          setCroppedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Crop error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, cropBox]);

  const handleDownload = () => {
    if (!croppedResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(croppedResult.blob, `${baseName}_cropped.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to crop"
          subtitle="Select preset ratios (Square 1:1, 16:9, 4:3, etc.) or freeform selection."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Crop className="w-4 h-4 text-blue-600" />
              Select Aspect Ratio Preset
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Free Crop', val: 'free' },
                { label: '1:1 Square', val: '1:1' },
                { label: '16:9 Landscape', val: '16:9' },
                { label: '4:3 Standard', val: '4:3' },
                { label: '3:4 Portrait', val: '3:4' },
                { label: '9:16 Story', val: '9:16' }
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => applyRatio(r.val)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                    selectedRatio === r.val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* In-box Crop Position Sliders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500">Horizontal Position</label>
                <input
                  type="range"
                  min="0"
                  max={1 - cropBox.w}
                  step="0.01"
                  value={cropBox.x}
                  onChange={(e) => setCropBox({ ...cropBox, x: Number(e.target.value) })}
                  className="w-full h-1.5 accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">Vertical Position</label>
                <input
                  type="range"
                  min="0"
                  max={1 - cropBox.h}
                  step="0.01"
                  value={cropBox.y}
                  onChange={(e) => setCropBox({ ...cropBox, y: Number(e.target.value) })}
                  className="w-full h-1.5 accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">Crop Width</label>
                <input
                  type="range"
                  min="0.1"
                  max={1 - cropBox.x}
                  step="0.01"
                  value={cropBox.w}
                  onChange={(e) => setCropBox({ ...cropBox, w: Number(e.target.value) })}
                  className="w-full h-1.5 accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">Crop Height</label>
                <input
                  type="range"
                  min="0.1"
                  max={1 - cropBox.y}
                  step="0.01"
                  value={cropBox.h}
                  onChange={(e) => setCropBox({ ...cropBox, h: Number(e.target.value) })}
                  className="w-full h-1.5 accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source with Overlay */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-500 mb-2 block">Source Photo & Crop Selection</span>
              <div className="relative max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  className="max-h-72 object-contain rounded-lg"
                />
                {/* Visual Crop Box Mask Overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none rounded-xs shadow-outline"
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.w * 100}%`,
                    height: `${cropBox.h * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Cropped Output Result */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-blue-600 mb-2 block">Cropped Result Preview</span>
              <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-2">
                {isProcessing ? (
                  <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                    Cropping image canvas...
                  </div>
                ) : croppedResult ? (
                  <img
                    src={croppedResult.url}
                    alt="Cropped"
                    className="max-h-72 object-contain rounded-lg shadow-sm"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Download Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Crop Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!croppedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Cropped Photo</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
