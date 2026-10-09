import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { ExportModal } from '../components/ExportModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { analytics, transactions, budgets, currency, timeFilter } = useFinance();
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Export CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Financial Intelligence & Reports
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Audit-ready cash flow statements, category breakdowns, and exportable ledgers
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
        >
          <FileDown className="w-4 h-4" />
          Export Statement (PDF / Excel / CSV)
        </button>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Gross Inflow</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {formatCurrency(analytics.totalIncome, currency)}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Total revenue during {timeFilter}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Gross Outflow</span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
            {formatCurrency(analytics.totalExpenses, currency)}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Total operational expenditure</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">Net Retained Surplus</span>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-mono">
            {formatCurrency(analytics.balance, currency)}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Net savings retained</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">Savings Ratio</span>
          <h3 className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {analytics.savingsRate}%
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Surplus efficiency percentage</p>
        </div>
      </div>

      {/* Monthly Comparative Performance Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Income vs Expenses Comparison
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comparative bar metrics for cash flow analysis
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${currency}${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value), currency), '']}
                contentStyle={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  border: '1px solid #1f2937',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Category Spending Analysis
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Proportional allocation of expenditure across categories
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Total Outflow</th>
                <th className="py-3 px-4 text-right">Share of Expenses</th>
                <th className="py-3 px-4">Visual Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs font-semibold">
              {analytics.categoryDistribution.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                    {formatCurrency(item.value, currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-500">
                    {item.percentage}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Performance Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Budget Discipline Performance
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Monitoring how closely spending respects allocated targets
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <div key={b.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>{b.category}</span>
                <span className={b.isExceeded ? 'text-rose-500' : 'text-emerald-500'}>
                  {b.usagePercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-2">
                <div
                  className={`h-full rounded-full ${b.isExceeded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, b.usagePercentage || 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-mono">
                <span>Spent: {formatCurrency(b.spent || 0, currency)}</span>
                <span>Limit: {formatCurrency(b.limit_amount, currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
