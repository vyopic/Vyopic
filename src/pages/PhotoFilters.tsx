import React, { useState, useEffect } from 'react';
import { Download, Sliders, RotateCcw, Eye } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, applyFilters, FilterOptions, downloadBlob } from '../utils/imageProcessing';

export const PhotoFiltersPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'photo-filters')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const defaultFilters: FilterOptions = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotate: 0
  };

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const [filteredResult, setFilteredResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setFilteredResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
    });
  }, [selectedFile]);

  // Apply Filters
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    applyFilters(loadedImg, filters, 'image/jpeg', 0.92)
      .then((res) => {
        if (isMounted) {
          setFilteredResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Filter apply error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, filters]);

  const applyPreset = (presetName: string) => {
    if (presetName === 'vintage') {
      setFilters({ ...defaultFilters, sepia: 40, contrast: 110, saturate: 85 });
    } else if (presetName === 'bw') {
      setFilters({ ...defaultFilters, grayscale: 100, contrast: 125 });
    } else if (presetName === 'warm') {
      setFilters({ ...defaultFilters, brightness: 105, saturate: 130, sepia: 15 });
    } else if (presetName === 'cool') {
      setFilters({ ...defaultFilters, hueRotate: 180, saturate: 110 });
    } else if (presetName === 'dramatic') {
      setFilters({ ...defaultFilters, contrast: 140, saturate: 120, brightness: 95 });
    }
  };

  const handleDownload = () => {
    if (!filteredResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(filteredResult.blob, `${baseName}_filtered.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image for filter adjustments"
          subtitle="Adjust brightness, contrast, saturation, grayscale, sepia, and blur in real time."
        />
      ) : (
        <div className="space-y-8">
          {/* Preset Buttons & Reset Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                Quick Filter Presets:
              </span>

              <button
                onClick={() => setFilters(defaultFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset All Filters</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Original', key: 'default' },
                { label: 'Vintage Tone', key: 'vintage' },
                { label: 'Black & White', key: 'bw' },
                { label: 'Warm Glow', key: 'warm' },
                { label: 'Cool Blue', key: 'cool' },
                { label: 'Dramatic Contrast', key: 'dramatic' }
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => (p.key === 'default' ? setFilters(defaultFilters) : applyPreset(p.key))}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Individual Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Brightness:</span>
                  <span className="text-blue-600 font-mono">{filters.brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Contrast:</span>
                  <span className="text-blue-600 font-mono">{filters.contrast}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Saturation:</span>
                  <span className="text-blue-600 font-mono">{filters.saturate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturate}
                  onChange={(e) => setFilters({ ...filters, saturate: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Grayscale:</span>
                  <span className="text-blue-600 font-mono">{filters.grayscale}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) => setFilters({ ...filters, grayscale: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Sepia Tone:</span>
                  <span className="text-blue-600 font-mono">{filters.sepia}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sepia}
                  onChange={(e) => setFilters({ ...filters, sepia: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Soft Blur:</span>
                  <span className="text-blue-600 font-mono">{filters.blur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={filters.blur}
                  onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Before & After Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">
                {showOriginal ? 'Showing Original Unfiltered Photo' : 'Filtered Image Preview'}
              </span>

              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs cursor-pointer select-none"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Hold to View Original</span>
              </button>
            </div>

            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {showOriginal ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  className="max-h-72 object-contain rounded-lg"
                />
              ) : isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Applying filter effects...
                </div>
              ) : filteredResult ? (
                <img
                  src={filteredResult.url}
                  alt="Filtered"
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
              Edit Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!filteredResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Filtered Photo</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
