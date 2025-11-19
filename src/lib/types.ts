// Tipos para el sistema de control financiero

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // formato: YYYY-MM-DD
  type: 'income' | 'expense';
}

export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  month: string; // formato: YYYY-MM
}

export interface VariableExpense {
  id: string;
  description: string;
  amount: number;
  month: string; // formato: YYYY-MM
}

export interface DayData {
  date: string; // formato: YYYY-MM-DD
  incomes: Transaction[];
  expenses: Transaction[];
}

export interface MonthData {
  month: string; // formato: YYYY-MM
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  days: Record<string, DayData>;
}

export interface MonthSummary {
  totalIncomes: number;
  totalExpenses: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  finalProfit: number;
  dailyData: Array<{
    date: string;
    incomes: number;
    expenses: number;
    profit: number;
  }>;
}
