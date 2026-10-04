import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { Spinner } from '../components/Spinner';
import { formatDate, initials } from '../utils/helpers';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user.name, department: user.department || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dirty = form.name.trim() !== user.name || form.department.trim() !== (user.department || '');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your full name');
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update your profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-display text-3xl font-bold text-white">
          {initials(user.name)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold">{user.name}</h2>
          <span className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
            {user.role}
          </span>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">Email</dt>
              <dd className="truncate">{user.email}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">College</dt>
              <dd>{user.college?.name} ({user.college?.code})</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-400">Member since {formatDate(user.createdAt)}</p>
        </div>
      </section>

      <form onSubmit={submit} className="card space-y-5 p-5 sm:p-8" noValidate>
        <h2 className="text-lg font-semibold">Edit details</h2>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </div>
          <div>
            <label htmlFor="department" className="label">Department</label>
            <input id="department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="input" placeholder="Optional" />
          </div>
        </div>
        <p className="text-xs text-slate-500">Your email, role and college cannot be changed.</p>
        <button type="submit" className="btn-primary" disabled={saving || !dirty}>
          {saving && <Spinner className="h-4 w-4" />}
          Save changes
        </button>
      </form>

      <button
        type="button"
        onClick={() => { logout(); navigate('/', { replace: true }); }}
        className="btn-secondary w-full text-red-600 hover:bg-red-50 sm:w-auto"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
      </button>
    </div>
  );
}
