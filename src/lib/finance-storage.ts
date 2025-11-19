// Sistema de almacenamiento para datos financieros
import { MonthData, DayData, Transaction, FixedExpense, VariableExpense, MonthSummary } from './types';

const STORAGE_KEY = 'finance_data';

// Obtener todos los datos
export function getAllData(): Record<string, MonthData> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Guardar todos los datos
function saveAllData(data: Record<string, MonthData>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Obtener datos de un mes específico
export function getMonthData(month: string): MonthData {
  const allData = getAllData();
  return allData[month] || {
    month,
    fixedExpenses: [],
    variableExpenses: [],
    days: {},
  };
}

// Guardar datos de un mes
export function saveMonthData(month: string, monthData: MonthData) {
  const allData = getAllData();
  allData[month] = monthData;
  saveAllData(allData);
}

// Obtener datos de un día específico
export function getDayData(date: string): DayData {
  const month = date.substring(0, 7); // YYYY-MM
  const monthData = getMonthData(month);
  return monthData.days[date] || {
    date,
    incomes: [],
    expenses: [],
  };
}

// Guardar datos de un día
export function saveDayData(date: string, dayData: DayData) {
  const month = date.substring(0, 7);
  const monthData = getMonthData(month);
  monthData.days[date] = dayData;
  saveMonthData(month, monthData);
}

// Agregar transacción (entrada o salida)
export function addTransaction(date: string, transaction: Omit<Transaction, 'id'>): Transaction {
  const dayData = getDayData(date);
  const newTransaction: Transaction = {
    ...transaction,
    id: `${Date.now()}-${Math.random()}`,
    date,
  };

  if (transaction.type === 'income') {
    dayData.incomes.push(newTransaction);
  } else {
    dayData.expenses.push(newTransaction);
  }

  saveDayData(date, dayData);
  return newTransaction;
}

// Eliminar transacción
export function deleteTransaction(date: string, transactionId: string, type: 'income' | 'expense') {
  const dayData = getDayData(date);
  
  if (type === 'income') {
    dayData.incomes = dayData.incomes.filter(t => t.id !== transactionId);
  } else {
    dayData.expenses = dayData.expenses.filter(t => t.id !== transactionId);
  }

  saveDayData(date, dayData);
}

// Actualizar transacción
export function updateTransaction(date: string, transactionId: string, updates: Partial<Transaction>) {
  const dayData = getDayData(date);
  
  const updateList = (list: Transaction[]) => {
    return list.map(t => t.id === transactionId ? { ...t, ...updates } : t);
  };

  dayData.incomes = updateList(dayData.incomes);
  dayData.expenses = updateList(dayData.expenses);

  saveDayData(date, dayData);
}

// Agregar gasto fijo
export function addFixedExpense(month: string, expense: Omit<FixedExpense, 'id'>): FixedExpense {
  const monthData = getMonthData(month);
  const newExpense: FixedExpense = {
    ...expense,
    id: `${Date.now()}-${Math.random()}`,
    month,
  };
  monthData.fixedExpenses.push(newExpense);
  saveMonthData(month, monthData);
  return newExpense;
}

// Eliminar gasto fijo
export function deleteFixedExpense(month: string, expenseId: string) {
  const monthData = getMonthData(month);
  monthData.fixedExpenses = monthData.fixedExpenses.filter(e => e.id !== expenseId);
  saveMonthData(month, monthData);
}

// Agregar gasto variable
export function addVariableExpense(month: string, expense: Omit<VariableExpense, 'id'>): VariableExpense {
  const monthData = getMonthData(month);
  const newExpense: VariableExpense = {
    ...expense,
    id: `${Date.now()}-${Math.random()}`,
    month,
  };
  monthData.variableExpenses.push(newExpense);
  saveMonthData(month, monthData);
  return newExpense;
}

// Eliminar gasto variable
export function deleteVariableExpense(month: string, expenseId: string) {
  const monthData = getMonthData(month);
  monthData.variableExpenses = monthData.variableExpenses.filter(e => e.id !== expenseId);
  saveMonthData(month, monthData);
}

// Calcular resumen del mes
export function calculateMonthSummary(month: string): MonthSummary {
  const monthData = getMonthData(month);
  
  let totalIncomes = 0;
  let totalExpenses = 0;
  const dailyData: Array<{ date: string; incomes: number; expenses: number; profit: number }> = [];

  // Calcular totales diarios
  Object.entries(monthData.days).forEach(([date, dayData]) => {
    const dayIncomes = dayData.incomes.reduce((sum, t) => sum + t.amount, 0);
    const dayExpenses = dayData.expenses.reduce((sum, t) => sum + t.amount, 0);
    
    totalIncomes += dayIncomes;
    totalExpenses += dayExpenses;

    dailyData.push({
      date,
      incomes: dayIncomes,
      expenses: dayExpenses,
      profit: dayIncomes - dayExpenses,
    });
  });

  // Ordenar por fecha
  dailyData.sort((a, b) => a.date.localeCompare(b.date));

  // Calcular gastos fijos y variables
  const totalFixedExpenses = monthData.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariableExpenses = monthData.variableExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Beneficio final = ingresos - gastos diarios - gastos fijos - gastos variables
  const finalProfit = totalIncomes - totalExpenses - totalFixedExpenses - totalVariableExpenses;

  return {
    totalIncomes,
    totalExpenses,
    totalFixedExpenses,
    totalVariableExpenses,
    finalProfit,
    dailyData,
  };
}

// Obtener todos los meses disponibles
export function getAvailableMonths(): string[] {
  const allData = getAllData();
  return Object.keys(allData).sort().reverse();
}
