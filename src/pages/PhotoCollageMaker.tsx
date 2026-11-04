import React, { useState, useEffect } from 'react';
import { Download, LayoutGrid, Palette, Sliders, Trash2 } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, createCollage, downloadBlob } from '../utils/imageProcessing';

export const PhotoCollageMakerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'photo-collage-maker')!;

  const [files, setFiles] = useState<File[]>([]);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  const [layoutType, setLayoutType] = useState<'grid-2' | 'grid-3' | 'grid-4' | 'grid-6'>('grid-4');
  const [spacing, setSpacing] = useState<number>(12);
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const [collageResult, setCollageResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle uploaded files
  const handleMultipleFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles].slice(0, 6);
    setFiles(combined);
  };

  // Load Image elements
  useEffect(() => {
    if (files.length === 0) {
      setLoadedImages([]);
      setCollageResult(null);
      return;
    }

    Promise.all(files.map((f) => loadImage(f)))
      .then((imgs) => setLoadedImages(imgs))
      .catch((err) => console.error('Collage image load error:', err));
  }, [files]);

  // Generate Collage Canvas
  useEffect(() => {
    if (loadedImages.length === 0) return;

    let isMounted = true;
    setIsProcessing(true);

    createCollage(loadedImages, layoutType, spacing, borderRadius, bgColor, 1200, 1200)
      .then((res) => {
        if (isMounted) {
          setCollageResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Collage creation error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImages, layoutType, spacing, borderRadius, bgColor]);

  const handleRemoveFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
  };

  const handleDownload = () => {
    if (!collageResult) return;
    downloadBlob(collageResult.blob, 'photo_collage_vyopic.jpg');
  };

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <DropZone
          multiple
          onMultipleImagesSelected={handleMultipleFiles}
          onImageSelected={(f) => handleMultipleFiles([f])}
          title="Upload 2 to 6 photos for your collage"
          subtitle="Combine photos into clean grid arrangements with customizable gap spacing and rounded borders."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            {/* Layout Selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                Collage Grid Layouts:
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'grid-2', label: '2 Photos Split' },
                  { id: 'grid-3', label: '3 Photos Feature' },
                  { id: 'grid-4', label: '4 Photos (2×2 Grid)' },
                  { id: 'grid-6', label: '6 Photos (3×2 Grid)' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayoutType(l.id as any)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                      layoutType === l.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Gap Spacing, Border Radius, Background Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Photo Gap Spacing:</span>
                  <span className="text-blue-600 font-mono">{spacing}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Corner Border Radius:</span>
                  <span className="text-blue-600 font-mono">{borderRadius}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Background Color:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono font-bold text-slate-600">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* File Thumbnails Management */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">Uploaded Photos ({files.length}/6)</span>
                {files.length < 6 && (
                  <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                    + Add More Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleMultipleFiles(Array.from(e.target.files))}
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-300 bg-white">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">
              Live Photo Collage Preview (1200 × 1200 px)
            </span>

            <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Rendering collage grid...
                </div>
              ) : collageResult ? (
                <img
                  src={collageResult.url}
                  alt="Collage"
                  className="max-h-80 object-contain rounded-lg shadow-md"
                />
              ) : null}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setFiles([]);
                setLoadedImages([]);
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Clear All & Start New
            </button>

            <button
              onClick={handleDownload}
              disabled={!collageResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Collage Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
