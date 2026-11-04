import React, { useState, useEffect } from 'react';
import { Download, Sliders, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { compressImage, formatFileSize, downloadBlob } from '../utils/imageProcessing';

export const ImageCompressorPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-compressor')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [compressedResult, setCompressedResult] = useState<{
    blob: Blob;
    url: string;
    width: number;
    height: number;
    newSize: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Re-compress whenever file, quality, or outputFormat changes
  useEffect(() => {
    if (!selectedFile) {
      setCompressedResult(null);
      return;
    }

    let isMounted = true;
    setIsProcessing(true);

    compressImage(selectedFile, quality, outputFormat)
      .then((res) => {
        if (isMounted) {
          setCompressedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Compression error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFile, quality, outputFormat]);

  const handleDownload = () => {
    if (!compressedResult || !selectedFile) return;
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const fileName = `${baseName}_compressed.${extMap[outputFormat]}`;
    downloadBlob(compressedResult.blob, fileName);
  };

  const reductionPercentage = selectedFile && compressedResult
    ? Math.max(0, Math.round(((selectedFile.size - compressedResult.newSize) / selectedFile.size) * 100))
    : 0;

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to compress"
          subtitle="Supports JPG, PNG, and WebP images. All compression happens locally in your browser."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Compression Quality: <span className="text-blue-600 font-mono">{quality}%</span>
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>Smaller File</span>
                <span>Best Quality</span>
              </div>
            </div>

            {/* Quick Quality Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Preset Levels:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuality(50)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    quality === 50 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  High (50%)
                </button>
                <button
                  onClick={() => setQuality(75)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    quality === 75 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Medium (75%)
                </button>
                <button
                  onClick={() => setQuality(90)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    quality === 90 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Low (90%)
                </button>
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Target Format:
              </label>
              <div className="flex gap-2">
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border uppercase transition-colors ${
                      outputFormat === fmt
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fmt.replace('image/', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl text-center">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Original Size</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compressed Size</p>
              <p className="text-base font-extrabold text-blue-600 mt-0.5">
                {compressedResult ? formatFileSize(compressedResult.newSize) : 'Calculating...'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Size Saved</p>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                {reductionPercentage}% Reduced
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolution</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                {compressedResult ? `${compressedResult.width} × ${compressedResult.height}px` : '---'}
              </p>
            </div>
          </div>

          {/* Preview & Action Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-500 mb-2 block">Original Photo</span>
              <div className="max-h-72 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original"
                  className="max-h-64 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Compressed Image Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-blue-600 mb-2 block">Compressed Preview</span>
              <div className="max-h-72 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-2">
                {isProcessing ? (
                  <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                    Optimizing image pixels...
                  </div>
                ) : compressedResult ? (
                  <img
                    src={compressedResult.url}
                    alt="Compressed"
                    className="max-h-64 object-contain rounded-lg"
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
              Compress Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!compressedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
