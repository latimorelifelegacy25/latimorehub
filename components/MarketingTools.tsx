
import React, { useMemo, useState } from "react";
import { Sparkles, Network, Check, Copy, Zap, Calendar } from "lucide-react";
import { chatWithGemini, generateBulkCampaign, generateCanvaSpec } from "../services/geminiService";
import { SocialPost } from "../types";

const BRAND = {
  navy: "#2C3E50",
  gold: "#C49A6C",
  white: "#FFFFFF",
};

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

function ToolCard({ icon, title, children }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#C49A6C] shadow-inner">
           {icon}
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface MarketingToolsProps {
  onBulkSchedule?: (posts: SocialPost[]) => void;
}

const MarketingTools: React.FC<MarketingToolsProps> = ({ onBulkSchedule }) => {
  const [activeTool, setActiveTool] = useState<'Canva' | 'Automation' | 'AutoPilot'>('Canva');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
       <header>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legacy Marketing Tools</h1>
          <p className="text-slate-500 font-medium">Professional assets for Pennsylvania's top insurance consultant.</p>
       </header>

       <div className="flex gap-6">
          <div className="flex-1">
             {activeTool === 'Canva' && <CanvaSpecGenerator />}
             {activeTool === 'Automation' && <AutomationPackGenerator />}
             {activeTool === 'AutoPilot' && <CampaignAutoPilot onBulkSchedule={onBulkSchedule} />}
          </div>
          
          <div className="w-72 space-y-4 hidden lg:block">
             <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                <h4 className="text-[10px] font-black uppercase text-[#C49A6C] tracking-widest mb-4">Tool Navigator</h4>
                <div className="space-y-2">
                   <button 
                     onClick={() => setActiveTool('Canva')}
                     className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTool === 'Canva' ? 'bg-[#C49A6C] text-slate-900' : 'hover:bg-slate-800 text-slate-400'}`}
                   >
                     Canva Creative Specs
                   </button>
                   <button 
                     onClick={() => setActiveTool('Automation')}
                     className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTool === 'Automation' ? 'bg-[#C49A6C] text-slate-900' : 'hover:bg-slate-800 text-slate-400'}`}
                   >
                     Automation Asset Packs
                   </button>
                   <button 
                     onClick={() => setActiveTool('AutoPilot')}
                     className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTool === 'AutoPilot' ? 'bg-[#C49A6C] text-slate-900' : 'hover:bg-slate-800 text-slate-400'}`}
                   >
                     <div className="flex items-center gap-2">
                        <Zap size={14} /> Campaign Auto-Pilot
                     </div>
                   </button>
                </div>
             </div>
             
             <div className="p-6 bg-white border border-slate-100 rounded-[2rem]">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Guidelines</h4>
                <ul className="text-[10px] text-slate-500 space-y-3 font-bold">
                   <li className="flex gap-2"><i className="fa-solid fa-check text-emerald-500"></i> No Gradients</li>
                   <li className="flex gap-2"><i className="fa-solid fa-check text-emerald-500"></i> Flat Design Lock</li>
                   <li className="flex gap-2"><i className="fa-solid fa-check text-emerald-500"></i> Local PA Dialect</li>
                </ul>
             </div>
          </div>
       </div>
    </div>
  );
};

const CampaignAutoPilot = ({ onBulkSchedule }: { onBulkSchedule?: (posts: SocialPost[]) => void }) => {
  const [goal, setGoal] = useState("");
  const [persona, setPersona] = useState("Young Families");
  const [campaignPosts, setCampaignPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const generate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setScheduled(false);
    const results = await generateBulkCampaign(goal, persona);
    setCampaignPosts(results);
    setLoading(false);
  };

  const commitToCalendar = () => {
    if (!onBulkSchedule || campaignPosts.length === 0) return;
    
    const posts: SocialPost[] = campaignPosts.map(p => {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + p.sequenceDay);
      scheduledDate.setHours(10, 0, 0, 0);

      return {
        id: Math.random().toString(36).substr(2, 9),
        content: p.draft,
        platform: p.platform.toLowerCase() as any,
        status: 'scheduled',
        scheduledDate: scheduledDate.toISOString().slice(0, 16),
        engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 }
      };
    });

    onBulkSchedule(posts);
    setScheduled(true);
  };

  return (
    <ToolCard icon={<Zap size={24} />} title="Campaign Auto-Pilot">
       <div className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
             Automatically architect a multi-week social campaign tailored to your business goals. 
          </p>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Campaign Goal</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C49A6C] outline-none transition-all"
                >
                  <option value="">Select Strategy...</option>
                  <option value="Mortgage Protection Awareness">Mortgage Protection</option>
                  <option value="Tax-Free Retirement (IUL)">Tax-Free Retirement</option>
                  <option value="Key Person for Schools">School District Outreach</option>
                  <option value="Velocity Term Life (Ethos)">Quick Protection</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Persona</label>
                <select 
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C49A6C] outline-none transition-all"
                >
                  <option>Young Families</option>
                  <option>Pre-Retirees</option>
                  <option>School Administrators</option>
                  <option>SME Owners</option>
                </select>
             </div>
          </div>

          <button 
            onClick={generate}
            disabled={loading || !goal}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#C49A6C] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
          >
            {loading ? <i className="fa-solid fa-gear fa-spin"></i> : <Sparkles size={16} />}
            {loading ? "Architecting 4-Week Flow..." : "Launch Auto-Pilot"}
          </button>

          {campaignPosts.length > 0 && (
            <div className="mt-8 space-y-6 animate-slideUp">
               <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Planned Sequence</h3>
                  {!scheduled ? (
                    <button 
                      onClick={commitToCalendar}
                      className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline"
                    >
                      <Calendar size={14} /> Commit Sequence to Calendar
                    </button>
                  ) : (
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Check size={14} /> Sequence Scheduled
                    </span>
                  )}
               </div>
               
               <div className="space-y-3">
                  {campaignPosts.map((post, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-start">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-[#C49A6C] shadow-sm flex-shrink-0">
                          {post.sequenceDay}d
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-800 mb-1">{post.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">"{post.draft}"</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
       </div>
    </ToolCard>
  );
};

const CanvaSpecGenerator = () => {
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("young_families");
  const [platform, setPlatform] = useState("facebook");
  const [assetType, setAssetType] = useState("canva_post");
  const [spec, setSpec] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const AUDIENCE_LABEL: Record<string, string> = {
    young_families: "Young Families",
    pre_retirees: "Pre-Retirees",
    school_districts: "School Districts",
    schuylkill_workforce: "Schuylkill Workforce",
    hispanic_community: "Hispanic Community",
    general: "General"
  };

  const PLATFORM_LABEL: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    website: "Website"
  };

  const ASSET_LABEL: Record<string, string> = {
    canva_post: "Canva Post",
    canva_story: "Canva Story",
    canva_flyer: "Canva Flyer",
    canva_slide: "Canva Slide",
    canva_banner: "Canva Banner"
  };

  const generate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const res = await generateCanvaSpec({
        goal: goal.trim(),
        audience: AUDIENCE_LABEL[audience] ?? audience,
        platform: PLATFORM_LABEL[platform] ?? platform,
        assetType: ASSET_LABEL[assetType] ?? assetType,
      });
      setSpec(res || "Error generating spec.");
    } catch (e: any) {
      console.error(e);
      setSpec(e?.message || 'Error generating spec. Add your Gemini API key in Settings → Integrations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolCard icon={<Sparkles size={24} />} title="Canva Creative Architect">
       <div className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
             Turn your strategic goals into precise creative instructions for your design team (or yourself).
          </p>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Campaign Objective</label>
             <textarea 
               value={goal}
               onChange={(e) => setGoal(e.target.value)}
               placeholder='Example: "Book consultations for young families"'
               className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#C49A6C] outline-none h-28 resize-none transition-all"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C49A6C] outline-none"
            >
              <option value="young_families">Young Families</option>
              <option value="pre_retirees">Pre-Retirees</option>
              <option value="school_districts">School Districts</option>
              <option value="schuylkill_workforce">Schuylkill Workforce</option>
              <option value="hispanic_community">Hispanic Community</option>
              <option value="general">General</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C49A6C] outline-none"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </select>

            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C49A6C] outline-none"
            >
              <option value="canva_post">Canva Post</option>
              <option value="canva_story">Canva Story</option>
              <option value="canva_flyer">Canva Flyer</option>
              <option value="canva_slide">Canva Slide</option>
              <option value="canva_banner">Canva Banner</option>
            </select>
          </div>
          <button 
            onClick={generate}
            disabled={loading || !goal.trim()}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#C49A6C] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
          >
            {loading ? <i className="fa-solid fa-gear fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
            {loading ? "Architecting Design..." : "Build Creative Spec"}
          </button>
          
          {spec && (
            <div className="mt-8 space-y-4 animate-slideUp">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400">Canva Asset Blueprint</span>
                  <button 
                    onClick={async () => {
                      const ok = await copyToClipboard(spec);
                      setCopied(ok);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
               </div>
               <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto no-scrollbar font-medium">
                  {spec}
               </div>
            </div>
          )}
       </div>
    </ToolCard>
  );
};

const AutomationPackGenerator = () => {
  const [objective, setObjective] = useState("");
  const [pack, setPack] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    const res = await chatWithGemini(`Generate a complete Automation Asset Pack for: "${objective}". Include form fields, tagging strategy, and email nurture series copy that sounds like a helpful neighbor, not a robot.`, []);
    setPack(res || "Error generating pack.");
    setLoading(false);
  };

  return (
    <ToolCard icon={<Network size={24} />} title="Automation Flow Architect">
       <div className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
             Generate the forms, tags, and email series required to turn a web visitor into a protected family.
          </p>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Automation Workflow Goal</label>
             <textarea 
               value={objective}
               onChange={(e) => setObjective(e.target.value)}
               placeholder="e.g., 'Instant download for a legacy checklist, leading to a booked FIA review'"
               className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#C49A6C] outline-none h-32 resize-none transition-all"
             />
          </div>
          <button 
            onClick={generate}
            disabled={loading || !objective.trim()}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#C49A6C] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
          >
            {loading ? <i className="fa-solid fa-gear fa-spin"></i> : <i className="fa-solid fa-microchip"></i>}
            {loading ? "Mapping Logic..." : "Generate Asset Pack"}
          </button>
          
          {pack && (
            <div className="mt-8 space-y-4 animate-slideUp">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400">Logic & Copy Blueprint</span>
                  <button 
                    onClick={async () => {
                      const ok = await copyToClipboard(pack);
                      setCopied(ok);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
               </div>
               <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto no-scrollbar font-medium">
                  {pack}
               </div>
            </div>
          )}
       </div>
    </ToolCard>
  );
};

export default MarketingTools;
