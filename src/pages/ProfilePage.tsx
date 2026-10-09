import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Coins,
  Palette,
  LogOut,
  Save,
  CheckCircle,
  Sparkles,
  Smartphone,
  Cloud,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useFinance();
  const { success } = useToast();

  const [name, setName] = useState<string>(user?.name || '');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        currency: selectedCurrency,
      });
      setCurrency(selectedCurrency);
      success('Profile Updated', 'Personal information and preferences have been updated');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          User Profile & Preferences
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your account credentials, regional currency, visual theme, and fintech settings
        </p>
      </div>

      {/* User Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
          {name ? name[0].toUpperCase() : 'U'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{name || 'User'}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Verified Account
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              Fintech Tier 1
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-gray-100 dark:bg-gray-800/40 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Primary Currency
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="₹">₹ - Indian Rupee (INR)</option>
                <option value="$">$ - US Dollar (USD)</option>
                <option value="€">€ - Euro (EUR)</option>
                <option value="£">£ - British Pound (GBP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Dashboard Theme
            </label>
            <div className="flex items-center gap-3 h-[42px]">
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-xs font-semibold flex items-center gap-2 hover:border-emerald-500 transition-colors"
              >
                <Palette className="w-4 h-4 text-emerald-500" />
                Current Theme: <span className="capitalize font-bold">{theme}</span> (Click to toggle)
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Future-Ready Architecture Feature Highlights */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Next-Gen Fintech Extensions (Ready Architecture)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            The modular API schema is pre-structured for these next-generation integrations:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: 'Bank / UPI Auto-Sync', desc: 'Secure Open Banking & Account Aggregator API connector', icon: Zap },
            { title: 'AI Spending Advisor', desc: 'LLM spending pattern categorization and waste detection', icon: Sparkles },
            { title: 'Recurring Bill Radar', desc: 'Predictive subscription renewal reminders & alerts', icon: Smartphone },
            { title: 'Cloud Encrypted Sync', desc: 'End-to-end encrypted backup to MongoDB Atlas', icon: Cloud },
            { title: 'Budget Push Alerts', desc: 'Instant email/mobile notifications upon exceeding 85%', icon: Shield },
            { title: 'Multi-Currency FX', desc: 'Automatic exchange rate conversion for international travel', icon: Coins },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/40">
                <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                  <Icon className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</h4>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
