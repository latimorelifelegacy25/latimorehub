import React from 'react';

const BOOKING_IFRAME_URL =
  'https://calendar.google.com/calendar/appointments/AcZssZ0pWKOYTgg4xc8vleuqTnfpTwqm8oYaG2B5TxA=?gv=true';

const BOOKING_SHORT_URL = 'https://calendar.app.google/qsZrpBUF78SPnJ6y9';

const Schedule: React.FC = () => {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_SHORT_URL);
      alert('✅ Booking link copied.');
    } catch {
      alert('Unable to copy. Here is the link:\n' + BOOKING_SHORT_URL);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">📅 Appointment Scheduling</h1>
        <p className="text-slate-500">
          Book reviews fast, send the link instantly, and keep everything inside the Hub.
        </p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-700">Latimore Booking Page</div>
          <div className="flex gap-2">
            <a
              href={BOOKING_SHORT_URL}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Open Full Page
            </a>
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="p-0">
          <iframe
            title="Google Appointment Scheduling"
            src={BOOKING_IFRAME_URL}
            style={{ border: 0, width: '100%', height: 720 }}
            loading="lazy"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800">
        <h3 className="font-black tracking-tight mb-2">Quick Send Templates</h3>
        <div className="text-sm text-slate-300 mb-4">
          Use this in text/email: <span className="font-bold text-white">{BOOKING_SHORT_URL}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Text</div>
            <div className="text-sm text-slate-200">
              Hi — here’s my booking link for a quick legacy review: {BOOKING_SHORT_URL}
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</div>
            <div className="text-sm text-slate-200">
              Subject: Quick Legacy Review<br />
              Body: Here’s the booking link to pick a time that works best: {BOOKING_SHORT_URL}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
