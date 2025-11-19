'use client';

import { useState } from 'react';
import { addFixedExpense, deleteFixedExpense, addVariableExpense, deleteVariableExpense, getMonthData } from '@/lib/finance-storage';
import { formatCurrency } from '@/lib/utils-finance';
import { Plus, Trash2, Receipt, CreditCard } from 'lucide-react';

interface MonthExpensesProps {
  month: string;
  onUpdate: () => void;
}

export default function MonthExpenses({ month, onUpdate }: MonthExpensesProps) {
  const monthData = getMonthData(month);
  
  const [showFixedForm, setShowFixedForm] = useState(false);
  const [showVariableForm, setShowVariableForm] = useState(false);
  
  const [fixedDescription, setFixedDescription] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  
  const [variableDescription, setVariableDescription] = useState('');
  const [variableAmount, setVariableAmount] = useState('');

  const handleAddFixed = (e: React.FormEvent) => {
    e.preventDefault();
    if (fixedDescription && fixedAmount) {
      addFixedExpense(month, {
        description: fixedDescription,
        amount: parseFloat(fixedAmount),
        month,
      });
      setFixedDescription('');
      setFixedAmount('');
      setShowFixedForm(false);
      onUpdate();
    }
  };

  const handleDeleteFixed = (id: string) => {
    deleteFixedExpense(month, id);
    onUpdate();
  };

  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (variableDescription && variableAmount) {
      addVariableExpense(month, {
        description: variableDescription,
        amount: parseFloat(variableAmount),
        month,
      });
      setVariableDescription('');
      setVariableAmount('');
      setShowVariableForm(false);
      onUpdate();
    }
  };

  const handleDeleteVariable = (id: string) => {
    deleteVariableExpense(month, id);
    onUpdate();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gastos Fijos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Gastos Fijos</h3>
          </div>
          <button
            onClick={() => setShowFixedForm(!showFixedForm)}
            className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showFixedForm && (
          <form onSubmit={handleAddFixed} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Descripción (ej: Alquiler)"
              value={fixedDescription}
              onChange={(e) => setFixedDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => setShowFixedForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {monthData.fixedExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No hay gastos fijos registrados
            </p>
          ) : (
            monthData.fixedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{expense.description}</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFixed(expense.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {monthData.fixedExpenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Total Fijos:</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(monthData.fixedExpenses.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gastos Variables */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Gastos Variables</h3>
          </div>
          <button
            onClick={() => setShowVariableForm(!showVariableForm)}
            className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showVariableForm && (
          <form onSubmit={handleAddVariable} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Descripción (ej: Reparación)"
              value={variableDescription}
              onChange={(e) => setVariableDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad"
              value={variableAmount}
              onChange={(e) => setVariableAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => setShowVariableForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {monthData.variableExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No hay gastos variables registrados
            </p>
          ) : (
            monthData.variableExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{expense.description}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteVariable(expense.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {monthData.variableExpenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Total Variables:</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(monthData.variableExpenses.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
