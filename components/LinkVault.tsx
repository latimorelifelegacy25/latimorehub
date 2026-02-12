import React, { useMemo, useState } from 'react';
import { LinkItem, LinkCategory } from '../types';
import { useLocalStorageState } from '../services/useLocalStorageState';

const STORAGE_KEY = 'latimore.links.v1';

const nowIso = () => new Date().toISOString();

const DEFAULT_LINKS: LinkItem[] = [
  {
    id: 'gfi-portal',
    name: 'GFI Portal',
    url: 'https://globalfinancialimpact.com/',
    category: 'GFI',
    tags: ['gfi', 'portal'],
    notes: 'Main GFI portal (log in).',
    isFavorite: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'carrier-ethos',
    name: 'Ethos Velocity',
    url: 'https://www.ethoslife.com/',
    category: 'Carrier',
    tags: ['term', 'velocity'],
    notes: 'Instant decision term.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'social-fb',
    name: 'Facebook Business',
    url: 'https://business.facebook.com/',
    category: 'Social',
    tags: ['facebook'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'social-linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    category: 'Social',
    tags: ['linkedin'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const CATEGORIES: LinkCategory[] = ['Carrier', 'GFI', 'Portals', 'Social', 'Tools', 'Funnels', 'Other'];

export default function LinkVault() {
  const [links, setLinks] = useLocalStorageState<LinkItem[]>(STORAGE_KEY, DEFAULT_LINKS);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<LinkCategory | 'All'>('All');
  const [editing, setEditing] = useState<LinkItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links
      .filter((l) => (activeCat === 'All' ? true : l.category === activeCat))
      .filter((l) => {
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.tags.join(' ').toLowerCase().includes(q) ||
          (l.notes || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(Boolean(b.isFavorite)) - Number(Boolean(a.isFavorite)) || b.updatedAt.localeCompare(a.updatedAt));
  }, [links, query, activeCat]);

  const upsert = (item: LinkItem) => {
    setLinks((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === item.id);
      if (existingIdx === -1) return [{ ...item }, ...prev];
      const next = [...prev];
      next[existingIdx] = { ...item };
      return next;
    });
  };

  const remove = (id: string) => setLinks((prev) => prev.filter((p) => p.id !== id));

  const toggleFav = (id: string) => {
    setLinks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite, updatedAt: nowIso() } : p))
    );
  };

  const newLink = () => {
    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
    setEditing({
      id,
      name: '',
      url: '',
      category: 'Portals',
      tags: [],
      notes: '',
      isFavorite: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn pb-32">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portals & Links</h1>
          <p className="text-slate-500 font-medium tracking-wide mt-2">
            Your private launcher: carriers, GFI, socials, funnels, tools.
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:w-96">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search links, tags, notes…"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2"
            />
          </div>
          <button
            onClick={newLink}
            className="px-6 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all"
          >
            + Add Link
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
        {filtered.map((l) => (
          <div key={l.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
            <div className="p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{l.name || 'Untitled'}</h3>
                    <span className="text-[9px] px-2 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 font-black uppercase tracking-widest">
                      {l.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 break-all">{l.url}</p>
                </div>
                <button
                  onClick={() => toggleFav(l.id)}
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
                    l.isFavorite ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                  title="Favorite"
                >
                  <i className={`fa-solid ${l.isFavorite ? 'fa-star' : 'fa-star-half-stroke'}`}></i>
                </button>
              </div>

              {l.notes ? <p className="text-sm text-slate-600 leading-relaxed">{l.notes}</p> : null}

              {l.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {l.tags.map((t) => (
                    <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <a
                href={l.url}
                target="_blank"
                rel="noopener"
                className="flex-1 text-center py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all"
              >
                Open
              </a>
              <button
                onClick={() => setEditing(l)}
                className="w-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all shadow-sm"
                title="Edit"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <button
                onClick={() => remove(l.id)}
                className="w-14 bg-white border border-rose-200 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                title="Delete"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
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
    </div>
  );
}

function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: LinkItem;
  onClose: () => void;
  onSave: (next: LinkItem) => void;
}) {
  const [draft, setDraft] = useState<LinkItem>({ ...item });

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 max-w-2xl w-full shadow-2xl animate-slideUp border border-slate-100">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{item.name ? 'Edit Link' : 'Add Link'}</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Tip: keep notes like “login flow” or “commission reports.”
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-rose-500 transition-all rounded-2xl w-12 h-12 border border-slate-200 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
              placeholder="e.g., North American Portal"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
            <select
              value={draft.category}
              onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value as LinkCategory }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL</label>
            <input
              value={draft.url}
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
              placeholder="carrier, iul, reporting"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notes</label>
            <textarea
              value={draft.notes || ''}
              onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 min-h-[120px]"
              placeholder="Login steps, where to find forms, commission notes…"
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
