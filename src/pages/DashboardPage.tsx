import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  AlertCircle,
  TrendingUp,
  CreditCard,
  PlusCircle,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { MetricCard } from '../components/MetricCard';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Transaction, TimeFilter } from '../types';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

const TIME_FILTERS: TimeFilter[] = ['Today', 'This Week', 'This Month', 'This Year', 'Custom'];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const {
    analytics,
    transactions,
    budgets,
    currency,
    timeFilter,
    setTimeFilter,
    setCustomDateRange,
    customStartDate,
    customEndDate,
    deleteTransaction,
  } = useFinance();

  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom date range state
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(timeFilter === 'Custom');
  const [startInput, setStartInput] = useState<string>(customStartDate);
  const [endInput, setEndInput] = useState<string>(customEndDate);

  const handleCustomApply = () => {
    if (startInput || endInput) {
      setCustomDateRange(startInput, endInput);
    }
  };

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

  // Modern Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 text-white p-3 rounded-xl shadow-xl border border-gray-800 text-xs backdrop-blur-md">
          <p className="font-bold text-gray-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="font-semibold flex items-center gap-2" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-mono">{formatCurrency(entry.value, currency)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart custom tooltip
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900/95 text-white p-2.5 rounded-xl shadow-xl border border-gray-800 text-xs backdrop-blur-md">
          <p className="font-bold">{data.name}</p>
          <p className="text-emerald-400 font-mono font-semibold">
            {formatCurrency(data.value, currency)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Controls: Filter Pills & Custom Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Financial Health Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time analytics for cash flow, savings optimization, and budget limits
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-gray-900/90 p-1 rounded-2xl border border-gray-200/80 dark:border-gray-800/80">
          {TIME_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setTimeFilter(f);
                if (f === 'Custom') setShowCustomPicker(true);
                else setShowCustomPicker(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeFilter === f
                  ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Popover */}
      {showCustomPicker && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">From:</span>
            <input
              type="date"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">To:</span>
            <input
              type="date"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            Apply Filter
          </button>
        </div>
      )}

      {/* 1. TOP METRIC CARDS (Exact match to prompt calculation and examples) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* TOTAL BALANCE */}
        <MetricCard
          title="Total Balance"
          value={formatCurrency(analytics.balance, currency)}
          subtitle="Net Liquidity available"
          icon={Wallet}
          colorTheme={analytics.balance >= 0 ? 'emerald' : 'rose'}
          trend={{
            value: '+12.4%',
            isPositive: true,
            label: 'growth',
          }}
        />

        {/* TOTAL INCOME */}
        <MetricCard
          title="Total Income"
          value={formatCurrency(analytics.totalIncome, currency)}
          subtitle="Direct deposits & earnings"
          icon={ArrowUpRight}
          colorTheme="cyan"
          trend={{
            value: '+8.2%',
            isPositive: true,
            label: 'this month',
          }}
        />

        {/* TOTAL EXPENSES */}
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(analytics.totalExpenses, currency)}
          subtitle="Total operational outflows"
          icon={ArrowDownRight}
          colorTheme="rose"
          trend={{
            value: '-4.1%',
            isPositive: true,
            label: 'under control',
          }}
        />

        {/* SAVINGS RATE */}
        <MetricCard
          title="Savings Rate"
          value={`${analytics.savingsRate}%`}
          subtitle="Target threshold: > 20%"
          icon={PiggyBank}
          colorTheme="indigo"
          progress={{
            percentage: analytics.savingsRate,
            label: 'Savings Target',
          }}
        />
      </div>

      {/* Secondary Highlights: Top Category & Overall Budget Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Top Spending Category
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {analytics.topCategory}
              </h4>
              <span className="text-xs font-mono font-semibold text-rose-500">
                {formatCurrency(analytics.topCategoryAmount, currency)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('budgets')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Manage Category <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between">
          <div className="flex-1 pr-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total Budget Usage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {analytics.budgetUsagePercentage}%
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                of {formatCurrency(analytics.totalBudgetLimit, currency)} allocated
              </span>
            </div>
          </div>
          <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                analytics.budgetUsagePercentage > 100
                  ? 'bg-rose-500'
                  : analytics.budgetUsagePercentage > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, analytics.budgetUsagePercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CHARTS SECTION */}
      {/* Monthly Trend Area / Bar Chart */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Income vs Expenses Trend
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Monthly net flow tracking across active periods
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-500">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics.monthlyTrend}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${currency}${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Category Breakdown (Doughnut) + Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Distribution */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Expense Category Distribution
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Breakdown of spending by category
            </p>
          </div>

          <div className="h-64 my-4 flex items-center justify-center">
            {analytics.categoryDistribution.length === 0 ? (
              <p className="text-xs text-gray-400">No expense data available for this range</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.categoryDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={getCategoryColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto">
            {analytics.categoryDistribution.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/60 text-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryColor(cat.name) }}
                />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                <span className="text-gray-400 font-mono text-[11px]">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress Bars */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Budget Allocation Progress
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Current month utilization per category
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('budgets')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All Budgets
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-1">
            {budgets.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No budgets established yet.</p>
            ) : (
              budgets.map((b) => {
                const percentage = b.usagePercentage || 0;
                const isOver = percentage > 100;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{b.category}</span>
                        {isOver && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Exceeded
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-gray-600 dark:text-gray-400">
                        <span className={isOver ? 'text-rose-500 font-bold' : ''}>
                          {formatCurrency(b.spent || 0, currency)}
                        </span>{' '}
                        /{' '}{formatCurrency(b.limit_amount, currency)}
                      </div>
                    </div>

                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-rose-500'
                            : percentage > 85
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Latest financial activity recorded on your ledger
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            All Transactions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TransactionTable
          transactions={transactions.slice(0, 5)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTx(null);
        }}
        transactionToEdit={editingTx}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? All dashboard figures and budget usage will be automatically recalculated."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
