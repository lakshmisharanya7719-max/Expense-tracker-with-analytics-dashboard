import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget, DashboardAnalytics, TimeFilter } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  analytics: DashboardAnalytics;
  isLoading: boolean;
  timeFilter: TimeFilter;
  customStartDate: string;
  customEndDate: string;
  currency: string;
  setTimeFilter: (filter: TimeFilter) => void;
  setCustomDateRange: (start: string, end: string) => void;
  setCurrency: (c: string) => void;
  refreshData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setBudgetLimit: (category: string, limit_amount: number, period?: string) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const defaultAnalytics: DashboardAnalytics = {
  totalIncome: 120000,
  totalExpenses: 44580,
  balance: 75420,
  savingsRate: 62.8,
  topCategory: 'Bills',
  topCategoryAmount: 12500,
  totalBudgetLimit: 56000,
  budgetUsagePercentage: 79.6,
  categoryDistribution: [],
  monthlyTrend: [],
  recentTransactions: [],
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(defaultAnalytics);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilterState] = useState<TimeFilter>('This Month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [currency, setCurrencyState] = useState<string>(user?.currency || '₹');

  useEffect(() => {
    if (user?.currency) {
      setCurrencyState(user.currency);
    }
  }, [user]);

  // Recalculate everything locally & fetch from API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [txRes, catRes, budgetRes, analyticsRes] = await Promise.all([
        api.getTransactions(),
        api.getCategories(),
        api.getBudgets(),
        api.getDashboardAnalytics(timeFilter, customStartDate, customEndDate),
      ]);

      setTransactions(txRes.data);
      setCategories(catRes);
      setBudgets(budgetRes);
      setAnalytics(analyticsRes);
    } catch (err: any) {
      console.error('Failed to load finance data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timeFilter, customStartDate, customEndDate]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const setTimeFilter = (filter: TimeFilter) => {
    setTimeFilterState(filter);
  };

  const setCustomDateRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setTimeFilterState('Custom');
  };

  const setCurrency = (c: string) => {
    setCurrencyState(c);
  };

  // 1. ADD TRANSACTION
  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    try {
      // Validate
      if (!tx.amount || tx.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!tx.category) {
        throw new Error('Category is required');
      }
      if (!tx.type) {
        throw new Error('Transaction type is required');
      }

      await api.createTransaction(tx);
      success('Transaction Added', `Successfully recorded ${tx.type === 'income' ? 'income' : 'expense'} of ${currency}${tx.amount}`);
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to add transaction');
      throw err;
    }
  };

  // 2. UPDATE TRANSACTION
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      if (updates.amount !== undefined && updates.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      await api.updateTransaction(id, updates);
      success('Transaction Updated', 'Changes saved successfully');
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to update transaction');
      throw err;
    }
  };

  // 3. DELETE TRANSACTION
  const deleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      success('Transaction Deleted', 'Transaction has been permanently removed');
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to delete transaction');
      throw err;
    }
  };

  // 4. CATEGORY OPERATIONS
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    try {
      if (!cat.name.trim()) throw new Error('Category name is required');
      await api.createCategory(cat);
      success('Category Created', `Added category "${cat.name}"`);
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await api.updateCategory(id, updates);
      success('Category Updated', 'Category details updated successfully');
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      success('Category Removed', 'Custom category deleted');
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to delete category');
      throw err;
    }
  };

  // 5. BUDGET OPERATIONS
  const setBudgetLimit = async (category: string, limit_amount: number, period = 'monthly') => {
    try {
      if (limit_amount <= 0) throw new Error('Budget limit must be greater than 0');
      await api.setBudget({ category, limit_amount, period });
      success('Budget Updated', `Limit for ${category} set to ${currency}${limit_amount}`);
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to set budget');
      throw err;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.deleteBudget(id);
      success('Budget Removed', 'Budget limit deleted');
      await refreshData();
    } catch (err: any) {
      error('Error', err.message || 'Failed to delete budget');
      throw err;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        analytics,
        isLoading,
        timeFilter,
        customStartDate,
        customEndDate,
        currency,
        setTimeFilter,
        setCustomDateRange,
        setCurrency,
        refreshData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setBudgetLimit,
        deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
