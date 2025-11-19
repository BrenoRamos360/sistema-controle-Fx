'use client';

import { calculateMonthSummary } from '@/lib/finance-storage';
import { formatCurrency } from '@/lib/utils-finance';
import { TrendingUp, TrendingDown, DollarSign, Receipt, CreditCard, Wallet } from 'lucide-react';

interface MonthSummaryProps {
  month: string;
}

export default function MonthSummary({ month }: MonthSummaryProps) {
  const summary = calculateMonthSummary(month);

  const stats = [
    {
      label: 'Total Entradas',
      value: summary.totalIncomes,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Total Salidas Diarias',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      label: 'Gastos Fijos',
      value: summary.totalFixedExpenses,
      icon: Receipt,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Gastos Variables',
      value: summary.totalVariableExpenses,
      icon: CreditCard,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  const totalGastos = summary.totalExpenses + summary.totalFixedExpenses + summary.totalVariableExpenses;

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {formatCurrency(stat.value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Beneficio final destacado */}
      <div className={`
        rounded-2xl p-6 border-2
        ${summary.finalProfit >= 0 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 dark:border-green-700' 
          : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-300 dark:border-red-700'
        }
      `}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className={`w-6 h-6 ${summary.finalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Beneficio Final del Mes</span>
            </div>
            <div className={`text-4xl font-bold ${summary.finalProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {formatCurrency(summary.finalProfit)}
            </div>
          </div>
          <div className="text-right text-sm text-gray-600 dark:text-gray-400">
            <div>Ingresos: {formatCurrency(summary.totalIncomes)}</div>
            <div>Gastos totales: {formatCurrency(totalGastos)}</div>
          </div>
        </div>
      </div>

      {/* Resumen de días con actividad */}
      {summary.dailyData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Actividad Diaria</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {summary.dailyData.map((day) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">+{formatCurrency(day.incomes)}</span>
                  <span className="text-red-600 dark:text-red-400">-{formatCurrency(day.expenses)}</span>
                  <span className={`font-semibold ${day.profit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {formatCurrency(day.profit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
