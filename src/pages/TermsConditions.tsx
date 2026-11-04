import React from 'react';
import { SEO } from '../components/common/SEO';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <SEO
        title="Terms & Conditions – Vyopic Usage Rules"
        description="Vyopic Terms & Conditions governing the free browser-based photo utilities and user guidelines."
        keywords={['terms and conditions', 'vyopic terms', 'usage rules']}
      />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="text-center max-w-lg mx-auto mb-8">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 text-xs font-semibold">
            Last Updated: November 2026
          </p>
        </div>

        <AdSenseSlot slotId="terms-top-ad" label="Advertisement" />

        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed my-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Vyopic, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of our online tools.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Free Service & Availability</h2>
          <p>
            Vyopic provides browser-based photo utilities on an "as is" and "as available" basis without financial cost. While we strive for 100% uptime, we do not guarantee uninterrupted availability.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. Passport & ID Photo Guidelines</h2>
          <p>
            Vyopic provides dimension preset templates (e.g. 35x45mm, 2x2in) for user convenience. Users are responsible for verifying official government photo requirements before submitting ID or passport photos to government agencies.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property & User Content</h2>
          <p>
            You retain 100% full ownership of all images processed through Vyopic. We claim no ownership, copyright, or rights over your content.
          </p>
        </div>

        <AdSenseSlot slotId="terms-bottom-ad" label="Advertisement" />
      </div>
    </div>
  );
};
