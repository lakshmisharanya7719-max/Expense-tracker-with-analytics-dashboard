import React, { useState } from 'react';
import { X, FileDown, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { transactions, analytics, currency } = useFinance();
  const { success, error } = useToast();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  // 1. EXPORT CSV
  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      const csvRows = [
        ['Date', 'Type', 'Category', 'Payment Method', 'Amount', 'Description'],
        ...transactions.map((t) => [
          t.date,
          t.type.toUpperCase(),
          t.category,
          t.payment_method,
          t.amount,
          `"${(t.note || '').replace(/"/g, '""')}"`,
        ]),
      ];

      const csvString = csvRows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      success('CSV Exported', 'Downloaded transaction records successfully');
      onClose();
    } catch (err: any) {
      error('Export Error', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. EXPORT EXCEL (.xlsx)
  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      
      // Transactions worksheet
      const txData = transactions.map((t) => ({
        Date: t.date,
        Type: t.type.toUpperCase(),
        Category: t.category,
        'Payment Method': t.payment_method,
        Amount: t.amount,
        Notes: t.note,
      }));

      // Summary worksheet
      const summaryData = [
        { Metric: 'Total Income', Value: `${currency}${analytics.totalIncome.toLocaleString()}` },
        { Metric: 'Total Expenses', Value: `${currency}${analytics.totalExpenses.toLocaleString()}` },
        { Metric: 'Net Balance', Value: `${currency}${analytics.balance.toLocaleString()}` },
        { Metric: 'Savings Rate', Value: `${analytics.savingsRate}%` },
        { Metric: 'Top Expense Category', Value: analytics.topCategory },
        { Metric: 'Report Date', Value: new Date().toLocaleDateString() },
      ];

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      const wsTx = XLSX.utils.json_to_sheet(txData);

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Financial Overview');
      XLSX.utils.book_append_sheet(wb, wsTx, 'Transactions');

      XLSX.writeFile(wb, `Financial_Statement_${new Date().toISOString().slice(0, 10)}.xlsx`);
      success('Excel Exported', 'Workbook with financial sheets downloaded');
      onClose();
    } catch (err: any) {
      error('Export Error', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. EXPORT PDF REPORT
  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();

      // Title & Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('ExpenseFlow - Financial Statement', 14, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on: ${new Date().toLocaleString()} | Currency: ${currency}`, 14, 28);

      // Financial Metrics Summary Box
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 14, 48);

      autoTable(doc, {
        startY: 53,
        head: [['Metric', 'Figure', 'Status']],
        body: [
          ['Total Income', formatCurrency(analytics.totalIncome, currency), 'Positive Cashflow'],
          ['Total Expenses', formatCurrency(analytics.totalExpenses, currency), 'Controlled Outflow'],
          ['Net Savings / Balance', formatCurrency(analytics.balance, currency), analytics.balance >= 0 ? 'Surplus' : 'Deficit'],
          ['Savings Rate', `${analytics.savingsRate}%`, `${analytics.savingsRate >= 20 ? 'Optimal' : 'Needs Review'}`],
          ['Top Spending Area', analytics.topCategory, formatCurrency(analytics.topCategoryAmount, currency)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 9 },
      });

      // Transactions Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const finalY = (doc as any).lastAutoTable.finalY + 14;
      doc.text('Transaction Ledger', 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Date', 'Type', 'Category', 'Payment', 'Amount', 'Description']],
        body: transactions.map((t) => [
          formatDate(t.date),
          t.type.toUpperCase(),
          t.category,
          t.payment_method,
          formatCurrency(t.amount, currency),
          t.note || '-',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 8 },
      });

      doc.save(`Expense_Statement_${new Date().toISOString().slice(0, 10)}.pdf`);
      success('PDF Exported', 'Clean statement generated and saved');
      onClose();
    } catch (err: any) {
      error('Export Error', err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Export Financial Data</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Select your preferred export format for auditing or archival
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 my-6">
          {/* PDF Option */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-left transition-all group"
          >
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">PDF Statement</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Formal printable report with summary tables</p>
            </div>
            <FileDown className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* Excel Option */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-left transition-all group"
          >
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Excel Spreadsheet (.xlsx)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Formatted workbook with multi-tab analysis</p>
            </div>
            <FileDown className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* CSV Option */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-left transition-all group"
          >
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Standard CSV</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lightweight raw dataset compatible everywhere</p>
            </div>
            <FileDown className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
