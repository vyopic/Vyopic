import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ShieldCheck, Zap, Lock, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { SEO } from '../components/common/SEO';
import { ToolIcon } from '../components/common/ToolIcon';

export const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const popularTools = TOOLS.filter((t) => t.badge);
  const filteredTools = search.trim()
    ? TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : TOOLS;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Vyopic – Free Online Photo Editing Tools | Smart Photo Maker"
        description="Free online photo tools to compress, resize, convert, crop, make passport photos, photo collages, apply filters, rotate, flip, and change background colors in browser."
        keywords={[
          'free photo tools',
          'online photo editor',
          'smart photo maker',
          'vyopic photo tools',
          'client side image editor',
          'free image compressor',
          'passport photo maker'
        ]}
      />

      {/* 1. AD SPACE BELOW HEADER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <AdSenseSlot slotId="home-top-header-ad" label="Advertisement" />
      </div>

      {/* HERO SECTION */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-6 border border-blue-200/80">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Browser-Based Photo Tools
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Free Online <span className="text-blue-600">Photo Editing</span> Tools
          </h1>

          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Process, compress, resize, and transform your photos instantly in your browser. Zero file uploads, 100% data privacy, and no registration required.
          </p>

          {/* Search Input Box */}
          <div className="max-w-2xl mx-auto relative mb-8 shadow-lg rounded-2xl bg-white border border-slate-200 p-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search photo tools (e.g. compress, passport photo, crop, resize)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 px-1 text-slate-900 text-sm md:text-base font-medium placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Private (Client-Side)
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Export (No Queues)
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Lock className="w-4 h-4 text-blue-600" />
              No Account Required
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* POPULAR TOOLS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Most Popular Tools
              </h2>
              <p className="text-xs text-slate-500">Frequently used photo utilities</p>
            </div>
            <span className="text-xs font-bold text-blue-600">Free Forever</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                      <ToolIcon name={tool.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Use Tool Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. AD SPACE AFTER POPULAR TOOLS */}
        <AdSenseSlot slotId="home-mid-popular-ad" label="Advertisement" />

        {/* ALL TOOLS GRID */}
        <section id="all-tools">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              All {TOOLS.length} Free Online Photo Tools
            </h2>
            <p className="text-slate-600 text-sm">
              Complete suite of browser-based utilities for photographers, creators, designers, students, and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ToolIcon name={tool.iconName} className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {tool.shortDescription}
                  </p>
                </div>

                <Link
                  to={tool.path}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl border border-slate-200 hover:border-blue-600 transition-all text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span>Use {tool.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              How Vyopic Works in 3 Easy Steps
            </h2>
            <p className="text-slate-600 text-sm">
              No software installation required. Everything processes right in your web browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Upload Photo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag and drop your image file into any of our 10 photo tool editors.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Edit & Adjust</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Change quality, dimensions, filters, background colors, or aspect ratio with real-time preview.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Download Result</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Save high quality edited images instantly back to your computer or mobile device.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE SMART PHOTO MAKER */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Why Choose Vyopic
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-4">
              Fast, Private & Powerful Photo Editing
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Vyopic was designed to give users a clean, ad-friendly, and secure alternative to slow cloud photo conversion websites.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Client-Side Engine:</strong> Your images are processed using HTML5 Canvas inside your own browser.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Registration:</strong> No signups, email entries, or hidden subscriptions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>High-Resolution Export:</strong> Retain visual fidelity without forced watermarks.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">Supported Formats & Devices</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Compatible with all modern web browsers including Chrome, Safari, Firefox, Edge, and mobile browsers on iOS & Android.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-blue-400 font-bold">Input Formats</p>
                <p className="text-slate-300">JPG, JPEG, PNG, WebP, GIF, BMP</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-emerald-400 font-bold">Output Formats</p>
                <p className="text-slate-300">JPG, PNG, WebP</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Everything you need to know about Vyopic free photo tools.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                Is Vyopic completely free to use?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                Yes! All 10 tools on Vyopic are 100% free with unlimited usage and no watermarks.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                Are my photos uploaded or saved on any server?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                No. Vyopic operates entirely inside your local web browser memory. Your files never get sent across the internet to any server.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                Can I use Vyopic on my smartphone or tablet?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed pl-7">
                Yes, Vyopic is fully responsive and optimized for mobile browsers on iPhone, iPad, and Android devices.
              </p>
            </div>
          </div>
        </section>

        {/* 3. AD SPACE BEFORE FOOTER */}
        <AdSenseSlot slotId="home-bottom-footer-ad" label="Advertisement" />
      </div>
    </div>
  );
};
