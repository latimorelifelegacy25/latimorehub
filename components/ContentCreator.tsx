
import React, { useState, useEffect } from 'react';
import { generateSocialContent } from '../services/geminiService';
import { ContentIdea, ContentTemplate, SocialPost } from '../types';

const INITIAL_TEMPLATES: ContentTemplate[] = [
  {
    id: '0',
    name: 'Legacy Anchor',
    structure: 'Open with the concept that a legacy is what you leave IN someone. Discuss how life insurance secures this for future generations in Central PA.',
    icon: 'fa-anchor'
  },
  {
    id: '1',
    name: 'The Educational Hook',
    structure: 'Start with a surprising fact about life insurance, followed by 3 tips for young families, and end with a CTA to protect their legacy.',
    icon: 'fa-graduation-cap'
  },
  {
    id: '2',
    name: 'Legacy Storyteller',
    structure: 'Share a story about the importance of planning for the next generation. Focus on peace of mind and family protection.',
    icon: 'fa-book-open'
  }
];

interface ContentCreatorProps {
  onPostScheduled?: (post: SocialPost) => void;
  preFillTopic?: string | null;
  onClearPreFill?: () => void;
  scheduledPosts?: SocialPost[]; 
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ 
  onPostScheduled, 
  preFillTopic,
  onClearPreFill,
  scheduledPosts = []
}) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentIdea[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>(INITIAL_TEMPLATES);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [pendingIdx, setPendingIdx] = useState<number | null>(null);

  // Load user templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('latimore_user_templates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTemplates([...INITIAL_TEMPLATES, ...parsed]);
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  useEffect(() => {
    if (preFillTopic) {
      setTopic(preFillTopic);
      if (onClearPreFill) onClearPreFill();
    }
  }, [preFillTopic, onClearPreFill]);

  const saveNewTemplate = () => {
    if (!topic.trim() || !newTemplateName.trim()) return;
    
    const newTemplate: ContentTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      structure: topic,
      icon: 'fa-star'
    };
    
    const updatedUserTemplates = [...templates.filter(t => !INITIAL_TEMPLATES.find(it => it.id === t.id)), newTemplate];
    localStorage.setItem('latimore_user_templates', JSON.stringify(updatedUserTemplates));
    
    setTemplates([...INITIAL_TEMPLATES, ...updatedUserTemplates]);
    setNewTemplateName('');
    setShowSaveTemplateModal(false);
  };

  const deleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (INITIAL_TEMPLATES.find(t => t.id === id)) return; // Don't delete system templates

    const updatedUserTemplates = templates
      .filter(t => !INITIAL_TEMPLATES.find(it => it.id === t.id))
      .filter(t => t.id !== id);
    
    localStorage.setItem('latimore_user_templates', JSON.stringify(updatedUserTemplates));
    setTemplates([...INITIAL_TEMPLATES, ...updatedUserTemplates]);
  };

  const applyTemplate = (structure: string) => {
    setTopic(structure);
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const results = await generateSocialContent(topic, platform);
      setSuggestions(results.map((r: any) => ({
        ...r,
        scheduledDate: '',
        isScheduled: false,
        engagementScore: Math.floor(Math.random() * 20) + 75
      })));
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Generation failed. Add your Gemini API key in Settings → Integrations.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateScheduledDate = (index: number, date: string) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index].scheduledDate = date;
    
    if (date) {
      const hours = new Date(date).getHours();
      let bonus = 0;
      if ((hours >= 8 && hours <= 10) || (hours >= 18 && hours <= 20)) bonus = 12;
      newSuggestions[index].engagementScore = Math.floor(Math.random() * 10) + 78 + bonus;
    }
    
    setSuggestions(newSuggestions);
  };

  const setQuickDate = (index: number, type: 'tomorrow' | 'weekend' | 'prime') => {
    const date = new Date();
    if (type === 'tomorrow') {
      date.setDate(date.getDate() + 1);
      date.setHours(9, 30, 0, 0);
    } else if (type === 'weekend') {
      const day = date.getDay();
      const diff = (6 - day + 7) % 7 || 7; 
      date.setDate(date.getDate() + diff);
      date.setHours(11, 0, 0, 0);
    } else if (type === 'prime') {
      date.setDate(date.getDate() + 2); 
      date.setHours(19, 45, 0, 0);
    }
    updateScheduledDate(index, date.toISOString().slice(0, 16));
  };

  const toggleSchedule = (index: number) => {
    const post = suggestions[index];
    if (post.isScheduled) {
      const newSuggestions = [...suggestions];
      newSuggestions[index].isScheduled = false;
      setSuggestions(newSuggestions);
      return;
    }
    if (!post.scheduledDate) {
      alert("Jackson, we need a specific release protocol (date/time) before we can lock this in.");
      return;
    }
    setPendingIdx(index);
    setShowConfirmModal(true);
  };

  const confirmSchedule = () => {
    if (pendingIdx !== null) {
      const newSuggestions = [...suggestions];
      const idea = newSuggestions[pendingIdx];
      idea.isScheduled = true;
      setSuggestions(newSuggestions);

      const newPost: SocialPost = {
        id: Math.random().toString(36).substr(2, 9),
        content: idea.draft,
        platform: idea.platform.toLowerCase() as any,
        status: 'scheduled',
        scheduledDate: idea.scheduledDate,
        engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 }
      };

      if (onPostScheduled) {
        onPostScheduled(newPost);
      }
    }
    setShowConfirmModal(false);
    setPendingIdx(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingPosts = scheduledPosts
    .sort((a, b) => new Date(a.scheduledDate || '').getTime() - new Date(b.scheduledDate || '').getTime())
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn relative">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content Architect</h1>
              <p className="text-slate-500 font-medium tracking-wide">Building educational bridges to the community.</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => { setTopic('The importance of securing legacy through life insurance'); setPlatform('LinkedIn'); }}
                 className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
               >
                 <i className="fa-solid fa-bolt"></i>
                 Quick: Legacy Protection
               </button>
            </div>
          </header>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <i className="fa-solid fa-clone text-[#c5a059]"></i> Strategy Blueprints
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {templates.map(t => {
                const isSystem = INITIAL_TEMPLATES.find(it => it.id === t.id);
                return (
                  <div key={t.id} className="flex-shrink-0 relative bg-white border border-slate-200 rounded-2xl hover:border-[#c5a059] hover:shadow-xl transition-all w-64 group overflow-hidden">
                    <button onClick={() => applyTemplate(t.structure)} className="w-full p-5 text-left h-full flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isSystem ? 'bg-slate-50 text-[#c5a059]' : 'bg-[#c5a059]/10 text-[#c5a059]'}`}>
                            <i className={`fa-solid ${t.icon}`}></i>
                          </div>
                          <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{t.name}</h4>
                        </div>
                        {!isSystem && (
                          <button 
                            onClick={(e) => deleteTemplate(t.id, e)}
                            className="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white flex items-center justify-center"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">"{t.structure}"</p>
                    </button>
                  </div>
                );
              })}
              <button 
                onClick={() => setShowSaveTemplateModal(true)} 
                disabled={!topic.trim()} 
                className="flex-shrink-0 border-2 border-dashed border-slate-200 p-5 rounded-2xl hover:border-[#c5a059] hover:text-[#c5a059] transition-all flex flex-col items-center justify-center w-64 text-slate-400 bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-plus text-lg mb-2"></i>
                <span className="text-xs font-bold uppercase tracking-wider">Save Strategy as Template</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">Strategy Instructions</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Tell me the educational hook you want to explore..."
                  className="w-full px-8 py-6 rounded-[2.5rem] bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#c5a059]/10 outline-none transition-all resize-none h-56 text-sm font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Release Channel</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-black text-xs text-slate-800 uppercase tracking-widest cursor-pointer outline-none">
                    <option>LinkedIn</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                  </select>
                </div>
                <button onClick={handleGenerate} disabled={isGenerating || !topic} className="mt-6 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-[#c5a059] shadow-2xl shadow-slate-900/10 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all">
                  {isGenerating ? <i className="fa-solid fa-gear fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  {isGenerating ? "Mapping Protocols..." : "Architect Drafts"}
                </button>
              </div>
            </div>

            <div className="md:w-1/3 bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 space-y-8">
                <h3 className="text-[10px] font-black uppercase text-[#c5a059] tracking-[0.3em]">Quality Protocol</h3>
                <ul className="space-y-8 text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                  <li className="flex gap-4"><i className="fa-solid fa-check text-[#c5a059]"></i> Educational Depth</li>
                  <li className="flex gap-4"><i className="fa-solid fa-check text-[#c5a059]"></i> Regional Relevance</li>
                  <li className="flex gap-4"><i className="fa-solid fa-check text-[#c5a059]"></i> Legacy First</li>
                </ul>
              </div>
              <i className="fa-solid fa-shield-heart absolute top-0 right-0 p-10 text-[180px] opacity-5"></i>
            </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Planned Beats</h3>
                <i className="fa-solid fa-heart-pulse text-[#c5a059] animate-pulse"></i>
             </div>
             <div className="space-y-4">
                {upcomingPosts.length > 0 ? upcomingPosts.map(post => (
                  <div key={post.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-3 group hover:border-[#c5a059] transition-all">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-slate-400">{post.platform}</span>
                        <span className="text-[9px] font-black text-[#c5a059]">{formatDate(post.scheduledDate || '')}</span>
                     </div>
                     <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed italic font-bold">"{post.content}"</p>
                  </div>
                )) : (
                  <div className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-3xl">No Active Beats</div>
                )}
             </div>
             <button onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'calendar' }))} className="w-full mt-8 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Full Timeline</button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp">
          {suggestions.map((item, idx) => (
            <div key={idx} className={`bg-white p-10 rounded-[3rem] shadow-sm border-2 transition-all group ${item.isScheduled ? 'border-[#c5a059] ring-8 ring-[#c5a059]/5' : 'border-slate-50'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase text-[#c5a059] tracking-widest">{item.platform} Blueprint</span>
                   <h4 className="font-black text-slate-900 text-xl tracking-tight line-clamp-1">{item.title}</h4>
                </div>
                {item.engagementScore && (
                  <div className={`px-3 py-2 rounded-xl flex flex-col items-center shadow-inner ${item.engagementScore > 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                     <span className="text-sm font-black">{item.engagementScore}%</span>
                     <span className="text-[8px] font-black uppercase tracking-tighter">Impact</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-10 flex-1 italic font-medium">"{item.draft}"</p>

              <div className="space-y-8 pt-8 border-t border-slate-50">
                {!item.isScheduled && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Date</label>
                      <button onClick={() => setQuickDate(idx, 'tomorrow')} className="text-[9px] font-black text-indigo-500 flex items-center gap-1.5 hover:underline bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                        <i className="fa-solid fa-bolt"></i> Peak Tomorrow
                      </button>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {['tomorrow', 'weekend', 'prime'].map(t => (
                        <button key={t} onClick={() => setQuickDate(idx, t as any)} className="text-[10px] font-black text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 hover:border-[#c5a059] transition-all uppercase whitespace-nowrap">
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input 
                        type="datetime-local" 
                        value={item.scheduledDate}
                        onChange={(e) => updateScheduledDate(idx, e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 font-black text-slate-700 outline-none focus:ring-4 focus:ring-[#c5a059]/10 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                )}
                
                <button onClick={() => toggleSchedule(idx)} className={`w-full py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl ${item.isScheduled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-[#c5a059]'}`}>
                  {item.isScheduled ? <><i className="fa-solid fa-check mr-2"></i> Sequence Locked</> : <><i className="fa-solid fa-calendar-check mr-2"></i> Commit to Timeline</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] p-12 max-w-md w-full shadow-2xl animate-slideUp border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Save Strategy</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Give this post structure a name to use it again later.</p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Blueprint Name</label>
                <input 
                  type="text" 
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Mortgage Protection Monthly"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#c5a059] outline-none font-bold text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={saveNewTemplate}
                  disabled={!newTemplateName.trim()}
                  className="w-full py-5 rounded-[1.5rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 disabled:opacity-50"
                >
                  Save to Hub
                </button>
                <button 
                  onClick={() => setShowSaveTemplateModal(false)}
                  className="w-full py-4 font-black text-[10px] text-slate-400 uppercase hover:text-rose-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && pendingIdx !== null && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[150] flex items-center justify-center p-6">
          <div className="bg-white rounded-[4rem] p-16 max-w-lg w-full shadow-2xl animate-slideUp border border-slate-100 text-center">
            <div className="w-24 h-24 bg-[#c5a059]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
              <i className="fa-solid fa-shield-heart text-[#c5a059] text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Strategic Authorization</h2>
            <p className="text-slate-500 text-sm mb-12 leading-relaxed font-bold">Jackson, are you ready to release this legacy blueprint into the community heartbeat?</p>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-12 border border-slate-100 shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Target release Protocol</span>
              <p className="text-slate-900 font-black text-2xl tracking-tight">{formatDate(suggestions[pendingIdx].scheduledDate || '')}</p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={confirmSchedule} className="w-full py-6 rounded-[2rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20">Lock Sequence</button>
              <button onClick={() => { setShowConfirmModal(false); setPendingIdx(null); }} className="w-full py-5 font-black text-[10px] text-slate-400 uppercase hover:text-rose-500 transition-colors">Abort Mission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;
