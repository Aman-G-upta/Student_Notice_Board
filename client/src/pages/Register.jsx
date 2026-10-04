import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { fetchAuthConfig, fetchColleges } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { homePathFor } from '../routes/ProtectedRoute';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [collegesState, setCollegesState] = useState('loading'); // loading | ready | error
  const [facultyCodeRequired, setFacultyCodeRequired] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', collegeId: '', department: '', facultyCode: '',
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchColleges(), fetchAuthConfig().catch(() => ({}))])
      .then(([list, config]) => {
        setColleges(list);
        setFacultyCodeRequired(Boolean(config.facultyCodeRequired));
        setCollegesState('ready');
      })
      .catch(() => setCollegesState('error'));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your full name');
    if (!form.collegeId) return setError('Please select your college');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const user = await register(form);
      navigate(homePathFor(user), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Pick your college to see only its notices."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <fieldset>
          <legend className="label">I am a</legend>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            {['student', 'faculty'].map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-lg py-2 text-center text-sm font-semibold capitalize transition focus-within:ring-2 focus-within:ring-brand-500 ${
                  form.role === r ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <input type="radio" name="role" value={r} checked={form.role === r} onChange={set('role')} className="sr-only" />
                {r}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" autoComplete="name" value={form.name} onChange={set('name')} className="input" placeholder="Aarav Sharma" />
        </div>

        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className="input" placeholder="you@college.edu" />
        </div>

        <div>
          <label htmlFor="college" className="label">College</label>
          <select id="college" value={form.collegeId} onChange={set('collegeId')} className="input" disabled={collegesState !== 'ready'}>
            <option value="">
              {collegesState === 'loading' ? 'Loading colleges...' : 'Select your college'}
            </option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
            ))}
          </select>
          {collegesState === 'error' && (
            <p className="mt-1.5 text-xs text-red-600">Could not load colleges. Check that the server is running.</p>
          )}
          {collegesState === 'ready' && colleges.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-700">No colleges found. Run <code>npm run seed</code> in the server folder first.</p>
          )}
        </div>

        <div>
          <label htmlFor="department" className="label">
            Department <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input id="department" value={form.department} onChange={set('department')} className="input" placeholder="Computer Engineering" />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              className="input pr-11"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {form.role === 'faculty' && facultyCodeRequired && (
          <div>
            <label htmlFor="facultyCode" className="label">Faculty invite code</label>
            <input id="facultyCode" value={form.facultyCode} onChange={set('facultyCode')} className="input" placeholder="Ask your administrator" />
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
