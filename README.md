# 💰 FinTrack – Personal Finance Dashboard

A clean, interactive finance dashboard built with **React + Vite** to track income, expenses, and spending patterns. Designed as a frontend assessment project demonstrating component architecture, state management, and modern UI design.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <https://github.com/Sakshisingh-BV/Finance_Dashboard.git>
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 📋 Features

### ✅ Core Features

| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | Summary cards (Balance, Income, Expenses) with month-over-month change indicators |
| **Balance Trend Chart** | Area chart showing monthly income vs expenses over 6 months |
| **Spending Breakdown** | Donut chart with category-wise expense distribution |
| **Transactions List** | Sortable, searchable, filterable table with pagination |
| **Role-Based UI** | Viewer (read-only) and Admin (add/edit/delete) modes via sidebar toggle |
| **Insights Section** | 6 key financial observations computed from transaction data |
| **State Management** | Context API + useReducer with proper separation of concerns |

### ⭐ Enhancements

| Feature | Description |
|---------|-------------|
| **Dark Mode** | Full dark/light theme toggle with smooth transitions |
| **Data Persistence** | LocalStorage – data survives page refreshes |
| **Export** | Download transactions as CSV or JSON |
| **Animations** | Fade-in cards, modal transitions, hover effects |
| **Responsive Design** | Mobile-first layout with collapsible sidebar |
| **Form Validation** | Input validation with error messages on add/edit forms |
| **Empty States** | Graceful handling when no data or no filter matches |

---

## 🏗️ Architecture

```
src/
├── App.jsx                         # Root – Router + Context Provider
├── App.css                         # Animations + global styles
├── index.css                       # Tailwind config + base styles
├── main.jsx                        # Entry point
│
├── Context/
│   └── AppContext.jsx              # State management (useReducer + localStorage)
│
├── Data/
│   └── mockData.js                 # 51 mock transactions + helpers
│
├── Components/
│   ├── Layout/
│   │   ├── Layout.jsx              # Shell: sidebar + content area
│   │   └── Sidebar.jsx             # Navigation, role switch, theme toggle
│   │
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx         # Balance / Income / Expense cards
│   │   ├── BalanceTrendChart.jsx    # Recharts AreaChart (time-based)
│   │   ├── SpendingBreakdownChart.jsx # Recharts PieChart (categorical)
│   │   └── InsightsPanel.jsx        # Key financial insights grid
│   │
│   └── Transactions/
│       ├── TransactionTable.jsx     # Table + search + filter + sort + pagination
│       └── AddTransactionModal.jsx  # Add/Edit form modal
│
└── Pages/
    ├── Dashboard.jsx               # Dashboard page composition
    └── Transactions.jsx            # Transactions page + export + CRUD
```

---

## 🌐 Live Demo  
👉 https://finance-dashboard-three-ruddy.vercel.app

## 🧠 Approach & Design Decisions

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard(2).png)

### Transactions
![Transactions](./screenshots/Transactions.png)

### State Management
- Used **Context API + `useReducer`** for a clean, centralized state without external libraries.
- All app state (transactions, role, theme, filters) flows through a single context.
- State is **persisted to localStorage** on every change and rehydrated on page load.

### Component Design
- Components are **focused and single-responsibility** – each handles one visual piece.
- Data computations use **`useMemo`** to avoid unnecessary recalculations.
- Charts receive data through parent computation, keeping them pure presentation components.

### Styling
- **Tailwind CSS v4** with the Vite plugin for zero-config, utility-first styling.
- Class-based dark mode via `@custom-variant` for toggle control.
- Custom CSS animations for polish without library overhead.

### Role-Based UI
- Frontend-only simulation: `state.role` controls visibility of add/edit/delete actions.
- Viewer mode shows a notice banner and hides mutation controls.
- Admin mode unlocks full CRUD capabilities.

### Data Visualization
- **Recharts** for both time-based (AreaChart) and categorical (PieChart) visualizations.
- Custom tooltips and responsive containers ensure readability across devices.
- Gradient fills and consistent color palette for visual appeal.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Recharts | Data visualization |
| React Router DOM | Client-side routing |
| Lucide React | Icon library |
| Context API + useReducer | State management |
| LocalStorage | Data persistence |

---

## 📱 Responsiveness

- **Desktop**: Full sidebar + 3-column card grid + side-by-side charts
- **Tablet**: Collapsible sidebar + 2-column grid + stacked charts
- **Mobile**: Hamburger menu + single-column layout + optimized touch targets

---

## 🎨 Design Highlights

- **Color System**: Violet accent, emerald for income, rose for expenses
- **Typography**: Inter font with consistent weight hierarchy
- **Micro-animations**: Staggered card fade-in, hover lifts, modal scale-in
- **Dark Mode**: Full theme support with smooth transitions
- **Custom Scrollbar**: Styled scrollbar matching the theme
- **Focus States**: Accessible focus rings on all interactive elements

---

## 📝 License

This project is built for evaluation purposes.
