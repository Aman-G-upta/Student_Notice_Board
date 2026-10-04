import { useEffect, useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { addComment, deleteComment, fetchComments } from '../services/noticeService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { initials, timeAgo } from '../utils/helpers';
import { Spinner } from './Spinner';
import ConfirmDialog from './ConfirmDialog';

export default function CommentSection({ noticeId }) {
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchComments(noticeId)
      .then((c) => !cancelled && setComments(c))
      .catch((e) => !cancelled && setError(getErrorMessage(e, 'Could not load comments')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [noticeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const comment = await addComment(noticeId, text.trim());
      setComments((c) => [comment, ...c]);
      setText('');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not post your comment'));
    } finally {
      setPosting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteComment(toDelete._id);
      setComments((c) => c.filter((x) => x._id !== toDelete._id));
      setToDelete(null);
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete the comment'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section id="comments" className="card scroll-mt-24 p-5 sm:p-6" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5 text-brand-600" aria-hidden="true" />
        Comments {!loading && <span className="text-sm font-normal text-slate-500">({comments.length})</span>}
      </h2>

      <form onSubmit={submit} className="mt-4">
        <label htmlFor="comment-text" className="sr-only">Write a comment</label>
        <textarea
          id="comment-text"
          rows={3}
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question or add a comment"
          className="input resize-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">{text.length}/500</span>
          <button type="submit" className="btn-primary" disabled={posting || !text.trim()}>
            {posting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            Post comment
          </button>
        </div>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-6 text-brand-600"><Spinner /></div>
        ) : error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">No comments yet. Be the first to ask something.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {comments.map((c) => (
              <li key={c._id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {initials(c.user?.name || '?')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-sm">
                    <span className="font-semibold text-slate-900">{c.user?.name || 'Former user'}</span>
                    {c.user?.role === 'faculty' && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Faculty</span>
                    )}
                    <span className="text-xs text-slate-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{c.text}</p>
                </div>
                {c.canDelete && (
                  <button
                    type="button"
                    onClick={() => setToDelete(c)}
                    className="h-fit rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this comment?"
        message="This cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
