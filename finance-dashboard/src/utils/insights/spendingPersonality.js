/**
 * spendingPersonality.js
 *
 * Determines a user's "spending personality" label and explanation
 * from a list of (already-filtered) transactions.
 */

import {
  PERSONALITY_THRESHOLDS as T,
  ESSENTIALS_CATEGORIES,
  FOOD_CATEGORY,
} from '../../constants/insightConfig';

import {
  sumAmounts,
  getTotalsByGroup,
  getTopEntry,
  getWeekendTransactions,
  shareOf,
} from './insightRules';

import { getMerchantStats, joinLabels } from './merchantUtils';

// ── Personality Matchers (evaluated in priority order) ──────────

const personalityMatchers = [
  {
    test: ({ topCategory, topCategoryShare, expenseTransactions }) => {
      if (topCategory !== FOOD_CATEGORY || topCategoryShare < T.foodieCategoryShare) return null;

      const topFoodMerchant = getMerchantStats(
        expenseTransactions.filter((t) => t.category === FOOD_CATEGORY)
      )[0];

      return {
        label: 'Foodie',
        explanation: topFoodMerchant
          ? `Food dominates your spend, and ${topFoodMerchant.label} shows up as a favorite.`
          : 'Food dominates your spending across the current filtered view.',
        suggestion: 'Try setting a weekly dining budget to keep it in check.',
      };
    },
  },
  {
    test: ({ convenienceCount, convenienceShare, convenienceMerchants }) => {
      if (convenienceCount < T.convenienceMinCount || convenienceShare < T.convenienceMinShare) {
        return null;
      }

      return {
        label: 'Convenience Spender',
        explanation: `${joinLabels(
          convenienceMerchants.slice(0, 2).map((m) => m.label)
        )} appear often, which points to quick-order habits.`,
        suggestion: 'Try reducing delivery spending to save more.',
      };
    },
  },
  {
    test: ({ weekendShare, weekendTransactions }) => {
      if (weekendShare < T.weekendMinShare || weekendTransactions.length < T.weekendMinTransactions) {
        return null;
      }

      return {
        label: 'Weekend Spender',
        explanation: 'Most of your expenses land on weekends instead of weekdays.',
        suggestion: 'A small weekend budget cap could help you save steadily.',
      };
    },
  },
  {
    test: ({ essentialsShare }) => {
      if (essentialsShare < T.essentialsMinShare) return null;

      return {
        label: 'Essentials First',
        explanation: 'Core needs like rent, bills, health, and transport take most of your money.',
        suggestion: 'Review recurring bills first if you want easier savings.',
      };
    },
  },
  {
    test: ({ categoryCount, topCategoryShare }) => {
      if (categoryCount >= T.balancedMinCategories && topCategoryShare <= T.balancedMaxTopShare) {
        return {
          label: 'Balanced Spender',
          explanation: 'Your spending is fairly spread out, with no single category dominating.',
        };
      }
      return null;
    },
  },
];

const DEFAULT_PERSONALITY = {
  label: 'Balanced Spender',
  explanation: 'Your filtered spending looks steady, without one habit clearly taking over.',
};

const TOO_FEW_TRANSACTIONS = {
  label: 'Balanced Spender',
  explanation: 'There is not enough filtered spending data yet to reveal one strong habit.',
};

// ── Public API ─────────────────────────────────────────────────

/**
 * Derive a spending-personality label + explanation from transactions.
 *
 * @param {Array} transactions – already-filtered transaction list
 * @returns {{ label: string, explanation: string, suggestion?: string }}
 */
export function getSpendingPersonality(transactions) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  if (expenseTransactions.length < T.minimumTransactions) {
    return TOO_FEW_TRANSACTIONS;
  }

  const totalExpense = sumAmounts(expenseTransactions);
  const categoryTotals = getTotalsByGroup(expenseTransactions, (t) => t.category);
  const [topCategory, topCategoryTotal] = getTopEntry(Object.entries(categoryTotals)) || [];
  const topCategoryShare = shareOf(topCategoryTotal, totalExpense);

  const merchantStats = getMerchantStats(expenseTransactions);
  const convenienceMerchants = merchantStats.filter((m) => m.isConvenience);
  const convenienceTotal = convenienceMerchants.reduce((sum, m) => sum + m.total, 0);
  const convenienceCount = convenienceMerchants.reduce((sum, m) => sum + m.count, 0);
  const convenienceShare = shareOf(convenienceTotal, totalExpense);

  const weekendTransactions = getWeekendTransactions(expenseTransactions);
  const weekendTotal = sumAmounts(weekendTransactions);
  const weekendShare = shareOf(weekendTotal, totalExpense);

  const essentialsTotal = expenseTransactions
    .filter((t) => ESSENTIALS_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const essentialsShare = shareOf(essentialsTotal, totalExpense);

  const categoryCount = Object.keys(categoryTotals).length;

  // Build context object once, pass to every matcher
  const ctx = {
    expenseTransactions,
    totalExpense,
    topCategory,
    topCategoryShare,
    convenienceMerchants,
    convenienceCount,
    convenienceShare,
    weekendTransactions,
    weekendShare,
    essentialsShare,
    categoryCount,
  };

  for (const { test } of personalityMatchers) {
    const result = test(ctx);
    if (result) return result;
  }

  return DEFAULT_PERSONALITY;
}
