import { useMemo, useState, useRef, useEffect } from 'react';
import { useApp } from '../../Context/AppContext';
import { formatCurrency, formatDate, ALL_CATEGORIES } from '../../Data/mockData';
import { filterTransactions } from '../../utils/filterTransactions';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  X,
  Inbox,
} from 'lucide-react';

const BATCH_SIZE = 10;

const TransactionTable = ({ onEdit }) => {
  const { state, dispatch } = useApp();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);

  const { type, category, search, sortBy, sortOrder } = state.filters;
  const isAdmin = state.role === 'admin';

  // ── Filtered + sorted data (uses centralized filter)
  const filtered = useMemo(
    () => filterTransactions(state.transactions, state.filters),
    [state.transactions, type, category, search, sortBy, sortOrder]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [type, category, search, sortBy, sortOrder]);

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= filtered.length) return prev;
            return Math.min(prev + BATCH_SIZE, filtered.length);
          });
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      dispatch({ type: 'SET_FILTER', payload: { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: col, sortOrder: 'desc' } });
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ArrowUpDown size={14} className="text-slate-300 dark:text-slate-600" />;
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-violet-500" />
    ) : (
      <ArrowDown size={14} className="text-violet-500" />
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  // Unique categories from current data
  const uniqueCategories = useMemo(
    () => [...new Set(state.transactions.map((t) => t.category))].sort(),
    [state.transactions],
  );

  return (
    <div className="space-y-4">
      {/* ── Search + Filter bar ─────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
          />
          {search && (
            <button
              onClick={() => dispatch({ type: 'SET_FILTER', payload: { search: '' } })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilters || type !== 'all' || category !== 'all'
              ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {(type !== 'all' || category !== 'all') && (
            <span className="w-2 h-2 rounded-full bg-violet-500" />
          )}
        </button>
      </div>

      {/* ── Filter panel ──────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-slide-down">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Type</label>
            <select
              value={type}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } })}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } })}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(type !== 'all' || category !== 'all') && (
            <button
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              className="self-end px-3 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Results count ──────────────────── */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Showing {visible.length} of {filtered.length} transactions
      </p>

      {/* ── Table ─────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <Inbox size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-base font-medium text-slate-500 dark:text-slate-400">
            No transactions found
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
            {search || type !== 'all' || category !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Add your first transaction to get started.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  {[
                    { col: 'date', label: 'Date' },
                    { col: 'description', label: 'Description' },
                    { col: 'category', label: 'Category' },
                    { col: 'amount', label: 'Amount' },
                  ].map(({ col, label }) => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col)}
                      className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {label}
                        <SortIcon col={col} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                {visible.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-200 max-w-[200px] truncate">
                      {t.description}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 font-semibold whitespace-nowrap ${
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          t.type === 'income'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors mr-1"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Infinite Scroll Sentinel ──── */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-violet-500 rounded-full animate-spin" />
                Loading more...
              </div>
            </div>
          )}
          {!hasMore && filtered.length > BATCH_SIZE && (
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-3 border-t border-slate-100 dark:border-slate-700/50">
              All {filtered.length} transactions loaded
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
