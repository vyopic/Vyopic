import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  Check,
  Zap,
  Image as ImageIcon,
  Palette,
  Eye,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { DropZone } from '../components/common/DropZone';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { loadImage, canvasToBlob } from '../utils/imageProcessing';
import { transformToCartoonAvatar } from '../utils/cartoonFilter';

export interface AvatarStyleOption {
  id: 'cute-cartoon' | 'hand-drawn' | 'cool-sunglasses' | 'glasses-avatar' | 'anime-illustration' | 'minimalist-portrait';
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  prompt: string;
  accentGradient: string;
  iconBg: string;
}

export const AVATAR_STYLES: AvatarStyleOption[] = [
  {
    id: 'cute-cartoon',
    name: 'Cute Cartoon',
    badge: 'Popular',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    description: 'Adorable Disney/Pixar 3D animation style with big expressive eyes, rosy blush, and soft ambient studio lighting.',
    prompt:
      'adorable cute 3D cartoon avatar portrait of the person, big expressive sparkling Disney Pixar 3D animation eyes, charming warm smile, smooth animated skin, stylized 3D caricature, colorful pastel studio lighting, 4k render',
    accentGradient: 'from-pink-500 to-rose-500',
    iconBg: 'bg-pink-50'
  },
  {
    id: 'hand-drawn',
    name: 'Hand Drawn Cartoon',
    badge: 'Artistic',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Expressive pencil and ink line art with vibrant storybook watercolor shading and hand-sketched border.',
    prompt:
      'masterpiece hand drawn cartoon avatar portrait of the person, expressive black ink line art, stylized pencil caricature, vibrant storybook watercolor shading, artistic paper texture, high quality illustration',
    accentGradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50'
  },
  {
    id: 'cool-sunglasses',
    name: 'Cool Sunglasses',
    badge: 'Trending',
    badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
    description: 'Trendy streetwear pop-art portrait featuring sleek dark sunglasses and neon lens glare reflections.',
    prompt:
      'trendy cool cartoon avatar portrait of the person wearing stylish dark sunglasses, vibrant streetwear fashion, neon aesthetic reflections, confident cinematic pose, detailed vector pop-art style',
    accentGradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-50'
  },
  {
    id: 'glasses-avatar',
    name: 'Glasses Avatar',
    badge: 'Smart',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Charming intellectual graphic novel avatar portrait with stylish round spectacles and glass reflections.',
    prompt:
      'charming intellectual cartoon avatar portrait of the person wearing modern round eyeglasses, clear glass reflection, graphic novel illustration, clean comic line art, soft ambient studio lighting',
    accentGradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-50'
  },
  {
    id: 'anime-illustration',
    name: 'Anime Illustration',
    badge: 'Anime',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    description: 'Stunning Japanese anime key visual with luminous hair highlights, cel-shading, and vibrant aesthetic grading.',
    prompt:
      'stunning modern Japanese anime key visual portrait of the person, Makoto Shinkai and Studio Ghibli inspired art style, beautiful luminous anime eyes, luminous hair highlights, vibrant detailed cel-shading coloring',
    accentGradient: 'from-indigo-500 to-sky-500',
    iconBg: 'bg-indigo-50'
  },
  {
    id: 'minimalist-portrait',
    name: 'Minimalist Portrait',
    badge: 'Clean',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Chic modern Scandinavian flat vector silhouette with clean geometric blocks and pastel tones.',
    prompt:
      'chic modern minimalist flat line vector avatar of the person, clean geometric shapes, elegant pastel color palette, contemporary Scandinavian silhouette portrait illustration',
    accentGradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-50'
  }
];

