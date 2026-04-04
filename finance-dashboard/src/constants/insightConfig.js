/**
 * insightConfig.js
 *
 * All thresholds, magic numbers, keyword mappings, and category
 * lists used by the insight engine live here.
 * Nothing in this file has runtime side-effects — it's pure config.
 */

// ── Merchant / Platform Patterns ───────────────────────────────

export const MERCHANT_PATTERNS = [
  { keyword: 'blinkit', label: 'Blinkit', isConvenience: true },
  { keyword: 'swiggy', label: 'Swiggy', isConvenience: true },
  { keyword: 'zomato', label: 'Zomato', isConvenience: true },
  { keyword: 'zepto', label: 'Zepto', isConvenience: true },
  { keyword: 'instamart', label: 'Instamart', isConvenience: true },
  { keyword: 'bigbasket', label: 'Big Basket', isConvenience: true },
  { keyword: 'big basket', label: 'Big Basket', isConvenience: true },
  { keyword: 'amazon fresh', label: 'Amazon Fresh', isConvenience: true },
  { keyword: 'uber eats', label: 'Uber Eats', isConvenience: true },
  { keyword: 'amazon', label: 'Amazon', isConvenience: false },
  { keyword: 'myntra', label: 'Myntra', isConvenience: false },
  { keyword: 'uber', label: 'Uber', isConvenience: false },
  { keyword: 'ola', label: 'Ola', isConvenience: false },
  { keyword: 'netflix', label: 'Netflix', isConvenience: false },
  { keyword: 'spotify', label: 'Spotify', isConvenience: false },
  { keyword: 'udemy', label: 'Udemy', isConvenience: false },
  { keyword: 'd-mart', label: 'D-Mart', isConvenience: false },
  { keyword: 'dmart', label: 'D-Mart', isConvenience: false },
];

// ── Day Labels ─────────────────────────────────────────────────

export const DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// ── Spending Personality Thresholds ────────────────────────────

export const PERSONALITY_THRESHOLDS = {
  /** Minimum share of top category to qualify as "Foodie" */
  foodieCategoryShare: 0.35,

  /** Minimum convenience order count for "Convenience Spender" */
  convenienceMinCount: 2,

  /** Minimum convenience spend share for "Convenience Spender" */
  convenienceMinShare: 0.18,

  /** Minimum weekend spend share for "Weekend Spender" */
  weekendMinShare: 0.55,

  /** Minimum weekend transactions for "Weekend Spender" */
  weekendMinTransactions: 2,

  /** Minimum essentials share for "Essentials First" */
  essentialsMinShare: 0.55,

  /** Minimum distinct categories for "Balanced Spender" */
  balancedMinCategories: 4,

  /** Maximum top-category share for "Balanced Spender" */
  balancedMaxTopShare: 0.32,

  /** Minimum expense transactions to compute a personality */
  minimumTransactions: 2,
};

// ── Insight Rule Thresholds ────────────────────────────────────

export const INSIGHT_THRESHOLDS = {
  /** Category share % at which we say it "dominates" */
  categoryDominancePercent: 60,

  /** Month-over-month % change below which we call it "flat" */
  momentumFlatPercent: 5,

  /** Weekend vs weekday spend multiplier to trigger the weekend insight */
  weekendWeekdayRatio: 1.15,

  /** Minimum convenience order count for merchant-habit insight */
  merchantConvenienceMinCount: 2,

  /** Minimum convenience share for merchant-habit insight */
  merchantConvenienceMinShare: 0.18,

  /** Minimum repeat count for a top-merchant insight */
  merchantRepeatMinCount: 2,
};

// ── Essentials Category List ───────────────────────────────────

export const ESSENTIALS_CATEGORIES = [
  'Rent',
  'Bills & Utilities',
  'Health',
  'Transport',
];

// ── Income Timing Windows ──────────────────────────────────────

export const INCOME_TIMING_WINDOWS = {
  start: { maxDay: 5, label: 'early in the month' },
  mid: { maxDay: 20, label: 'mid-month' },
  end: { maxDay: 31, label: 'toward month-end' },
};

// ── Food Category Name ─────────────────────────────────────────

export const FOOD_CATEGORY = 'Food & Dining';
