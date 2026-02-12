import React, { useState, useMemo } from 'react';
import { MOCK_CLIENTS, PIPELINE_STAGES } from '../constants';
import { Client, PipelineStage, ProductType, County, LeadSource } from '../types';
import { generateClientSnapshot, generateReviewScript } from '../services/geminiService';
import { useLocalStorageState } from '../services/useLocalStorageState';

const CLIENT_STORAGE_KEY = 'latimore.clients.v1';
const CRM: React.FC = () => {
  const [clients, setClients] = useLocalStorageState<Client[]>(CLIENT_STORAGE_KEY, MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [reviewScript, setReviewScript] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'Pipeline' | 'List'>('Pipeline');
  
  // Add Client Modal State
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'None',
    household: '',
    notes: '',
    goals: []
  });

  // Action Tile Metrics
  const metrics = useMemo(() => {
    const newLeads = clients.filter(c => c.status === 'New Lead').length;
    const underwriting = clients.filter(c => c.status === 'Underwriting').length;
    const inForce = clients.filter(c => c.status === 'In Force + Review').length;
    const pendingCalls = clients.filter(c => c.status === 'Booked Call').length;
    return { newLeads, underwriting, inForce, pendingCalls };
  }, [clients]);

  const handleGenerateSnapshot = async (client: Client) => {
    setIsGeneratingSnapshot(true);
    try {
      const snapshot = await generateClientSnapshot(client.notes, client.household);
      if (snapshot) {
        const updatedClient = { ...client, snapshot };
        setClients(clients.map(c => c.id === client.id ? updatedClient : c));
        setSelectedClient(updatedClient);
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Snapshot failed. Add your Gemini API key in Settings → Integrations.');
    } finally {
      setIsGeneratingSnapshot(false);
    }
  };

  const handleGenerateReview = async (client: Client) => {
    setIsGeneratingReview(true);
    setReviewScript(null);
    try {
      const script = await generateReviewScript(client);
      setReviewScript(script);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Review script failed. Add your Gemini API key in Settings → Integrations.');
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      alert("Jackson, we need at least a name and email to establish a legacy file.");
      return;
    }
    
    const clientToAdd: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      status: newClient.status || 'New Lead',
      county: (newClient.county as County) || 'Schuylkill',
      leadSource: (newClient.leadSource as LeadSource) || 'Social',
      productInterest: (newClient.productInterest as ProductType) || 'None',
      household: newClient.household || '',
      lastInteraction: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      goals: newClient.goals || [],
      notes: newClient.notes || '',
      monthlyPremium: newClient.monthlyPremium
    };

    setClients([clientToAdd, ...clients]);
    setIsAddingClient(false);
    setNewClient({
      status: 'New Lead',
      county: 'Schuylkill',
      leadSource: 'Social',
      productInterest: 'None',
      household: '',
      notes: '',
      goals: []
    });
  };

  const getStatusStyle = (status: PipelineStage) => {
    switch (status) {
      case 'New Lead': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Underwriting': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Force + Review': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Lost / Not Proceeding': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateClientStatus = (clientId: string, newStatus: PipelineStage) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c);
    setClients(updated);
    if (selectedClient?.id === clientId) {
      setSelectedClient({ ...selectedClient, status: newStatus });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col pb-12">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Latimore Life Hub</h1>
          <p className="text-slate-500 font-medium">Protecting Today. Securing Tomorrow. Pennsylvania's Legacy System.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-200/50 p-1 rounded-xl flex">
            <button 
              onClick={() => setViewMode('Pipeline')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'Pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pipeline
            </button>
            <button 
              onClick={() => setViewMode('List')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'List' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              List
            </button>
          </div>
          <button 
            onClick={() => setIsAddingClient(true)}
            className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl hover:bg-[#c5a059] transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 text-sm"
          >
            <i className="fa-solid fa-plus"></i> New Life
          </button>
        </div>
      </header>

      {/* Action Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-star"></i>
             </div>
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Action Required</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.newLeads}</p>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Leads (72h)</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
             <div className="w-10 h-10 bg-[#c5a059]/10 rounded-xl flex items-center justify-center text-[#c5a059]">
                <i className="fa-solid fa-phone"></i>
             </div>
             <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Today</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.pendingCalls}</p>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Calls Scheduled</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
             <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <i className="fa-solid fa-file-signature"></i>
             </div>
             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending Carrier</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.underwriting}</p>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Underwriting</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <i className="fa-solid fa-heart-pulse"></i>
             </div>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">In Force</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.inForce}</p>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Policies Active</h3>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
          {viewMode === 'List' ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input 
                    type="text" 
                    placeholder="Search families by name, email, or county..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Family Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pipeline Stage</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product / Interest</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">County</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Premium</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredClients.map(client => (
                      <tr 
                        key={client.id} 
                        onClick={() => { setSelectedClient(client); setReviewScript(null); }}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-[#c5a059]/5' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{client.name}</span>
                            <span className="text-[11px] text-slate-400">{client.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">
                               {client.productInterest?.slice(0, 1)}
                             </div>
                             <span className="text-sm font-medium text-slate-700">{client.productInterest}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">{client.county}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-slate-900">{client.monthlyPremium ? `$${client.monthlyPremium}/mo` : '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{client.lastInteraction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex no-scrollbar bg-slate-50/50">
              {PIPELINE_STAGES.map(stage => {
                const stageClients = filteredClients.filter(c => c.status === stage);
                return (
                  <div key={stage} className="flex-shrink-0 w-80 border-r border-slate-200 flex flex-col">
                    <div className="p-4 bg-white border-b border-slate-200 sticky top-0 flex justify-between items-center z-10">
                      <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest line-clamp-1">{stage}</h4>
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">{stageClients.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
                      {stageClients.map(client => (
                        <div 
                          key={client.id}
                          onClick={() => { setSelectedClient(client); setReviewScript(null); }}
                          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer group shadow-sm hover:shadow-md hover:border-[#c5a059] ${selectedClient?.id === client.id ? 'border-[#c5a059] ring-2 ring-[#c5a059]/10' : 'border-slate-200'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">{client.name}</h5>
                            <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-[#c5a059]"></i>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{client.email}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{client.county}</span>
                            <span className="text-[9px] font-black uppercase bg-[#c5a059]/10 text-[#c5a059] px-2 py-0.5 rounded-lg">{client.productInterest}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                               <i className="fa-solid fa-calendar-alt"></i>
                               <span>{client.lastInteraction}</span>
                             </div>
                             {client.monthlyPremium && (
                               <span className="text-xs font-black text-slate-900">${client.monthlyPremium}</span>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl animate-slideUp border border-slate-100 flex flex-col h-[90vh]">
            <header className="flex justify-between items-center mb-8 shrink-0">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Establish New Life File</h2>
                  <p className="text-slate-500 text-sm font-medium">Capture family data for Schuylkill regional protection.</p>
               </div>
               <button onClick={() => setIsAddingClient(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                  <i className="fa-solid fa-times"></i>
               </button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                     <input type="text" value={newClient.name || ''} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                     <input type="email" value={newClient.email || ''} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none" placeholder="john@example.com" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                     <input type="tel" value={newClient.phone || ''} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none" placeholder="+1 555-000-0000" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">County</label>
                     <select value={newClient.county} onChange={e => setNewClient({...newClient, county: e.target.value as County})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none">
                        <option value="Schuylkill">Schuylkill</option>
                        <option value="Luzerne">Luzerne</option>
                        <option value="Northumberland">Northumberland</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Interest</label>
                     <select value={newClient.productInterest} onChange={e => setNewClient({...newClient, productInterest: e.target.value as ProductType})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none">
                        <option value="None">Discovery Phase</option>
                        <option value="Term">Term Life</option>
                        <option value="IUL">IUL (Wealth Building)</option>
                        <option value="FE">Final Expense</option>
                        <option value="FIA">Annuity (Safe Income)</option>
                        <option value="Whole Life">Whole Life</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Budget</label>
                     <input type="number" value={newClient.monthlyPremium || ''} onChange={e => setNewClient({...newClient, monthlyPremium: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none" placeholder="e.g. 50" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Household / Family Context</label>
                  <input type="text" value={newClient.household || ''} onChange={e => setNewClient({...newClient, household: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none" placeholder="e.g. Married, 2 kids" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discovery Notes</label>
                  <textarea value={newClient.notes || ''} onChange={e => setNewClient({...newClient, notes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none h-24 resize-none" placeholder="Enter key facts or emotional hooks..."></textarea>
               </div>
            </div>

            <footer className="pt-8 border-t border-slate-100 shrink-0">
               <button 
                  onClick={handleAddClient}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#c5a059] transition-all shadow-2xl shadow-slate-900/20"
               >
                  Commit to Life Hub
               </button>
            </footer>
          </div>
        </div>
      )}

      {/* Client Detail Side Panel / Modal Overlay */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-4xl bg-white h-screen shadow-2xl animate-slideLeft flex flex-col overflow-hidden border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedClient(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                    <i className="fa-solid fa-arrow-left"></i>
                 </button>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedClient.name}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedClient.status}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                {selectedClient.status === 'In Force + Review' && (
                  <button 
                    onClick={() => handleGenerateReview(selectedClient)}
                    disabled={isGeneratingReview}
                    className="bg-amber-50 text-amber-600 px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 border border-amber-100 hover:bg-amber-100 transition-all"
                  >
                    {isGeneratingReview ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-calendar-check"></i>}
                    Strategic Review
                  </button>
                )}
                <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Edit Relationship</button>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10">Action Menu</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
               {/* Quick Action Stages */}
               <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
                  {PIPELINE_STAGES.map((stage, i) => {
                    const isPassed = PIPELINE_STAGES.indexOf(selectedClient.status) >= i;
                    const isCurrent = selectedClient.status === stage;
                    return (
                      <button 
                        key={stage}
                        onClick={() => updateClientStatus(selectedClient.id, stage)}
                        className={`h-2 rounded-full transition-all relative group ${isCurrent ? 'bg-[#c5a059] ring-4 ring-[#c5a059]/20' : isPassed ? 'bg-slate-900' : 'bg-slate-200'}`}
                      >
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap shadow-xl">
                              {stage}
                            </div>
                         </div>
                      </button>
                    );
                  })}
               </div>

               {reviewScript && (
                 <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 space-y-6 animate-slideUp">
                    <div className="flex justify-between items-center">
                       <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="fa-solid fa-microphone"></i> Strategic Review Protocol
                       </h3>
                       <button onClick={() => setReviewScript(null)} className="text-amber-400 hover:text-amber-600"><i className="fa-solid fa-times"></i></button>
                    </div>
                    <div className="space-y-4">
                       <div className="p-5 bg-white rounded-2xl border border-amber-50">
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Opening Hook</p>
                          <p className="text-sm text-slate-800 leading-relaxed font-bold italic">"{reviewScript.opening}"</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 bg-white rounded-2xl border border-amber-50">
                             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Discovery Protocol</p>
                             <ul className="space-y-2">
                                {reviewScript.discoveryQuestions.map((q: string, i: number) => (
                                   <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                      <i className="fa-solid fa-circle-question text-amber-400 mt-1"></i>
                                      {q}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div className="p-5 bg-white rounded-2xl border border-amber-50">
                             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Strategic Pivot</p>
                             <p className="text-xs text-slate-800 leading-relaxed italic">"{reviewScript.strategicPivot}"</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-8">
                     {/* Information Grid */}
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Demographics</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">County</span>
                                 <span className="text-xs font-bold text-slate-900">{selectedClient.county}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">Lead Source</span>
                                 <span className="text-xs font-bold text-slate-900">{selectedClient.leadSource}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">Phone</span>
                                 <span className="text-xs font-bold text-slate-900">{selectedClient.phone}</span>
                              </div>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Protection Details</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">Product Interest</span>
                                 <span className="text-xs font-bold text-slate-900">{selectedClient.productInterest}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">Carrier</span>
                                 <span className="text-xs font-bold text-slate-900">{selectedClient.carrier || 'Pending selection'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500">Monthly Premium</span>
                                 <span className="text-xs font-black text-[#c5a059]">{selectedClient.monthlyPremium ? `$${selectedClient.monthlyPremium}` : '—'}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <i className="fa-solid fa-brain text-[#c5a059]"></i> 
                            Legacy Snapshot
                          </h3>
                          {!selectedClient.snapshot && (
                            <button 
                              onClick={() => handleGenerateSnapshot(selectedClient)}
                              disabled={isGeneratingSnapshot}
                              className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                              {isGeneratingSnapshot ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                              {isGeneratingSnapshot ? 'Architecting...' : 'Generate AI Analysis'}
                            </button>
                          )}
                        </div>

                        {selectedClient.snapshot ? (
                          <div className="animate-slideUp space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                               <p className="text-sm text-slate-800 font-bold mb-2">Internal Summary</p>
                               <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedClient.snapshot.summary}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-4">
                                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Family Context</p>
                                  <ul className="space-y-2">
                                    {selectedClient.snapshot.familyContext.map((item, i) => (
                                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                        <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                               </div>
                               <div className="space-y-4">
                                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Risk Themes</p>
                                  <ul className="space-y-2">
                                    {selectedClient.snapshot.riskThemes.map((item, i) => (
                                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                        <i className="fa-solid fa-bolt text-amber-500 mt-1"></i>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4 border-2 border-dashed border-slate-100 rounded-[2rem]">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                              <i className="fa-solid fa-brain text-2xl"></i>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest">No Analysis Found</p>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <section className="bg-slate-900 p-6 rounded-3xl text-white">
                        <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Timeline & Deadlines</h4>
                        <div className="space-y-6">
                           <div className="relative pl-6 border-l-2 border-slate-800">
                              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-[#c5a059]"></div>
                              <p className="text-[10px] font-black uppercase text-[#c5a059] mb-1">Application Date</p>
                              <p className="text-sm font-bold">{selectedClient.appDate || 'Pending'}</p>
                           </div>
                           <div className="relative pl-6 border-l-2 border-slate-800">
                              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-emerald-500"></div>
                              <p className="text-[10px] font-black uppercase text-emerald-500 mb-1">Issue Date</p>
                              <p className="text-sm font-bold">{selectedClient.issueDate || 'Pending'}</p>
                           </div>
                           <div className="relative pl-6 border-l-2 border-slate-800">
                              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-indigo-500"></div>
                              <p className="text-[10px] font-black uppercase text-indigo-500 mb-1">Annual Review</p>
                              <p className="text-sm font-bold">{selectedClient.reviewMonth || 'Pending'}</p>
                           </div>
                        </div>
                     </section>

                     <section className="bg-white p-6 rounded-3xl border border-slate-200">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Quick Notes</h4>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{selectedClient.notes}"
                        </p>
                        <button className="w-full mt-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:bg-slate-100">Add New Note</button>
                     </section>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default CRM;