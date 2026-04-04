/**
 * insightsHelpers.js
 *
 * Backward-compatibility shim.
 * All logic has been moved to src/utils/insights/.
 * This file re-exports the public API so existing imports keep working.
 */

export { generateInsights } from '../../utils/insights/generateInsights';
export { getSpendingPersonality } from '../../utils/insights/spendingPersonality';
