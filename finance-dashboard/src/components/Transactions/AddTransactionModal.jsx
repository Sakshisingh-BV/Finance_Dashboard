import { useState, useEffect } from 'react';
import { useApp } from '../../Context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../Data/mockData';
import { X } from 'lucide-react';

const empty = {
  date: '',
  description: '',
  amount: '',
  type: 'expense',
  category: '',
};

const AddTransactionModal = ({ isOpen, onClose, editData }) => {
  const { dispatch } = useApp();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        description: editData.description,
        amount: String(editData.amount),
        type: editData.type,
        category: editData.category,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editData, isOpen]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = 'Date is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.category) errs.category = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (isEditing) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: { ...payload, id: editData.id } });
      onClose(false);
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload });
      onClose(true);
    }

    setForm(empty);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4"
      onClick={() => onClose(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[21rem] md:max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700 md:px-6 md:py-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white md:text-lg">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 md:p-1.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4 md:space-y-4 md:p-6">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Type
            </label>
            <div className="mt-1.5 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t, category: '' }))}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all md:py-2 md:text-sm ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-700 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:bg-slate-900 dark:text-slate-200 md:py-2.5 md:text-sm ${
                errors.date ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Grocery Shopping"
              className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-700 placeholder-slate-400 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500 md:py-2.5 md:text-sm ${
                errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-700 placeholder-slate-400 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500 md:py-2.5 md:text-sm ${
                errors.amount ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-700 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:bg-slate-900 dark:text-slate-200 md:py-2.5 md:text-sm ${
                errors.category ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="c-button c-button--gooey c-button--gooey-submit focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <span className="c-button__text">{isEditing ? 'Save Changes' : 'Add Transaction'}</span>
            <span className="c-button__blobs" aria-hidden="true">
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
