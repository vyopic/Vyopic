import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types';
import { TOOLS } from '../../config/tools';
import { AdSenseSlot } from '../ads/AdSenseSlot';
import { SEO } from './SEO';

interface ToolLayoutProps {
  tool: ToolItem;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const relatedTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10">
      <SEO
        title={tool.metaTitle}
        description={tool.metaDescription}
        keywords={tool.keywords}
        canonicalUrl={`https://vyopic.com${tool.path}`}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{tool.title}</span>
        </nav>

        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          {tool.badge && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              {tool.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {tool.title}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {tool.fullDescription}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Private Client-Side
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Export
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              No Registration Needed
            </span>
          </div>
        </div>

        {/* 1. TOP AD SPACE (Below Page Header as required) */}
        <AdSenseSlot slotId={`top-${tool.id}`} label="Advertisement" />

        {/* 2. MAIN TOOL WORKSPACE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-8 mb-10">
          {children}
        </div>

        {/* 3. MIDDLE AD SPACE (Below Main Editing Tool as required) */}
        <AdSenseSlot slotId={`mid-${tool.id}`} label="Advertisement" />

        {/* 4. STEP-BY-STEP & FEATURES SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              How to Use {tool.title}
            </h2>
            <ol className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="font-semibold text-blue-600">Step 1:</span>
                <span>Select or drag & drop your image file into the tool frame.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-blue-600">Step 2:</span>
                <span>Adjust your desired settings, dimensions, quality, or colors in real-time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-blue-600">Step 3:</span>
                <span>Preview the live visual result directly on your screen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-blue-600">Step 4:</span>
                <span>Click the Download button to save your edited image instantly to your device.</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Key Advantages & Features
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {tool.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. DETAILED SEO ARTICLE SECTION */}
        <article className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-10 shadow-xs mb-12 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            About Vyopic Free Online {tool.title}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Vyopic provides an industry-leading, privacy-first solution for editing and optimizing photos directly in your web browser. Built on HTML5 Canvas technology, our <strong>{tool.title}</strong> allows users to perform high-grade image manipulations without uploading sensitive files to cloud servers.
          </p>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Why Choose Browser-Based Client-Side Photo Processing?
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Traditional online image editors require uploading your photo to remote web servers, creating privacy risks and delay. Vyopic runs entirely inside your browser memory. This means zero bandwidth delay, zero waiting in queues, and 100% data confidentiality for personal, family, and professional photographs.
          </p>
        </article>

        {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {tool.faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                  <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BOTTOM AD SPACE (Before Related Tools Section as required) */}
        <AdSenseSlot slotId={`bot-${tool.id}`} label="Advertisement" />

        {/* 8. RELATED TOOLS GRID */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Explore More Free Online Photo Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedTools.map((rt) => (
              <Link
                key={rt.id}
                to={rt.path}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors mb-1">
                    {rt.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {rt.shortDescription}
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-blue-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Use Tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
