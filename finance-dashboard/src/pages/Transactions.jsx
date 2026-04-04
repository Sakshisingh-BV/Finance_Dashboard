import { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useApp } from '../Context/AppContext';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import TransactionTable from '../components/Transactions/TransactionTable';
import FinanceLottie from '../components/Animations/FinanceLottie';
import TransactionSuccessOverlay from '../components/Transactions/TransactionSuccessOverlay';

const TRANSACTIONS_LOTTIE_SRC =
  'https://lottie.host/7b277c69-cfe2-4962-9b4f-d44a3b1f0fb5/KleLcIQT84.lottie';

const Transactions = () => {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const isAdmin = state.role === 'admin';

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setShowSuccessOverlay(false);
    setEditData(null);
    setModalOpen(true);
  };

  const handleClose = (wasAdded = false) => {
    setModalOpen(false);

    if (wasAdded === true && !editData) {
      setShowSuccessOverlay(true);
    }

    setEditData(null);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = state.transactions.map((transaction) => [
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.category,
      transaction.type,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state.transactions, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `transactions_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: 0, width: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl dark:text-white">
              Hyy Sakshi !
            </h1>
            <div className="h-12 w-12 md:h-14 md:w-14 animate-fade-in">
              <FinanceLottie
                src={TRANSACTIONS_LOTTIE_SRC}
                className="h-full w-full"
                speed={1.1}
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and explore your financial activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="group relative">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <Download size={16} />
              Export
            </button>

            <div className="invisible absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={exportCSV}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                CSV
              </button>
              <button
                onClick={exportJSON}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                JSON
              </button>
            </div>
          </div>

          {isAdmin && (
            <button type="button" onClick={handleOpenCreate} className="c-button c-button--gooey">
              <span className="c-button__text">
                <Plus size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Add Transaction
              </span>
              <span className="c-button__blobs" aria-hidden="true">
                <div></div>
                <div></div>
                <div></div>
              </span>
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
          You are in <strong>Viewer</strong> mode. Switch to <strong>Admin</strong> to add or
          edit transactions.
        </div>
      )}

      <TransactionTable onEdit={handleEdit} />
      <AddTransactionModal isOpen={modalOpen} onClose={handleClose} editData={editData} />
      <TransactionSuccessOverlay
        isOpen={showSuccessOverlay}
        onClose={() => setShowSuccessOverlay(false)}
      />
    </div>
  );
};

export default Transactions;
