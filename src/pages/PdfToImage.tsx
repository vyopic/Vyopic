import React, { useState } from 'react';
import { Download, FileImage, RefreshCw, ZoomIn } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { downloadBlob, formatFileSize } from '../utils/imageProcessing';

// Configure pdfjs worker using unpkg / cdnjs fallback
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

export const PdfToImagePage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'pdf-to-image')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [scale, setScale] = useState<number>(2.0); // 2x gives crisp 150-200 DPI
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<string>('');

  const handlePdfUpload = async (file: File) => {
    setSelectedFile(file);
    setPages([]);
    setIsRendering(true);
    setRenderProgress('Loading PDF document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;

      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setRenderProgress(`Rendering Page ${i} of ${totalPages}...`);
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Render page to canvas
          await (page.render({
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas
          } as any)).promise;

          const dataUrl = canvas.toDataURL(format, 0.92);
          rendered.push({
            pageNum: i,
            dataUrl,
            width: viewport.width,
            height: viewport.height
          });
        }
      }

      setPages(rendered);
    } catch (err) {
      console.error('PDF rendering error:', err);
      alert('Could not render PDF. Please ensure the file is not encrypted or corrupted.');
    } finally {
      setIsRendering(false);
      setRenderProgress('');
    }
  };

  const downloadSinglePage = (page: RenderedPage) => {
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const baseName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'document';
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `${baseName}_page_${page.pageNum}.${ext}`;
    link.click();
  };

  const downloadAllPages = () => {
    pages.forEach((p, idx) => {
      setTimeout(() => downloadSinglePage(p), idx * 200);
    });
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-10 text-center bg-white cursor-pointer transition-colors relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Click or Drag & Drop PDF File Here</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Converts each PDF page into high-resolution JPG or PNG pictures directly inside your browser.
          </p>
          <div className="inline-flex px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs">
            Select PDF from Device
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Format selection */}
                <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                  <button
                    onClick={() => setFormat('image/jpeg')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      format === 'image/jpeg' ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => setFormat('image/png')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      format === 'image/png' ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    PNG
                  </button>
                </div>

                {/* Scale Resolution */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                  <span className="font-semibold text-slate-500">DPI Scale:</span>
                  <select
                    value={scale}
                    onChange={(e) => {
                      setScale(Number(e.target.value));
                      if (selectedFile) handlePdfUpload(selectedFile);
                    }}
                    className="font-bold text-slate-800 bg-transparent focus:outline-none"
                  >
                    <option value={1.0}>1x Standard (72 DPI)</option>
                    <option value={2.0}>2x High (150 DPI)</option>
                    <option value={3.0}>3x Ultra (300 DPI)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Loading status */}
          {isRendering && (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">{renderProgress}</p>
              <p className="text-xs text-slate-500">Processing locally in browser memory...</p>
            </div>
          )}

          {/* Rendered Pages Grid */}
          {!isRendering && pages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-800">
                  Rendered Pages ({pages.length} Pages Extracted)
                </span>
                <button
                  onClick={downloadAllPages}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Pages</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <div
                    key={p.pageNum}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between group hover:border-blue-500 transition-colors shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">Page {p.pageNum}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {Math.round(p.width)} × {Math.round(p.height)} px
                        </span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 p-2 flex items-center justify-center max-h-72">
                        <img
                          src={p.dataUrl}
                          alt={`Page ${p.pageNum}`}
                          className="max-h-64 object-contain shadow-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => downloadSinglePage(p)}
                      className="w-full py-2 bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Page {p.pageNum}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedFile(null);
                setPages([]);
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Choose Another PDF
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
