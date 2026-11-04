import React, { useState, useEffect } from 'react';
import { Download, FlipHorizontal, FlipVertical, RotateCcw } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, rotateAndFlip, downloadBlob } from '../utils/imageProcessing';

export const ImageFlipperPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-flipper')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [flipH, setFlipH] = useState<boolean>(true); // Default to horizontal mirror
  const [flipV, setFlipV] = useState<boolean>(false);

  const [flippedResult, setFlippedResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setFlippedResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
    });
  }, [selectedFile]);

  // Perform flip
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    rotateAndFlip(loadedImg, 0, flipH, flipV, 'image/png', 0.95)
      .then((res) => {
        if (isMounted) {
          setFlippedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Flip error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, flipH, flipV]);

  const handleReset = () => {
    setFlipH(false);
    setFlipV(false);
  };

  const handleDownload = () => {
    if (!flippedResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(flippedResult.blob, `${baseName}_flipped.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to flip or mirror"
          subtitle="Mirror photos horizontally or vertically in one click with instant download."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-800">Select Mirror Direction:</span>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Flip</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`py-3 px-5 border font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  flipH ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlipHorizontal className="w-5 h-5" />
                <span>Flip Horizontal (Left ↔ Right)</span>
              </button>

              <button
                onClick={() => setFlipV(!flipV)}
                className={`py-3 px-5 border font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  flipV ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlipVertical className="w-5 h-5" />
                <span>Flip Vertical (Top ↕ Bottom)</span>
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Flipped Preview</span>

            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Flipping photo canvas...
                </div>
              ) : flippedResult ? (
                <img
                  src={flippedResult.url}
                  alt="Flipped"
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
              Flip Another Image
            </button>

            <button
              onClick={handleDownload}
              disabled={!flippedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Flipped Image</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
