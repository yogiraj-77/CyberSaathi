import React, { useState, useEffect } from 'react';
import { Search, Scale, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { LawItem, Language } from '../types';

interface LawsViewProps {
  language: Language;
}

export const LawsView: React.FC<LawsViewProps> = ({ language }) => {
  const [laws, setLaws] = useState<LawItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedLaw, setSelectedLaw] = useState<LawItem | null>(null);

  useEffect(() => {
    fetch('/api/laws')
      .then((res) => res.json())
      .then((data) => setLaws(data))
      .catch((err) => console.error('Failed to load cyber laws:', err));
  }, []);

  const categories = [
    'All',
    'Information Technology Act',
    'Bharatiya Nyaya Sanhita',
    'Privacy & Data Protection',
  ];

  const filteredLaws = laws.filter((law) => {
    const matchesCategory =
      activeCategory === 'All' || law.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      law.section.toLowerCase().includes(search.toLowerCase()) ||
      law.title.toLowerCase().includes(search.toLowerCase()) ||
      law.description.toLowerCase().includes(search.toLowerCase()) ||
      law.act.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'te' ? 'భారతీయ సైబర్ చట్టాలు' : 'Indian Cyber Laws'}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl">
          {language === 'te'
            ? 'ముఖ్యమైన సైబర్ చట్టాలు, నిబంధనలు మరియు శిక్షలను సరళమైన వివరణలతో అన్వేషించండి.'
            : 'Explore important cyber laws, legal definitions, and statutory penalties with simple, structured explanations.'}
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'te'
                ? 'చట్టాలను శోధించండి (ఉదా: సెక్షన్ 66D, హ్యాకింగ్, మోసం...)'
                : 'Search laws (e.g., Section 66D, hacking, identity theft, cheating)...'
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
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
      </div>

      {/* Laws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLaws.map((law) => (
          <div
            key={law.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                    {law.section}
                  </span>
                  <p className="text-xs text-slate-500 font-medium mt-1">{law.act}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-sky-600">
                  <Scale className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{law.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{law.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight">
                  Penalty: {law.penalty}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="text-[11px] font-medium">{law.bailable}</span>
                <button
                  onClick={() => setSelectedLaw(law)}
                  className="text-sky-600 font-semibold hover:text-sky-700 flex items-center space-x-1"
                >
                  <span>Read Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLaws.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-700">No matching statutes found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or selecting 'All' categories.
          </p>
        </div>
      )}

      {/* Law Detail Modal */}
      {selectedLaw && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold">
                  {selectedLaw.section}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedLaw.title}</h3>
                <p className="text-xs text-slate-500">{selectedLaw.act}</p>
              </div>
              <button
                onClick={() => setSelectedLaw(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>{selectedLaw.description}</p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900">Punishment & Penalty:</span>
                <p className="text-amber-800">{selectedLaw.penalty}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800">Classification:</span>
                <p className="text-slate-600">{selectedLaw.bailable}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLaw(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
