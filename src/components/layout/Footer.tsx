import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';
import { TOOLS } from '../../config/tools';
import { LogoIconSVG } from '../common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center p-2 shadow-xs">
                <LogoIconSVG className="w-full h-full" fill="white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Vyopic
                </span>
                <span className="block text-[10px] font-semibold tracking-wider text-slate-400 -mt-1 uppercase">
                  Smart Photo Maker
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fast, free, and privacy-focused online photo editing tools in your browser. Compress, resize, convert, crop, make passport photos and photo collages without uploading images to any server.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 p-2.5 rounded-xl w-fit">
              <Shield className="w-4 h-4 shrink-0" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Column 2: Photo Tools (Part 1) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Online Photo Tools
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              {TOOLS.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link to={t.path} className="hover:text-blue-600 transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Photo Tools (Part 2) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              More Image Utilities
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              {TOOLS.slice(5, 10).map((t) => (
                <li key={t.id}>
                  <Link to={t.path} className="hover:text-blue-600 transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Pages & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Quick Links & Legal
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  About Vyopic
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vyopic (Smart Photo Maker). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for maximum speed, privacy & search performance <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
