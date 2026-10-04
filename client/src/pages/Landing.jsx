import { Link } from 'react-router-dom';
import {
  BookOpenCheck,
  Building2,
  Check,
  Flag,
  Lock,
  MessageSquare,
  Paperclip,
  Pin,
  Search,
} from 'lucide-react';

/* ---------- small pieces ---------- */

function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Pin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold text-slate-900">Notice Board</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Sections">
          {[
            ['#features', 'Features'],
            ['#how-it-works', 'How it works'],
            ['#who-its-for', 'Students and faculty'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/login" className="btn-ghost px-3.5 py-2">Log in</Link>
          <Link to="/register" className="btn-primary px-3.5 py-2">Get started</Link>
        </div>
      </div>
    </header>
  );
}

/** A faithful miniature of the real student dashboard, built from the same card styles. */
function BoardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-brand-100" aria-hidden="true" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-paper shadow-lift" aria-hidden="true">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Pin className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-slate-900">Thakur College of Engineering and Technology</span>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">AS</span>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
            <Search className="h-4 w-4" /> Search notices by title or content
          </div>
          <div className="flex gap-1.5 overflow-hidden">
            {['All', 'Academic', 'Examination', 'Placement'].map((c, i) => (
              <span key={c} className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {c}
              </span>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-4 pl-5">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-red-500" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Urgent
              </span>
              <span className="text-xs text-slate-500">Examination</span>
              <span className="ml-auto text-xs text-slate-500">10 min ago</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-red-950">Mid-semester timetable has changed</p>
            <p className="mt-1 text-xs text-slate-600">Papers for Semester 3 move up by two days. Check the new dates before Friday.</p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-amber-50 p-4 pl-5">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-300">
                <Flag className="h-3 w-3" /> Important
              </span>
              <span className="text-xs text-slate-500">Placement</span>
              <span className="ml-auto text-xs text-slate-500">2 hr ago</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-slate-900">Placement drive registration closes Friday</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attachment</span>
              <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 4 comments</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pl-5">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-slate-200" />
            <p className="font-display text-base font-semibold text-slate-900">Library timings for this week</p>
            <p className="mt-0.5 text-xs text-slate-500">General · Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRIORITY_DEMO = [
  { label: 'Urgent', text: 'Exam hall change, reported today', row: 'border-red-200 bg-red-50', bar: 'bg-red-500', pill: 'bg-red-600 text-white' },
  { label: 'Important', text: 'Scholarship form deadline', row: 'border-amber-200 bg-amber-50', bar: 'bg-amber-400', pill: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300' },
  { label: 'Normal', text: 'Cultural club meeting notes', row: 'border-slate-200 bg-white', bar: 'bg-slate-200', pill: 'bg-slate-100 text-slate-600' },
];

const SMALL_FEATURES = [
  { icon: Lock, title: 'Private to your college', text: 'Students and faculty only ever see notices and comments from their own college.' },
  { icon: Search, title: 'Search and filter', text: 'Find any notice by title or content, then narrow it by category or priority.' },
  { icon: MessageSquare, title: 'Questions on the notice', text: 'Students ask in the comments, so the answer is there for everyone who reads next.' },
  { icon: Paperclip, title: 'PDFs and images', text: 'Attach the circular, the timetable or the poster directly to the notice.' },
];

const STEPS = [
  { title: 'Choose your college', text: 'Pick your college when you sign up. Faculty can add their college if it is not listed yet.' },
  { title: 'Faculty publish a notice', text: 'Add a title, details and a category, mark it Normal, Important or Urgent, and attach a file if needed.' },
  { title: 'Students read and reply', text: 'Urgent notices appear first on the dashboard. Students search, open the notice and comment.' },
];

const STUDENT_POINTS = [
  'Urgent and important notices are always at the top',
  'Search by title or content, filter by category',
  'Comment to ask a question on any notice',
];
const FACULTY_POINTS = [
  'Publish, edit and delete your notices in one place',
  'Choose a category and a priority for each notice',
  'Remove inappropriate comments from your notices',
];

function Checklist({ items }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ---------- page ---------- */

export default function Landing() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
          <div>
            <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Notices that reach students before the deadline does.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Faculty post once. Students see urgent notices first, search everything, and ask questions right on the
              notice. Every college gets its own private board.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">Create your account</Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">Log in</Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <Lock className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Each college sees only its own notices and comments.
            </p>
          </div>

          <BoardPreview />
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-y border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Everything a notice wall does, without the wall</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Nothing extra to learn. Faculty publish, students read, and the important things stay visible.
            </p>

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-paper p-6 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold">Urgent notices come first</h3>
                <p className="mt-2 max-w-md text-slate-600">
                  Faculty mark every notice as Normal, Important or Urgent. The board sorts and highlights them
                  automatically, so a last-minute exam change never gets buried.
                </p>
                <div className="mt-6 space-y-2.5" aria-hidden="true">
                  {PRIORITY_DEMO.map((p) => (
                    <div key={p.label} className={`relative flex items-center gap-3 overflow-hidden rounded-xl border py-3 pl-5 pr-4 ${p.row}`}>
                      <span className={`absolute inset-y-0 left-0 w-1.5 ${p.bar}`} />
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.pill}`}>{p.label}</span>
                      <span className="text-sm font-medium text-slate-800">{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {SMALL_FEATURES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-paper p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Up and running in three steps</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Audiences */}
        <section id="who-its-for" className="scroll-mt-20 border-y border-slate-200 bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
            <div className="rounded-2xl bg-paper p-6 sm:p-8">
              <h3 className="text-2xl font-semibold">For students</h3>
              <p className="mt-2 text-slate-600">One place to check instead of walking past three notice boards.</p>
              <Checklist items={STUDENT_POINTS} />
            </div>
            <div className="rounded-2xl bg-paper p-6 sm:p-8">
              <h3 className="text-2xl font-semibold">For faculty</h3>
              <p className="mt-2 text-slate-600">Publish in a minute and know that every student can see it.</p>
              <Checklist items={FACULTY_POINTS} />
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-start gap-8 overflow-hidden rounded-3xl bg-brand-800 p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Put your college notice board online</h2>
              <p className="mt-3 text-brand-100">
                Create an account, choose your college and start posting or reading in a couple of minutes.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/register" className="btn bg-white px-6 py-3 text-base text-brand-800 hover:bg-brand-50">Create your account</Link>
              <Link to="/login" className="btn border border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">Log in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <span className="flex items-center gap-2 font-medium text-slate-700">
            <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" /> Digital College Notice Board
          </span>
          <span>Built for colleges. Each college's data stays separate.</span>
        </div>
      </footer>
    </div>
  );
}