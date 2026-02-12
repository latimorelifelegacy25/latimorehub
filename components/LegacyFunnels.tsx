
import React, { useState, useEffect } from 'react';
import { generateFunnelStrategy } from '../services/geminiService';
import { Funnel, FunnelStage } from '../types';
import { FUNNEL_BLUEPRINTS, LANDING_PAGE_BLUEPRINTS, FORM_BLUEPRINTS } from '../constants';

type HubView = 'Active' | 'FunnelDB' | 'LandingDB' | 'FormDB';

const LegacyFunnels: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [goal, setGoal] = useState('');
  const [persona, setPersona] = useState('Young Families');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [activeHubView, setActiveHubView] = useState<HubView>('Active');
  const [activeFunnel, setActiveFunnel] = useState<Funnel | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);

  // Load funnels from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('latimore_legacy_funnels');
    if (saved) {
      try {
        setFunnels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved funnels", e);
      }
    }
  }, []);

  // Save funnels to local storage on change
  useEffect(() => {
    localStorage.setItem('latimore_legacy_funnels', JSON.stringify(funnels));
  }, [funnels]);

  const handleLaunchArchitect = async () => {
    if (!goal.trim()) return;
    setIsArchitecting(true);
    
    try {
      const strategyStages = await generateFunnelStrategy(goal, persona);
      
      const newFunnel: Funnel = {
        id: Math.random().toString(36).substr(2, 9),
        name: goal.length > 30 ? goal.substring(0, 27) + '...' : goal,
        goal,
        persona,
        stages: strategyStages,
        status: 'Draft'
      };

      setFunnels([newFunnel, ...funnels]);
      setActiveFunnel(newFunnel);
      setShowPromptModal(false);
      setGoal(''); 
    } catch (error) {
      console.error("Failed to architect funnel:", error);
      const msg = (error as any)?.message;
      alert(msg || "Jackson, I hit a snag engineering that strategy. Add your Gemini API key in Settings → Integrations.");
    } finally {
      setIsArchitecting(false);
    }
  };

  const deleteFunnel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Jackson, are you sure you want to retire this strategy protocol?")) {
      setFunnels(funnels.filter(f => f.id !== id));
      if (activeFunnel?.id === id) setActiveFunnel(null);
    }
  };

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFunnels(funnels.map(f => 
      f.id === id ? { ...f, status: f.status === 'Draft' ? 'Active' : 'Draft' } : f
    ));
  };

  const HubNav = () => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit mb-8">
      {[
        { id: 'Active', label: 'Strategy Board', icon: 'fa-heart-pulse' },
        { id: 'FunnelDB', label: 'Blueprints', icon: 'fa-route' },
        { id: 'LandingDB', label: 'Pages', icon: 'fa-browser' },
        { id: 'FormDB', label: 'Forms', icon: 'fa-list-check' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => { setActiveHubView(tab.id as HubView); setActiveFunnel(null); }}
          className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
            activeHubView === tab.id ? 'bg-[#c5a059] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className={`fa-solid ${tab.icon}`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 relative">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legacy Conversion Hub</h1>
          <p className="text-slate-500 font-medium">Persistent infrastructure for regional protection sequences.</p>
        </div>
        <button 
          onClick={() => setShowPromptModal(true)}
          className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#c5a059] transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10 group"
        >
          <i className="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i>
          Architect Strategy
        </button>
      </header>

      <HubNav />

      {activeFunnel ? (
        <div className="space-y-8 animate-slideUp">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setActiveFunnel(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                          <i className="fa-solid fa-arrow-left"></i>
                       </button>
                       <div>
                          <h2 className="text-2xl font-black tracking-tight">{activeFunnel.name}</h2>
                          <p className="text-xs font-bold text-[#c5a059] uppercase tracking-[0.2em]">{activeFunnel.persona} Journey</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                          onClick={(e) => deleteFunnel(activeFunnel.id, e)}
                          className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                       >
                          Retire Protocol
                       </button>
                       <button 
                          onClick={(e) => toggleStatus(activeFunnel.id, e)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeFunnel.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-[#c5a059] text-white'
                          }`}
                       >
                          {activeFunnel.status === 'Active' ? 'Deployment Active' : 'Commit to Production'}
                       </button>
                    </div>
                 </div>
                 <div className="flex gap-8 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                          <i className="fa-solid fa-crosshairs"></i>
                       </div>
                       <span className="text-sm font-bold text-slate-300">Goal: {activeFunnel.goal}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                          <i className="fa-solid fa-map"></i>
                       </div>
                       <span className="text-sm font-bold text-slate-300">Region: Central PA</span>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                 <i className="fa-solid fa-funnel-dollar text-[140px]"></i>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              {activeFunnel.stages.map((stage, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg relative z-10 flex flex-col gap-6 hover:translate-y-[-8px] transition-all">
                    <div className="flex justify-between items-center">
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-xl shadow-slate-900/10">
                          {i + 1}
                       </div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stage.name} Phase</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-[#c5a059] uppercase tracking-widest mb-3">Strategy Protocol</h4>
                       <p className="text-xs text-slate-600 font-medium leading-relaxed italic border-l-2 border-[#c5a059] pl-3">{stage.strategy}</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Asset Copy Draft</h4>
                       <p className="text-[11px] text-slate-800 leading-relaxed font-bold whitespace-pre-wrap">{stage.assetCopy}</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                          onClick={() => navigator.clipboard.writeText(stage.assetCopy)}
                          className="flex-1 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                       >
                          Copy Asset
                       </button>
                       <button className="flex-1 py-3 rounded-xl bg-slate-100 text-[#c5a059] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Export PDF</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fadeIn">
          {activeHubView === 'Active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funnels.length === 0 ? (
                <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <i className="fa-solid fa-heart-pulse text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Active Conversions</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs">Launch the Strategy Architect to map a new protection sequence.</p>
                  <button 
                    onClick={() => setShowPromptModal(true)}
                    className="mt-8 bg-[#c5a059] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all shadow-xl shadow-[#c5a059]/20"
                  >
                    Launch Architect
                  </button>
                </div>
              ) : (
                funnels.map(funnel => (
                  <div key={funnel.id} onClick={() => setActiveFunnel(funnel)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-6 relative">
                    <div className="flex justify-between items-center">
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:bg-[#c5a059] transition-colors">
                          <i className="fa-solid fa-route"></i>
                       </div>
                       <div className="flex gap-1.5">
                          <button 
                            onClick={(e) => deleteFunnel(funnel.id, e)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white flex items-center justify-center"
                          >
                             <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                          <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border tracking-widest ${
                            funnel.status === 'Active' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'
                          }`}>
                            {funnel.status}
                          </span>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 group-hover:text-[#c5a059] transition-colors tracking-tight line-clamp-1">{funnel.name}</h3>
                       <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em] mt-2">{funnel.persona} Focus</p>
                    </div>
                    <div className="flex -space-x-3 mt-4">
                       {funnel.stages.map((_, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }}>{i+1}</div>
                       ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeHubView === 'FunnelDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
               {FUNNEL_BLUEPRINTS.map(blueprint => (
                 <div key={blueprint.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6 group">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-[#c5a059] bg-[#c5a059]/5 px-3 py-1 rounded-full border border-[#c5a059]/10 tracking-widest">{blueprint.category}</span>
                       <i className="fa-solid fa-route text-slate-200 group-hover:text-[#c5a059] transition-colors"></i>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">{blueprint.name}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed italic">"{blueprint.description}"</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Persona</p>
                       <p className="text-xs font-bold text-slate-800">{blueprint.persona}</p>
                    </div>
                    <button 
                      onClick={() => { setGoal(blueprint.name); setPersona(blueprint.persona); setShowPromptModal(true); }} 
                      className="mt-4 w-full py-4 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all"
                    >
                      Initialize Blueprint
                    </button>
                 </div>
               ))}
            </div>
          )}

          {activeHubView === 'LandingDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
               {LANDING_PAGE_BLUEPRINTS.map(blueprint => (
                 <div key={blueprint.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6 group">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 tracking-widest">{blueprint.category}</span>
                       <i className="fa-solid fa-browser text-slate-200 group-hover:text-blue-500 transition-colors"></i>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">{blueprint.name}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{blueprint.description}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Layout Architecture</p>
                       <ul className="space-y-1">
                          {blueprint.sections.map((s, i) => (
                            <li key={i} className="text-[10px] font-bold text-slate-600 flex items-center gap-2"><i className="fa-solid fa-check text-[#c5a059] text-[8px]"></i> {s}</li>
                          ))}
                       </ul>
                    </div>
                    <button className="mt-4 w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Configure Design</button>
                 </div>
               ))}
            </div>
          )}

          {activeHubView === 'FormDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
               {FORM_BLUEPRINTS.map(blueprint => (
                 <div key={blueprint.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6 group">
                    <div className="flex justify-between items-center">
                       <i className="fa-solid fa-list-check text-slate-200 group-hover:text-emerald-500 transition-colors"></i>
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{blueprint.fields.length} Fields</span>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">{blueprint.name}</h3>
                       <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed italic">"{blueprint.description}"</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                       {blueprint.fields.map((f, i) => (
                         <span key={i} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{f}</span>
                       ))}
                    </div>
                    <button className="mt-4 w-full py-4 rounded-2xl border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all">Preview Fields</button>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}

      {/* Strategy Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[150] flex items-center justify-center p-6">
          <div className="bg-white rounded-[4rem] p-12 max-w-2xl w-full shadow-2xl animate-slideUp border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 -z-10">
                <i className="fa-solid fa-wand-magic-sparkles text-[200px] text-[#c5a059]"></i>
             </div>

             <div className="text-center space-y-3 mb-12">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-3xl mx-auto shadow-2xl mb-6">
                  <i className="fa-solid fa-brain-circuit text-[#c5a059]"></i>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Strategy Architect</h2>
                <p className="text-slate-500 font-medium italic">"Map a new legacy journey for our Central PA neighbors."</p>
             </div>

             <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-6">Strategic Objective</label>
                  <div className="relative">
                    <i className="fa-solid fa-crosshairs absolute left-8 top-1/2 -translate-y-1/2 text-[#c5a059]"></i>
                    <input 
                      type="text" 
                      autoFocus
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g., Secure 10 Mortgage Protection Reviews"
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] pl-16 pr-8 py-6 text-base font-bold focus:ring-4 focus:ring-[#c5a059]/10 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-6">Target Persona</label>
                  <div className="relative">
                    <i className="fa-solid fa-users absolute left-8 top-1/2 -translate-y-1/2 text-[#c5a059]"></i>
                    <select 
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] pl-16 pr-8 py-6 text-base font-bold focus:ring-4 focus:ring-[#c5a059]/10 outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option>Young Families</option>
                      <option>Pre-Retirees</option>
                      <option>School Administrators</option>
                      <option>Small Business Owners</option>
                      <option>Central PA Seniors</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <button 
                    onClick={handleLaunchArchitect}
                    disabled={isArchitecting || !goal.trim()}
                    className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#c5a059] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 disabled:opacity-50 group"
                  >
                    {isArchitecting ? (
                      <><i className="fa-solid fa-gear fa-spin"></i> Mapping Conversion Protocol...</>
                    ) : (
                      <><i className="fa-solid fa-rocket group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i> Launch Strategy Architect</>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowPromptModal(false)}
                    disabled={isArchitecting}
                    className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-rose-500 transition-colors"
                  >
                    Discard Draft
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegacyFunnels;
