import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/imageProcessing';

interface DropZoneProps {
  onImageSelected: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
  selectedFile?: File | null;
  onClear?: () => void;
  multiple?: boolean;
  onMultipleImagesSelected?: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onImageSelected,
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/bmp',
  maxSizeMb = 25,
  selectedFile,
  onClear,
  multiple = false,
  onMultipleImagesSelected,
  title = 'Click or drag & drop photo here',
  subtitle = 'Supports JPG, PNG, WebP up to 25MB. 100% Client-Side & Private.'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File ${file.name} exceeds maximum size limit of ${maxSizeMb}MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      if (multiple && onMultipleImagesSelected) {
        onMultipleImagesSelected(validFiles);
      } else {
        onImageSelected(validFiles[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="truncate">
              <p className="font-semibold text-slate-800 text-sm truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {formatFileSize(selectedFile.size)} • {selectedFile.type.replace('image/', '').toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Change Photo
            </button>
            {onClear && (
              <button
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove photo"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 bg-white'
          }`}
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{subtitle}</p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors">
            Select Photo from Device
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">No Server Upload</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">100% Free</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Instant Export</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
