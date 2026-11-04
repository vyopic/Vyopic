import React, { useState, useEffect } from 'react';
import { Download, Palette, Sliders } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, changeBgColor, downloadBlob } from '../utils/imageProcessing';

export const BackgroundColorChangerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'background-color-changer')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const [targetColor, setTargetColor] = useState<string>('#FFFFFF');
  const [customColor, setCustomColor] = useState<string>('#2563EB');
  const [tolerance, setTolerance] = useState<number>(30);

  const [changedResult, setChangedResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setChangedResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
    });
  }, [selectedFile]);

  // Execute Background Color Change
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    changeBgColor(loadedImg, targetColor, tolerance, 'image/png')
      .then((res) => {
        if (isMounted) {
          setChangedResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Background color change error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, targetColor, tolerance]);

  const handleDownload = () => {
    if (!changedResult || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(changedResult.blob, `${baseName}_bg_changed.png`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload image to change background color"
          subtitle="Fill or change background color to White, Black, Blue, Red, or Custom Palette in your browser."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                <Palette className="w-4 h-4 text-blue-600" />
                Select New Background Color:
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setTargetColor('#FFFFFF')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    targetColor === '#FFFFFF' ? 'ring-2 ring-blue-600 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300" />
                  <span>White Background</span>
                </button>

                <button
                  onClick={() => setTargetColor('#000000')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    targetColor === '#000000' ? 'ring-2 ring-blue-600 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black" />
                  <span>Black Background</span>
                </button>

                <button
                  onClick={() => setTargetColor('#00A2E8')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    targetColor === '#00A2E8' ? 'ring-2 ring-blue-600 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#00A2E8]" />
                  <span>Blue Background</span>
                </button>

                <button
                  onClick={() => setTargetColor('#ED1C24')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    targetColor === '#ED1C24' ? 'ring-2 ring-blue-600 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#ED1C24]" />
                  <span>Red Background</span>
                </button>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Custom Color:</span>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setTargetColor(e.target.value);
                    }}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>

            {/* Tolerance Sensitivity Slider */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Color Replacement Sensitivity / Tolerance:
                </span>
                <span className="text-blue-600 font-mono">{tolerance}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Increase tolerance if edges are missed, or decrease if subject details are affected.
              </p>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <span className="text-xs font-bold text-slate-500 mb-3 block">Background Changed Preview</span>

            <div className="max-h-80 overflow-hidden rounded-xl bg-slate-200/50 flex items-center justify-center p-3">
              {isProcessing ? (
                <div className="py-12 text-slate-400 text-xs font-semibold animate-pulse">
                  Applying new background color...
                </div>
              ) : changedResult ? (
                <img
                  src={changedResult.url}
                  alt="Background Changed"
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
              Change Another Photo
            </button>

            <button
              onClick={handleDownload}
              disabled={!changedResult || isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Modified Photo</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
