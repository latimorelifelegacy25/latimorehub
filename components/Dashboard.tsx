
import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_ENGAGEMENT_DATA, BRAND_STORY } from '../constants';

const StatCard = ({ title, value, trend, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value.toLocaleString()}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState(MOCK_ENGAGEMENT_DATA);
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    impressions: 142800,
    engagement: 8450,
    clicks: 1200,
    shares: 540
  });

  // Ensure Recharts doesn't render until the container is ready
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClearData = () => {
    setData([]);
    setStats({
      impressions: 0,
      engagement: 0,
      clicks: 0,
      shares: 0
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <header>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legacy Pulse</h1>
          <p className="text-slate-500 font-medium">{BRAND_STORY.tagline} {BRAND_STORY.hashtag}</p>
        </header>
        <button 
          onClick={handleClearData}
          className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50"
        >
          <i className="fa-solid fa-trash-can"></i>
          Reset Metrics
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'links', label: 'Portals', icon: 'fa-link' },
          { id: 'docs', label: 'Brochures', icon: 'fa-folder-open' },
          { id: 'crm', label: 'CRM', icon: 'fa-users-gear' },
          { id: 'creator', label: 'Create', icon: 'fa-pen-nib' },
        ].map((a) => (
          <button
            key={a.id}
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: a.id }))}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-4 text-left hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <i className={`fa-solid ${a.icon}`}></i>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick</p>
                <p className="text-sm font-black text-slate-900">{a.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C49A6C]">Mission Grounding</span>
               <h2 className="text-3xl font-black leading-tight max-w-lg">Protecting what matters. Building legacies that outlive them.</h2>
               <p className="text-slate-400 text-sm leading-relaxed max-w-md italic">
                 "{BRAND_STORY.origin}"
               </p>
            </div>
            <div className="pt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden">
                      <img src={`https://picsum.photos/seed/legacy${i}/100`} alt="Legacy" />
                   </div>
                 ))}
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#C49A6C]">540,000 Lives Served in Central PA</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <i className="fa-solid fa-shield-heart text-[240px]"></i>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Regional Focus</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <span className="text-sm font-bold text-slate-700">Schuylkill</span>
                 <span className="text-xs font-black text-[#C49A6C]">42% Growth</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <span className="text-sm font-bold text-slate-700">Luzerne</span>
                 <span className="text-xs font-black text-[#C49A6C]">28% Reach</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <span className="text-sm font-bold text-slate-700">Northumberland</span>
                 <span className="text-xs font-black text-[#C49A6C]">15% New leads</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Impressions" value={stats.impressions} trend={12} icon="fa-eye" color="bg-blue-500" />
        <StatCard title="Engagement" value={stats.engagement} trend={24} icon="fa-heart" color="bg-rose-500" />
        <StatCard title="Clicks" value={stats.clicks} trend={-3} icon="fa-arrow-pointer" color="bg-amber-500" />
        <StatCard title="Shares" value={stats.shares} trend={48} icon="fa-share-nodes" color="bg-indigo-500" />
      </div>

      {/* Wrapping div with min-width to fix Recharts width calculations */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-w-0">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Engagement Trajectory</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Measuring the beat of the community</p>
          </div>
          <div className="flex gap-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#C49A6C]"></div>
                <span className="text-[10px] font-bold text-slate-500">Likes</span>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#2C3E50]"></div>
                <span className="text-[10px] font-bold text-slate-500">Clicks</span>
             </div>
          </div>
        </div>
        <div className="h-80 w-full min-w-0" style={{ minHeight: '320px' }}>
          {data.length > 0 && isMounted ? (
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="likes" stroke="#C49A6C" strokeWidth={4} dot={false} activeDot={{ r: 6, fill: '#C49A6C' }} />
                <Line type="monotone" dataKey="clicks" stroke="#2C3E50" strokeWidth={4} dot={false} activeDot={{ r: 6, fill: '#2C3E50' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : !isMounted ? (
            <div className="h-full flex items-center justify-center text-slate-200">
               <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 flex-col gap-4">
              <i className="fa-solid fa-chart-line text-5xl"></i>
              <p className="font-medium uppercase tracking-widest text-xs">No Signal Detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
