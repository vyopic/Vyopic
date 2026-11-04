import React from 'react';
import { SEO } from '../components/common/SEO';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <SEO
        title="Privacy Policy – Vyopic Client-Side Protection"
        description="Vyopic Privacy Policy explaining client-side browser photo processing, zero image storage, cookies, and Google AdSense guidelines."
        keywords={['privacy policy', 'vyopic privacy', 'data security', 'zero server upload']}
      />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="text-center max-w-lg mx-auto mb-8">
          <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-xs font-semibold">
            Last Updated: November 2026
          </p>
        </div>

        <AdSenseSlot slotId="privacy-top-ad" label="Advertisement" />

        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed my-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">1. Client-Side Processing Commitment</h2>
          <p>
            At Vyopic, your privacy is our core priority. All photo manipulations—including compression, resizing, format conversion, cropping, passport photo building, collage rendering, filtering, rotation, and background color changes—take place exclusively inside your client browser memory using HTML5 Canvas APIs. No images or media files are ever transmitted to or stored on our servers.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Analytics & Cookies</h2>
          <p>
            We may collect standard anonymized technical log data (such as user-agent, screen resolution, and page visits) solely to optimize website performance. We do not track personal identifying information (PII).
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. Google AdSense Advertisements</h2>
          <p>
            Vyopic uses Google AdSense to serve advertisements when you visit our web application. Google and third-party ad vendors use cookies to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting Google's Ad Settings.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. Third-Party Links</h2>
          <p>
            Vyopic contains no third-party cloud image storage integrations, ensuring complete isolated privacy for your photos.
          </p>
        </div>

        <AdSenseSlot slotId="privacy-bottom-ad" label="Advertisement" />
      </div>
    </div>
  );
};
