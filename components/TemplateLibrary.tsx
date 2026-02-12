
import React, { useState } from 'react';
import { LIBRARY_TEMPLATES } from '../constants';
import { LibraryTemplate } from '../types';

interface TemplateLibraryProps {
  onUseTemplate: (structure: string) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onUseTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Life Insurance', 'Annuities', 'Legacy & Estate', 'Business Protection'];

  const filteredTemplates = LIBRARY_TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Strategy Library</h1>
          <p className="text-slate-500 font-medium">Professional concepts for Life Insurance & Annuity positioning.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <i className="fa-solid fa-book-open text-[#c5a059]"></i>
          <span className="text-sm font-bold text-slate-700">{LIBRARY_TEMPLATES.length} Proven Strategies</span>
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search by product, benefit, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#c5a059] outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' 
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(t => (
          <div 
            key={t.id} 
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col overflow-hidden"
          >
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-[#c5a059] bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/10">
                  {t.subCategory}
                </span>
                <i className={`fa-solid ${
                  t.category === 'Life Insurance' ? 'fa-shield-heart' : 
                  t.category === 'Annuities' ? 'fa-chart-line' : 'fa-vault'
                } text-slate-200 group-hover:text-[#c5a059] transition-colors`}></i>
              </div>
              
              <div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#c5a059] transition-colors leading-tight">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-code-branch"></i> Logic Structure
                </p>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {t.structure}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {t.hashtags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold text-slate-400">#{tag}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onUseTemplate(t.structure)}
              className="w-full bg-slate-900 text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-[#c5a059] transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-pen-nib"></i>
              Send to Content Architect
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <i className="fa-solid fa-box-open text-4xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">No results found</h3>
            <p className="text-slate-400">Try adjusting your filters or search terms.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
