import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, FileText, Pencil, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { deleteNotice, fetchNotice } from '../services/noticeService';
import { getErrorMessage } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import CommentSection from '../components/CommentSection';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/Spinner';
import { formatBytes, formatDateTime, isImageAttachment } from '../utils/helpers';

const BANNER = {
  urgent: 'border-red-200 bg-red-50',
  important: 'border-amber-200 bg-amber-50',
  normal: 'border-slate-200 bg-white',
};

export default function NoticeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchNotice(id)
      .then((n) => !cancelled && setNotice(n))
      .catch((e) => !cancelled && setError(getErrorMessage(e, 'Could not load this notice')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Jump to the comments when arriving via a "#comments" link.
  useEffect(() => {
    if (!loading && notice && location.hash === '#comments') {
      setTimeout(() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [loading, notice, location.hash]);

  const backTo = user.role === 'faculty' ? '/faculty' : '/dashboard';

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteNotice(notice._id);
      toast.success('Notice deleted');
      navigate(backTo, { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e, 'Could not delete the notice'));
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error || !notice) {
    return (
      <EmptyState
        icon={FileText}
        title="Notice not found"
        message={error || 'It may have been removed, or it does not belong to your college.'}
        action={<Link to={backTo} className="btn-primary">Back to notices</Link>}
      />
    );
  }

  const isOwner = user.role === 'faculty' && notice.createdBy?._id === user.id;
  const att = notice.attachment;
  const hasAttachment = Boolean(att?.url);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to notices
      </Link>

      <article className={`overflow-hidden rounded-2xl border shadow-card ${BANNER[notice.priority] || BANNER.normal}`}>
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={notice.priority} showNormal />
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
              {notice.category}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl">{notice.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {notice.createdBy?.name || 'Faculty'}
              {notice.createdBy?.department ? `, ${notice.createdBy.department}` : ''}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatDateTime(notice.createdAt)}
            </span>
          </div>

          <p className="mt-6 max-w-prose whitespace-pre-wrap break-words text-base leading-relaxed text-slate-700">
            {notice.description}
          </p>

          {hasAttachment && (
            <div className="mt-8">
              {isImageAttachment(att) && (
                <a href={att.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img src={att.url} alt={att.originalName || 'Notice attachment'} className="max-h-[28rem] w-full object-contain" loading="lazy" />
                </a>
              )}
              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex max-w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-brand-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate font-medium text-slate-900">{att.originalName || 'Attachment'}</span>
                  <span className="block text-xs text-slate-500">
                    {att.format ? att.format.toUpperCase() : 'File'}{att.size ? ` · ${formatBytes(att.size)}` : ''}
                  </span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              </a>
            </div>
          )}

          {isOwner && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-black/5 pt-5">
              <Link to={`/notices/${notice._id}/edit`} className="btn-secondary">
                <Pencil className="h-4 w-4" aria-hidden="true" /> Edit notice
              </Link>
              <button type="button" className="btn-secondary text-red-600 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
              </button>
            </div>
          )}
        </div>
      </article>

      <CommentSection noticeId={notice._id} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this notice?"
        message="The notice and all of its comments will be removed for everyone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
