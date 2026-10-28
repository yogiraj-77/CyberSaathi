import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Plus,
  Trash2,
  Paperclip,
  Mic,
  Copy,
  Check,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  PhoneCall,
  Scale,
} from 'lucide-react';
import { ChatMessage, ChatResponse, Language } from '../types';

interface AssistantViewProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  language: Language;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'te'
          ? 'నమస్కారం! నేను సైబర్‌సాథీ AI అసిస్టెంట్. సైబర్ నేరాల పరిస్థితులను అర్థం చేసుకోవడంలో మరియు భారతీయ చట్టాల ఆధారంగా చట్టపరమైన మార్గదర్శకత్వం అందించడంలో నేను మీకు సహాయపడతాను. మీరు మీ సమస్యను వివరించవచ్చు.'
          : "I'm here to help you understand cybercrime situations and provide legal guidance based on Indian laws. You can describe your issue in simple language.",
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick suggestion chips
  const suggestionChips = [
    {
      en: 'Someone transferred money from my bank account via UPI without permission',
      te: 'నా అనుమతి లేకుండా నా బ్యాంక్ ఖాతా నుండి UPI ద్వారా డబ్బు తీసివేయబడింది',
      labelEn: 'UPI unauthorized deduction',
      labelTe: 'UPI అనధికార తగ్గింపు',
    },
    {
      en: 'I clicked on a phishing link and shared my OTP/credentials',
      te: 'నేను ఫిషింగ్ లింక్‌పై క్లిక్ చేసి OTP ఇచ్చాను',
      labelEn: 'I clicked a phishing link',
      labelTe: 'ఫిషింగ్ లింక్ క్లిక్ చేసాను',
    },
    {
      en: 'My Instagram/social media account was hacked and impersonated',
      te: 'నా ఇన్‌స్టాగ్రామ్ ఖాతా హ్యాక్ చేయబడింది',
      labelEn: 'My Instagram is hacked',
      labelTe: 'ఇన్‌స్టాగ్రామ్ హ్యాక్ అయ్యింది',
    },
    {
      en: 'I received a fake job offer on Telegram asking for registration fee',
      te: 'టెలిగ్రామ్‌లో నకిలీ ఉద్యోగ ఆఫర్ వచ్చింది',
      labelEn: 'Fake job offer scam',
      labelTe: 'నకిలీ ఉద్యోగ మోసం',
    },
  ];

  // Auto-send or prefill if initial prompt is passed from home
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: `saathi-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseMeta: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'te'
            ? 'క్షమించండి, ప్రతిస్పందనను రూపొందించడంలో లోపం ఏర్పడింది. దయచేసి జాతీయ సైబర్‌క్రైమ్ హెల్ప్‌లైన్ 1930 లేదా https://cybercrime.gov.in/ ను సంప్రదించండి.'
            : 'Unable to connect to the legal reasoning engine. If you are experiencing ongoing cyber fraud, please call 1930 immediately or visit https://cybercrime.gov.in/',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSourceExpand = (id: string) => {
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          language === 'te'
            ? 'కొత్త సంభాషణ ప్రారంభించబడింది. మీ చట్టపరమైన ప్రశ్నను అడగండి.'
            : 'New consultation started. Please describe your cyber legal situation.',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[580px]">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 justify-between">
          <div className="space-y-4">
            <button
              onClick={clearChat}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'te' ? 'కొత్త చాట్' : '+ New Chat'}</span>
            </button>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                {language === 'te' ? 'సాధారణ ఉదాహరణలు' : 'Recent Topics'}
              </p>
              <div className="space-y-1">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip[language])}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors truncate block"
                  >
                    {language === 'te' ? chip.labelTe : chip.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Helpline 1930</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Financial cyber fraud? Report within the golden hour to freeze funds.
              </p>
            </div>

            <button
              onClick={clearChat}
              className="w-full py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'అన్నీ క్లియర్ చేయండి' : 'Clear All'}</span>
            </button>
          </div>
        </aside>

        {/* Chat Main Window */}
        <main className="flex-1 flex flex-col bg-slate-50/50">
          {/* Assistant Header */}
          <div className="py-3 px-6 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">CyberSaathi AI Assistant</h2>
                <p className="text-[11px] text-slate-500">
                  {language === 'te'
                    ? 'భారతీయ చట్టాల ఆధారిత మార్గదర్శకత్వం (Dataset-First Engine)'
                    : 'Dataset-First Indian Legal Guidance Engine'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>FTS5 Search Active</span>
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const meta = msg.responseMeta;
              const isDatasetMatch = meta?.answer_source === 'dataset_summary';
              const isFallback = meta?.answer_source === 'gemini_fallback';
              const hasSources = meta?.sources && meta.sources.length > 0;
              const isSourcesExpanded = expandedSources[msg.id];

              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] sm:max-w-[80%] space-y-2`}>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-700">
                        {isUser ? 'You' : 'CyberSaathi AI'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>

                      {/* Source Provenance Badge */}
                      {!isUser && isDatasetMatch && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                          <BookOpen className="w-3 h-3" />
                          <span>Verified Indian Legal Dataset</span>
                        </span>
                      )}

                      {!isUser && isFallback && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>AI General Guidance Fallback</span>
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-4 sm:p-5 rounded-2xl shadow-sm leading-relaxed text-sm ${
                        isUser
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>

                      {/* Fallback Notice Box if Applicable */}
                      {!isUser && isFallback && meta?.fallback_notice && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs">
                          {meta.fallback_notice}
                        </div>
                      )}

                      {/* Expandable Document Metadata Sources */}
                      {!isUser && hasSources && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => toggleSourceExpand(msg.id)}
                            className="flex items-center space-x-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>
                              {isSourcesExpanded
                                ? 'Hide Statutory Citations'
                                : `View ${meta.sources.length} Statutory Citations`}
                            </span>
                            {isSourcesExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isSourcesExpanded && (
                            <div className="mt-2.5 space-y-2">
                              {meta.sources.map((src, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                                >
                                  <p className="font-semibold text-slate-800">{src.title}</p>
                                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-200/60 font-medium">
                                      {src.document_type || 'Act'}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-200/60 font-medium">
                                      {src.jurisdiction || 'Central'}
                                    </span>
                                    {src.issue_date && (
                                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 font-medium">
                                        Date: {src.issue_date}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-mono truncate">
                                    ID: {src.doc_id}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Actions */}
                      {!isUser && (
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                          <p className="text-[10px] italic max-w-sm text-slate-400">
                            Educational guidance only. Not official legal representation.
                          </p>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex items-center space-x-1"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">
                              {copiedId === msg.id ? 'Copied' : 'Copy'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-bl-none shadow-sm flex items-center space-x-3 text-slate-600 text-sm">
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                  <span>{language === 'te' ? 'సమాధానం రూపొందించబడుతోంది...' : 'Generating response...'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips (above input) */}
          <div className="px-4 py-2 border-t border-slate-100 flex overflow-x-auto space-x-2 bg-white">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip[language])}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition-colors font-medium flex-shrink-0"
              >
                {language === 'te' ? chip.labelTe : chip.labelEn}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'te'
                      ? 'మీ సైబర్ నేరం లేదా చట్టపరమైన ప్రశ్నను ఇక్కడ వివరించండి...'
                      : 'Type your cyber legal question or situation here...'
                  }
                  className="w-full py-3 pl-4 pr-20 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900 transition-all"
                  disabled={isLoading}
                />
                <div className="absolute right-2.5 flex items-center space-x-1 text-slate-400">
                  <button
                    type="button"
                    title="Attach evidence screenshot"
                    className="p-1.5 rounded-lg hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Voice input"
                    className="p-1.5 rounded-lg hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-semibold shadow-md transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
