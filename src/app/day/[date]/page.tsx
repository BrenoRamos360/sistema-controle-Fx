'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDayData, addTransaction, deleteTransaction } from '@/lib/finance-storage';
import { formatDate, formatCurrency, getDayName } from '@/lib/utils-finance';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Transaction } from '@/lib/types';

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;

  const [dayData, setDayData] = useState(getDayData(date));
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    setDayData(getDayData(date));
  }, [date]);

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (incomeDescription && incomeAmount) {
      addTransaction(date, {
        description: incomeDescription,
        amount: parseFloat(incomeAmount),
        type: 'income',
        date,
      });
      setIncomeDescription('');
      setIncomeAmount('');
      setShowIncomeForm(false);
      setDayData(getDayData(date));
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseDescription && expenseAmount) {
      addTransaction(date, {
        description: expenseDescription,
        amount: parseFloat(expenseAmount),
        type: 'expense',
        date,
      });
      setExpenseDescription('');
      setExpenseAmount('');
      setShowExpenseForm(false);
      setDayData(getDayData(date));
    }
  };

  const handleDeleteIncome = (id: string) => {
    deleteTransaction(date, id, 'income');
    setDayData(getDayData(date));
  };

  const handleDeleteExpense = (id: string) => {
    deleteTransaction(date, id, 'expense');
    setDayData(getDayData(date));
  };

  const totalIncomes = dayData.incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = dayData.expenses.reduce((sum, t) => sum + t.amount, 0);
  const dayProfit = totalIncomes - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al calendario
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
            {getDayName(date)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{formatDate(date)}</p>
        </div>

        {/* Resumen del día */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entradas</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncomes)}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Salidas</span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpenses)}
            </div>
          </div>

          <div className={`rounded-xl p-4 border-2 ${
            dayProfit >= 0
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 dark:border-green-700'
              : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`w-5 h-5 ${dayProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Beneficio</span>
            </div>
            <div className={`text-2xl font-bold ${dayProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {formatCurrency(dayProfit)}
            </div>
          </div>
        </div>

        {/* Layout de dos columnas: Entradas | Salidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA: ENTRADAS */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Entradas
              </h2>
              <button
                onClick={() => setShowIncomeForm(!showIncomeForm)}
                className="p-2 rounded-lg bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showIncomeForm && (
              <form onSubmit={handleAddIncome} className="mb-4 space-y-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <input
                  type="text"
                  placeholder="Descripción (ej: Venta de producto)"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cantidad"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Agregar Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIncomeForm(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dayData.incomes.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay entradas registradas
                </p>
              ) : (
                dayData.incomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{income.description}</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        +{formatCurrency(income.amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteIncome(income.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {dayData.incomes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(totalIncomes)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: SALIDAS */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                Salidas
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="mb-4 space-y-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <input
                  type="text"
                  placeholder="Descripción (ej: Compra de material)"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cantidad"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Agregar Salida
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpenseForm(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dayData.expenses.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay salidas registradas
                </p>
              ) : (
                dayData.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{expense.description}</div>
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        -{formatCurrency(expense.amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {dayData.expenses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
