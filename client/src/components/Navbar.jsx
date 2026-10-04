import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Pin, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links =
    user.role === 'faculty'
      ? [
          { to: '/faculty', label: 'My notices', end: true },
          { to: '/notices/new', label: 'New notice' },
          { to: '/profile', label: 'Profile' },
        ]
      : [
          { to: '/dashboard', label: 'Notice board' },
          { to: '/profile', label: 'Profile' },
        ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Pin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-slate-900">Notice Board</span>
            <span className="block max-w-[11rem] truncate text-xs text-slate-500">{user.college?.name}</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs capitalize text-slate-500">{user.role}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials(user.name)}
          </span>
          <button type="button" onClick={handleLogout} className="btn-ghost px-3 py-2" aria-label="Log out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials(user.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role} · {user.college?.code}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
