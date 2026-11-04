/**
 * Utility functions for client-side HTML5 Canvas Image Processing
 */

export interface FilterOptions {
  brightness: number;  // 0 to 200 (100 = default)
  contrast: number;    // 0 to 200 (100 = default)
  saturate: number;    // 0 to 200 (100 = default)
  grayscale: number;   // 0 to 100
  sepia: number;       // 0 to 100
  blur: number;        // 0 to 20 px
  hueRotate: number;   // 0 to 360 deg
  preset?: string;
}

export interface PassportOptions {
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  bgColor: string;
  zoom: number;       // 0.5 to 2.5
  offsetX: number;    // px shift
  offsetY: number;    // px shift
  rotateDeg: number;
  gridCols?: number;
  gridRows?: number;
  paperSize?: 'A4' | 'Single';
}

export const loadImage = (source: File | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.src = url;
    }
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string = 'image/jpeg',
  quality: number = 0.85
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas conversion to blob failed'));
      },
      type,
      quality
    );
  });
};

/**
 * 1. COMPRESS IMAGE
 */
export const compressImage = async (
  file: File,
  qualityPercentage: number,
  outputType: string = 'image/jpeg'
): Promise<{ blob: Blob; url: string; width: number; height: number; newSize: number }> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill white background for JPEG
  if (outputType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const normalizedQuality = Math.max(0.05, Math.min(1, qualityPercentage / 100));
  const blob = await canvasToBlob(canvas, outputType, normalizedQuality);
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    width: img.width,
    height: img.height,
    newSize: blob.size
  };
};

/**
 * 2. RESIZE IMAGE
 */
export const resizeImage = async (
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  outputType: string = 'image/jpeg',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (outputType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas, outputType, quality);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

/**
 * 3. CONVERT IMAGE
 */
export const convertImageFormat = async (
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.9
): Promise<{ blob: Blob; url: string; name: string }> => {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const blob = await canvasToBlob(canvas, targetFormat, quality);
  const url = URL.createObjectURL(blob);

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newName = `${baseName}.${extMap[targetFormat] || 'jpg'}`;

  return { blob, url, name: newName };
};

/**
 * 4. CROP IMAGE
 */
export const cropImage = async (
  image: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  outputType: string = 'image/png',
  quality: number = 0.95
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (outputType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await canvasToBlob(canvas, outputType, quality);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

/**
 * 5. PASSPORT PHOTO MAKER
 */
export const createPassportPhoto = async (
  image: HTMLImageElement,
  options: PassportOptions
): Promise<{ singleBlob: Blob; singleUrl: string; gridBlob: Blob; gridUrl: string }> => {
  // Single Passport Photo Canvas
  const singleCanvas = document.createElement('canvas');
  singleCanvas.width = options.widthPx;
  singleCanvas.height = options.heightPx;

  const ctx = singleCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill background
  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, singleCanvas.width, singleCanvas.height);

  // Draw subject with zoom, offset, and rotation
  ctx.save();
  ctx.translate(singleCanvas.width / 2 + options.offsetX, singleCanvas.height / 2 + options.offsetY);
  ctx.rotate((options.rotateDeg * Math.PI) / 180);

  const scaledW = image.width * options.zoom;
  const scaledH = image.height * options.zoom;

  // Fit image to aspect ratio first
  const aspectFitScale = Math.max(singleCanvas.width / image.width, singleCanvas.height / image.height) * options.zoom;
  const drawW = image.width * aspectFitScale;
  const drawH = image.height * aspectFitScale;

  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  const singleBlob = await canvasToBlob(singleCanvas, 'image/jpeg', 0.95);
  const singleUrl = URL.createObjectURL(singleBlob);

  // Printable A4 Grid Canvas (Standard 300 DPI A4 is 2480 x 3508 px)
  const a4Canvas = document.createElement('canvas');
  a4Canvas.width = 2480;
  a4Canvas.height = 3508;

  const a4Ctx = a4Canvas.getContext('2d');
  if (!a4Ctx) throw new Error('Could not get A4 canvas context');

  // White paper background
  a4Ctx.fillStyle = '#FFFFFF';
  a4Ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);

  // Calculate layout specs
  // Standard passport photo in A4 (300 DPI)
  // 35x45mm = ~413 x 531 px
  // 2x2 inch = ~600 x 600 px
  const photoDpiScale = 300 / 72; // scale factor
  const targetPhotoW = Math.round(options.widthPx * photoDpiScale);
  const targetPhotoH = Math.round(options.heightPx * photoDpiScale);

  const marginX = 120;
  const marginY = 160;
  const gap = 40;

  const cols = Math.floor((a4Canvas.width - marginX * 2 + gap) / (targetPhotoW + gap));
  const rows = Math.floor((a4Canvas.height - marginY * 2 + gap) / (targetPhotoH + gap));

  const actualCols = Math.min(cols, 6);
  const actualRows = Math.min(rows, 8);

  for (let r = 0; r < actualRows; r++) {
    for (let c = 0; c < actualCols; c++) {
      const x = marginX + c * (targetPhotoW + gap);
      const y = marginY + r * (targetPhotoH + gap);

      // Draw photo
      a4Ctx.drawImage(singleCanvas, x, y, targetPhotoW, targetPhotoH);

      // Draw thin cutting guide border
      a4Ctx.strokeStyle = '#CBD5E1';
      a4Ctx.lineWidth = 2;
      a4Ctx.strokeRect(x, y, targetPhotoW, targetPhotoH);
    }
  }

  // Header Title on A4 Sheet
  a4Ctx.fillStyle = '#64748B';
  a4Ctx.font = '24px sans-serif';
  a4Ctx.fillText('Vyopic Free Passport Photo Printable Sheet (A4 Standard 300 DPI)', marginX, 100);

  const gridBlob = await canvasToBlob(a4Canvas, 'image/jpeg', 0.92);
  const gridUrl = URL.createObjectURL(gridBlob);

  return { singleBlob, singleUrl, gridBlob, gridUrl };
};

/**
 * 6. PHOTO COLLAGE MAKER
 */
export const createCollage = async (
  images: HTMLImageElement[],
  layoutType: 'grid-2' | 'grid-3' | 'grid-4' | 'grid-6',
  spacing: number = 10,
  borderRadius: number = 8,
  bgColor: string = '#FFFFFF',
  width: number = 1200,
  height: number = 1200
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  interface Box { x: number; y: number; w: number; h: number }
  const boxes: Box[] = [];

  const S = spacing;
  const W = width;
  const H = height;

  if (layoutType === 'grid-2') {
    // 2 side by side
    const boxW = (W - S * 3) / 2;
    boxes.push({ x: S, y: S, w: boxW, h: H - S * 2 });
    boxes.push({ x: S * 2 + boxW, y: S, w: boxW, h: H - S * 2 });
  } else if (layoutType === 'grid-3') {
    // 1 large left, 2 right stacked
    const leftW = (W - S * 3) * 0.55;
    const rightW = (W - S * 3) * 0.45;
    const rightH = (H - S * 3) / 2;

    boxes.push({ x: S, y: S, w: leftW, h: H - S * 2 });
    boxes.push({ x: S * 2 + leftW, y: S, w: rightW, h: rightH });
    boxes.push({ x: S * 2 + leftW, y: S * 2 + rightH, w: rightW, h: rightH });
  } else if (layoutType === 'grid-4') {
    // 2x2 grid
    const boxW = (W - S * 3) / 2;
    const boxH = (H - S * 3) / 2;
    boxes.push({ x: S, y: S, w: boxW, h: boxH });
    boxes.push({ x: S * 2 + boxW, y: S, w: boxW, h: boxH });
    boxes.push({ x: S, y: S * 2 + boxH, w: boxW, h: boxH });
    boxes.push({ x: S * 2 + boxW, y: S * 2 + boxH, w: boxW, h: boxH });
  } else if (layoutType === 'grid-6') {
    // 3x2 grid
    const boxW = (W - S * 4) / 3;
    const boxH = (H - S * 3) / 2;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        boxes.push({
          x: S + c * (boxW + S),
          y: S + r * (boxH + S),
          w: boxW,
          h: boxH
        });
      }
    }
  }

  boxes.forEach((box, i) => {
    const img = images[i % images.length];
    if (!img) return;

    ctx.save();

    // Rounded rectangle clip
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(box.x, box.y, box.w, box.h, borderRadius);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.w, box.h);
      ctx.clip();
    }

    // Cover scale calculation
    const scale = Math.max(box.w / img.width, box.h / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = box.x + (box.w - drawW) / 2;
    const drawY = box.y + (box.h - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  });

  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

