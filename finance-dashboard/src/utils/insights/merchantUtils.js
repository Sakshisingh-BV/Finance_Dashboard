/**
 * merchantUtils.js
 *
 * Merchant-detection and aggregation helpers.
 * Pure functions — no UI, no side-effects.
 */

import { MERCHANT_PATTERNS } from '../../constants/insightConfig';

// ── Text Normalisation ─────────────────────────────────────────

export const normalizeDescription = (description = '') =>
  description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// ── Single-Transaction Merchant Extraction ─────────────────────

export const extractMerchant = (description = '') => {
  const normalized = normalizeDescription(description);
  const pattern = MERCHANT_PATTERNS.find(({ keyword }) => normalized.includes(keyword));
  if (!pattern) return null;

  return {
    label: pattern.label,
    isConvenience: pattern.isConvenience,
  };
};

// ── Aggregate Merchant Stats from a List ───────────────────────

export const getMerchantStats = (transactions) => {
  const merchantMap = {};

  transactions.forEach((transaction) => {
    const merchant = extractMerchant(transaction.description);
    if (!merchant) return;

    if (!merchantMap[merchant.label]) {
      merchantMap[merchant.label] = {
        label: merchant.label,
        total: 0,
        count: 0,
        isConvenience: merchant.isConvenience,
      };
    }

    merchantMap[merchant.label].total += transaction.amount;
    merchantMap[merchant.label].count += 1;
  });

  return Object.values(merchantMap).sort((a, b) => {
    if (b.count === a.count) return b.total - a.total;
    return b.count - a.count;
  });
};

// ── Label Joiner (e.g. "Swiggy and Zomato") ───────────────────

export const joinLabels = (labels) => {
  const unique = [...new Set(labels.filter(Boolean))];
  if (unique.length <= 1) return unique[0] || '';
  if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
  return `${unique.slice(0, -1).join(', ')}, and ${unique[unique.length - 1]}`;
};
