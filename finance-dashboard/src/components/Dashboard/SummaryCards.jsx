import { useMemo } from 'react';
import { useApp } from '../../Context/AppContext';
import { formatCurrency } from '../../Data/mockData';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    topColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    topColor: 'linear-gradient(135deg, #10b981, #14b8a6)',
  },
  {
    key: 'expense',
    label: 'Total Expenses',
    icon: TrendingDown,
    topColor: 'linear-gradient(135deg, #f43f5e, #ec4899)',
  },
];

const SummaryCards = () => {
  const { state } = useApp();

  const totals = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { balance: income - expense, income, expense };
  }, [state.transactions]);

  const changes = useMemo(() => {
    const now = new Date();
    const thisMonth = state.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = state.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() - 2 && d.getFullYear() === now.getFullYear();
    });

    const thisIncome = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const lastIncome = lastMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const thisExpense = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const lastExpense = lastMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const pct = (curr, prev) => (prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100));

    return {
      balance: pct(thisIncome - thisExpense, lastIncome - lastExpense),
      income: pct(thisIncome, lastIncome),
      expense: pct(thisExpense, lastExpense),
    };
  }, [state.transactions]);

  return (
    <div className="summary-cards-grid dashboard-summary-mobile-grid grid grid-cols-3 gap-2.5 md:gap-5">
      {cards.map((card, idx) => {
        const value = totals[card.key];
        const change = changes[card.key];
        const isPositive = change >= 0;

        return (
          <div key={card.key} className="card">
            {/* Colored top section */}
            <div className="img-section" style={{ background: card.topColor }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: 'clamp(18px, 4vw, 28px)',
                  height: 'clamp(18px, 4vw, 28px)',
                  margin: '10px auto',
                  display: 'block',
                }}
              >
                {card.key === 'balance' && (
                  <>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 10h20" />
                  </>
                )}
                {card.key === 'income' && (
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                )}
                {card.key === 'expense' && (
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                )}
              </svg>
            </div>

            {/* Dark body */}
            <div className="card-desc">
              <div className="card-header">
                <div className="card-title">{card.label}</div>
                <div className="card-menu">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
              <div className="card-time">{formatCurrency(value)}</div>
              <p className="recent">
                {change !== 0 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.85em',
                    color: (card.key === 'expense')
                      ? (isPositive ? '#fda4af' : '#6ee7b7')
                      : (isPositive ? '#6ee7b7' : '#fda4af'),
                  }}>
                    {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(change)}% vs last month
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
