export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  theme: 'dark' | 'light';
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  payment_method: PaymentMethod;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  spent?: number;
  remaining?: number;
  usagePercentage?: number;
  isExceeded?: boolean;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  percentage: number;
}

export interface MonthlyTrendPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface DashboardAnalytics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topCategory: string;
  topCategoryAmount: number;
  totalBudgetLimit: number;
  budgetUsagePercentage: number;
  categoryDistribution: CategoryDistribution[];
  monthlyTrend: MonthlyTrendPoint[];
  recentTransactions: Transaction[];
  filteredCount?: number;
}

export type TimeFilter = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom';
