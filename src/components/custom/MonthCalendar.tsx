'use client';

import { getDayData } from '@/lib/finance-storage';
import { getMonthDates, getDayName, formatCurrency } from '@/lib/utils-finance';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface MonthCalendarProps {
  month: string;
  onMonthChange: (month: string) => void;
  previousMonth: string;
  nextMonth: string;
}

export default function MonthCalendar({ month, onMonthChange, previousMonth, nextMonth }: MonthCalendarProps) {
  const dates = getMonthDates(month);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2">
        {/* Días de la semana */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}

        {/* Espacios vacíos al inicio */}
        {(() => {
          const firstDate = new Date(dates[0] + 'T00:00:00');
          const firstDayOfWeek = firstDate.getDay();
          const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
          
          return Array.from({ length: emptyDays }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ));
        })()}

        {/* Días del mes */}
        {dates.map((date) => {
          const dayData = getDayData(date);
          const dayIncomes = dayData.incomes.reduce((sum, t) => sum + t.amount, 0);
          const dayExpenses = dayData.expenses.reduce((sum, t) => sum + t.amount, 0);
          const dayProfit = dayIncomes - dayExpenses;
          const hasData = dayIncomes > 0 || dayExpenses > 0;

          const day = parseInt(date.split('-')[2]);
          const isToday = date === new Date().toISOString().split('T')[0];

          return (
            <Link
              key={date}
              href={`/day/${date}`}
              className={`
                aspect-square border rounded-lg p-2 hover:shadow-lg transition-all
                flex flex-col justify-between
                ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-gray-700'}
                ${hasData ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                hover:scale-105
              `}
            >
              <div className="text-right">
                <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {day}
                </span>
              </div>
              
              {hasData && (
                <div className="text-xs space-y-0.5">
                  {dayIncomes > 0 && (
                    <div className="text-green-600 dark:text-green-400 font-medium truncate">
                      +{formatCurrency(dayIncomes)}
                    </div>
                  )}
                  {dayExpenses > 0 && (
                    <div className="text-red-600 dark:text-red-400 font-medium truncate">
                      -{formatCurrency(dayExpenses)}
                    </div>
                  )}
                  <div className={`font-bold truncate ${dayProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {formatCurrency(dayProfit)}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
