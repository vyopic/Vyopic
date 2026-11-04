import React, { useState, useEffect } from 'react';
import { Download, Printer, UserCheck, Palette, ZoomIn, Move, Layout } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, createPassportPhoto, downloadBlob } from '../utils/imageProcessing';

export const PassportPhotoMakerPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'passport-photo-maker')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Preset Dimensions
  const [selectedPreset, setSelectedPreset] = useState<string>('35x45');
  const [widthPx, setWidthPx] = useState<number>(413); // 35mm at 300DPI = 413px
  const [heightPx, setHeightPx] = useState<number>(531); // 45mm at 300DPI = 531px

  // Background Color
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [customBgColor, setCustomBgColor] = useState<string>('#00A2E8');

  // Positioning
  const [zoom, setZoom] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [rotateDeg, setRotateDeg] = useState<number>(0);

  // Results
  const [passportResult, setPassportResult] = useState<{
    singleBlob: Blob;
    singleUrl: string;
    gridBlob: Blob;
    gridUrl: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLoadedImg(null);
      setPassportResult(null);
      return;
    }

    loadImage(selectedFile).then((img) => {
      setLoadedImg(img);
    });
  }, [selectedFile]);

  // Handle Preset Selection
  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === '35x45') {
      // 35mm x 45mm (Standard EU, UK, India, Australia)
      setWidthPx(413);
      setHeightPx(531);
    } else if (presetKey === '2x2') {
      // 2x2 inch (51mm x 51mm US, US Visa)
      setWidthPx(600);
      setHeightPx(600);
    } else if (presetKey === '33x48') {
      // 33mm x 48mm (China Visa)
      setWidthPx(390);
      setHeightPx(567);
    } else if (presetKey === '30x40') {
      // 30mm x 40mm (Japan ID)
      setWidthPx(354);
      setHeightPx(472);
    }
  };

  // Generate Passport Photos
  useEffect(() => {
    if (!loadedImg) return;

    let isMounted = true;
    setIsProcessing(true);

    createPassportPhoto(loadedImg, {
      widthMm: 35,
      heightMm: 45,
      widthPx,
      heightPx,
      bgColor,
      zoom,
      offsetX,
      offsetY,
      rotateDeg
    })
      .then((res) => {
        if (isMounted) {
          setPassportResult(res);
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error('Passport photo creation error:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadedImg, widthPx, heightPx, bgColor, zoom, offsetX, offsetY, rotateDeg]);

  const handleDownloadSingle = () => {
    if (!passportResult) return;
    downloadBlob(passportResult.singleBlob, 'passport_photo_single.jpg');
  };

  const handleDownloadSheet = () => {
    if (!passportResult) return;
    downloadBlob(passportResult.gridBlob, 'passport_photos_a4_printable_sheet.jpg');
  };

  const handlePrintSheet = () => {
    if (!passportResult) return;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Passport Photos Sheet</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
              img { max-width: 100%; height: auto; }
              @page { size: A4 portrait; margin: 0; }
            </style>
          </head>
          <body>
            <img src="${passportResult.gridUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(file) => setSelectedFile(file)}
          title="Upload headshot portrait photo"
          subtitle="Select size dimensions, background color (white, blue, red), adjust head position, and print A4 sheet."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Standard Passport & ID Dimensions:
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: '35x45', label: '35 × 45 mm (UK, EU, India, AU)' },
                  { key: '2x2', label: '2 × 2 inches / 51×51 mm (US Passport & Visa)' },
                  { key: '33x48', label: '33 × 48 mm (China Visa)' },
                  { key: '30x40', label: '30 × 40 mm (Japan ID)' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      selectedPreset === p.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Picker */}
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <Palette className="w-4 h-4 text-blue-600" />
                Background Color Selection:
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBgColor('#FFFFFF')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    bgColor === '#FFFFFF' ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300" />
                  <span>White Background</span>
                </button>

                <button
                  onClick={() => setBgColor('#00A2E8')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    bgColor === '#00A2E8' ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#00A2E8]" />
                  <span>Blue Background</span>
                </button>

                <button
                  onClick={() => setBgColor('#ED1C24')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    bgColor === '#ED1C24' ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#ED1C24]" />
                  <span>Red Background</span>
                </button>

                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Custom:</span>
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      setBgColor(e.target.value);
                    }}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>

            {/* Scale, Position, Zoom Adjustments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Zoom / Head Scale:</span>
                  <span className="text-blue-600 font-mono">{Math.round(zoom * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Horizontal Shift (X):</span>
                  <span className="text-blue-600 font-mono">{offsetX}px</span>
                </label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                  <span>Vertical Shift (Y):</span>
                  <span className="text-blue-600 font-mono">{offsetY}px</span>
                </label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Previews: Single Passport Photo & A4 Sheet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Single Photo Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center justify-between">
              <span className="text-xs font-bold text-slate-600 mb-2">Single Passport Photo</span>

              <div className="w-48 h-60 bg-white border border-slate-300 rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-sm">
                {isProcessing ? (
                  <span className="text-xs text-slate-400">Rendering...</span>
                ) : passportResult ? (
                  <img src={passportResult.singleUrl} alt="Single Passport" className="max-h-full object-contain" />
                ) : null}
              </div>

              <button
                onClick={handleDownloadSingle}
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Single Photo</span>
              </button>
            </div>

            {/* A4 Printable Sheet Preview */}
            <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center justify-between">
              <span className="text-xs font-bold text-blue-600 mb-2">
                A4 Printable Grid Layout Sheet (300 DPI High Resolution)
              </span>

              <div className="max-h-72 w-full overflow-hidden rounded-xl bg-white border border-slate-300 p-2 flex items-center justify-center shadow-xs">
                {isProcessing ? (
                  <span className="text-xs text-slate-400">Building A4 print sheet...</span>
                ) : passportResult ? (
                  <img src={passportResult.gridUrl} alt="A4 Sheet" className="max-h-64 object-contain shadow-2xs" />
                ) : null}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full justify-end">
                <button
                  onClick={handlePrintSheet}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print A4 Sheet</span>
                </button>

                <button
                  onClick={handleDownloadSheet}
                  className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full A4 Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
