import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../../Context/AppContext';

const BalanceTrendChart = () => {
  const { state } = useApp();

  const monthlyData = useMemo(() => {
    const map = {};

    state.transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!map[key]) {
        map[key] = { month: '', income: 0, expense: 0 };
      }

      map[key].month = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

      if (transaction.type === 'income') {
        map[key].income += transaction.amount;
      } else {
        map[key].expense += transaction.amount;
      }
    });

    return Object.keys(map)
      .sort()
      .map((key) => ({
        ...map[key],
        savings: map[key].income - map[key].expense,
      }));
  }, [state.transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-2 text-[11px] shadow-xl dark:border-slate-700 dark:bg-slate-800 md:p-3 md:text-sm">
        <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200 md:mb-2">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full md:h-2.5 md:w-2.5" style={{ background: entry.color }} />
            {entry.name}: Rs {entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  };

  if (monthlyData.length === 0) {
    return (
      <div className="dashboard-dark-outline-card flex h-[20rem] items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800 md:h-auto md:min-h-[24rem] md:p-6">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 md:text-sm">
          No data available for chart
        </p>
      </div>
    );
  }

  return (
    <div className="light-outline-card flex min-w-0 h-[20rem] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700/50 dark:bg-slate-800 md:h-auto md:min-h-[24rem] md:p-6">
      <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white md:text-base">
        Balance Trend
      </h3>
      <p className="mb-3 text-[11px] text-slate-500 dark:text-slate-400 md:mb-5 md:text-sm">
        Monthly income vs expenses overview
      </p>

      <div className="flex-1 min-h-0 md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 5, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--grid-color, #e2e8f0)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              minTickGap={14}
            />
            <YAxis
              width={28}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `Rs${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={6}
            />
            <Area
              type="monotone"
              name="Income"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2.2}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              name="Expense"
              dataKey="expense"
              stroke="#f43f5e"
              strokeWidth={2.2}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrendChart;
