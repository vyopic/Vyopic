/**
 * Advanced Cartoon Avatar Transformation Engine
 * Transforms real photos into distinct cartoon illustrations across 6 styles:
 * 1. Sobel Edge Detection (comic/cartoon ink outlines)
 * 2. Color Quantization & Cel-shading (flat animation color blocks)
 * 3. Style-specific artistic overlays (Sunglasses, Spectacles, Watercolor, Anime Glow)
 */

export interface CartoonFilterOptions {
  style: 'cute-cartoon' | 'hand-drawn' | 'cool-sunglasses' | 'glasses-avatar' | 'anime-illustration' | 'minimalist-portrait';
  edgeThickness?: number;
  colorSteps?: number;
}

export async function transformToCartoonAvatar(
  imageSource: HTMLImageElement | File | Blob | string,
  options: CartoonFilterOptions
): Promise<string> {
  let img: HTMLImageElement;

  if (typeof imageSource === 'string') {
    img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = (e) => reject(e);
      el.src = imageSource;
    });
  } else if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else {
    const url = URL.createObjectURL(imageSource);
    img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => {
        URL.revokeObjectURL(url);
        resolve(el);
      };
      el.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      el.src = url;
    });
  }

  // Target 512x512 resolution for avatar
  const targetDim = 512;
  const canvas = document.createElement('canvas');
  canvas.width = targetDim;
  canvas.height = targetDim;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Center-crop to square
  const minSide = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const sx = ((img.naturalWidth || img.width) - minSide) / 2;
  const sy = ((img.naturalHeight || img.height) - minSide) / 2;

  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetDim, targetDim);

  const imgData = ctx.getImageData(0, 0, targetDim, targetDim);
  const data = imgData.data;
  const W = targetDim;
  const H = targetDim;

  // 1. Grayscale luminance buffer
  const gray = new Float32Array(W * H);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // 2. Sobel Edge Detection for Cartoon Ink Outlines
  const edges = new Uint8Array(W * H);
  const edgeThreshold = options.style === 'hand-drawn' ? 38 : options.style === 'minimalist-portrait' ? 42 : 48;

  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const idx = y * W + x;
      // Sobel horizontal gradient
      const gx =
        -1 * gray[idx - W - 1] +
        1 * gray[idx - W + 1] +
        -2 * gray[idx - 1] +
        2 * gray[idx + 1] +
        -1 * gray[idx + W - 1] +
        1 * gray[idx + W + 1];

      // Sobel vertical gradient
      const gy =
        -1 * gray[idx - W - 1] +
        -2 * gray[idx - W] +
        -1 * gray[idx - W + 1] +
        1 * gray[idx + W - 1] +
        2 * gray[idx + W] +
        1 * gray[idx + W + 1];

      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[idx] = mag > edgeThreshold ? 1 : 0;
    }
  }

  // 3. Color Quantization & Cel-shading (Posterize colors into discrete cartoon tones)
  const step = options.style === 'minimalist-portrait' ? 52 : options.style === 'hand-drawn' ? 44 : 36;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Saturation boost for cartoon vibrance
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    if (delta > 0) {
      const satMultiplier = options.style === 'cute-cartoon' ? 1.45 : options.style === 'anime-illustration' ? 1.55 : 1.35;
      r = Math.min(255, Math.max(0, r + (r - (max + min) / 2) * (satMultiplier - 1)));
      g = Math.min(255, Math.max(0, g + (g - (max + min) / 2) * (satMultiplier - 1)));
      b = Math.min(255, Math.max(0, b + (b - (max + min) / 2) * (satMultiplier - 1)));
    }

    // Quantize into discrete cartoon color levels
    r = Math.min(255, Math.round(r / step) * step);
    g = Math.min(255, Math.round(g / step) * step);
    b = Math.min(255, Math.round(b / step) * step);

    // Apply dark cartoon edge lines
    const pixelIndex = i / 4;
    if (edges[pixelIndex] === 1) {
      if (options.style === 'hand-drawn') {
        // Dark sepia / graphite pencil line
        data[i] = 45;
        data[i + 1] = 35;
        data[i + 2] = 30;
      } else if (options.style === 'anime-illustration') {
        // Deep purple/indigo anime ink line
        data[i] = 30;
        data[i + 1] = 20;
        data[i + 2] = 50;
      } else {
        // Crisp dark cartoon ink line
        data[i] = 25;
        data[i + 1] = 25;
        data[i + 2] = 35;
      }
    } else {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  // Put quantized cartoon image back onto canvas
  ctx.putImageData(imgData, 0, 0);

  // 4. Style-Specific Artistic Visual Features
  ctx.save();

  if (options.style === 'hand-drawn') {
    // Watercolor / Parchment wash & sketched border
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(254, 243, 199, 0.35)'; // warm ivory watercolor tint
    ctx.fillRect(0, 0, W, H);

    // Artistic hand-drawn border vignette
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, W - 16, H - 16);
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, W - 28, H - 28);
  } else if (options.style === 'cute-cartoon') {
    // Pixar/Disney 3D lighting: soft pastel ambient glow
    const radial = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.75);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    radial.addColorStop(0.7, 'rgba(244, 114, 182, 0.15)');
    radial.addColorStop(1, 'rgba(168, 85, 247, 0.25)');

    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);

    // Cute rosy cheeks blush
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
    ctx.beginPath();
    ctx.ellipse(W * 0.32, H * 0.58, W * 0.09, H * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(W * 0.68, H * 0.58, W * 0.09, H * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute sparkle eye catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W * 0.37, H * 0.42, 4, 0, Math.PI * 2);
    ctx.arc(W * 0.63, H * 0.42, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (options.style === 'cool-sunglasses') {
    // Draw modern dark sunglasses over eye area with cyan/purple neon lens reflection
    ctx.globalCompositeOperation = 'source-over';
    const glassY = H * 0.39;
    const lensW = W * 0.24;
    const lensH = H * 0.14;

    // Sunglasses frame drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Left Lens
    ctx.fillStyle = '#0a0a0c';
    ctx.beginPath();
    ctx.roundRect(W * 0.22, glassY, lensW, lensH, [12, 12, 20, 20]);
    ctx.fill();

    // Right Lens
    ctx.beginPath();
    ctx.roundRect(W * 0.54, glassY, lensW, lensH, [12, 12, 20, 20]);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Black frame rim
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Frame Bridge
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(W * 0.46, glassY + lensH * 0.3);
    ctx.lineTo(W * 0.54, glassY + lensH * 0.3);
    ctx.stroke();

    // Neon Glare streaks on sunglasses
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.25, glassY + 8);
    ctx.lineTo(W * 0.38, glassY + lensH - 8);
    ctx.stroke();

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.57, glassY + 8);
    ctx.lineTo(W * 0.7, glassY + lensH - 8);
    ctx.stroke();

    // Vibrant street art pop color wash
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.fillRect(0, 0, W, H);
  } else if (options.style === 'glasses-avatar') {
    // Draw stylish modern acetate round eyeglasses with clear reflection
    ctx.globalCompositeOperation = 'source-over';
    const glassY = H * 0.41;
    const r = W * 0.12;

    // Left Frame Rim
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(W * 0.34, glassY, r, 0, Math.PI * 2);
    ctx.stroke();

    // Right Frame Rim
    ctx.beginPath();
    ctx.arc(W * 0.66, glassY, r, 0, Math.PI * 2);
    ctx.stroke();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(W * 0.34 + r, glassY - 4);
    ctx.quadraticCurveTo(W * 0.5, glassY - 14, W * 0.66 - r, glassY - 4);
    ctx.stroke();

    // Specular Glass Lens Reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(W * 0.34, glassY, r - 6, -Math.PI * 0.7, -Math.PI * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W * 0.66, glassY, r - 6, -Math.PI * 0.7, -Math.PI * 0.3);
    ctx.stroke();
  } else if (options.style === 'anime-illustration') {
    // Luminous Japanese Anime atmospheric color gradient
    const animeGrad = ctx.createLinearGradient(0, 0, W, H);
    animeGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    animeGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)');
    animeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = animeGrad;
    ctx.fillRect(0, 0, W, H);

    // Anime luminous hair highlight arc
    ctx.globalCompositeOperation = 'overlay';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.24, W * 0.32, H * 0.12, 0, Math.PI, 0);
    ctx.stroke();
  } else if (options.style === 'minimalist-portrait') {
    // Flat Scandinavian pastel tint
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.fillRect(0, 0, W, H);

    // Clean geometric accent ring
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W * 0.46, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  return canvas.toDataURL('image/png', 0.95);
}
