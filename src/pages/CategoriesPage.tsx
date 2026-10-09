import React, { useState } from 'react';
import { PlusCircle, Tag, Edit2, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryModal } from '../components/CategoryModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Category } from '../types';
import { formatCurrency, getCategoryColor } from '../utils/formatters';

export const CategoriesPage: React.FC = () => {
  const { categories, transactions, currency, deleteCategory } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate total expense per category
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount);
    });

  const handleEdit = (cat: Category) => {
    setCategoryToEdit(cat);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteCategory(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Classify and tag your expenses & income streams with custom color-coded labels
          </p>
        </div>

        <button
          onClick={() => {
            setCategoryToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const totalSpent = expenseByCategory[cat.name] || 0;
          const color = cat.color || getCategoryColor(cat.name);

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    <Tag className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!cat.isDefault ? (
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span title="Default Core Category" className="p-1.5 text-gray-400">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {cat.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      cat.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {cat.type}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Recorded Activity:</span>
                <span className="font-bold font-mono text-gray-900 dark:text-white">
                  {cat.type === 'expense' ? formatCurrency(totalSpent, currency) : 'Income Stream'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
      />

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Category"
        message="Are you sure you want to delete this custom category? Associated past transactions will retain their record tag."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