/**
 * 7. PHOTO FILTERS & ADJUSTMENTS
 */
export const applyFilters = async (
  image: HTMLImageElement,
  filters: FilterOptions,
  outputType: string = 'image/jpeg',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Set CSS Filter String
  const filterString = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturate}%)
    grayscale(${filters.grayscale}%)
    sepia(${filters.sepia}%)
    blur(${filters.blur}px)
    hue-rotate(${filters.hueRotate}deg)
  `.trim();

  ctx.filter = filterString;

  if (outputType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0);

  const blob = await canvasToBlob(canvas, outputType, quality);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

/**
 * 8. ROTATE & FLIP IMAGE
 */
export const rotateAndFlip = async (
  image: HTMLImageElement,
  angleDegrees: number,
  flipH: boolean,
  flipV: boolean,
  outputType: string = 'image/png',
  quality: number = 0.95
): Promise<{ blob: Blob; url: string }> => {
  const rad = (angleDegrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  const newWidth = Math.round(image.width * cos + image.height * sin);
  const newHeight = Math.round(image.width * sin + image.height * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  if (outputType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.save();
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();

  const blob = await canvasToBlob(canvas, outputType, quality);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};

/**
 * 9. BACKGROUND COLOR CHANGER
 */
export const changeBgColor = async (
  image: HTMLImageElement,
  targetBgColor: string,
  tolerance: number = 30, // 0 to 100
  outputType: string = 'image/png'
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Hex to RGB
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const [targetR, targetG, targetB] = hexToRgb(targetBgColor);

  // Sample corner pixel color as source background
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  const tolSq = Math.pow((tolerance / 100) * 255, 2) * 3;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // If already transparent or matches sampled background color within tolerance
    const distSq = Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2);

    if (a < 50 || distSq <= tolSq) {
      data[i] = targetR;
      data[i + 1] = targetG;
      data[i + 2] = targetB;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const blob = await canvasToBlob(canvas, outputType, 0.95);
  const url = URL.createObjectURL(blob);

  return { blob, url };
};
