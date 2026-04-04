import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialTransactions } from '../Data/mockData';

// ─── Context ───────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Default State ─────────────────────────────────────────────
const defaultState = {
  transactions: initialTransactions,
  role: 'admin',   // 'viewer' | 'admin'
  theme: 'light',  // 'light'  | 'dark'
  filters: {
    type: 'all',
    category: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

// ─── Load from localStorage ────────────────────────────────────
const loadState = () => {
  try {
    const saved = localStorage.getItem('financeAppState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new keys are always present
      return { ...defaultState, ...parsed, filters: { ...defaultState.filters, ...parsed.filters } };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultState;
};

// ─── Reducer ───────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultState.filters };

    case 'ADD_TRANSACTION': {
      const newId = Math.max(0, ...state.transactions.map((t) => t.id)) + 1;
      return {
        ...state,
        transactions: [{ ...action.payload, id: newId }, ...state.transactions],
      };
    }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Provider ──────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financeAppState', JSON.stringify(state));
  }, [state]);

  // Toggle dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Custom Hook ───────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
