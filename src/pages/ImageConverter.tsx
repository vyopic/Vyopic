import React, { useState, useEffect } from 'react';
import { Download, Repeat, Sliders } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { convertImageFormat, downloadBlob, formatFileSize } from '../utils/imageProcessing';

export const ImageConverterPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-converter')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(90);
  const [convertedResult, setConvertedResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setConvertedResult(null);
      return;
    }

    let isMounted = true;
    setIsProcessing(true);

    convertImageFormat(selectedFile, targetFormat, quality / 100)
      .then((res) => {
        if (isMounted) {
          setConvertedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Format conversion error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFile, targetFormat, quality]);

  const handleDownload = () => {
    if (!convertedResult) return;
    downloadBlob(convertedResult.blob, convertedResult.name);
  };

  const currentExt = selectedFile
    ? selectedFile.type.replace('image/', '').toUpperCase()
    : 'RAW';

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to convert format"
          subtitle="Convert between JPG, PNG, and WebP instantly with zero server uploads."
        />
      ) : (
        <div className="space-y-8">
          {/* Format Selection Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg uppercase">
                  Current: {currentExt}
                </span>
                <Repeat className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Target Format</span>
              </div>

              {/* Target Format Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setTargetFormat('image/jpeg')}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border uppercase transition-colors ${
                    targetFormat === 'image/jpeg' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  JPG / JPEG
                </button>
                <button
                  onClick={() => setTargetFormat('image/png')}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border uppercase transition-colors ${
                    targetFormat === 'image/png' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setTargetFormat('image/webp')}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border uppercase transition-colors ${
                    targetFormat === 'image/webp' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  WEBP
                </button>
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Conversion Quality: {quality}%
                </label>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Result Info Box */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl text-center">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Original File</p>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Converted File</p>
              <p className="text-sm font-extrabold text-blue-600 mt-0.5">
                {convertedResult ? `${convertedResult.name} (${formatFileSize(convertedResult.blob.size)})` : '...'}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Conversion Status</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                Ready to Export
              </p>
            </div>
          </div>

          {/* Image Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Converted Preview</span>
            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Converting format...
                </div>
              ) : convertedResult ? (
                <img
                  src={convertedResult.url}
                  alt="Converted"
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
              Convert Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!convertedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Converted Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
