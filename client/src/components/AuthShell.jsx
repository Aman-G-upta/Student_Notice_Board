import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';

const SAMPLE = [
  { tone: 'bg-red-50 border-red-200', bar: 'bg-red-500', tag: 'Urgent', tagClass: 'bg-red-600 text-white', title: 'Mid-semester timetable has changed', meta: 'Examination · 10 min ago', rotate: '-rotate-2' },
  { tone: 'bg-amber-50 border-amber-200', bar: 'bg-amber-400', tag: 'Important', tagClass: 'bg-amber-100 text-amber-800', title: 'Placement drive registration closes Friday', meta: 'Placement · 2 hr ago', rotate: 'rotate-1 translate-x-6' },
  { tone: 'bg-white border-slate-200', bar: 'bg-slate-200', tag: 'Normal', tagClass: 'bg-slate-100 text-slate-600', title: 'Library timings for this week', meta: 'General · Yesterday', rotate: '-rotate-1 -translate-x-2' },
];

// Shared layout for the login and register screens.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand-800 p-12 text-white lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Pin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">Notice Board</span>
        </Link>

        <div className="my-auto max-w-md py-12">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Every notice from your college, in one place.
          </h2>
          <p className="mt-4 text-brand-100">
            Urgent notices rise to the top automatically, so nothing important gets lost on a crowded wall.
          </p>

          <div className="mt-12 space-y-4" aria-hidden="true">
            {SAMPLE.map((n) => (
              <div key={n.title} className={`relative overflow-hidden rounded-2xl border p-4 pl-5 shadow-lift ${n.tone} ${n.rotate}`}>
                <span className={`absolute inset-y-0 left-0 w-1.5 ${n.bar}`} />
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${n.tagClass}`}>{n.tag}</span>
                <p className="mt-2 font-display text-base font-semibold text-slate-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{n.meta}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-brand-200">Each college sees only its own notices.</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Pin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold">Notice Board</span>
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </main>
    </div>
  );
}
