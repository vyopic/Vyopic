import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../../config/tools';
import { LogoIconSVG } from '../common/Logo';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const filteredTools = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : TOOLS;

  const handleSelectTool = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setIsToolsDropdownOpen(false);
    setIsMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors p-2">
            <LogoIconSVG className="w-full h-full" fill="white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Vyopic
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-slate-400 -mt-1 uppercase">
              Smart Photo Maker
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <Link to="/" className="hover:text-blue-600 transition-colors py-2">
            Home
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              onMouseEnter={() => setIsToolsDropdownOpen(true)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2"
            >
              <span>Photo Tools</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isToolsDropdownOpen && (
              <div
                onMouseLeave={() => setIsToolsDropdownOpen(false)}
                className="absolute top-full left-0 w-96 max-h-[480px] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur-xs">
                  All Photo Tools ({TOOLS.length})
                </div>
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.path)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </p>
                        {tool.badge && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-blue-600 transition-colors py-2">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors py-2">
            Contact
          </Link>
        </nav>

        {/* Right CTA / Search Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-xl transition-colors border border-slate-200/80"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search tools...</span>
            <kbd className="bg-white text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          <Link
            to="/image-compressor"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Start</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Search tools"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 hover:bg-slate-50 rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 hover:bg-slate-50 rounded-xl"
            >
              About Vyopic
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 hover:bg-slate-50 rounded-xl"
            >
              Contact Support
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 max-h-80 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              All Photo Tools ({TOOLS.length})
            </p>
            <div className="grid grid-cols-1 gap-1">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTool(t.path)}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-between"
                >
                  <span>{t.title}</span>
                  <span className="text-[10px] text-slate-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-16 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools (e.g., passport, compress, crop, resize)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 max-h-96 overflow-y-auto space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTool(t.path)}
                    className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
                        {t.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {t.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Tool
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No matching tools found for "{searchQuery}".
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Vyopic Client-Side Processing
              </span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
