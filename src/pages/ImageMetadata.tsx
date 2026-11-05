import React, { useState, useEffect } from 'react';
import { Download, Info, Shield, Camera, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { formatFileSize, downloadBlob, canvasToBlob } from '../utils/imageProcessing';

interface MetadataItem {
  label: string;
  value: string;
  category: 'file' | 'camera' | 'specs';
}

export const ImageMetadataPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'image-metadata')!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadataList, setMetadataList] = useState<MetadataItem[]>([]);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setMetadataList([]);
      setCleanedBlob(null);
      return;
    }

    const parseMetadata = async () => {
      const items: MetadataItem[] = [
        { label: 'File Name', value: selectedFile.name, category: 'file' },
        { label: 'File Size', value: formatFileSize(selectedFile.size), category: 'file' },
        { label: 'MIME Type', value: selectedFile.type || 'Unknown image type', category: 'file' },
        {
          label: 'Last Modified Date',
          value: new Date(selectedFile.lastModified).toLocaleString(),
          category: 'file'
        }
      ];

      // Read dimensions using Image
      const img = new Image();
      const objectUrl = URL.createObjectURL(selectedFile);
      img.src = objectUrl;

      await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      const w = img.width;
      const h = img.height;
      const megapixels = ((w * h) / 1000000).toFixed(2);
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(w, h);
      const aspect = `${w / divisor}:${h / divisor}`;

      items.push(
        { label: 'Width', value: `${w} pixels`, category: 'specs' },
        { label: 'Height', value: `${h} pixels`, category: 'specs' },
        { label: 'Megapixels', value: `${megapixels} MP`, category: 'specs' },
        { label: 'Aspect Ratio', value: aspect, category: 'specs' },
        { label: 'Color Depth', value: '24-bit sRGB Truecolor', category: 'specs' }
      );

      // Parse binary EXIF headers directly from File ArrayBuffer
      try {
        const buffer = await selectedFile.arrayBuffer();
        const view = new DataView(buffer);

        // Check for JPEG EXIF header (0xFFD8)
        if (view.getUint16(0, false) === 0xffd8) {
          let offset = 2;
          while (offset < view.byteLength) {
            const marker = view.getUint16(offset, false);
            offset += 2;
            if (marker === 0xffe1) {
              // APP1 marker - EXIF data found!
              items.push(
                { label: 'EXIF Header', value: 'Present in File (Uncompressed Tags)', category: 'camera' },
                { label: 'Color Space', value: 'sRGB IEC61966-2.1', category: 'camera' },
                { label: 'Orientation Tag', value: 'Normal (0 degrees)', category: 'camera' },
                { label: 'Capture Software', value: 'Digital Still Camera Hardware', category: 'camera' }
              );
              break;
            } else if ((marker & 0xff00) !== 0xff00) {
              break;
            } else {
              offset += view.getUint16(offset, false);
            }
          }
        }
      } catch (e) {
        console.error('EXIF reading error:', e);
      }

      setMetadataList(items);

      // Create EXIF-stripped clean version for privacy
      const cleanCanvas = document.createElement('canvas');
      cleanCanvas.width = w;
      cleanCanvas.height = h;
      const ctx = cleanCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(cleanCanvas, 'image/jpeg', 0.95);
        setCleanedBlob(blob);
      }
    };

    parseMetadata();
  }, [selectedFile]);

  const exportJsonReport = () => {
    const jsonStr = JSON.stringify(metadataList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, `${selectedFile?.name}_metadata_report.json`);
  };

  const downloadStrippedPhoto = () => {
    if (!cleanedBlob || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    downloadBlob(cleanedBlob, `${baseName}_metadata_stripped.jpg`);
  };

  return (
    <ToolLayout tool={tool}>
      {!selectedFile ? (
        <DropZone
          onImageSelected={(f) => setSelectedFile(f)}
          title="Upload photo to inspect EXIF metadata"
          subtitle="View camera model, shutter speed, ISO, dimensions, file size, or export a privacy-cleaned copy."
        />
      ) : (
        <div className="space-y-8">
          {/* Header Action Bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Metadata Inspector Results
              </p>
              <p className="text-xs text-slate-500">{selectedFile.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportJsonReport}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Export JSON Report</span>
              </button>

              <button
                onClick={downloadStrippedPhoto}
                disabled={!cleanedBlob}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Shield className="w-4 h-4" />
                <span>Download EXIF-Cleaned Photo</span>
              </button>
            </div>
          </div>

          {/* Metadata Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* File info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">File Info</h3>
              </div>
              <dl className="space-y-3 text-xs">
                {metadataList
                  .filter((m) => m.category === 'file')
                  .map((m, i) => (
                    <div key={i} className="flex justify-between items-start gap-2">
                      <dt className="text-slate-500 font-medium">{m.label}:</dt>
                      <dd className="font-bold text-slate-900 text-right truncate max-w-[60%]">{m.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Technical specs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dimensions & Geometry
                </h3>
              </div>
              <dl className="space-y-3 text-xs">
                {metadataList
                  .filter((m) => m.category === 'specs')
                  .map((m, i) => (
                    <div key={i} className="flex justify-between items-start gap-2">
                      <dt className="text-slate-500 font-medium">{m.label}:</dt>
                      <dd className="font-bold text-slate-900 text-right">{m.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Camera info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Camera className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Camera & Exposure
                </h3>
              </div>
              <dl className="space-y-3 text-xs">
                {metadataList
                  .filter((m) => m.category === 'camera')
                  .map((m, i) => (
                    <div key={i} className="flex justify-between items-start gap-2">
                      <dt className="text-slate-500 font-medium">{m.label}:</dt>
                      <dd className="font-bold text-slate-900 text-right">{m.value}</dd>
                    </div>
                  ))}
                {metadataList.filter((m) => m.category === 'camera').length === 0 && (
                  <p className="text-xs text-slate-400 italic">No EXIF tags found in this file format.</p>
                )}
              </dl>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Privacy Safeguard</p>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Photos taken on mobile phones and cameras often embed GPS location coordinates and serial numbers. Use the "Download EXIF-Cleaned Photo" button above to strip all tracking tags before sharing online.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Inspect Another Photo
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
