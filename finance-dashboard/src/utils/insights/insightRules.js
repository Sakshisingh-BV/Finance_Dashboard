/**
 * insightRules.js
 *
 * Pure helpers and predicate functions that encapsulate the
 * "rules" behind insight generation: grouping, date math,
 * amount aggregation, and threshold checks.
 *
 * Nothing in here knows about UI or wording — just data logic.
 */

import { formatCurrency } from '../../Data/mockData';
import { DAY_LABELS } from '../../constants/insightConfig';

// ── Date Utilities ─────────────────────────────────────────────

export const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
};

export const formatInsightDate = (dateStr) =>
  parseDate(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const getMonthKey = (dateStr) => dateStr.slice(0, 7);

// ── Math Utilities ─────────────────────────────────────────────

export const roundPercent = (value) => Math.round(value);

export const sumAmounts = (transactions) =>
  transactions.reduce((sum, t) => sum + t.amount, 0);

export const percentChange = (current, previous) =>
  previous === 0 ? null : ((current - previous) / previous) * 100;

export const shareOf = (part, total) =>
  total > 0 ? part / total : 0;

// ── Grouping Utilities ─────────────────────────────────────────

export const getTotalsByGroup = (transactions, getKey) =>
  transactions.reduce((map, transaction) => {
    const key = getKey(transaction);
    if (!key) return map;
    map[key] = (map[key] || 0) + transaction.amount;
    return map;
  }, {});

export const getCountsByGroup = (transactions, getKey) =>
  transactions.reduce((map, transaction) => {
    const key = getKey(transaction);
    if (!key) return map;
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});

export const getTopEntry = (entries) =>
  [...entries].sort((a, b) => {
    if (b[1] === a[1]) return String(a[0]).localeCompare(String(b[0]));
    return b[1] - a[1];
  })[0];

// ── Transaction Partitions ─────────────────────────────────────

export const getExpenseTransactions = (transactions) =>
  transactions.filter((t) => t.type === 'expense');

export const getIncomeTransactions = (transactions) =>
  transactions.filter((t) => t.type === 'income');

export const getWeekendTransactions = (transactions) =>
  transactions.filter((t) => {
    const day = parseDate(t.date).getDay();
    return day === 0 || day === 6;
  });

export const getWeekdayTransactions = (transactions) =>
  transactions.filter((t) => {
    const day = parseDate(t.date).getDay();
    return day !== 0 && day !== 6;
  });

export const getDayLabel = (transaction) => {
  const dayIndex = parseDate(transaction.date).getDay();
  return DAY_LABELS[dayIndex];
};

// ── Income Timing Window ───────────────────────────────────────

export const getIncomeTimingWindow = (transaction) => {
  const day = parseDate(transaction.date).getDate();
  if (day <= 5) return 'start';
  if (day <= 20) return 'mid';
  return 'end';
};

// ── Sorted Month Keys ──────────────────────────────────────────

export const getSortedMonthKeys = (monthlyTotals) =>
  Object.keys(monthlyTotals).sort();

// ── Largest Transaction ────────────────────────────────────────

export const getLargestTransaction = (transactions) =>
  [...transactions].sort((a, b) => b.amount - a.amount)[0] || null;
