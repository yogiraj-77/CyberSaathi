import React from 'react';
import {
  PhoneCall,
  Globe,
  FileCheck2,
  Calendar,
  ShieldCheck,
  BookmarkCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TabType, Language } from '../types';

interface ReportViewProps {
  setActiveTab: (tab: TabType) => void;
  language: Language;
}

export const ReportView: React.FC<ReportViewProps> = ({ setActiveTab, language }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'te' ? 'సైబర్ క్రైమ్ రిపోర్ట్ చేయండి' : 'Report a Cybercrime'}
        </h1>
        <p className="text-base text-slate-600 max-w-2xl">
          {language === 'te'
            ? 'మీ ఫిర్యాదును నమోదు చేయడానికి భారత ప్రభుత్వ అధికారిక ఛానెళ్లను ఉపయోగించండి.'
            : 'Use official government channels to file your formal complaint and freeze unauthorized transactions.'}
        </p>
      </div>

      {/* Official Government Channels Callout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Helpline 1930 Card */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 text-white rounded-3xl p-7 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tight">1930</span>
              <h3 className="text-lg font-bold text-red-100">Cybercrime Helpline</h3>
              <p className="text-xs text-red-200 mt-1 font-medium">
                (Citizen Financial Cyber Fraud Reporting and Management System)
              </p>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              If money has been deducted from your bank account or UPI, call 1930 immediately within the golden hour to block the funds at the recipient bank.
            </p>
          </div>

          <a
            href="tel:1930"
            className="w-full py-3.5 px-4 rounded-xl bg-white text-red-600 font-bold text-sm text-center shadow-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1930 Now</span>
          </a>
        </div>

        {/* National Cyber Crime Reporting Portal Card */}
        <div className="bg-gradient-to-br from-[#071328] via-[#0e2447] to-[#122e5a] text-white rounded-3xl p-7 shadow-xl flex flex-col justify-between space-y-6 border border-slate-800">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 backdrop-blur-md flex items-center justify-center">
              <Globe className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">National Cyber Crime Reporting Portal</h3>
              <p className="text-xs text-sky-300 mt-0.5 font-medium">
                Ministry of Home Affairs, Government of India
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              File formal complaints online for all cybercrime categories: financial fraud, women/child safety, social media harassment, hacking, and identity theft.
            </p>
          </div>

          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm text-center shadow-lg shadow-sky-600/30 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Visit Portal (cybercrime.gov.in)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Before You File a Complaint Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'te' ? 'ఫిర్యాదు చేయడానికి ముందు' : 'Before You File a Complaint'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Having these essential details prepared ensures faster investigation and account blocking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 flex-shrink-0 mt-0.5">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Collect Evidence</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Save transaction IDs (UTR/Ref No.), bank statements, uncropped chat screenshots, email headers, and SMS alerts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">2. Note Important Details</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Record exact dates, times, scammer phone numbers, UPI handles, fake profile links, and exact amounts lost.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3. Provide Accurate Information</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Be clear, chronological, and truthful in your incident narrative. Avoid omitting steps or altering timestamps.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 flex-shrink-0 mt-0.5">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">4. Save Complaint Reference</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Always note down your acknowledgement number generated by cybercrime.gov.in for local cyber cell police follow-up.
              </p>
            </div>
          </div>
        </div>

        {/* AI Assistant Help CTA Banner */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('assistant')}
            className="w-full p-4 rounded-2xl bg-sky-50 border border-sky-200 hover:border-sky-300 text-sky-900 flex items-center justify-between group transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold">
                  Need personalized help drafting your complaint narrative?
                </p>
                <p className="text-[11px] text-sky-700">
                  Ask CyberSaathi AI Assistant for step-by-step guidance based on Indian law.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
