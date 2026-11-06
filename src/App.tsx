import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// First 10 Core Pages
import { Home } from './pages/Home';
import { NameBrandLogoPage } from './pages/NameBrandLogo';
import { ImageCompressorPage } from './pages/ImageCompressor';
import { ImageResizerPage } from './pages/ImageResizer';
import { ImageConverterPage } from './pages/ImageConverter';
import { ImageCropperPage } from './pages/ImageCropper';
import { PassportPhotoMakerPage } from './pages/PassportPhotoMaker';
import { PhotoCollageMakerPage } from './pages/PhotoCollageMaker';
import { PhotoFiltersPage } from './pages/PhotoFilters';
import { ImageRotatorPage } from './pages/ImageRotator';
import { BackgroundColorChangerPage } from './pages/BackgroundColorChanger';
import { ImageFlipperPage } from './pages/ImageFlipper';

// 10 New Features
import { BackgroundRemoverPage } from './pages/BackgroundRemover';
import { ImageUpscalerPage } from './pages/ImageUpscaler';
import { PhotoEnhancerPage } from './pages/PhotoEnhancer';
import { ImageToPdfPage } from './pages/ImageToPdf';
import { PdfToImagePage } from './pages/PdfToImage';
import { ImageWatermarkPage } from './pages/ImageWatermark';
import { ObjectRemoverPage } from './pages/ObjectRemover';
import { MemeGeneratorPage } from './pages/MemeGenerator';
import { ImageMetadataPage } from './pages/ImageMetadata';
import { QrCodeGeneratorPage } from './pages/QrCodeGenerator';

// 4 New Features
import { AIProfilePicturePage } from './pages/AIProfilePicture';
import { PhotoToSketchPage } from './pages/PhotoToSketch';
import { AIPhotoBoothPage } from './pages/AIPhotoBooth';
import { AISocialMediaPosterPage } from './pages/AISocialMediaPoster';
import { AICartoonAvatarPage } from './pages/AICartoonAvatar';

// Legal & Info Pages
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { TermsConditionsPage } from './pages/TermsConditions';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-cartoon-avatar" element={<AICartoonAvatarPage />} />
            <Route path="/name-brand-logo" element={<NameBrandLogoPage />} />
            
            {/* First 10 Tools */}
            <Route path="/image-compressor" element={<ImageCompressorPage />} />
            <Route path="/image-resizer" element={<ImageResizerPage />} />
            <Route path="/image-converter" element={<ImageConverterPage />} />
            <Route path="/image-cropper" element={<ImageCropperPage />} />
            <Route path="/passport-photo-maker" element={<PassportPhotoMakerPage />} />
            <Route path="/photo-collage-maker" element={<PhotoCollageMakerPage />} />
            <Route path="/photo-filters" element={<PhotoFiltersPage />} />
            <Route path="/image-rotator" element={<ImageRotatorPage />} />
            <Route path="/background-color-changer" element={<BackgroundColorChangerPage />} />
            <Route path="/image-flipper" element={<ImageFlipperPage />} />

            {/* 10 New Tools */}
            <Route path="/background-remover" element={<BackgroundRemoverPage />} />
            <Route path="/image-upscaler" element={<ImageUpscalerPage />} />
            <Route path="/photo-enhancer" element={<PhotoEnhancerPage />} />
            <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/pdf-to-image" element={<PdfToImagePage />} />
            <Route path="/image-watermark" element={<ImageWatermarkPage />} />
            <Route path="/object-remover" element={<ObjectRemoverPage />} />
            <Route path="/meme-generator" element={<MemeGeneratorPage />} />
            <Route path="/image-metadata" element={<ImageMetadataPage />} />
            <Route path="/qr-code-generator" element={<QrCodeGeneratorPage />} />
            <Route path="/qr-code-generato" element={<QrCodeGeneratorPage />} />

            {/* 4 New Features */}
            <Route path="/ai-profile-picture" element={<AIProfilePicturePage />} />
            <Route path="/photo-to-sketch" element={<PhotoToSketchPage />} />
            <Route path="/ai-photo-booth" element={<AIPhotoBoothPage />} />
            <Route path="/ai-poster-maker" element={<AISocialMediaPosterPage />} />

            {/* Legal Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
