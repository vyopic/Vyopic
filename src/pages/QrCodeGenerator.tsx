import React, { useState, useEffect } from 'react';
import { Download, QrCode, Palette, Sliders, Globe, Wifi, Mail, Phone, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { downloadBlob } from '../utils/imageProcessing';

export const QrCodeGeneratorPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'qr-code-generator')!;

  // Mode
  const [mode, setMode] = useState<'url' | 'text' | 'wifi' | 'email'>('url');

  // Input states
  const [url, setUrl] = useState<string>('https://vyopic.pages.dev');
  const [text, setText] = useState<string>('Hello from Vyopic!');
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('securepassword123');
  const [emailTo, setEmailTo] = useState<string>('hello@vyopic.com');

  // Style Settings
  const [darkColor, setDarkColor] = useState<string>('#000000');
  const [lightColor, setLightColor] = useState<string>('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [qrSize, setQrSize] = useState<number>(1000); // 1000px high res

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute payload text based on mode
  const getQrPayload = (): string => {
    switch (mode) {
      case 'url':
        return url.trim() || 'https://vyopic.pages.dev';
      case 'wifi':
        return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
      case 'email':
        return `mailto:${emailTo}`;
      default:
        return text || 'Vyopic Free QR Code';
    }
  };

  // Generate QR Code data URL
  useEffect(() => {
    const payload = getQrPayload();

    QRCode.toDataURL(payload, {
      width: qrSize,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: errorCorrection
    })
      .then((data) => setQrDataUrl(data))
      .catch((err) => console.error('QR code generation error:', err));
  }, [mode, url, text, wifiSsid, wifiPass, emailTo, darkColor, lightColor, errorCorrection, qrSize]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `vyopic_qrcode_${mode}.png`;
    link.click();
  };

  const handleCopy = () => {
    if (!qrDataUrl) return;
    navigator.clipboard.writeText(getQrPayload()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'url', label: 'Website URL', icon: Globe },
            { id: 'text', label: 'Plain Text', icon: QrCode },
            { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
            { id: 'email', label: 'Email Address', icon: Mail }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === item.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Input parameters */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <h3 className="text-sm font-bold text-slate-900">QR Code Content</h3>

            {mode === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Website URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {mode === 'text' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plain Text or Message</label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter message here..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {mode === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wi-Fi Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Home_Network"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Wi-Fi Password"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {mode === 'email' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Colors and styling */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Colors & Quality</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pattern Color</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700">{darkColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700">{lightColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Error Correction Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'L', label: 'Low (7%)' },
                    { id: 'M', label: 'Med (15%)' },
                    { id: 'Q', label: 'High (25%)' },
                    { id: 'H', label: 'Max (30%)' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setErrorCorrection(lvl.id as any)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        errorCorrection === lvl.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR Code Visual Preview & Download */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-between">
            <span className="text-xs font-bold text-slate-500 mb-4">High-Resolution QR Code Output (1000 × 1000 px)</span>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md mb-6 max-w-xs w-full flex items-center justify-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Generated QR Code" className="w-full aspect-square object-contain" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-xs text-slate-400">
                  Generating QR Code...
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Payload Copied!' : 'Copy Data'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
