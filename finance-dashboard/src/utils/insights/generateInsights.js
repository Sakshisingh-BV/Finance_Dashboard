/**
 * generateInsights.js
 *
 * Produces the array of insight objects that the InsightsPanel renders.
 * Each insight generator is a small, focused function.
 */

import { formatCurrency } from '../../Data/mockData';
import { INSIGHT_THRESHOLDS as T, INCOME_TIMING_WINDOWS } from '../../constants/insightConfig';

import {
  sumAmounts,
  getTotalsByGroup,
  getCountsByGroup,
  getTopEntry,
  getMonthKey,
  formatMonthLabel,
  formatInsightDate,
  roundPercent,
  shareOf,
  getExpenseTransactions,
  getIncomeTransactions,
  getWeekendTransactions,
  getWeekdayTransactions,
  getDayLabel,
  getLargestTransaction,
  getIncomeTimingWindow,
  getSortedMonthKeys,
} from './insightRules';

import { getMerchantStats, joinLabels } from './merchantUtils';

// ── Expense Insight Generators ─────────────────────────────────

function getTopCategoryInsight(expenses, totalExpense) {
  const categoryTotals = getTotalsByGroup(expenses, (t) => t.category);
  const [topCategory, topCategoryTotal] = getTopEntry(Object.entries(categoryTotals)) || [];

  if (!topCategory) return null;

  const categoryTransactions = expenses.filter((t) => t.category === topCategory);
  const categoryShare = totalExpense > 0 ? roundPercent((topCategoryTotal / totalExpense) * 100) : 0;
  const topMerchant = getMerchantStats(categoryTransactions)[0];

  return {
    kind: 'top-category',
    label: 'Biggest Spend Area',
    title:
      categoryShare >= T.categoryDominancePercent
        ? `${topCategory} dominates this view`
        : `${topCategory} leads your spending`,
    detail: topMerchant
      ? `${topMerchant.label} accounts for ${formatCurrency(topMerchant.total)} of it.`
      : `${formatCurrency(topCategoryTotal)} went here, or ${categoryShare}% of your spend.`,
  };
}

function getMonthlyMomentumInsight(expenses) {
  const monthlyTotals = getTotalsByGroup(expenses, (t) => getMonthKey(t.date));
  const monthlyCounts = getCountsByGroup(expenses, (t) => getMonthKey(t.date));
  const months = getSortedMonthKeys(monthlyTotals);
  const latestMonth = months.at(-1);

  if (!latestMonth) return null;

  if (months.length === 1) {
    return {
      kind: 'momentum',
      label: 'Spending Momentum',
      title: `${formatMonthLabel(latestMonth)} holds all visible spending`,
      detail: `${monthlyCounts[latestMonth]} expense entries add up to ${formatCurrency(
        monthlyTotals[latestMonth]
      )}.`,
    };
  }

  const previousMonth = months.at(-2);
  const latestTotal = monthlyTotals[latestMonth];
  const previousTotal = monthlyTotals[previousMonth];

  if (previousTotal === 0) {
    return {
      kind: 'momentum',
      label: 'Spending Momentum',
      title: `Spending kicked in during ${formatMonthLabel(latestMonth)}`,
      detail: `${formatCurrency(latestTotal)} landed in ${formatMonthLabel(
        latestMonth
      )}, after no spend in ${formatMonthLabel(previousMonth)}.`,
    };
  }

  const change = ((latestTotal - previousTotal) / previousTotal) * 100;
  const roundedChange = Math.abs(roundPercent(change));

  let title = `Spending stayed almost flat versus ${formatMonthLabel(previousMonth)}`;
  if (roundedChange >= T.momentumFlatPercent) {
    title =
      change > 0
        ? `Spending is up ${roundedChange}% versus ${formatMonthLabel(previousMonth)}`
        : `Spending is down ${roundedChange}% versus ${formatMonthLabel(previousMonth)}`;
  }

  return {
    kind: 'momentum',
    label: 'Spending Momentum',
    title,
    detail: `${formatCurrency(latestTotal)} in ${formatMonthLabel(latestMonth)} vs ${formatCurrency(
      previousTotal
    )} before that.`,
  };
}

