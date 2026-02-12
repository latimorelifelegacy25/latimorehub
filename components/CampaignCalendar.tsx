
import React, { useState } from 'react';
import { SocialPost } from '../types';

interface CampaignCalendarProps {
  posts: SocialPost[];
  onRemovePost: (id: string) => void;
  onAddPost: (post: SocialPost) => void;
}

const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ posts, onRemovePost, onAddPost }) => {
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Scheduling Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPlatform, setNewPostPlatform] = useState<'facebook' | 'linkedin' | 'instagram' | 'twitter'>('facebook');

  const sortedPosts = [...posts].sort((a, b) => 
    new Date(a.scheduledDate || '').getTime() - new Date(b.scheduledDate || '').getTime()
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'fa-brands fa-facebook text-blue-600';
      case 'linkedin': return 'fa-brands fa-linkedin text-blue-800';
      case 'instagram': return 'fa-brands fa-instagram text-rose-500';
      case 'twitter': return 'fa-brands fa-twitter text-sky-400';
      default: return 'fa-solid fa-share-nodes text-slate-400';
    }
  };

  const getPlatformBg = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-50 border-blue-100';
      case 'linkedin': return 'bg-blue-50 border-blue-200';
      case 'instagram': return 'bg-rose-50 border-rose-100';
      case 'twitter': return 'bg-sky-50 border-sky-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  const formatListDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, date: null });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const dateKey = date.toISOString().split('T')[0];
      const dayPosts = posts.filter(p => p.scheduledDate?.startsWith(dateKey));
      days.push({ day: d, date, posts: dayPosts });
    }

    return days;
  };

  const openCreateModal = (date?: Date) => {
    if (date) {
      setSelectedDateForModal(date.toISOString().slice(0, 16));
    } else {
      setSelectedDateForModal(new Date().toISOString().slice(0, 16));
    }
    setShowCreateModal(true);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !selectedDateForModal) return;

    const post: SocialPost = {
      id: Math.random().toString(36).substr(2, 9),
      content: newPostContent,
      platform: newPostPlatform,
      status: 'scheduled',
      scheduledDate: selectedDateForModal,
      engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 }
    };

    onAddPost(post);
    setShowCreateModal(false);
    setNewPostContent('');
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const calendarDays = generateCalendarDays();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Planner</h1>
          <p className="text-slate-500 font-medium">Visualizing the legacy heartbeat across all channels.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => openCreateModal()}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Quick Schedule
          </button>
          <div className="bg-slate-200/50 p-1 rounded-xl flex shadow-inner">
            <button 
              onClick={() => setViewMode('Grid')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'Grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Calendar
            </button>
            <button 
              onClick={() => setViewMode('List')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'List' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Timeline
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {viewMode === 'Grid' ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden flex flex-col min-h-[700px]">
            {/* Calendar Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{monthYearLabel}</h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="w-10 h-10 rounded-xl hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 transition-all"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                  <button onClick={nextMonth} className="w-10 h-10 rounded-xl hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 transition-all"><i className="fa-solid fa-chevron-right text-xs"></i></button>
                  <button onClick={goToToday} className="px-4 h-10 rounded-xl hover:bg-slate-100 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all">Today</button>
                </div>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr">
              {calendarDays.map((dayObj, idx) => {
                const isToday = dayObj.date?.toDateString() === new Date().toDateString();
                return (
                  <div 
                    key={idx} 
                    onClick={() => dayObj.date && openCreateModal(dayObj.date)}
                    className={`min-h-[120px] p-3 border-r border-b border-slate-50 relative group cursor-pointer ${!dayObj.day ? 'bg-slate-50/30' : 'hover:bg-[#c5a059]/5 transition-colors'}`}
                  >
                    {dayObj.day && (
                      <div className="flex flex-col h-full">
                        <div className={`text-xs font-black mb-2 w-7 h-7 flex items-center justify-center rounded-lg ${isToday ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/30' : 'text-slate-400 group-hover:text-slate-900'}`}>
                          {dayObj.day}
                        </div>
                        <div className="space-y-1 overflow-y-auto no-scrollbar max-h-24">
                          {dayObj.posts?.map(post => (
                            <div 
                              key={post.id} 
                              className={`px-2 py-1.5 rounded-lg border text-[9px] font-bold text-slate-700 flex items-center gap-2 truncate shadow-sm bg-white ${getPlatformBg(post.platform)}`}
                            >
                              <i className={getPlatformIcon(post.platform)}></i>
                              <span className="truncate">{post.content}</span>
                            </div>
                          ))}
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px]">
                            <i className="fa-solid fa-plus"></i>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Upcoming Legacy Heartbeats</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedPosts.map((post) => (
                <div key={post.id} className="p-8 hover:bg-slate-50/50 transition-all group flex flex-col md:flex-row md:items-center gap-8">
                  <div className="md:w-56 flex-shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Release Protocol</p>
                    <p className="text-base font-black text-slate-900 leading-tight">{formatListDate(post.scheduledDate || '')}</p>
                  </div>

                  <div className="flex-1 flex items-start gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-3xl">
                      <i className={getPlatformIcon(post.platform)}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 leading-relaxed italic line-clamp-2 font-medium">"{post.content}"</p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemovePost(post.id); }}
                      className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-rose-300 hover:text-rose-600 transition-all shadow-md"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-slideUp border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Direct Publication</h2>
               <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                  <i className="fa-solid fa-times"></i>
               </button>
            </div>
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Message Content</label>
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Draft your message here..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#c5a059] outline-none font-medium text-slate-700 h-32 resize-none"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Platform</label>
                    <select 
                      value={newPostPlatform}
                      onChange={(e) => setNewPostPlatform(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Schedule Time</label>
                    <input 
                      type="datetime-local" 
                      value={selectedDateForModal}
                      onChange={(e) => setSelectedDateForModal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#c5a059] outline-none"
                    />
                  </div>
               </div>
               <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#c5a059] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
               >
                 <i className="fa-solid fa-calendar-check"></i>
                 Lock Into Timeline
               </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CampaignCalendar;
