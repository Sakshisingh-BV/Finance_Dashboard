import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './Context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
