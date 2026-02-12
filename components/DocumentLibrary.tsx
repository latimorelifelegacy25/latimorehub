import React, { useMemo, useState } from 'react';
import { DocItem, DocCategory } from '../types';
import { useLocalStorageState } from '../services/useLocalStorageState';

const STORAGE_KEY = 'latimore.docs.v1';

const nowIso = () => new Date().toISOString();

const CATEGORIES: DocCategory[] = ['Brochure', 'Product Guide', 'Presentation', 'Script', 'Compliance', 'Other'];

const DEFAULT_DOCS: DocItem[] = [
  {
    id: 'latimore-main-site',
    title: 'Latimore Life & Legacy – Main Site',
    category: 'Other',
    carrier: '',
    url: 'https://jackson1989-design.github.io/latimore-life-legacy-site/',
    tags: ['website'],
    notes: 'Public site / hero assets / brand references.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export default function DocumentLibrary() {
  const [docs, setDocs] = useLocalStorageState<DocItem[]>(STORAGE_KEY, DEFAULT_DOCS);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<DocCategory | 'All'>('All');
  const [editing, setEditing] = useState<DocItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs
      .filter((d) => (activeCat === 'All' ? true : d.category === activeCat))
      .filter((d) => {
        if (!q) return true;
        return (
          d.title.toLowerCase().includes(q) ||
          (d.carrier || '').toLowerCase().includes(q) ||
          (d.url || '').toLowerCase().includes(q) ||
          d.tags.join(' ').toLowerCase().includes(q) ||
          (d.notes || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [docs, query, activeCat]);

  const upsert = (item: DocItem) => {
    setDocs((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) return [{ ...item }, ...prev];
      const next = [...prev];
      next[idx] = { ...item };
      return next;
    });
  };

  const remove = (id: string) => setDocs((prev) => prev.filter((p) => p.id !== id));

  const newDoc = () => {
    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
    setEditing({
      id,
      title: '',
      category: 'Brochure',
      carrier: '',
      url: '',
      tags: [],
      notes: '',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn pb-32">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Brochures & Docs</h1>
          <p className="text-slate-500 font-medium tracking-wide mt-2">
            Save product links, scripts, presentations, compliance notes. (File uploads land in Hub v2 with Supabase Storage.)
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:w-96">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs, carrier, tags…"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2"
            />
          </div>
          <button
            onClick={newDoc}
            className="px-6 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all"
          >
            + Add Doc
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="px-6 py-4 rounded-2xl bg-white text-slate-700 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Upload PDF
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCat === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
            <div className="p-8 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{d.title || 'Untitled'}</h3>
                    <span className="text-[9px] px-2 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 font-black uppercase tracking-widest">
                      {d.category}
                    </span>
                  </div>
                  {d.carrier ? <p className="text-xs text-slate-500 mt-1">Carrier: {d.carrier}</p> : null}
                </div>
                <button
                  onClick={() => setEditing(d)}
                  className="w-10 h-10 rounded-2xl border bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center"
                  title="Edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>

              {d.url ? (
                <p className="text-xs text-slate-500 break-all">
                  <span className="font-black text-slate-400 uppercase tracking-widest mr-2">Link</span>
                  {d.url}
                </p>
              ) : null}

              {d.notes ? <p className="text-sm text-slate-600 leading-relaxed">{d.notes}</p> : null}

              {d.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 text-center py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all"
                >
                  Open
                </a>
              ) : (
                <button
                  onClick={() => setEditing(d)}
                  className="flex-1 py-4 rounded-xl bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                >
                  Add Link
                </button>
              )}
              <button
                onClick={() => remove(d.id)}
                className="w-14 bg-white border border-rose-200 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                title="Delete"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            upsert({ ...next, updatedAt: nowIso() });
            setEditing(null);
          }}
        />
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}

function EditModal({ item, onClose, onSave }: { item: DocItem; onClose: () => void; onSave: (next: DocItem) => void }) {
  const [draft, setDraft] = useState<DocItem>({ ...item });

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 max-w-2xl w-full shadow-2xl animate-slideUp border border-slate-100">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{item.title ? 'Edit Doc' : 'Add Doc'}</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Store links now. File uploads come next.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-rose-500 transition-all rounded-2xl w-12 h-12 border border-slate-200 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Title</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
              placeholder="e.g., North American IUL Brochure"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
            <select
              value={draft.category}
              onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value as DocCategory }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Carrier (optional)</label>
            <input
              value={draft.carrier || ''}
              onChange={(e) => setDraft((p) => ({ ...p, carrier: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
              placeholder="e.g., North American"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL (optional)</label>
            <input
              value={draft.url || ''}
              onChange={(e) => setDraft((p) => ({ ...p, url: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tags</label>
            <input
              value={draft.tags.join(', ')}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
              placeholder="iul, brochure, illustration"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notes</label>
            <textarea
              value={draft.notes || ''}
              onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 min-h-[120px]"
              placeholder="Where to find riders, target market, compliance reminders…"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-8">
          <button
            onClick={() => onSave(draft)}
            className="flex-1 py-5 rounded-[1.5rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-5 rounded-[1.5rem] font-black bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 max-w-xl w-full shadow-2xl animate-slideUp border border-slate-100">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Upload PDFs (next)</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              File uploads require cloud storage. In Hub v2 we connect Supabase Storage so brochures stay synced across devices.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-rose-500 transition-all rounded-2xl w-12 h-12 border border-slate-200 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            For now, paste brochure links (carrier portal PDFs, Google Drive links, etc.).
            When we turn on Supabase, this screen becomes drag-and-drop upload with tagging + preview.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-5 rounded-[1.5rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
