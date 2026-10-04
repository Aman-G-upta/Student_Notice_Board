import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold">This page is not on the board</h1>
      <p className="mt-2 text-slate-500">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="btn-primary mt-6">Go to home</Link>
    </div>
  );
}
