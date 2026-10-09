import React, { useState, useEffect } from 'react';
import { X, Target, AlertCircle } from 'lucide-react';
import { Budget } from '../types';
import { useFinance } from '../context/FinanceContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budgetToEdit,
}) => {
  const { categories, setBudgetLimit, currency } = useFinance();

  const [category, setCategory] = useState<string>('');
  const [limitAmount, setLimitAmount] = useState<string>('');
  const [period, setPeriod] = useState<string>('monthly');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setLimitAmount(budgetToEdit.limit_amount.toString());
      setPeriod(budgetToEdit.period || 'monthly');
    } else {
      if (expenseCategories.length > 0) {
        setCategory(expenseCategories[0].name);
      }
      setLimitAmount('');
      setPeriod('monthly');
    }
    setError('');
  }, [budgetToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      setError('Please select an expense category');
      return;
    }
    const num = parseFloat(limitAmount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a spending limit greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await setBudgetLimit(category, num, period);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to set budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800/80">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {budgetToEdit ? 'Adjust Budget Limit' : 'Set Spending Budget'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Control your monthly outflows and prevent overspending
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              disabled={!!budgetToEdit}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-medium bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Limit amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Spending Limit ({currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                {currency}
              </span>
              <input
                type="number"
                step="100"
                min="1"
                placeholder="10,000"
                value={limitAmount}
                onChange={(e) => {
                  setLimitAmount(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xl font-bold bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Period selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Budget Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['monthly', 'weekly', 'yearly'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    period === p
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {[5000, 10000, 15000, 25000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLimitAmount(preset.toString())}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {currency}{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
