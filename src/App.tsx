import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
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

            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />

            {/* Fallback redirect */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