function getMerchantHabitInsight(expenses, totalExpense) {
  const merchantStats = getMerchantStats(expenses);
  const convenienceMerchants = merchantStats.filter((m) => m.isConvenience);
  const convenienceTotal = convenienceMerchants.reduce((sum, m) => sum + m.total, 0);
  const convenienceCount = convenienceMerchants.reduce((sum, m) => sum + m.count, 0);
  const convenienceShare = shareOf(convenienceTotal, totalExpense);

  if (convenienceCount >= T.merchantConvenienceMinCount && convenienceShare >= T.merchantConvenienceMinShare) {
    return {
      kind: 'merchant',
      label: 'Merchant Pattern',
      title: 'Convenience spending is showing up often',
      detail: `${joinLabels(convenienceMerchants.slice(0, 2).map((m) => m.label))} make up ${formatCurrency(
        convenienceTotal
      )} across ${convenienceCount} orders.`,
    };
  }

  const topMerchant = merchantStats[0];
  if (topMerchant && topMerchant.count >= T.merchantRepeatMinCount) {
    return {
      kind: 'merchant',
      label: 'Merchant Pattern',
      title: `${topMerchant.label} is your most repeated merchant`,
      detail: `${topMerchant.count} transactions there add up to ${formatCurrency(topMerchant.total)}.`,
    };
  }

  const averageExpense = expenses.length ? Math.round(totalExpense / expenses.length) : 0;

  return {
    kind: 'merchant',
    label: 'Merchant Pattern',
    title: 'Smaller repeat spends are shaping this view',
    detail: `Your average expense is ${formatCurrency(averageExpense)} across ${expenses.length} transactions.`,
  };
}

function getTimingInsight(expenses, totalExpense) {
  const weekendTx = getWeekendTransactions(expenses);
  const weekdayTx = getWeekdayTransactions(expenses);
  const weekendTotal = sumAmounts(weekendTx);
  const weekdayTotal = sumAmounts(weekdayTx);

  if (weekendTotal > 0 && weekdayTotal > 0) {
    if (weekendTotal >= weekdayTotal * T.weekendWeekdayRatio) {
      return {
        kind: 'timing',
        label: 'When You Spend',
        title: 'Weekend spending is higher than weekdays',
        detail: `${formatCurrency(weekendTotal)} lands on weekends vs ${formatCurrency(
          weekdayTotal
        )} during the week.`,
      };
    }

    if (weekdayTotal >= weekendTotal * T.weekendWeekdayRatio) {
      return {
        kind: 'timing',
        label: 'When You Spend',
        title: 'Weekday spending carries most of the load',
        detail: `${formatCurrency(weekdayTotal)} happens on weekdays vs ${formatCurrency(
          weekendTotal
        )} on weekends.`,
      };
    }
  }

  const dayTotals = getTotalsByGroup(expenses, getDayLabel);
  const [topDay, topDayTotal] = getTopEntry(Object.entries(dayTotals)) || [];

  return {
    kind: 'timing',
    label: 'When You Spend',
    title: topDay ? `${topDay} is your busiest spending day` : 'Your spend is spread through the week',
    detail: topDay
      ? `${formatCurrency(topDayTotal)} was spent on ${topDay.toLowerCase()}s.`
      : `${formatCurrency(totalExpense)} is distributed across multiple days.`,
  };
}

function getLargestExpenseInsight(expenses) {
  const largest = getLargestTransaction(expenses);
  if (!largest) return null;

  return {
    kind: 'largest-expense',
    label: 'Largest Expense',
    title: `${largest.description} was your biggest single expense`,
    detail: `${formatCurrency(largest.amount)} on ${formatInsightDate(largest.date)}.`,
  };
}

// ── Income Insight Generators ──────────────────────────────────

function getTopIncomeInsight(incomeTransactions, totalIncome) {
  const incomeCategoryTotals = getTotalsByGroup(incomeTransactions, (t) => t.category);
  const [topCategory, topCategoryTotal] = getTopEntry(Object.entries(incomeCategoryTotals)) || [];

  return {
    kind: 'top-category',
    label: 'Top Income Source',
    title: topCategory ? `${topCategory} leads this filtered view` : 'Income is the main story here',
    detail: topCategory
      ? `${formatCurrency(topCategoryTotal)} came from ${topCategory.toLowerCase()}.`
      : `${formatCurrency(totalIncome)} is visible in this view.`,
  };
}

