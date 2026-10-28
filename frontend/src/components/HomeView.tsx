import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  Scale,
  Clock,
  CheckCircle2,
  Smartphone,
  Link2,
  Users,
  UserCheck,
  ShoppingBag,
  Eye,
  Mail,
  Briefcase,
  Lock,
  HelpCircle,
} from 'lucide-react';
import { TabType, Language } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: TabType) => void;
  onSelectIssue: (issuePrompt: string) => void;
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSelectIssue,
  language,
}) => {
  const commonIssues = [
    {
      titleEn: 'UPI & Online Payment Fraud',
      titleTe: 'UPI & ఆన్‌లైన్ చెల్లింపుల మోసం',
      icon: Smartphone,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      prompt: 'Someone fraudulently debited money from my account via UPI/QR code without my consent. What should I do under Indian law?',
    },
    {
      titleEn: 'Phishing & Fraudulent Links',
      titleTe: 'ఫిషింగ్ & మోసపూరిత లింకులు',
      icon: Link2,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      prompt: 'I clicked on a suspicious phishing link pretending to be my bank and entered my credentials. What immediate legal steps must I take?',
    },
    {
      titleEn: 'Social Media Account Hacking',
      titleTe: 'సోషల్ మీడియా ఖాతా హ్యాకింగ్',
      icon: Users,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      prompt: 'My Instagram/WhatsApp account was hacked and unauthorized messages are being sent to my contacts. What legal remedies apply?',
    },
    {
      titleEn: 'Identity Theft & Impersonation',
      titleTe: 'గుర్తింపు దొంగతనం & నకిలీ ప్రొఫైల్స్',
      icon: UserCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      prompt: 'Someone created a fake profile using my photos and identity to scam people. What sections under IT Act 2000 apply to impersonation?',
    },
    {
      titleEn: 'Online Shopping Fraud',
      titleTe: 'ఆన్‌లైన్ షాపింగ్ మోసం',
      icon: ShoppingBag,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      prompt: 'I paid an online website/seller for an item, but received nothing and the seller blocked me. How do I report online commerce fraud?',
    },
    {
      titleEn: 'Cyberstalking & Harassment',
      titleTe: 'సైబర్‌స్టాకింగ్ & వేధింపులు',
      icon: Eye,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      prompt: 'I am receiving continuous abusive, threatening messages and harassment online. What Indian legal protections exist for cyber harassment?',
    },
    {
      titleEn: 'Email & Account Compromise',
      titleTe: 'ఇమెయిల్ & ఖాతా రాజీ',
      icon: Mail,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      prompt: 'My business/personal email was compromised and unauthorized access was obtained. What are the legal offences for unauthorized access?',
    },
    {
      titleEn: 'Fake Job & Loan Scams',
      titleTe: 'నకిలీ ఉద్యోగాలు & లోన్ మోసాలు',
      icon: Briefcase,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      prompt: 'I fell victim to a fake work-from-home job / instant loan app scam. How do I report it and what laws penalize such scams in India?',
    },
    {
      titleEn: 'Privacy Violation & Data Leak',
      titleTe: 'గోప్యతా ఉల్లంఘన & డేటా లీక్',
      icon: Lock,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      prompt: 'My private photos or personal data were leaked online without my permission. What are my rights under IT Act Section 66E / 67 and DPDP Act?',
    },
    {
      titleEn: 'Other Cybercrimes',
      titleTe: 'ఇతర సైబర్ నేరాలు',
      icon: HelpCircle,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      prompt: 'I suspect a cybercrime incident and need legal guidance under Indian law on preserving evidence and lodging a complaint.',
    },
  ];

  const handleCardClick = (prompt: string) => {
    onSelectIssue(prompt);
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071328] via-[#0b1e3d] to-[#071328] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-2xl border-b border-sky-900/40">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Dataset-First Indian Legal Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {language === 'te' ? (
              <>
                సైబర్ చట్ట మార్గదర్శకత్వం కోసం{' '}
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  మీ నమ్మకమైన నేస్తం
                </span>
              </>
            ) : (
              <>
                Your Trusted Companion for{' '}
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Cyber Legal Guidance
                </span>
              </>
            )}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {language === 'te'
              ? 'మీ సైబర్ నేర పరిస్థితిని అర్థం చేసుకోండి, చట్టపరమైన ఎంపికలను తెలుసుకోండి, ఆధారాలను భద్రపరచండి మరియు AI మద్దతుతో సరైన ప్రభుత్వ పోర్టల్స్‌ను కనుగొనండి.'
              : 'Understand your cybercrime situation, learn your legal options, preserve evidence, and discover the right reporting channels with AI-powered assistance.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('assistant')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-sky-600/30 flex items-center space-x-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>{language === 'te' ? 'చట్టపరమైన మార్గదర్శకత్వం పొందండి' : 'Get Legal Guidance'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-100 font-semibold shadow-md flex items-center space-x-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>{language === 'te' ? 'సైబర్ క్రైమ్ రిపోర్ట్ చేయండి' : 'Report Cybercrime'}</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="max-w-5xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">1930</p>
              <p className="text-[11px] text-slate-400">Cybercrime Helpline</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">24/7</p>
              <p className="text-[11px] text-slate-400">Guidance Support</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">35,000+</p>
              <p className="text-[11px] text-slate-400">Indian Cyber Statutes</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Safe & Aware</p>
              <p className="text-[11px] text-slate-400">Digital India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Cybercrime Issues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {language === 'te' ? 'సాధారణ సైబర్ క్రైమ్ సమస్యలు' : 'Common Cybercrime Issues'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {language === 'te'
              ? 'AI మార్గదర్శకత్వం పొందడానికి ఒక వర్గాన్ని ఎంచుకోండి లేదా మీ ప్రశ్నను నేరుగా అడగండి.'
              : 'Select a category or ask your own question to get instant AI guidance grounded in Indian law.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {commonIssues.map((issue, idx) => {
            const Icon = issue.icon;
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(issue.prompt)}
                className="group p-4 bg-white border border-slate-200 hover:border-sky-400 rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${issue.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                    {language === 'te' ? issue.titleTe : issue.titleEn}
                  </h3>
                  <span className="text-[11px] text-slate-400 group-hover:text-sky-500 font-medium inline-flex items-center space-x-1 mt-1">
                    <span>{language === 'te' ? 'సహాయం పొందండి' : 'Get Guidance'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
