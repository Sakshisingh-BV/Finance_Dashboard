import { useMemo } from 'react';
import { useApp } from '../../Context/AppContext';
import { generateInsights, getSpendingPersonality } from './insightsHelpers';
import { filterTransactions } from '../../utils/filterTransactions';
import {
  ShoppingBag,
  BarChart3,
  PiggyBank,
  CalendarDays,
  TrendingUp,
  Activity,
} from 'lucide-react';

const INSIGHT_CARD_STYLES = {
  'top-category': {
    icon: ShoppingBag,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  momentum: {
    icon: TrendingUp,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
  merchant: {
    icon: BarChart3,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  timing: {
    icon: CalendarDays,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  'largest-expense': {
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  personality: {
    icon: PiggyBank,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
};

const InsightsPanel = () => {
  const { state } = useApp();

  const filteredTransactions = useMemo(
    () => filterTransactions(state.transactions, state.filters, { excludeFuture: true }),
    [state.transactions, state.filters]
  );

  const insights = useMemo(() => {
    if (filteredTransactions.length === 0) return [];

    const smartInsights = generateInsights(filteredTransactions).map((insight) => ({
      ...INSIGHT_CARD_STYLES[insight.kind],
      label: insight.label,
      value: insight.title,
      sub: insight.detail,
    }));

    const personality = getSpendingPersonality(filteredTransactions);

    return [
      ...smartInsights,
      {
        ...INSIGHT_CARD_STYLES.personality,
        label: 'Your Spending Style',
        value: personality.label,
        sub: personality.suggestion
          ? `${personality.explanation} ${personality.suggestion}`
          : personality.explanation,
      },
    ];
  }, [filteredTransactions]);

  if (insights.length === 0) {
    return (
      <div className="dashboard-dark-outline-card rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800">
        <p className="text-center text-slate-500 dark:text-slate-400">
          No insights available yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white md:text-base">
        Key Insights
      </h3>
      <p className="mb-3 text-xs text-slate-600 dark:text-slate-400 md:mb-4 md:text-sm">
        A simple summary of what you spent, saved, and where your money went
      </p>

      <div className="dashboard-insights-mobile-grid grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {insights.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className="light-outline-card animate-fade-in h-full min-h-[9.5rem] min-w-0 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800 md:min-h-0 md:p-5"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex h-full flex-col items-start gap-2 md:flex-row md:gap-3">
              <div className={`flex-shrink-0 rounded-xl p-2 md:p-2 ${item.bg}`}>
                <item.icon size={16} className={item.color} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-start">
                <p className="mb-1 text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-400 md:mb-0.5 md:text-xs">
                  {item.label}
                </p>
                <p className="break-words text-[1.05rem] font-bold leading-[1.15] text-slate-800 dark:text-white md:text-lg">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] leading-[1.28] text-slate-500 dark:text-slate-400 md:mt-0.5 md:text-xs">
                  {item.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
