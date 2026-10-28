import React from 'react';
import { Shield, Sparkles, Scale, GraduationCap, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface AboutViewProps {
  language: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ language }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero / About Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-sky-600/30">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About CyberSaathi
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {language === 'te'
            ? 'భారతీయ పౌరుల కోసం చట్టపరమైన మార్గదర్శకత్వం మరియు సైబర్ భద్రత అవగాహనను అందించే AI-ఆధారిత వేదిక.'
            : 'CyberSaathi is an educational and informational platform designed to help Indian citizens understand cybercrime situations, learn about relevant legal provisions, and access official reporting channels using AI-powered guidance.'}
        </p>
      </div>

      {/* Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">AI Powered Guidance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Utilizes a dataset-first search engine indexed across 35,000+ official Indian statutes with Google Gemini fallback to provide accurate legal answers.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Indian Laws Simplified</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Translates complex sections of the Information Technology Act 2000, Bharatiya Nyaya Sanhita 2023, and DPDP Act into plain, accessible language.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Public Awareness</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empowers users to identify fraudulent patterns, preserve admissible digital evidence, and immediately access verified government helplines.
          </p>
        </div>
      </div>

      {/* Legal Disclaimer Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-7 text-amber-900 space-y-3">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Statutory Legal Disclaimer</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-800">
          CyberSaathi provides general educational and informational guidance based on Indian legal statutes. It does not provide legal representation, legal advice, or official police investigation services.
        </p>
        <p className="text-xs leading-relaxed text-amber-800">
          Legal applicability depends strictly on the unique facts of your case. For formal complaint lodging, always utilize official channels (<strong>Helpline 1930</strong> and <strong>https://cybercrime.gov.in/</strong>) or consult a qualified advocate.
        </p>
      </div>
    </div>
  );
};
