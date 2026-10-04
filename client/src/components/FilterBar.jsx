import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../utils/helpers';

export default function FilterBar({ filters, onChange, onClear }) {
  const active = filters.search || filters.category || filters.priority;

  return (
    <div className="card space-y-4 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search notices by title or content"
            aria-label="Search notices"
            className="input pl-10"
          />
        </div>
        <select
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value })}
          aria-label="Filter by priority"
          className="input sm:w-48"
        >
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="important">Important</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by category">
        {['', ...CATEGORIES].map((c) => {
          const selected = filters.category === c;
          return (
            <button
              key={c || 'all'}
              type="button"
              onClick={() => onChange({ category: c })}
              aria-pressed={selected}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c || 'All'}
            </button>
          );
        })}
        {active && (
          <button type="button" onClick={onClear} className="ml-auto inline-flex shrink-0 items-center gap-1 px-2 text-sm font-medium text-brand-700 hover:underline">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
