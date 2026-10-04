import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Paperclip, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createNotice, fetchNotice, updateNotice } from '../services/noticeService';
import { getErrorMessage } from '../services/api';
import { PageLoader, Spinner } from '../components/Spinner';
import { CATEGORIES, PRIORITIES, formatBytes } from '../utils/helpers';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const PRIORITY_STYLE = {
  normal: 'peer-checked:border-slate-400 peer-checked:bg-slate-50',
  important: 'peer-checked:border-amber-400 peer-checked:bg-amber-50',
  urgent: 'peer-checked:border-red-500 peer-checked:bg-red-50',
};
const DOT = { normal: 'bg-slate-400', important: 'bg-amber-400', urgent: 'bg-red-500' };

export default function NoticeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '', category: 'General', priority: 'normal' });
  const [file, setFile] = useState(null);
  const [existing, setExisting] = useState(null); // attachment already saved on the notice
  const [removeExisting, setRemoveExisting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    fetchNotice(id)
      .then((n) => {
        if (cancelled) return;
        if (n.createdBy?._id !== user.id) {
          toast.error('You can only edit notices you created');
          navigate('/faculty', { replace: true });
          return;
        }
        setForm({ title: n.title, description: n.description, category: n.category, priority: n.priority });
        setExisting(n.attachment?.url ? n.attachment : null);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        toast.error(getErrorMessage(e, 'Could not load this notice'));
        navigate('/faculty', { replace: true });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!ALLOWED.includes(picked.type)) {
      setError('Only PDF, JPG, PNG or WEBP files can be attached');
      e.target.value = '';
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError('That file is larger than 5 MB');
      e.target.value = '';
      return;
    }
    setError('');
    setFile(picked);
  };

  const clearFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters');
    if (!form.description.trim()) return setError('Please add a description');

    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('description', form.description.trim());
    data.append('category', form.category);
    data.append('priority', form.priority);
    if (file) data.append('attachment', file);
    if (isEdit && removeExisting && !file) data.append('removeAttachment', 'true');

    setSaving(true);
    try {
      const notice = isEdit ? await updateNotice(id, data) : await createNotice(data);
      toast.success(isEdit ? 'Notice updated' : 'Notice published');
      navigate(`/notices/${notice._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the notice'));
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const showExisting = existing && !removeExisting && !file;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/faculty" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to my notices
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{isEdit ? 'Edit notice' : 'New notice'}</h1>
      <p className="mt-2 text-slate-500">
        Visible to everyone at <span className="font-medium text-slate-700">{user.college?.name}</span>.
      </p>

      <form onSubmit={submit} className="card mt-6 space-y-6 p-5 sm:p-8" noValidate>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div>
          <label htmlFor="title" className="label">Title</label>
          <input id="title" value={form.title} onChange={set('title')} maxLength={150} className="input" placeholder="e.g. Semester 5 exam timetable" />
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" rows={7} value={form.description} onChange={set('description')} maxLength={5000} className="input resize-y" placeholder="Write the full details students need to know" />
        </div>

        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" value={form.category} onChange={set('category')} className="input sm:max-w-xs">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <fieldset>
          <legend className="label">Priority</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {PRIORITIES.map((p) => (
              <label key={p.value} className="block cursor-pointer">
                <input type="radio" name="priority" value={p.value} checked={form.priority === p.value} onChange={set('priority')} className="peer sr-only" />
                <span className={`block h-full rounded-xl border border-slate-200 bg-white p-3.5 transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 ${PRIORITY_STYLE[p.value]}`}>
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className={`h-2.5 w-2.5 rounded-full ${DOT[p.value]}`} aria-hidden="true" />
                    {p.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{p.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <span className="label">
            Attachment <span className="font-normal text-slate-400">(optional, PDF or image, up to 5 MB)</span>
          </span>

          {showExisting && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <FileText className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
              <a href={existing.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate font-medium text-slate-800 hover:underline">
                {existing.originalName || 'Current attachment'}
              </a>
              <button type="button" onClick={() => setRemoveExisting(true)} className="text-sm font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
          )}

          {existing && removeExisting && !file && (
            <p className="mb-2 text-sm text-slate-500">
              The current attachment will be removed when you save.{' '}
              <button type="button" onClick={() => setRemoveExisting(false)} className="font-medium text-brand-700 hover:underline">Undo</button>
            </p>
          )}

          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
              <Paperclip className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-medium text-slate-800">{file.name}</span>
              <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
              <button type="button" onClick={clearFile} className="rounded-lg p-1 text-slate-500 hover:bg-white" aria-label="Remove selected file">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            !showExisting && (
              <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500">
                <Paperclip className="h-6 w-6 text-slate-400" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-700">Choose a file to attach</span>
                <span className="text-xs text-slate-500">PDF, JPG, PNG or WEBP</span>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" onChange={pickFile} className="sr-only" />
              </label>
            )
          )}

          {showExisting && (
            <p className="mt-2 text-xs text-slate-500">To replace it, remove the current attachment and choose a new file.</p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <Link to="/faculty" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            {isEdit ? 'Save changes' : 'Publish notice'}
          </button>
        </div>
      </form>
    </div>
  );
}
