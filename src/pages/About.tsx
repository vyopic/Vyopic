import React from 'react';
import { SEO } from '../components/common/SEO';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { Shield, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <SEO
        title="About Vyopic – Smart Photo Maker & Free Online Image Tools"
        description="Learn about Vyopic, a modern privacy-first online photo suite providing free image compression, resizing, conversion, cropping, and passport photo generation."
        keywords={['about vyopic', 'privacy photo editor', 'smart photo maker', 'browser image utilities']}
      />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Privacy & Speed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            About Vyopic
          </h1>
          <p className="text-slate-600 text-base">
            Vyopic (Smart Photo Maker) was built to make image editing free, instant, and 100% private.
          </p>
        </div>

        <AdSenseSlot slotId="about-top-ad" label="Advertisement" />

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 text-sm leading-relaxed my-8">
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p>
            Millions of users need to edit, compress, or convert photos every day for job applications, passport forms, web development, and social media. However, most online converters upload user files to cloud servers, posing severe privacy risks and taking precious time.
          </p>
          <p>
            Vyopic solves this by executing all image calculations locally inside your web browser using HTML5 Canvas API and modern WebAssembly techniques. Your images never touch our servers or any third-party infrastructure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">100% Private</h3>
              <p className="text-xs text-slate-500">Zero file uploads to external servers.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Performance</h3>
              <p className="text-xs text-slate-500">No queues or network delay.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <ImageIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">10 Core Tools</h3>
              <p className="text-xs text-slate-500">Compress, resize, passport, filters & more.</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Free & Ad-Supported</h2>
          <p>
            To keep all 10 photo tools free for everyone without paywalls or mandatory subscriptions, Vyopic displays unobtrusive Google AdSense advertisements that do not interfere with tool operation.
          </p>
        </div>

        <AdSenseSlot slotId="about-bottom-ad" label="Advertisement" />
      </div>
    </div>
  );
};
