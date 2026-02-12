
import React, { useState, useRef } from 'react';
import { CarrierAsset, ContentIdea } from '../types';
import { generateContentFromAsset } from '../services/geminiService';

const MOCK_ASSETS: CarrierAsset[] = [
  { id: '1', name: 'Builder Plus 4 IUL Brochure', carrier: 'North American', type: 'IUL', uploadDate: '2024-05-12' },
  { id: '2', name: 'Safe Income Advantage Rider', carrier: 'F&G', type: 'Annuity', uploadDate: '2024-05-10' },
  { id: '3', name: 'Ethos Term Life Spec Sheet', carrier: 'Ethos', type: 'Term', uploadDate: '2024-05-15' },
];

interface AssetVaultProps {
  onIdeasGenerated?: (ideas: ContentIdea[]) => void;
}

const AssetVault: React.FC<AssetVaultProps> = ({ onIdeasGenerated }) => {
  const [assets, setAssets] = useState<CarrierAsset[]>(MOCK_ASSETS);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [platform, setPlatform] = useState('LinkedIn');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // In a real app, we'd upload to a server. Here we just add to mock state.
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result?.toString().split(',')[1];
      const newAsset: CarrierAsset = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        carrier: 'Manual Upload',
        type: file.type.includes('pdf') ? 'PDF Document' : 'Product Image',
        uploadDate: new Date().toISOString().split('T')[0],
        fileData: base64Data,
        mimeType: file.type
      };
      setAssets([newAsset, ...assets]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (asset: CarrierAsset) => {
    if (!asset.fileData || !asset.mimeType) {
      alert("This mock asset has no file data. Please upload a fresh file to test analysis.");
      return;
    }

    setIsAnalyzing(asset.id);
    try {
      const ideas = await generateContentFromAsset(asset.fileData, asset.mimeType, platform);
      if (ideas.length > 0 && onIdeasGenerated) onIdeasGenerated(ideas);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Analysis failed. Add your Gemini API key in Settings → Integrations.');
    } finally {
      setIsAnalyzing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Legacy Asset Vault</h1>
          <p className="text-slate-500 font-medium tracking-wide mt-2">Centralized intelligence for carrier products and educational blueprints.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="application/pdf,image/*" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-[#c5a059] transition-all flex items-center gap-3 shadow-2xl shadow-slate-900/20"
          >
            {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            {isUploading ? "Uploading..." : "Upload Carrier Product"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
            <div className="p-8 flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 text-3xl shadow-inner group-hover:text-[#c5a059] transition-colors">
                  <i className={`fa-solid ${asset.type.includes('PDF') ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Uploaded</span>
                   <span className="text-xs font-black text-slate-900">{asset.uploadDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#c5a059] transition-colors">{asset.name}</h3>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full border border-slate-200">
                     {asset.carrier}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest bg-[#c5a059]/10 text-[#c5a059] px-3 py-1.5 rounded-full border border-[#c5a059]/10">
                     {asset.type}
                   </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                 <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-[#c5a059]"
                 >
                   <option>LinkedIn</option>
                   <option>Facebook</option>
                   <option>Instagram</option>
                 </select>
                 <button 
                  onClick={() => handleAnalyze(asset)}
                  disabled={!!isAnalyzing}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all flex items-center justify-center gap-2"
                 >
                   {isAnalyzing === asset.id ? <i className="fa-solid fa-brain fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                   {isAnalyzing === asset.id ? "Analyzing..." : "Generate Educational Posts"}
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/20 group hover:border-[#c5a059] transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 group-hover:text-[#c5a059] transition-colors shadow-inner">
              <i className="fa-solid fa-plus text-2xl"></i>
           </div>
           <div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Add New Knowledge</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium italic">"Upload a brochure to train the AI on new carrier benefits."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetVault;
