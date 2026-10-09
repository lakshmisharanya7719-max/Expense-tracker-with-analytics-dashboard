import { User, Transaction, Category, Budget, DashboardAnalytics, TimeFilter } from '../types';

// Realistic sample transactions matching the prompt's exact calculations
const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 100000,
    category: 'Salary',
    date: new Date().toISOString().slice(0, 8) + '01',
    payment_method: 'Net Banking',
    note: 'Monthly Senior Tech Lead Salary (Direct Deposit)',
  },
  {
    id: 'tx-2',
    type: 'income',
    amount: 20000,
    category: 'Freelance',
    date: new Date().toISOString().slice(0, 8) + '05',
    payment_method: 'UPI',
    note: 'Mobile App Consulting Project milestone',
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 12500,
    category: 'Bills',
    date: new Date().toISOString().slice(0, 8) + '03',
    payment_method: 'Net Banking',
    note: 'Apartment Maintenance & High-speed Fiber Internet',
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 11200,
    category: 'Food',
    date: new Date().toISOString().slice(0, 8) + '08',
    payment_method: 'Credit Card',
    note: 'Gourmet Organic Groceries & Dining',
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 8450,
    category: 'Shopping',
    date: new Date().toISOString().slice(0, 8) + '12',
    payment_method: 'Credit Card',
    note: 'Ergonomic Desk Accessories & Tech gear',
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 5300,
    category: 'Travel',
    date: new Date().toISOString().slice(0, 8) + '15',
    payment_method: 'UPI',
    note: 'Fuel & Weekend Outing Highway Tolls',
  },
  {
    id: 'tx-7',
    type: 'expense',
    amount: 3850,
    category: 'Health',
    date: new Date().toISOString().slice(0, 8) + '18',
    payment_method: 'Debit Card',
    note: 'Gym Membership & Multivitamin Supplements',
  },
  {
    id: 'tx-8',
    type: 'expense',
    amount: 3280,
    category: 'Entertainment',
    date: new Date().toISOString().slice(0, 8) + '22',
    payment_method: 'UPI',
    note: 'IMAX Cinema Tickets & OTT subscriptions',
  },
];

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Food', type: 'expense', icon: 'UtensilsCrossed', color: '#f59e0b', isDefault: true },
  { id: 'cat-2', name: 'Travel', type: 'expense', icon: 'Plane', color: '#06b6d4', isDefault: true },
  { id: 'cat-3', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', isDefault: true },
  { id: 'cat-4', name: 'Bills', type: 'expense', icon: 'Receipt', color: '#ef4444', isDefault: true },
  { id: 'cat-5', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#8b5cf6', isDefault: true },
  { id: 'cat-6', name: 'Health', type: 'expense', icon: 'HeartPulse', color: '#10b981', isDefault: true },
  { id: 'cat-7', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#6366f1', isDefault: true },
  { id: 'cat-8', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981', isDefault: true },
  { id: 'cat-9', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3b82f6', isDefault: true },
  { id: 'cat-10', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#8b5cf6', isDefault: true },
];

const initialBudgets: Budget[] = [
  { id: 'b-1', category: 'Bills', limit_amount: 15000, period: 'monthly' },
  { id: 'b-2', category: 'Food', limit_amount: 14000, period: 'monthly' },
  { id: 'b-3', category: 'Shopping', limit_amount: 10000, period: 'monthly' },
  { id: 'b-4', category: 'Travel', limit_amount: 8000, period: 'monthly' },
  { id: 'b-5', category: 'Health', limit_amount: 5000, period: 'monthly' },
  { id: 'b-6', category: 'Entertainment', limit_amount: 4000, period: 'monthly' },
];

const STORAGE_KEYS = {
  TRANSACTIONS: 'fintech_transactions',
  CATEGORIES: 'fintech_categories',
  BUDGETS: 'fintech_budgets',
  TOKEN: 'token',
  USER: 'fintech_user',
};

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Helper to filter transactions by period
const filterByPeriod = (transactions: Transaction[], filter: TimeFilter, startDate?: string, endDate?: string) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return transactions.filter((t) => {
    const txDate = new Date(t.date);
    if (filter === 'Today') {
      return txDate >= startOfDay;
    }
    if (filter === 'This Week') {
      return txDate >= startOfWeek;
    }
    if (filter === 'This Month') {
      return txDate >= startOfMonth;
    }
    if (filter === 'This Year') {
      return txDate >= startOfYear;
    }
    if (filter === 'Custom' && (startDate || endDate)) {
      if (startDate && txDate < new Date(startDate)) return false;
      if (endDate && txDate > new Date(endDate)) return false;
      return true;
    }
    return true;
  });
};

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = getLocal<User>(STORAGE_KEYS.USER, {
      id: 'demo-user-123',
      name: 'Vikhyath Dev',
      email: 'demo@fintech.com',
      currency: '₹',
      theme: 'dark',
    });

    const userToLogin = {
      ...existingUser,
      email: email.toLowerCase(),
    };

    const token = 'jwt-token-' + Date.now();
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToLogin));
    return { user: userToLogin, token };
  },

  async register(name: string, email: string, password: string, currency = '₹'): Promise<{ user: User; token: string }> {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      currency,
      theme: 'dark',
    };
    const token = 'jwt-token-' + Date.now();
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return { user: newUser, token };
  },

  async getMe(): Promise<User> {
    return getLocal<User>(STORAGE_KEYS.USER, {
      id: 'demo-user-123',
      name: 'Vikhyath Dev',
      email: 'demo@fintech.com',
      currency: '₹',
      theme: 'dark',
    });
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = getLocal<User>(STORAGE_KEYS.USER, {
      id: 'demo-user-123',
      name: 'Vikhyath Dev',
      email: 'demo@fintech.com',
      currency: '₹',
      theme: 'dark',
    });
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  // Transactions
  async getTransactions(params: Record<string, string> = {}): Promise<{ data: Transaction[]; total: number }> {
    let list = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);

    if (params.category && params.category !== 'All') {
      list = list.filter((t) => t.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.type && params.type !== 'All') {
      list = list.filter((t) => t.type.toLowerCase() === params.type.toLowerCase());
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.note && t.note.toLowerCase().includes(s)) ||
          t.category.toLowerCase().includes(s) ||
          t.payment_method.toLowerCase().includes(s)
      );
    }
    if (params.startDate) {
      list = list.filter((t) => new Date(t.date) >= new Date(params.startDate));
    }
    if (params.endDate) {
      list = list.filter((t) => new Date(t.date) <= new Date(params.endDate));
    }

    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { data: list, total: list.length };
  },

  async createTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    const list = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    };
    const updated = [newTx, ...list];
    setLocal(STORAGE_KEYS.TRANSACTIONS, updated);
    return newTx;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const list = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    const idx = list.findIndex((t) => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(STORAGE_KEYS.TRANSACTIONS, list);
      return list[idx];
    }
    throw new Error('Transaction not found');
  },

  async deleteTransaction(id: string): Promise<void> {
    const list = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    const filtered = list.filter((t) => t.id !== id);
    setLocal(STORAGE_KEYS.TRANSACTIONS, filtered);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  },

  async createCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    const newCat: Category = { ...cat, id: 'cat-' + Date.now() };
    setLocal(STORAGE_KEYS.CATEGORIES, [...list, newCat]);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(STORAGE_KEYS.CATEGORIES, list);
      return list[idx];
    }
    throw new Error('Category not found');
  },

  async deleteCategory(id: string): Promise<void> {
    const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    setLocal(STORAGE_KEYS.CATEGORIES, list.filter((c) => c.id !== id));
  },

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    const budgets = getLocal<Budget[]>(STORAGE_KEYS.BUDGETS, initialBudgets);
    const transactions = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = transactions.filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth));

    return budgets.map((b) => {
      const spent = monthlyExpenses
        .filter((t) => t.category.toLowerCase() === b.category.toLowerCase())
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const remaining = Math.max(0, b.limit_amount - spent);
      const usagePercentage = b.limit_amount > 0 ? Number(((spent / b.limit_amount) * 100).toFixed(1)) : 0;
      return {
        ...b,
        spent,
        remaining,
        usagePercentage,
        isExceeded: spent > b.limit_amount,
      };
    });
  },

  async setBudget(budget: { category: string; limit_amount: number; period?: string }): Promise<Budget> {
    const list = getLocal<Budget[]>(STORAGE_KEYS.BUDGETS, initialBudgets);
    const idx = list.findIndex((b) => b.category.toLowerCase() === budget.category.toLowerCase());
    if (idx !== -1) {
      list[idx].limit_amount = budget.limit_amount;
      if (budget.period) list[idx].period = budget.period as any;
      setLocal(STORAGE_KEYS.BUDGETS, list);
      return list[idx];
    }
    const newB: Budget = {
      id: 'b-' + Date.now(),
      category: budget.category,
      limit_amount: budget.limit_amount,
      period: (budget.period as any) || 'monthly',
    };
    setLocal(STORAGE_KEYS.BUDGETS, [...list, newB]);
    return newB;
  },

  async deleteBudget(id: string): Promise<void> {
    const list = getLocal<Budget[]>(STORAGE_KEYS.BUDGETS, initialBudgets);
    setLocal(STORAGE_KEYS.BUDGETS, list.filter((b) => b.id !== id));
  },

  // Analytics & Dashboard calculations
  async getDashboardAnalytics(filter: TimeFilter = 'This Month', startDate?: string, endDate?: string): Promise<DashboardAnalytics> {
    const allTransactions = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    const budgets = getLocal<Budget[]>(STORAGE_KEYS.BUDGETS, initialBudgets);

    // Filter transactions for period
    const filteredTx = filterByPeriod(allTransactions, filter, startDate, endDate);

    let totalIncome = 0;
    let totalExpenses = 0;
    const catMap: Record<string, number> = {};

    filteredTx.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
        catMap[tx.category] = (catMap[tx.category] || 0) + amt;
      }
    });

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)) : 0;

    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > topCategoryAmount) {
        topCategoryAmount = val;
        topCategory = cat;
      }
    });

    const totalBudgetLimit = budgets.reduce((acc, b) => acc + (b.limit_amount || 0), 0);
    const budgetUsagePercentage = totalBudgetLimit > 0 ? Number(((totalExpenses / totalBudgetLimit) * 100).toFixed(1)) : 0;

    const categoryDistribution = Object.entries(catMap)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpenses > 0 ? Number(((value / totalExpenses) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Monthly trends from all transactions
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyMap: Record<string, { month: string; income: number; expenses: number }> = {};

    for (let m = 0; m < 12; m++) {
      const key = `${monthNames[m]} ${currentYear}`;
      monthlyMap[key] = { month: monthNames[m], income: 0, expenses: 0 };
    }

    allTransactions.forEach((tx) => {
      const d = new Date(tx.date);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      if (yr === currentYear) {
        const key = `${monthNames[mIdx]} ${yr}`;
        if (tx.type === 'income') {
          monthlyMap[key].income += Number(tx.amount);
        } else {
          monthlyMap[key].expenses += Number(tx.amount);
        }
      }
    });

    const currentMonthIdx = new Date().getMonth();
    const monthlyTrend = Object.values(monthlyMap).slice(0, Math.min(12, currentMonthIdx + 2));

    const recentTransactions = [...allTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      topCategory,
      topCategoryAmount,
      totalBudgetLimit,
      budgetUsagePercentage,
      categoryDistribution,
      monthlyTrend,
      recentTransactions,
      filteredCount: filteredTx.length,
    };
  },
};
