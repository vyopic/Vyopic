import React, { useState } from 'react';
import { Download, FileText, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { loadImage, formatFileSize } from '../utils/imageProcessing';

export const ImageToPdfPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-to-pdf')!;

  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(10); // mm
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    const copy = [...files];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setFiles(copy);
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize === 'fit' ? 'a4' : pageSize
      });

      for (let i = 0; i < files.length; i++) {
        if (i > 0) {
          pdf.addPage(pageSize === 'fit' ? 'a4' : pageSize, orientation);
        }

        const img = await loadImage(files[i]);
        const pdfPageW = pdf.internal.pageSize.getWidth();
        const pdfPageH = pdf.internal.pageSize.getHeight();

        const availW = pdfPageW - margin * 2;
        const availH = pdfPageH - margin * 2;

        const imgRatio = img.width / img.height;
        const availRatio = availW / availH;

        let drawW = availW;
        let drawH = availH;

        if (imgRatio > availRatio) {
          drawH = availW / imgRatio;
        } else {
          drawW = availH * imgRatio;
        }

        const x = margin + (availW - drawW) / 2;
        const y = margin + (availH - drawH) / 2;

        // Convert image to data url
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.92);
          pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH);
        }
      }

      pdf.save('vyopic_images_document.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <DropZone
          multiple
          onMultipleImagesSelected={handleAddFiles}
          onImageSelected={(f) => handleAddFiles([f])}
          title="Upload images to convert to PDF"
          subtitle="Supports multiple JPG, PNG, and WebP photos. Organize page order and paper layouts."
        />
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Document Layout & Page Options
              </span>

              {/* Add more button */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add More Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleAddFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Page Paper Format</label>
                <div className="flex gap-2">
                  {[
                    { id: 'a4', label: 'A4' },
                    { id: 'letter', label: 'US Letter' },
                    { id: 'fit', label: 'Fit Ratio' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPageSize(p.id as any)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                        pageSize === p.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Orientation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                      orientation === 'portrait'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                      orientation === 'landscape'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                  <span>Page Margin:</span>
                  <span className="text-blue-600 font-mono">{margin} mm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="5"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Image List / Order Manager */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700">
                Uploaded Images ({files.length} Pages in Document)
              </span>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs relative flex flex-col justify-between"
                >
                  <div className="relative aspect-3/2 bg-slate-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Page {idx + 1}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 truncate mb-1">{file.name}</p>
                  <p className="text-[10px] text-slate-400 mb-3">{formatFileSize(file.size)}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                        title="Move Page Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                        title="Move Page Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Remove from PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setFiles([])}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Start Over
            </button>

            <button
              onClick={generatePdf}
              disabled={isGenerating || files.length === 0}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF Document...' : 'Download PDF Document'}</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
