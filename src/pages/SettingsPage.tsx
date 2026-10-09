import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Database,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Trash2,
  Check,
  Server,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { refreshData } = useFinance();
  const { success } = useToast();

  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [budgetOverspendWarnings, setBudgetOverspendWarnings] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleResetSampleData = async () => {
    setIsResetting(true);
    try {
      localStorage.removeItem('fintech_transactions');
      localStorage.removeItem('fintech_categories');
      localStorage.removeItem('fintech_budgets');
      await refreshData();
      success('Data Reset', 'Restored verified default sample data matching dashboard specifications');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Configure security policies, alerts, notification thresholds, and ledger data
        </p>
      </div>

      {/* Pure Frontend Engine & Storage Status */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-500" />
          Client-Side Financial Engine
        </h3>
        <p className="text-xs text-gray-400">
          Architecture: 100% Client-Side Pure Frontend Single Page Application (SPA). Zero backend latency, complete privacy, and instant local persistence.
        </p>
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Pure Frontend Mode Active</p>
              <p className="text-[11px] text-gray-400">Database: Browser LocalStorage & In-Memory Financial Engine (Self-Contained)</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[10px]">
            STANDALONE
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          Notifications & Budget Alerts
        </h3>

        <div className="space-y-3 divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Budget Overspend Threshold Warning</p>
              <p className="text-xs text-gray-400">Receive alert toast when spending exceeds 85% of allocated limit</p>
            </div>
            <input
              type="checkbox"
              checked={budgetOverspendWarnings}
              onChange={(e) => setBudgetOverspendWarnings(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Statements & Summaries</p>
              <p className="text-xs text-gray-400">Receive monthly financial report directly to registered email</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Cash Flow Digest</p>
              <p className="text-xs text-gray-400">Weekly breakdown of credits and debits</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          Data & State Management
        </h3>
        <p className="text-xs text-gray-400">
          Reset local ledger cache to restore verified test dataset (Income: ₹1,20,000, Expense: ₹44,580, Balance: ₹75,420, Savings Rate: 62.8%).
        </p>

        <button
          onClick={handleResetSampleData}
          disabled={isResetting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          Reload Default Sample Data
        </button>
      </div>
    </div>
  );
};
