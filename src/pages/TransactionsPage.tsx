import React, { useState } from 'react';
import { PlusCircle, FileDown, Calendar, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ExportModal } from '../components/ExportModal';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

export const TransactionsPage: React.FC = () => {
  const { transactions, currency, deleteTransaction } = useFinance();

  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Quick stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsAddTxOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteTransaction(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with CTA actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Full history of your credits, debits, categorization, and receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4 text-emerald-500" />
            Export Data
          </button>
          <button
            onClick={() => {
              setEditingTx(null);
              setIsAddTxOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Mini Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Entries</span>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{transactions.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Total Credits</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              +{formatCurrency(totalIncome, currency)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Total Debits</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
              -{formatCurrency(totalExpense, currency)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemsPerPage={10}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTx(null);
        }}
        transactionToEdit={editingTx}
      />

      {/* Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction from your records?"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
