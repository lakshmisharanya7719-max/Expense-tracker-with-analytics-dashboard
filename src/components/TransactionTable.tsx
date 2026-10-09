import React, { useState } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
} from 'lucide-react';
import { Transaction, PaymentMethod } from '../types';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  itemsPerPage = 10,
}) => {
  const { categories, currency } = useFinance();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [detailModalTx, setDetailModalTx] = useState<Transaction | null>(null);

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNote = tx.note?.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      const matchMethod = tx.payment_method.toLowerCase().includes(q);
      const matchAmt = tx.amount.toString().includes(q);
      if (!matchNote && !matchCat && !matchMethod && !matchAmt) return false;
    }

    // Type
    if (selectedType !== 'All' && tx.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    // Category
    if (selectedCategory !== 'All' && tx.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Payment method
    if (selectedPayment !== 'All' && tx.payment_method !== selectedPayment) {
      return false;
    }

    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Quick Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions, notes, categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-[#111827] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => {
              setSelectedPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="py-3.5 px-4">Transaction</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm font-medium">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <p className="text-sm font-medium">No transactions found matching criteria</p>
                    <p className="text-xs mt-1">Try clearing search filters or add a new transaction</p>
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = getCategoryColor(tx.category);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors group"
                    >
                      {/* Description & Type Icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                              {tx.note || (isIncome ? 'Income Credit' : 'Expense Outflow')}
                            </p>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                isIncome ? 'text-emerald-500' : 'text-rose-500'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: catColor }}
                          />
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {tx.payment_method}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold font-mono text-base ${
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount, currency)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            title="View details"
                            onClick={() => setDetailModalTx(tx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => onEdit(tx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => onDelete(tx.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-900/10 text-xs text-gray-500 dark:text-gray-400">
            <div>
              Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {Math.min(currentPage * itemsPerPage, filtered.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {detailModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Transaction Details</h3>
              <button onClick={() => setDetailModalTx(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Amount:</span>
                <span className={`font-bold font-mono text-base ${detailModalTx.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                  {formatCurrency(detailModalTx.amount, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Type:</span>
                <span className="capitalize font-semibold">{detailModalTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Category:</span>
                <span className="font-semibold">{detailModalTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Payment Method:</span>
                <span className="font-semibold">{detailModalTx.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Date:</span>
                <span className="font-semibold">{formatDate(detailModalTx.date)}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block mb-1">Notes:</span>
                <p className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300">
                  {detailModalTx.note || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  const tx = detailModalTx;
                  setDetailModalTx(null);
                  onEdit(tx);
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
              >
                Edit
              </button>
              <button
                onClick={() => setDetailModalTx(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
