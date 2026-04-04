/**
 * filterTransactions.js
 *
 * Single source of truth for filtering & sorting transactions.
 * Used by both the TransactionTable and InsightsPanel so the
 * same filter semantics are applied everywhere.
 */

// ── Predicates ─────────────────────────────────────────────────

const isFutureDate = (dateStr) => {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return new Date(`${dateStr}T00:00:00`) > todayOnly;
};

const matchesType = (transaction, type) =>
  !type || type === 'all' || transaction.type === type;

const matchesCategory = (transaction, category) =>
  !category || category === 'all' || transaction.category === category;

const matchesSearch = (transaction, search) => {
  if (!search?.trim()) return true;
  const query = search.toLowerCase();
  return (
    transaction.description.toLowerCase().includes(query) ||
    transaction.category.toLowerCase().includes(query) ||
    transaction.amount.toString().includes(query)
  );
};

const matchesDateFilters = (transaction, filters) => {
  const { date: exactDate, startDate, endDate, month, year, dateRange } = filters;

  if (exactDate && transaction.date !== exactDate) return false;
  if (startDate && transaction.date < startDate) return false;
  if (endDate && transaction.date > endDate) return false;
  if (month && !transaction.date.startsWith(month)) return false;
  if (year && !transaction.date.startsWith(String(year))) return false;
  if (dateRange?.start && transaction.date < dateRange.start) return false;
  if (dateRange?.end && transaction.date > dateRange.end) return false;

  return true;
};

// ── Sorting ────────────────────────────────────────────────────

const SORT_COMPARATORS = {
  date: (a, b) => new Date(a.date) - new Date(b.date),
  amount: (a, b) => a.amount - b.amount,
  category: (a, b) => a.category.localeCompare(b.category),
  description: (a, b) => a.description.localeCompare(b.description),
};

const sortTransactions = (data, sortBy, sortOrder) => {
  const comparator = SORT_COMPARATORS[sortBy];
  if (!comparator) return data;

  return [...data].sort((a, b) => {
    const cmp = comparator(a, b);
    return sortOrder === 'asc' ? cmp : -cmp;
  });
};

// ── Main Filter Function ───────────────────────────────────────

/**
 * Filter and optionally sort transactions.
 *
 * @param {Array}  transactions  – the full transaction list
 * @param {Object} filters       – filter criteria
 * @param {string} [filters.type]
 * @param {string} [filters.category]
 * @param {string} [filters.search]
 * @param {string} [filters.date]
 * @param {string} [filters.startDate]
 * @param {string} [filters.endDate]
 * @param {string} [filters.month]
 * @param {number|string} [filters.year]
 * @param {Object} [filters.dateRange]
 * @param {string} [filters.sortBy]
 * @param {string} [filters.sortOrder]
 * @param {Object} options
 * @param {boolean} [options.excludeFuture=false] – drop transactions dated after today
 * @returns {Array} filtered (and sorted, if sortBy is provided) transactions
 */
export function filterTransactions(transactions, filters = {}, options = {}) {
  const { excludeFuture = false } = options;

  const filtered = transactions.filter((transaction) => {
    if (excludeFuture && isFutureDate(transaction.date)) return false;
    if (!matchesType(transaction, filters.type)) return false;
    if (!matchesCategory(transaction, filters.category)) return false;
    if (!matchesSearch(transaction, filters.search)) return false;
    if (!matchesDateFilters(transaction, filters)) return false;
    return true;
  });

  if (filters.sortBy) {
    return sortTransactions(filtered, filters.sortBy, filters.sortOrder || 'desc');
  }

  return filtered;
}
