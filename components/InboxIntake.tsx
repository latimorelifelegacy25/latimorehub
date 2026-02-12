import React from 'react';

export default function InboxIntake() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-32">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inbox (Intake)</h1>
        <p className="text-slate-500 font-medium tracking-wide mt-2">
          This becomes your lead pipeline inbox: forwarded emails → leads → CRM. (Backend required.)
        </p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">What changes next</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Right now, this hub runs in your browser (localStorage). To truly “funnel emails in,” we wire an inbound
            email route (Mailgun/SendGrid) into a Vercel Serverless Function and store messages + contacts in a database
            (Supabase).
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="font-black text-slate-900">Recommended setup (private)</h3>
            <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm text-slate-700">
              <li>Create an intake address like <span className="font-black">leads@latimorelegacy.com</span>.</li>
              <li>Forward carrier/contact form notifications to that address.</li>
              <li>Mailgun inbound route → Vercel function → Supabase tables (contacts, threads, messages).</li>
              <li>Hub shows it as a real inbox + creates CRM leads automatically.</li>
            </ol>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Outcome</p>
              <p className="mt-2 text-sm text-emerald-900 font-bold">No more hunting through Gmail. Leads land here.</p>
            </div>
            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Your rule</p>
              <p className="mt-2 text-sm text-amber-900 font-bold">One place to run the business: open hub, execute.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
