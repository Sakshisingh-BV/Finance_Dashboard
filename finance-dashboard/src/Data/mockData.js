// ─── Category Constants ────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Rent',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gifts',
  'Other',
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// ─── Chart Color Palette ───────────────────────────────────────
export const CHART_COLORS = [
  '#7c3aed', // violet
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#f97316', // orange
];

// ─── Initial Transaction Data ──────────────────────────────────
export const initialTransactions = [
  // ── October 2025 ─────────────
  { id: 1,  date: '2025-10-01', description: 'Monthly Salary',       amount: 75000, category: 'Salary',           type: 'income'  },
  { id: 2,  date: '2025-10-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 3,  date: '2025-10-05', description: 'Grocery – Big Basket', amount: 4200,  category: 'Food & Dining',    type: 'expense' },
  { id: 4,  date: '2025-10-08', description: 'Electricity Bill',     amount: 2800,  category: 'Bills & Utilities',type: 'expense' },
  { id: 5,  date: '2025-10-10', description: 'Uber Rides',           amount: 1500,  category: 'Transport',        type: 'expense' },
  { id: 6,  date: '2025-10-12', description: 'Freelance Project',    amount: 15000, category: 'Freelance',        type: 'income'  },
  { id: 7,  date: '2025-10-15', description: 'Netflix Subscription', amount: 649,   category: 'Entertainment',    type: 'expense' },
  { id: 8,  date: '2025-10-18', description: 'Amazon Shopping',      amount: 3400,  category: 'Shopping',         type: 'expense' },

  // ── November 2025 ────────────
  { id: 9,  date: '2025-11-01', description: 'Monthly Salary',       amount: 75000, category: 'Salary',           type: 'income'  },
  { id: 10, date: '2025-11-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 11, date: '2025-11-05', description: 'Restaurant Dinner',    amount: 2100,  category: 'Food & Dining',    type: 'expense' },
  { id: 12, date: '2025-11-07', description: 'Gym Membership',       amount: 2000,  category: 'Health',           type: 'expense' },
  { id: 13, date: '2025-11-10', description: 'Mobile Recharge',      amount: 599,   category: 'Bills & Utilities',type: 'expense' },
  { id: 14, date: '2025-11-12', description: 'Online Course – Udemy',amount: 499,   category: 'Education',        type: 'expense' },
  { id: 15, date: '2025-11-15', description: 'Investment Returns',   amount: 5000,  category: 'Investment',       type: 'income'  },
  { id: 16, date: '2025-11-20', description: 'Movie Tickets',        amount: 800,   category: 'Entertainment',    type: 'expense' },
  { id: 17, date: '2025-11-25', description: 'Petrol',               amount: 3000,  category: 'Transport',        type: 'expense' },

  // ── December 2025 ────────────
  { id: 18, date: '2025-12-01', description: 'Monthly Salary',       amount: 75000, category: 'Salary',           type: 'income'  },
  { id: 19, date: '2025-12-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 20, date: '2025-12-05', description: 'Christmas Shopping',   amount: 8500,  category: 'Shopping',         type: 'expense' },
  { id: 21, date: '2025-12-08', description: 'Swiggy Orders',        amount: 3200,  category: 'Food & Dining',    type: 'expense' },
  { id: 22, date: '2025-12-10', description: 'Freelance Website',    amount: 20000, category: 'Freelance',        type: 'income'  },
  { id: 23, date: '2025-12-12', description: 'Internet Bill',        amount: 999,   category: 'Bills & Utilities',type: 'expense' },
  { id: 24, date: '2025-12-15', description: 'Doctor Consultation',  amount: 1500,  category: 'Health',           type: 'expense' },
  { id: 25, date: '2025-12-20', description: 'Gift for Friend',      amount: 2000,  category: 'Shopping',         type: 'expense' },
  { id: 26, date: '2025-12-28', description: 'Year-end Bonus',       amount: 25000, category: 'Salary',           type: 'income'  },

  // ── January 2026 ────────────
  { id: 27, date: '2026-01-01', description: 'Monthly Salary',       amount: 80000, category: 'Salary',           type: 'income'  },
  { id: 28, date: '2026-01-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 29, date: '2026-01-05', description: 'Grocery Shopping',     amount: 5500,  category: 'Food & Dining',    type: 'expense' },
  { id: 30, date: '2026-01-08', description: 'Electricity Bill',     amount: 3200,  category: 'Bills & Utilities',type: 'expense' },
  { id: 31, date: '2026-01-10', description: 'Metro Card Recharge',  amount: 1000,  category: 'Transport',        type: 'expense' },
  { id: 32, date: '2026-01-15', description: 'Spotify Subscription', amount: 119,   category: 'Entertainment',    type: 'expense' },
  { id: 33, date: '2026-01-20', description: 'Books – Amazon',       amount: 1200,  category: 'Education',        type: 'expense' },
  { id: 34, date: '2026-01-25', description: 'Freelance Logo Design',amount: 8000,  category: 'Freelance',        type: 'income'  },

  // ── February 2026 ───────────
  { id: 35, date: '2026-02-01', description: 'Monthly Salary',       amount: 80000, category: 'Salary',           type: 'income'  },
  { id: 36, date: '2026-02-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 37, date: '2026-02-05', description: 'Valentine Dinner',     amount: 3500,  category: 'Food & Dining',    type: 'expense' },
  { id: 38, date: '2026-02-08', description: 'Shopping Mall',        amount: 6000,  category: 'Shopping',         type: 'expense' },
  { id: 39, date: '2026-02-10', description: 'Investment Returns',   amount: 7500,  category: 'Investment',       type: 'income'  },
  { id: 40, date: '2026-02-12', description: 'Health Checkup',       amount: 3000,  category: 'Health',           type: 'expense' },
  { id: 41, date: '2026-02-15', description: 'Cab Rides',            amount: 2200,  category: 'Transport',        type: 'expense' },
  { id: 42, date: '2026-02-20', description: 'Concert Tickets',      amount: 3500,  category: 'Entertainment',    type: 'expense' },

  // ── March 2026 ──────────────
  { id: 43, date: '2026-03-01', description: 'Monthly Salary',       amount: 80000, category: 'Salary',           type: 'income'  },
  { id: 44, date: '2026-03-03', description: 'House Rent',           amount: 15000, category: 'Rent',             type: 'expense' },
  { id: 45, date: '2026-03-05', description: 'Grocery – D-Mart',     amount: 4800,  category: 'Food & Dining',    type: 'expense' },
  { id: 46, date: '2026-03-07', description: 'Water Bill',           amount: 500,   category: 'Bills & Utilities',type: 'expense' },
  { id: 47, date: '2026-03-10', description: 'Myntra Order',         amount: 4500,  category: 'Shopping',         type: 'expense' },
  { id: 48, date: '2026-03-12', description: 'Freelance App Dev',    amount: 25000, category: 'Freelance',        type: 'income'  },
  { id: 49, date: '2026-03-15', description: 'Medicines',            amount: 800,   category: 'Health',           type: 'expense' },
  { id: 50, date: '2026-03-20', description: 'Ola Rides',            amount: 1800,  category: 'Transport',        type: 'expense' },
  { id: 51, date: '2026-03-25', description: 'Birthday Gift Received', amount: 1500,category: 'Gifts',            type: 'income'  },
];

// ─── Helpers ───────────────────────────────────────────────────
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};