function getIncomeMomentumInsight(incomeTransactions) {
  const monthlyTotals = getTotalsByGroup(incomeTransactions, (t) => getMonthKey(t.date));
  const months = getSortedMonthKeys(monthlyTotals);
  const latestMonth = months.at(-1);

  if (!latestMonth) return null;

  if (months.length === 1) {
    return {
      kind: 'momentum',
      label: 'Income Momentum',
      title: `${formatMonthLabel(latestMonth)} holds the visible income`,
      detail: `${formatCurrency(monthlyTotals[latestMonth])} was recorded in this month.`,
    };
  }

  const previousMonth = months.at(-2);
  const latestTotal = monthlyTotals[latestMonth];
  const previousTotal = monthlyTotals[previousMonth];

  if (previousTotal === 0) {
    return {
      kind: 'momentum',
      label: 'Income Momentum',
      title: `Income picked up in ${formatMonthLabel(latestMonth)}`,
      detail: `${formatCurrency(latestTotal)} arrived after no income in ${formatMonthLabel(
        previousMonth
      )}.`,
    };
  }

  const change = ((latestTotal - previousTotal) / previousTotal) * 100;
  const roundedChange = Math.abs(roundPercent(change));
  const title =
    change > 0
      ? `Income is up ${roundedChange}% versus ${formatMonthLabel(previousMonth)}`
      : `Income is down ${roundedChange}% versus ${formatMonthLabel(previousMonth)}`;

  return {
    kind: 'momentum',
    label: 'Income Momentum',
    title,
    detail: `${formatCurrency(latestTotal)} in ${formatMonthLabel(latestMonth)} vs ${formatCurrency(
      previousTotal
    )} before that.`,
  };
}

function getIncomeTimingInsight(incomeTransactions) {
  const dayCounts = getCountsByGroup(incomeTransactions, getIncomeTimingWindow);
  const [topWindow] = getTopEntry(Object.entries(dayCounts)) || [];

  const labelMap = {};
  for (const [key, config] of Object.entries(INCOME_TIMING_WINDOWS)) {
    labelMap[key] = config.label;
  }

  return {
    kind: 'timing',
    label: 'Payday Pattern',
    title: topWindow ? `Income usually lands ${labelMap[topWindow]}` : 'Income entries are spread out',
    detail: `${incomeTransactions.length} income transaction${
      incomeTransactions.length === 1 ? '' : 's'
    } are visible in this filtered view.`,
  };
}

function getLargestIncomeInsight(incomeTransactions) {
  const largest = getLargestTransaction(incomeTransactions);
  if (!largest) return null;

  return {
    kind: 'largest-expense',
    label: 'Largest Income',
    title: `${largest.description} was your biggest income entry`,
    detail: `${formatCurrency(largest.amount)} on ${formatInsightDate(largest.date)}.`,
  };
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Generate an array of insight objects from already-filtered transactions.
 *
 * @param {Array} transactions – filtered transaction list
 * @returns {Array<{ kind, label, title, detail }>}
 */
export function generateInsights(transactions) {
  if (!transactions.length) return [];

  const expenses = getExpenseTransactions(transactions);

  if (expenses.length === 0) {
    const income = getIncomeTransactions(transactions);
    const totalIncome = sumAmounts(income);

    return [
      getTopIncomeInsight(income, totalIncome),
      getIncomeMomentumInsight(income),
      getIncomeTimingInsight(income),
      getLargestIncomeInsight(income),
      {
        kind: 'merchant',
        label: 'Filtered View',
        title: 'This filter is focused on income activity',
        detail: `${income.length} income transaction${
          income.length === 1 ? '' : 's'
        } are shaping the current insights.`,
      },
    ].filter(Boolean);
  }

  const totalExpense = sumAmounts(expenses);

  return [
    getTopCategoryInsight(expenses, totalExpense),
    getMonthlyMomentumInsight(expenses),
    getMerchantHabitInsight(expenses, totalExpense),
    getTimingInsight(expenses, totalExpense),
    getLargestExpenseInsight(expenses),
  ].filter(Boolean);
}
