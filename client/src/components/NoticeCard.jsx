import { Link } from 'react-router-dom';
import { MessageSquare, Paperclip, Pencil, Trash2 } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { timeAgo } from '../utils/helpers';

const TONE = {
  urgent: { card: 'border-red-200 bg-red-50 hover:border-red-300', bar: 'bg-red-500', title: 'text-red-950' },
  important: { card: 'border-amber-200 bg-amber-50 hover:border-amber-300', bar: 'bg-amber-400', title: 'text-slate-900' },
  normal: { card: 'border-slate-200 bg-white hover:border-slate-300', bar: 'bg-slate-200', title: 'text-slate-900' },
};

/**
 * One notice. The title is a "stretched link" so the whole card is clickable,
 * while the faculty action buttons sit above it.
 */
export default function NoticeCard({ notice, featured = false, onDelete, editTo }) {
  const tone = TONE[notice.priority] || TONE.normal;
  const hasActions = Boolean(onDelete || editTo);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border pl-1.5 shadow-card transition hover:shadow-lift ${tone.card}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`} aria-hidden="true" />

      <div className={`flex flex-1 flex-col gap-3 ${featured ? 'p-5 sm:p-6' : 'p-4 sm:p-5'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={notice.priority} />
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
            {notice.category}
          </span>
          <span className="ml-auto text-xs text-slate-500">{timeAgo(notice.createdAt)}</span>
        </div>

        <h3 className={`font-display font-semibold leading-snug ${featured ? 'text-xl sm:text-2xl' : 'text-lg'} ${tone.title}`}>
          <Link
            to={`/notices/${notice._id}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
          >
            {notice.title}
          </Link>
        </h3>

        <p className={`text-sm leading-relaxed text-slate-600 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {notice.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{notice.createdBy?.name || 'Faculty'}</span>
          {notice.attachment?.url && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" /> Attachment
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {notice.commentCount || 0} {notice.commentCount === 1 ? 'comment' : 'comments'}
          </span>

          {hasActions && (
            <span className="relative z-10 ml-auto flex items-center gap-1.5">
              {editTo && (
                <Link
                  to={editTo}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                </Link>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(notice)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
