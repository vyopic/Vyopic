import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { AdSenseSlot } from '../components/ads/AdSenseSlot';
import { Mail, CheckCircle2, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <SEO
        title="Contact Us – Vyopic Support & Feedback"
        description="Get in touch with the Vyopic team for feature requests, bug reports, advertising inquiries, or feedback."
        keywords={['contact vyopic', 'support', 'feedback', 'vyopic photo maker']}
      />

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Contact Support
          </h1>
          <p className="text-slate-600 text-sm">
            Have questions, feedback, or advertising inquiries? We'd love to hear from you.
          </p>
        </div>

        <AdSenseSlot slotId="contact-top-ad" label="Advertisement" />

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center my-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Message Sent Successfully!</h2>
            <p className="text-xs text-slate-600">
              Thank you for contacting Vyopic. Our team will review your message shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-8">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
              <textarea
                required
                rows={5}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}

        <AdSenseSlot slotId="contact-bottom-ad" label="Advertisement" />
      </div>
    </div>
  );
};
