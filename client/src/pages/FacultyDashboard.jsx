import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus2, Plus, SearchX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { deleteNotice, fetchNotices } from '../services/noticeService';
import { getErrorMessage } from '../services/api';
import FilterBar from '../components/FilterBar';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { PageLoader, Spinner } from '../components/Spinner';

const PAGE_SIZE = 12;
const EMPTY_FILTERS = { search: '', category: '', priority: '' };

export default function FacultyDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ notices: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(filters.search), 350);
    return () => clearTimeout(t);
  }, [filters.search]);

  const params = { mine: true, search, category: filters.category, priority: filters.priority, limit: PAGE_SIZE };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchNotices({ ...params, page: 1 })
      .then((res) => !cancelled && setData(res))
      .catch((e) => !cancelled && setError(getErrorMessage(e, 'Could not load your notices')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters.category, filters.priority]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetchNotices({ ...params, page: data.page + 1 });
      setData((d) => ({ ...res, notices: [...d.notices, ...res.notices] }));
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load more notices'));
    } finally {
      setLoadingMore(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteNotice(toDelete._id);
      setData((d) => ({ ...d, total: d.total - 1, notices: d.notices.filter((n) => n._id !== toDelete._id) }));
      setToDelete(null);
      toast.success('Notice deleted');
    } catch (e) {
      toast.error(getErrorMessage(e, 'Could not delete the notice'));
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(filters.search || filters.category || filters.priority);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">{user.college?.name}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">My notices</h1>
          <p className="mt-2 text-slate-500">
            {loading ? 'Loading...' : `${data.total} ${data.total === 1 ? 'notice' : 'notices'} published by you`}
          </p>
        </div>
        <Link to="/notices/new" className="btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" aria-hidden="true" /> New notice
        </Link>
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
          <EmptyState
            icon={FilePlus2}
            title="You have not published anything yet"
            message="Your notices appear here once you publish them. Students in your college see them right away."
            action={<Link to="/notices/new" className="btn-primary">Publish your first notice</Link>}
          />
        )
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data.notices.map((n) => (
              <NoticeCard key={n._id} notice={n} editTo={`/notices/${n._id}/edit`} onDelete={setToDelete} />
            ))}
          </div>
          {data.page < data.pages && (
            <div className="flex justify-center">
              <button className="btn-secondary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore && <Spinner className="h-4 w-4" />}
                Load more notices
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this notice?"
        message={toDelete ? `"${toDelete.title}" and all of its comments will be removed for everyone.` : ''}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
