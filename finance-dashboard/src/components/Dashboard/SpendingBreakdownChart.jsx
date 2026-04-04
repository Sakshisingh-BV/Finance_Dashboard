import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../Context/AppContext';
import { CHART_COLORS, formatCurrency } from '../../Data/mockData';

const SpendingBreakdownChart = () => {
  const { state } = useApp();

  const categoryData = useMemo(() => {
    const map = {};

    state.transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        map[transaction.category] = (map[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const entry = payload[0];
    const percentage = ((entry.value / total) * 100).toFixed(1);

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-2 text-[11px] shadow-xl dark:border-slate-700 dark:bg-slate-800 md:p-3 md:text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200">{entry.name}</p>
        <p className="text-slate-500 dark:text-slate-400">
          {formatCurrency(entry.value)} ({percentage}%)
        </p>
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <div className="dashboard-dark-outline-card flex h-[20rem] items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800 md:h-auto md:min-h-[24rem] md:p-6">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 md:text-sm">
          No expense data available
        </p>
      </div>
    );
  }

  return (
    <div className="light-outline-card flex min-w-0 h-[20rem] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700/50 dark:bg-slate-800 md:h-auto md:min-h-[24rem] md:p-6">
      <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white md:text-base">
        Spending Breakdown
      </h3>
      <p className="mb-3 text-[11px] text-slate-500 dark:text-slate-400 md:mb-5 md:text-sm">
        Expenses by category
      </p>

      <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="w-full flex-shrink-0 md:w-[46%]">
          <div className="mx-auto h-36 max-w-[13rem] md:h-60 md:max-w-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="88%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-h-0 w-full min-w-0 flex-1 space-y-1.5 overflow-y-auto pr-1 md:w-[54%] md:max-h-60 md:space-y-2.5 md:pr-2">
          {categoryData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);

            return (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 text-[11px] md:text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full md:h-3 md:w-3"
                    style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="min-w-0 leading-tight text-slate-600 dark:text-slate-300">
                    {item.name}
                  </span>
                </div>
                <div className="ml-2 flex flex-shrink-0 items-center gap-2 md:gap-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{percentage}%</span>
                  <span className="w-16 text-right font-medium text-slate-700 dark:text-slate-200 md:w-24">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdownChart;
