import React, { useState } from 'react';
import { PlusCircle, Target, AlertTriangle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { BudgetModal } from '../components/BudgetModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Budget } from '../types';
import { formatCurrency, getCategoryColor } from '../utils/formatters';

export const BudgetsPage: React.FC = () => {
  const { budgets, currency, deleteBudget } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalBudgeted = budgets.reduce((acc, b) => acc + (b.limit_amount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  const overallUsage = totalBudgeted > 0 ? Number(((totalSpent / totalBudgeted) * 100).toFixed(1)) : 0;

  const handleEdit = (b: Budget) => {
    setBudgetToEdit(b);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteBudget(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Budget Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Set spending guardrails per category and monitor outflows before you overspend
          </p>
        </div>

        <button
          onClick={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Set New Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Budgeted</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-mono">
            {formatCurrency(totalBudgeted, currency)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Spent</span>
          <p className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {formatCurrency(totalSpent, currency)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Remaining Cushion</span>
          <p className="text-2xl font-black text-emerald-500 mt-1 font-mono">
            {formatCurrency(totalRemaining, currency)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Overall Utilization</span>
          <p className="text-2xl font-black text-indigo-500 mt-1 font-mono">
            {overallUsage}%
          </p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const spent = b.spent || 0;
          const limit = b.limit_amount;
          const remaining = Math.max(0, limit - spent);
          const usage = b.usagePercentage || 0;
          const isExceeded = b.isExceeded || spent > limit;
          const catColor = getCategoryColor(b.category);

          return (
            <div
              key={b.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#111827] border transition-all duration-200 shadow-sm hover:shadow-md ${
                isExceeded
                  ? 'border-rose-500/50 dark:border-rose-500/40 shadow-rose-500/5'
                  : 'border-gray-200/80 dark:border-gray-800/80 hover:border-indigo-500/30'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: catColor }}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {b.category}
                    </h3>
                    <span className="text-[11px] text-gray-400 capitalize">{b.period || 'monthly'} cycle</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Warning or Safe Indicator */}
              <div className="my-4">
                {isExceeded ? (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Budget Exceeded by {formatCurrency(spent - limit, currency)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>On Track ({formatCurrency(remaining, currency)} remaining)</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Spent:</span>
                  <span className="font-bold font-mono text-gray-900 dark:text-white">
                    {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExceeded
                        ? 'bg-rose-500'
                        : usage > 85
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, usage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                  <span>Usage Rate:</span>
                  <span className={`font-mono font-bold ${isExceeded ? 'text-rose-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {usage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBudgetToEdit(null);
        }}
        budgetToEdit={budgetToEdit}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Remove Budget Limit"
        message="Are you sure you want to remove this category's budget limit? Historical transaction tracking will remain intact."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
