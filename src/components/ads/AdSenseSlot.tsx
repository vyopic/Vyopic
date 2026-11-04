import React, { useEffect } from 'react';
import { AdSenseProps } from '../../types';

// Global AdSense publisher configuration
export const ADSENSE_CLIENT_ID = 'ca-pub-0000000000000000'; // Replace with real Publisher ID in production

export const AdSenseSlot: React.FC<AdSenseProps> = ({
  slotId = '1234567890',
  client = ADSENSE_CLIENT_ID,
  format = 'auto',
  className = '',
  label = 'Advertisement'
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle) {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.log('AdSense script initialization:', e);
    }
  }, []);

  return (
    <div className={`my-6 w-full flex flex-col items-center justify-center ${className}`}>
      {/* Label above ad for strict Google AdSense Policy Compliance */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200">
          {label}
        </span>
        <span className="text-[10px] text-slate-400">Vyopic Free Sponsored Space</span>
      </div>

      {/* Ad Container Box */}
      <div className="w-full max-w-4xl bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden min-h-[90px] md:min-h-[100px] flex items-center justify-center relative shadow-xs group">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* AdSense Placeholder Banner (Shown prior to ad load or during local review) */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/50 border-dashed border-2 border-slate-200/60 pointer-events-none text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700">Google AdSense Space ({slotId})</p>
              <p className="text-[11px] text-slate-500">Non-intrusive responsive advertisement unit</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Publisher: {client}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
