# FinVantage | Expense Tracker with Analytics Dashboard (Pure Frontend) 🚀

A modern, responsive, standalone fintech personal finance management web application. Built entirely with **React 18 + TypeScript + Vite + Tailwind CSS + Recharts**.

---

## 🌟 Live Demo & Quick Access

- **Web Application URL**: [http://localhost:5173](http://localhost:5173)

### 🔑 Demo Account
- **1-Click Instant Demo Login**: Simply click the glowing *"1-Click Instant Demo Login"* button on the sign-in screen to instantly load the full dashboard.
- **Or Sign In With**:
  - **Email**: `demo@fintech.com`
  - **Password**: `password123`

---

## 📊 Core Features

### 1. 🛡️ Authentication & User Accounts (Client-Side)
- User Registration with name, email, password, and primary currency preference
- User Login & session persistence in browser `localStorage`
- Protected dashboard routes with user-specific data isolation
- 1-Click Instant Demo Access

### 2. 📈 Dashboard Analytics
- **Total Balance**: `Balance = Total Income - Total Expenses` (Default: **₹75,420**)
- **Total Income**: `Gross Inflow` (Default: **₹1,20,000**)
- **Total Expenses**: `Gross Outflow` (Default: **₹44,580**)
- **Savings Rate %**: `((Total Income - Total Expenses) / Total Income) × 100` (Default: **62.8%**)
- **Top Spending Category**: Identified dynamically (e.g. **Bills**, ₹12,500)
- **Total Budget Usage %**: `(Actual Expenses / Budget Limit) × 100`

### 3. 📉 Interactive Visualizations (Recharts)
- **Income vs Expense Trend**: Multi-area dual gradient chart
- **Expense Category Distribution**: Interactive Doughnut / Pie chart with tooltips
- **Budget Allocation Bars**: Real-time progress indicators with overspend alerts (> 100% turns rose-red)
- **Comparative Cashflow Bars**: Multi-month comparative bar chart in Reports
- **Timeframe Filtering**:
  - `Today`
  - `This Week`
  - `This Month`
  - `This Year`
  - `Custom Date Range` (with dual calendar start & end pickers)

### 4. 💳 Transaction Management (Full CRUD)
- Add Income / Add Expense with intuitive tabbed modal
- Instant validation (amount > 0, required category, valid date)
- Edit existing transactions with live recalculation across all dashboard cards
- Delete transactions with confirmation modal
- Search transactions by note, category, or payment method
- Filter by Category, Transaction Type (`Income` / `Expense`), or Payment Method
- Supported Payment Methods: `UPI`, `Credit Card`, `Debit Card`, `Net Banking`, `Cash`, `Other`
- Pagination for large transaction ledgers

### 5. 🏷️ Category Management
- Default Core Categories: `Food`, `Travel`, `Shopping`, `Bills`, `Education`, `Health`, `Entertainment`
- Income Streams: `Salary`, `Freelance`, `Investments`
- Create, edit, and delete custom categories
- Custom color palette picker & visual tags

### 6. 🎯 Budget Management & Guardrails
- Set monthly, weekly, or yearly category spending limits
- Real-time remaining budget calculations: `Remaining = Limit - Actual Spent`
- Visual progress bars with threshold color transitions (green -> amber -> red)
- Exceeded budget warning pill badge

### 7. 📑 Reports & Document Exports
- Dedicated financial statements page
- **PDF Export**: Generates a clean audit-ready PDF statement using `jspdf` and `jspdf-autotable`
- **Excel (.xlsx) Export**: Generates a multi-sheet spreadsheet (Summary sheet + Transaction Ledger sheet)
- **CSV Export**: Standard CSV download for spreadsheet imports

### 8. 👤 Profile, Preferences & Theme
- Name and currency preference (`₹`, `$`, `€`, `£`)
- Dark Mode / Light Mode with instant toggle
- System settings and one-click data reset to restore default demo benchmarks

---

## 🏗️ Project Structure

```
puppy/
├── src/
│   ├── components/           # MetricCard, TransactionModal, Table, ExportModal, etc.
│   ├── context/              # AuthContext, FinanceContext, ThemeContext, ToastContext
│   ├── layouts/              # MainLayout (Sidebar + Top Navbar)
│   ├── pages/                # Dashboard, Transactions, Budgets, Categories, Reports, Profile, Settings
│   ├── services/             # api.ts (Self-contained client storage & analytics engine)
│   ├── utils/                # formatters.ts (Currency & date formatting)
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 How to Run

```bash
# Start development server:
npm run dev

# Or build for production:
npm run build
npm run preview
```
