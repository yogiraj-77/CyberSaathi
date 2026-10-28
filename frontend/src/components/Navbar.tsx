import React from 'react';
import { Shield } from 'lucide-react';
import { TabType, Language } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const navItems: { id: TabType; labelEn: string; labelTe: string }[] = [
    { id: 'home', labelEn: 'Home', labelTe: 'హోమ్' },
    { id: 'assistant', labelEn: 'AI Assistant', labelTe: 'AI అసిస్టెంట్' },
    { id: 'laws', labelEn: 'Cyber Laws', labelTe: 'సైబర్ చట్టాలు' },
    { id: 'report', labelEn: 'Report', labelTe: 'ఫిర్యాదు చేయండి' },
    { id: 'awareness', labelEn: 'Awareness', labelTe: 'అవగాహన' },
    { id: 'about', labelEn: 'About', labelTe: 'గురించి' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071328]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                CyberSaathi
              </span>
              <span className="hidden sm:block text-[11px] text-sky-300 font-medium tracking-wide">
                AI Powered Cyber Legal Guidance
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600/30 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {language === 'te' ? item.labelTe : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Toggle & Emergency Pill */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  language === 'te'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                తెలుగు
              </button>
            </div>

            <a
              href="tel:1930"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold hover:bg-red-600/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>1930 Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile nav scrollbar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800/80 space-x-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
                isActive ? 'bg-sky-600 text-white' : 'text-slate-300 bg-slate-800/60'
              }`}
            >
              {language === 'te' ? item.labelTe : item.labelEn}
            </button>
          );
        })}
      </div>
    </header>
  );
};
