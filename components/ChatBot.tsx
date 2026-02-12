
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Good day, Jackson. I am synchronized with the Latimore Life Hub. How can I assist your legacy mission today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const messageToSend = customText || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(messageToSend, []);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I encountered an error analyzing that strategy." }]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'bot', text: e?.message || 'Chat failed. Add your Gemini API key in Settings → Integrations.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    { label: 'Pipeline Advice', prompt: 'How should I follow up with a lead in the "Discovery Complete" stage?' },
    { label: 'Explain IUL', prompt: 'Explain Indexed Universal Life insurance simply for a young family in Schuylkill county.' },
    { label: 'Post Idea', prompt: 'Give me a LinkedIn post idea for Mortgage Protection that targets new homeowners.' },
    { label: 'Market Update', prompt: 'What are the current trends in the annuity market for 2024?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-[26rem] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 mb-4 flex flex-col overflow-hidden animate-slideUp max-h-[80vh]">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-[#c5a059] rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/40">
                <i className="fa-solid fa-shield-heart text-slate-900 text-lg"></i>
              </div>
              <div>
                <p className="font-black text-sm tracking-tight">Legacy Co-Pilot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Business Integrated</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none border border-slate-800 font-medium' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length < 3 && !isLoading && (
            <div className="px-6 pb-2 pt-2 bg-slate-50/50">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Executive Commands</p>
               <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_PROMPTS.map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(q.prompt)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-[#c5a059] hover:text-[#c5a059] transition-all shadow-sm"
                    >
                      {q.label}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your assistant anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-[#c5a059] transition-all disabled:opacity-30 disabled:hover:bg-slate-900 shadow-lg shadow-slate-900/10"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
              Securing Pennsylvania's Legacy
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 group relative ${isOpen ? 'bg-white text-slate-900 rotate-90 scale-90 border border-slate-200' : 'bg-slate-900 text-[#c5a059] hover:scale-110'}`}
      >
        <div className={`absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-50 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-brain-circuit'} text-2xl`}></i>
        {!isOpen && (
          <div className="absolute right-20 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 pointer-events-none border border-slate-800">
            Strategy Sync Active
          </div>
        )}
      </button>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChatBot;
