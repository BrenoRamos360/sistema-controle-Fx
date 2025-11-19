import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface Transaction {
  id?: string;
  user_id: string;
  type: 'entrada' | 'salida';
  amount: number;
  description: string;
  payment_method?: 'tarjeta' | 'efectivo';
  category?: string;
  date: string;
  created_at?: string;
}

export interface FixedExpense {
  id?: string;
  user_id: string;
  description: string;
  amount: number;
  created_at?: string;
}

export interface Tax {
  id?: string;
  user_id: string;
  description: string;
  amount: number;
  created_at?: string;
}

export interface Bill {
  id?: string;
  user_id: string;
  creditor: string;
  amount: number;
  due_date: string;
  status: 'pendiente' | 'pagada' | 'vencida';
  description: string;
  created_at?: string;
}

export interface Category {
  id?: string;
  user_id: string;
  name: string;
  type: 'entrada' | 'salida';
  color: string;
  created_at?: string;
}

export interface FinancialGoal {
  id?: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  description: string;
  created_at?: string;
}
