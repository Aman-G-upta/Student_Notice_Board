import { Flag } from 'lucide-react';

export default function PriorityBadge({ priority, showNormal = false }) {
  if (priority === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        Urgent
      </span>
    );
  }
  if (priority === 'important') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-300">
        <Flag className="h-3 w-3" aria-hidden="true" />
        Important
      </span>
    );
  }
  if (!showNormal) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Normal
    </span>
  );
}
