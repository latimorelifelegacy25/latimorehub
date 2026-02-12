import React, { useMemo, useState } from 'react';

const SESSION_KEY = 'latimore.hub_session.v1';
const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

function getEnvPasscode(): string {
  // Vite exposes env vars prefixed with VITE_
  // If you don't set this, the hub won't prompt.
  // @ts-ignore
  return (import.meta?.env?.VITE_HUB_PASSCODE || '').toString();
}

export function isAuthed(): boolean {
  const passcode = getEnvPasscode();
  if (!passcode) return true;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.ok === true && typeof parsed?.at === 'number' && Date.now() - parsed.at < DAYS_30;
  } catch {
    return false;
  }
}

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const passcode = useMemo(getEnvPasscode, []);
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);

  if (!passcode) return null;

  const submit = () => {
    if (code.trim() !== passcode) {
      setErr('Incorrect passcode');
      return;
    }
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ ok: true, at: Date.now() }));
    onAuthed();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-10">
          <div className="w-16 h-16 rounded-3xl bg-[#c5a059] flex items-center justify-center text-slate-900 text-2xl shadow-xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">Latimore Private Hub</h1>
          <p className="mt-2 text-slate-500 font-medium">Enter your passcode to access your command center.</p>

          <div className="mt-8 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passcode</label>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErr(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2"
            />
            {err ? <p className="text-sm text-rose-600 font-bold">{err}</p> : null}
            <button
              onClick={submit}
              className="w-full py-5 rounded-[1.5rem] font-black bg-slate-900 text-white hover:bg-[#c5a059] transition-all text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20"
            >
              Unlock Hub
            </button>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Tip: set <span className="font-black">VITE_HUB_PASSCODE</span> in Vercel → Settings → Environment Variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