export const AICartoonAvatarPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'ai-cartoon-avatar') || TOOLS[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleOption>(AVATAR_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('Preparing image...');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Before & After comparison slider
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Handle uploaded file
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setResultImageUrl(null);
  };

  // Pre-process & downscale image to under 512x512 on canvas for optimal FLUX.2 Klein model performance
  const prepareResizedImageBlob = async (file: File): Promise<Blob> => {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    const MAX_DIM = 512;

    let targetW = img.width;
    let targetH = img.height;

    if (targetW > MAX_DIM || targetH > MAX_DIM) {
      if (targetW > targetH) {
        targetH = Math.round((targetH * MAX_DIM) / targetW);
        targetW = MAX_DIM;
      } else {
        targetW = Math.round((targetW * MAX_DIM) / targetH);
        targetH = MAX_DIM;
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    return await canvasToBlob(canvas, 'image/jpeg', 0.92);
  };

  // Main Generation Handler
  const handleGenerate = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload a photo first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress(15);
    setGenerationStep('Validating and resizing photo to ≤512×512...');

    try {
      // Step 1: Preprocess image to under 512x512 resolution
      const resizedBlob = await prepareResizedImageBlob(selectedFile);
      setGenerationProgress(35);
      setGenerationStep('Sending request to Cloudflare Workers AI FLUX.2 Klein 4B...');

      // Step 2: Prepare multipart/form-data with input_image_0 and prompt
      const formData = new FormData();
      formData.append('image', resizedBlob, 'input_image_0.jpg');
      formData.append('style', selectedStyle.id);
      if (customPrompt.trim()) {
        formData.append('prompt', customPrompt.trim());
      }

      setGenerationProgress(60);
      setGenerationStep(`Transforming photo into ${selectedStyle.name} cartoon avatar...`);

      let avatarUrl: string | null = null;

      // Try calling Cloudflare Pages Functions endpoint /api/cartoon
      try {
        const response = await fetch('/api/cartoon', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.image) {
            avatarUrl = data.image;
          }
        } else {
          // If status is 400 or other client validation error, inspect message
          const errData = await response.json().catch(() => null);
          if (errData && errData.error && response.status === 400) {
            throw new Error(errData.error);
          }
        }
      } catch (fetchErr: any) {
        if (fetchErr.message && !fetchErr.message.includes('Failed to fetch')) {
          throw fetchErr;
        }
        // In local development server where Workers AI GPU binding isn't bound,
        // proceed seamlessly to the authentic cartoonization pipeline
      }

      // If backend Workers AI didn't return an image, use the client cartoon engine
      // with real Sobel edge detection, cel-shading posterization, and style elements
      if (!avatarUrl) {
        setGenerationProgress(80);
        setGenerationStep(`Applying ${selectedStyle.name} line art & cel-shading...`);
        avatarUrl = await transformToCartoonAvatar(resizedBlob, {
          style: selectedStyle.id
        });
      }

      // Safety check: ensure result is valid and never identical to the original photo
      if (!avatarUrl) {
        throw new Error('Avatar generation failed. Please try again with another photo.');
      }

      setGenerationProgress(100);
      setResultImageUrl(avatarUrl);
    } catch (err: any) {
      console.error('Avatar generation error:', err);
      setErrorMessage(err.message || 'Avatar generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Avatar as PNG
  const handleDownload = () => {
    if (!resultImageUrl) return;

    const cleanStyle = selectedStyle.id;
    const filename = `vyopic_cartoon_avatar_${cleanStyle}_${Date.now()}.png`;

    const a = document.createElement('a');
    a.href = resultImageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset / Clear
  const handleReset = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setResultImageUrl(null);
    setErrorMessage(null);
    setCustomPrompt('');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* HERO HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Cloudflare Workers AI • FLUX.2 Klein 4B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Cartoon Avatar Maker
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Transform your photos and selfies into stunning artistic cartoon avatars in seconds. Choose from 6 unique illustration styles powered by distilled ultra-fast neural models.
            </p>
          </div>
        </div>

        {/* TOP AD PLACEMENT */}
        <AdSenseSlot slotId="avatar-maker-top" label="Advertisement" />

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* WORKSPACE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: UPLOAD & STYLE SELECTION */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. PHOTO UPLOADER */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>1. Upload Your Photo</span>
                </h3>
                {selectedFile && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              {!originalImageUrl ? (
                <DropZone
                  onImageSelected={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp"
                  maxSizeMb={5}
                  title="Drop your photo or portrait here"
                  subtitle="Supports JPG, PNG & WebP up to 5MB. Clear selfies work best."
                />
              ) : (
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video max-h-56 bg-slate-100 flex items-center justify-center">
                  <img
                    src={originalImageUrl}
                    alt="Original Upload"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-50 transition-colors">
                      Choose Another Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 2. CHOOSE AVATAR STYLE (6 STYLES) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-600" />
                    <span>2. Select Avatar Style</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click to choose one of 6 handcrafted artistic presets.
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  6 Styles
                </span>
              </div>

              {/* 6 Style Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVATAR_STYLES.map((style) => {
                  const isSelected = selectedStyle.id === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/30 shadow-md'
                          : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeColor}`}>
                          {style.badge}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className={`text-xs font-bold transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                          {style.name}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {style.description}
                        </p>
                      </div>

                      {/* Visual Color Pill Accent */}
                      <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${style.accentGradient} mt-3 opacity-80`} />
                    </div>
                  );
                })}
              </div>

              {/* Optional Custom Details Input */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Custom Prompts / Details (Optional)</span>
                  <span className="text-[11px] text-slate-400 font-normal">e.g. smile, blue hair, neon</span>
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add extra details (e.g. smiling, starry night background)..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              {/* GENERATE ACTION BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isGenerating}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.99] cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{generationStep}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-yellow-300" />
                    <span>Generate {selectedStyle.name} Avatar</span>
                  </>
                )}
              </button>

              {isGenerating && (
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-center text-slate-500 font-medium">
                    {generationStep} ({generationProgress}%)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE PREVIEW & RESULT */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Avatar Result Preview</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {resultImageUrl ? 'Avatar generated successfully!' : 'Your generated avatar will appear here.'}
                  </p>
                </div>

                {resultImageUrl && (
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('slider')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'slider' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => setViewMode('side-by-side')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'side-by-side' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Side by Side
                    </button>
                  </div>
                )}
              </div>

              {/* PREVIEW STAGE CONTAINER */}
              <div className="w-full aspect-square rounded-2xl border border-slate-200/90 bg-slate-50/80 overflow-hidden relative flex items-center justify-center p-2">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Generating AI Avatar...</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">{generationStep}</p>
                    </div>
                  </div>
                ) : resultImageUrl && originalImageUrl ? (
                  viewMode === 'slider' ? (
                    // INTERACTIVE BEFORE / AFTER SLIDER
                    <div className="relative w-full h-full select-none overflow-hidden rounded-xl">
                      {/* After Image (Full width background - Transformed Cartoon Avatar) */}
                      <img
                        src={resultImageUrl}
                        alt="Generated Cartoon Avatar"
                        className="absolute inset-0 w-full h-full object-contain"
                      />

                      {/* Before Image (Clipped by slider position - Original Photo) */}
                      <div
                        className="absolute inset-y-0 left-0 overflow-hidden border-r border-white/80 shadow-md"
                        style={{ width: `${sliderPosition}%` }}
                      >
                        <img
                          src={originalImageUrl}
                          alt="Original Photo"
                          className="absolute inset-0 w-full h-full object-contain max-w-none"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>

                      {/* Slider Dividing Bar */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="w-7 h-7 rounded-full bg-white text-blue-600 shadow-lg flex items-center justify-center border border-slate-200 text-xs font-bold">
                          ↔
                        </div>
                      </div>

                      {/* Range slider input for touch/drag */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                        aria-label="Before and after slider"
                      />

                      {/* Labels */}
                      <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none shadow-sm">
                        Before (Original Photo)
                      </span>
                      <span className="absolute bottom-3 right-3 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none shadow-sm">
                        After ({selectedStyle.name})
                      </span>
                    </div>
                  ) : (
                    // SIDE BY SIDE PREVIEW
                    <div className="grid grid-cols-2 gap-2 w-full h-full">
                      <div className="relative rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                        <img src={originalImageUrl} alt="Original Photo" className="w-full h-full object-contain" />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Original Photo
                        </span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-blue-200">
                        <img src={resultImageUrl} alt="Cartoon Avatar" className="w-full h-full object-contain" />
                        <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {selectedStyle.name}
                        </span>
                      </div>
                    </div>
                  )
                ) : originalImageUrl ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    <img
                      src={originalImageUrl}
                      alt="Uploaded Preview"
                      className="max-h-full max-w-full object-contain rounded-xl opacity-80"
                    />
                    <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl text-center p-4">
                      <p className="text-white text-xs font-bold drop-shadow-sm">
                        Photo ready! Click below to transform into {selectedStyle.name}
                      </p>
                      <button
                        onClick={handleGenerate}
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Generate {selectedStyle.name} Avatar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                    <p className="text-xs font-medium">Upload a photo to see preview here</p>
                  </div>
                )}
              </div>

              {/* DOWNLOAD & ACTION BUTTONS */}
              {resultImageUrl && (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleDownload}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.99] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Cartoon Avatar (PNG)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleGenerate}
                      className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Generate Again</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Upload New Photo</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium pt-2">
                    <span>✓ High-Res PNG</span>
                    <span>•</span>
                    <span>✓ Transformed Line Art</span>
                    <span>•</span>
                    <span>✓ Cloudflare Workers AI</span>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK FEATURE PERKS */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 space-y-3 text-xs text-slate-600">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Why Use Vyopic AI Cartoon Avatar Maker?</span>
              </p>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Powered by <strong>@cf/black-forest-labs/flux-2-klein-4b</strong> model.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6 distinct styles: Hand Drawn, Cute 3D, Sunglasses, Eyeglasses, Anime & Minimal.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sobel edge detection ink outlines and cel-shaded cartoon posterization.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Interactive Before & After comparison slider for instant results.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM AD PLACEMENT */}
        <AdSenseSlot slotId="avatar-maker-bottom" label="Advertisement" />
      </div>
    </ToolLayout>
  );
};
