import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'h-5 w-5' }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-brand-600" role="status">
      <Spinner className="h-7 w-7" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
