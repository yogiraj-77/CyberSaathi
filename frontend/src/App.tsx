import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AssistantView } from './components/AssistantView';
import { LawsView } from './components/LawsView';
import { ReportView } from './components/ReportView';
import { AwarenessView } from './components/AwarenessView';
import { AboutView } from './components/AboutView';
import { TabType, Language } from './types';
import { PhoneCall, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  const handleSelectIssue = (promptText: string) => {
    setInitialPrompt(promptText);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Emergency Floating Top Alert */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs py-2 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="font-semibold">
                Financial cyber fraud emergency? Call 1930 immediately to block transactions.
              </span>
            </div>
            <a
              href="tel:1930"
              className="underline font-bold hover:text-red-100 flex items-center space-x-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930</span>
            </a>
          </div>
        </div>

        {/* Tab Content Views */}
        <main>
          {activeTab === 'home' && (
            <HomeView
              setActiveTab={setActiveTab}
              onSelectIssue={handleSelectIssue}
              language={language}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView
              initialPrompt={initialPrompt}
              onClearInitialPrompt={() => setInitialPrompt('')}
              language={language}
            />
          )}

          {activeTab === 'laws' && <LawsView language={language} />}

          {activeTab === 'report' && (
            <ReportView setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'awareness' && <AwarenessView language={language} />}

          {activeTab === 'about' && <AboutView language={language} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#071328] text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-sm">CyberSaathi</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Dataset-First Indian Cyber Legal Guidance</span>
            </div>

            <div className="flex items-center space-x-6 text-slate-400">
              <button onClick={() => setActiveTab('laws')} className="hover:text-white transition-colors">
                Cyber Laws
              </button>
              <button onClick={() => setActiveTab('report')} className="hover:text-white transition-colors">
                1930 Helpline
              </button>
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                Disclaimer
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} CyberSaathi. Built for Indian digital safety and legal education.</p>
            <p>Official reporting portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">cybercrime.gov.in</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
