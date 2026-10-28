import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { AwarenessItem, Language } from '../types';

interface AwarenessViewProps {
  language: Language;
}

export const AwarenessView: React.FC<AwarenessViewProps> = ({ language }) => {
  const [guides, setGuides] = useState<AwarenessItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/awareness')
      .then((res) => res.json())
      .then((data) => setGuides(data))
      .catch((err) => console.error('Failed to load awareness articles:', err));
  }, []);

  const categories = [
    'All',
    'Phishing',
    'Online Payments',
    'Social Media',
    'Privacy',
    'Safe Practices',
  ];

  const filteredGuides = guides.filter((g) => {
    return activeCategory === 'All' || g.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'te' ? 'సైబర్ క్రైమ్ అవగాహన' : 'Cybercrime Awareness'}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl">
          {language === 'te'
            ? 'సరళమైన మరియు ఆచరణాత్మక చిట్కాలతో ఆన్‌లైన్‌లో ఎలా సురక్షితంగా ఉండాలో తెలుసుకోండి.'
            : 'Learn how to stay safe online with simple, verified, and practical cybersecurity best practices.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                {guide.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{guide.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{guide.summary}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Key Safety Tips:</span>
              </p>
              <ul className="space-y-2">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
