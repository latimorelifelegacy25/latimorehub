
import React, { useState } from 'react';
import { Connector } from '../types';

const INITIAL_CONNECTORS: Connector[] = [
  // Agency / GFI
  { id: 'gfi', name: 'Global Financial Impact', description: 'GFI Enterprise Portal & Hierarchy Data', icon: 'fa-solid fa-building-shield', category: 'Agency', isConnected: true, lastSync: 'Real-time', color: 'bg-slate-900', brandColor: '#2C3E50' },
  
  // Carriers
  { id: 'nac', name: 'North American', description: 'IUL Underwriting & Builder Plus Sync', icon: 'fa-solid fa-shield-halved', category: 'Carrier', isConnected: true, lastSync: '10 mins ago', color: 'bg-blue-900', brandColor: '#004c8c' },
  { id: 'fg', name: 'F&G Annuities', description: 'Fixed Indexed Annuities & Income Advantage', icon: 'fa-solid fa-vault', category: 'Carrier', isConnected: false, color: 'bg-[#c5a059]', brandColor: '#c5a059' },
  { id: 'ethos', name: 'Ethos Velocity', description: 'Instant Decision Term Underwriting', icon: 'fa-solid fa-bolt-lightning', category: 'Carrier', isConnected: true, lastSync: 'Active', color: 'bg-emerald-600', brandColor: '#10b981' },
  { id: 'aig', name: 'American General', description: 'Broad Market Protection Products', icon: 'fa-solid fa-landmark', category: 'Carrier', isConnected: false, color: 'bg-indigo-700', brandColor: '#303f9f' },
  { id: 'aec', name: 'American Equity', description: 'Asset Preservation & FIA Portfolio', icon: 'fa-solid fa-coins', category: 'Carrier', isConnected: false, color: 'bg-amber-600', brandColor: '#d97706' },

  // Social
  { id: 'li', name: 'LinkedIn', description: 'B2B Strategy & Central PA Outreach', icon: 'fa-brands fa-linkedin', category: 'Social', isConnected: true, lastSync: '1 hour ago', color: 'bg-blue-800' },
  { id: 'fb', name: 'Facebook Business', description: 'Community Legacy Storytelling', icon: 'fa-brands fa-facebook', category: 'Social', isConnected: true, lastSync: '5 mins ago', color: 'bg-blue-600' },
];

const Connectors: React.FC = () => {
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [vaultModal, setVaultModal] = useState<Connector | null>(null);
  const [agentIdInput, setAgentIdInput] = useState('');

  const handleOpenVault = (connector: Connector) => {
    setAgentIdInput(connector.agentId || '');
    setVaultModal(connector);
  };

  const saveVaultCredentials = () => {
    if (!vaultModal) return;
    setConnectors(prev => prev.map(c => 
      c.id === vaultModal.id ? { ...c, isConnected: true, lastSync: 'Just now', agentId: agentIdInput } : c
    ));
    setVaultModal(null);
  };

  const toggleConnection = (id: string) => {
    setConnectors(prev => prev.map(c => {
      if (c.id === id) {
        if (c.isConnected) return { ...c, isConnected: false, lastSync: undefined, agentId: undefined };
        return c; // If connecting, we open vault modal instead
      }
      return c;
    }));
  };

  const runSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setConnectors(prev => prev.map(c => c.id === id ? { ...c, lastSync: 'Just now' } : c));
    }, 2000);
  };

  const categories = ['Agency', 'Carrier', 'Social'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Integrations</h1>
          <p className="text-slate-500 font-medium tracking-wide mt-2">Connecting Latimore Life & Legacy to GFI and elite insurance carriers.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-sm">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Carrier Grid Synchronized
           </div>
        </div>
      </header>

      {categories.map(cat => (
        <section key={cat} className="space-y-6">
           <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{cat} Protocols</h2>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectors.filter(c => c.category === cat).map((connector) => (
                <div key={connector.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                   <div className="p-8 flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                         <div 
                           className={`w-16 h-16 rounded-[1.5rem] ${connector.color} flex items-center justify-center text-white text-3xl shadow-2xl shadow-slate-200 transition-transform group-hover:scale-110 duration-500`}
                           style={connector.brandColor ? { backgroundColor: connector.brandColor } : {}}
                         >
                            <i className={connector.icon}></i>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                              connector.isConnected 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                               {connector.isConnected ? 'Active' : 'Disconnected'}
                            </span>
                            {connector.lastSync && (
                              <span className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                                <i className="fa-solid fa-clock-rotate-left mr-1"></i> {connector.lastSync}
                              </span>
                            )}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-slate-900 tracking-tight">{connector.name}</h3>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed">{connector.description}</p>
                      </div>

                      {connector.agentId && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent ID</span>
                           <span className="text-xs font-black text-slate-700">{connector.agentId}</span>
                        </div>
                      )}
                   </div>

                   <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                      {connector.isConnected ? (
                        <>
                          <button 
                            onClick={() => toggleConnection(connector.id)}
                            className="flex-1 py-3.5 rounded-xl bg-white text-rose-500 border border-rose-100 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                          >
                            Disconnect
                          </button>
                          <button 
                            onClick={() => runSync(connector.id)}
                            disabled={syncingId === connector.id}
                            className="w-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#c5a059] transition-all shadow-sm"
                          >
                            <i className={`fa-solid fa-rotate ${syncingId === connector.id ? 'fa-spin text-[#c5a059]' : ''}`}></i>
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleOpenVault(connector)}
                          className="w-full py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] shadow-xl shadow-slate-900/10 transition-all"
                        >
                          Establish Protocol
                        </button>
                      )}
                   </div>
                </div>
              ))}
              
              {cat === 'Carrier' && (
                <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/20 group hover:border-[#c5a059] transition-all cursor-pointer">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 group-hover:text-[#c5a059] transition-colors shadow-inner">
                      <i className="fa-solid fa-plus text-2xl"></i>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Add Carrier</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">Request custom API hook for additional life or annuity providers.</p>
                   </div>
                </div>
              )}
           </div>
        </section>
      ))}

      {/* Authorization Vault Modal */}
      {vaultModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3.5rem] p-12 max-w-md w-full shadow-2xl animate-slideUp border border-slate-100 text-center">
              <div 
                className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl text-white text-4xl ${vaultModal.color}`}
                style={vaultModal.brandColor ? { backgroundColor: vaultModal.brandColor } : {}}
              >
                 <i className={vaultModal.icon}></i>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">Authorize {vaultModal.name}</h2>
              <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">
                 Enter your Agent Credentials to synchronize your {vaultModal.name} contract data with the Latimore Legacy Hub.
              </p>

              <div className="space-y-6 text-left">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Agent / Producer ID</label>
                    <input 
                      type="text" 
                      value={agentIdInput}
                      onChange={(e) => setAgentIdInput(e.target.value)}
                      placeholder="e.g. 1029485"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#c5a059] outline-none font-bold text-slate-800"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Enterprise Access Key (NIPR)</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#c5a059] outline-none font-bold text-slate-800"
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-3 mt-10">
                 <button 
                   onClick={saveVaultCredentials}
                   className="w-full py-5 rounded-[1.5rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20"
                 >
                    Establish Secure Link
                 </button>
                 <button 
                   onClick={() => setVaultModal(null)}
                   className="w-full py-4 font-black text-[10px] text-slate-400 uppercase hover:text-rose-500 transition-colors"
                 >
                    Cancel Protocol
                 </button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-3">
                 <i className="fa-solid fa-lock text-slate-300 text-xs"></i>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Enterprise-Grade Encryption Active</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Connectors;
