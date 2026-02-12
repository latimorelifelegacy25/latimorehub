
import React from 'react';
import { NAV_ITEMS, COLORS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-[#c5a059] rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-shield-heart text-slate-900 text-xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight">Latimore Hub</span>
          <span className="text-xs text-slate-400">Private Command Center</span>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-[#c5a059] text-slate-900 font-semibold shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-slate-400 text-xs text-center">
        © 2024 Latimore Life & Legacy LLC
      </div>
    </aside>
  );
};

export default Sidebar;
