import { useEffect, useMemo, useState } from 'react';
import { Inbox, SearchX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchNotices } from '../services/noticeService';
import { getErrorMessage } from '../services/api';
import FilterBar from '../components/FilterBar';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';
import { PageLoader, Spinner } from '../components/Spinner';

const PAGE_SIZE = 12;
const EMPTY_FILTERS = { search: '', category: '', priority: '' };

function Section({ title, count, dot, children }) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="flex items-center gap-2.5 text-lg font-semibold">
        {dot && <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />}
        {title}
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">{count}</span>
      </h2>
      {children}
    </section>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ notices: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // Wait briefly after typing before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => setSearch(filters.search), 350);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchNotices({ search, category: filters.category, priority: filters.priority, page: 1, limit: PAGE_SIZE })
      .then((res) => !cancelled && setData(res))
      .catch((e) => !cancelled && setError(getErrorMessage(e, 'Could not load notices')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [search, filters.category, filters.priority]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetchNotices({
        search, category: filters.category, priority: filters.priority, page: data.page + 1, limit: PAGE_SIZE,
      });
      setData((d) => ({ ...res, notices: [...d.notices, ...res.notices] }));
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load more notices'));
    } finally {
      setLoadingMore(false);
    }
  };

  const { urgent, important, latest } = useMemo(
    () => ({
      urgent: data.notices.filter((n) => n.priority === 'urgent'),
      important: data.notices.filter((n) => n.priority === 'important'),
      latest: data.notices.filter((n) => n.priority === 'normal'),
    }),
    [data.notices]
  );

  const hasFilters = Boolean(filters.search || filters.category || filters.priority);
  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-brand-700">{user.college?.name}</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Hello, {firstName}</h1>
        <p className="mt-2 text-slate-500">Here is what is on your college notice board.</p>
      </header>

      <FilterBar
        filters={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <PageLoader label="Loading notices" />
      ) : data.notices.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No notices match your filters"
            message="Try a different search word, or clear the filters."
            action={<button className="btn-secondary" onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</button>}
          />
        ) : (
          <EmptyState icon={Inbox} title="The board is empty" message="New notices from your faculty will show up here." />
        )
      ) : (
        <div className="space-y-10">
          {urgent.length > 0 && (
            <Section title="Urgent" count={urgent.length} dot="bg-red-500">
              <div className="grid gap-4">
                {urgent.map((n) => <NoticeCard key={n._id} notice={n} featured />)}
              </div>
            </Section>
          )}

          {important.length > 0 && (
            <Section title="Important" count={important.length} dot="bg-amber-400">
              <div className="grid gap-4 md:grid-cols-2">
                {important.map((n) => <NoticeCard key={n._id} notice={n} />)}
              </div>
            </Section>
          )}

          {latest.length > 0 && (
            <Section title="Latest notices" count={latest.length}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {latest.map((n) => <NoticeCard key={n._id} notice={n} />)}
              </div>
            </Section>
          )}

          {data.page < data.pages && (
            <div className="flex justify-center">
              <button className="btn-secondary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore && <Spinner className="h-4 w-4" />}
                Load more notices
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
