'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, Plus, X, CreditCard, Banknote, Receipt, FileText, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  type: 'entrada' | 'salida';
  amount: number;
  description: string;
  paymentMethod?: 'tarjeta' | 'efectivo';
}

interface FixedExpense {
  description: string;
  amount: number;
}

interface Tax {
  description: string;
  amount: number;
}

interface Bill {
  id: string;
  creditor: string;
  amount: number;
  dueDate: Date;
  status: 'pendiente' | 'pagada' | 'vencida';
  description: string;
}

interface DayData {
  [day: number]: Transaction[];
}

interface MonthData {
  [monthKey: string]: DayData;
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'entrada' | 'salida'>('entrada');
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'efectivo'>('tarjeta');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [monthData, setMonthData] = useState<MonthData>({});
  
  // Estados para gastos fijos e impuestos
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [showFixedExpenseModal, setShowFixedExpenseModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [newFixedExpense, setNewFixedExpense] = useState({ description: '', amount: '' });
  const [newTax, setNewTax] = useState({ description: '', amount: '' });

  // Estados para Cuentas a Pagar
  const [bills, setBills] = useState<Bill[]>([]);
  const [showBillModal, setShowBillModal] = useState(false);
  const [newBill, setNewBill] = useState({
    creditor: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const monthKey = `${currentYear}-${currentDate.getMonth()}`;

  const getDaysInMonth = () => {
    return new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentDate.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleAddTransaction = () => {
    if (!amount || !selectedDay) return;

    const newTransaction: Transaction = {
      type: transactionType,
      amount: parseFloat(amount),
      description: description || 'Sin descripción',
      paymentMethod: transactionType === 'entrada' ? paymentMethod : undefined
    };

    setMonthData(prev => {
      const currentMonthData = prev[monthKey] || {};
      const dayTransactions = currentMonthData[selectedDay] || [];

      return {
        ...prev,
        [monthKey]: {
          ...currentMonthData,
          [selectedDay]: [...dayTransactions, newTransaction]
        }
      };
    });

    // Reset form
    setAmount('');
    setDescription('');
    setShowModal(false);
  };

  const handleAddFixedExpense = () => {
    if (!newFixedExpense.amount || !newFixedExpense.description) return;
    
    setFixedExpenses([...fixedExpenses, {
      description: newFixedExpense.description,
      amount: parseFloat(newFixedExpense.amount)
    }]);
    
    setNewFixedExpense({ description: '', amount: '' });
    setShowFixedExpenseModal(false);
  };

  const handleAddTax = () => {
    if (!newTax.amount || !newTax.description) return;
    
    setTaxes([...taxes, {
      description: newTax.description,
      amount: parseFloat(newTax.amount)
    }]);
    
    setNewTax({ description: '', amount: '' });
    setShowTaxModal(false);
  };

  const handleAddBill = () => {
    if (!newBill.creditor || !newBill.amount || !newBill.dueDate) return;

    const dueDate = new Date(newBill.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    let status: 'pendiente' | 'pagada' | 'vencida' = 'pendiente';
    if (dueDate < today) {
      status = 'vencida';
    }

    const bill: Bill = {
      id: Date.now().toString(),
      creditor: newBill.creditor,
      amount: parseFloat(newBill.amount),
      dueDate: dueDate,
      status: status,
      description: newBill.description || 'Sin descripción'
    };

    setBills([...bills, bill]);
    setNewBill({ creditor: '', amount: '', dueDate: '', description: '' });
    setShowBillModal(false);
  };

  const toggleBillStatus = (id: string) => {
    setBills(prev =>
      prev.map(bill =>
        bill.id === id
          ? { ...bill, status: bill.status === 'pagada' ? 'pendiente' : 'pagada' }
          : bill
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  const getDayTransactions = (day: number): Transaction[] => {
    return monthData[monthKey]?.[day] || [];
  };

  const getDayTotals = (day: number) => {
    const transactions = getDayTransactions(day);
    const entradas = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);
    const salidas = transactions
      .filter(t => t.type === 'salida')
      .reduce((sum, t) => sum + t.amount, 0);
    return { entradas, salidas };
  };

  const getMonthTotals = () => {
    const currentMonthData = monthData[monthKey] || {};
    let totalEntradas = 0;
    let totalSalidas = 0;
    let entradasTarjeta = 0;
    let entradasEfectivo = 0;

    Object.values(currentMonthData).forEach(dayTransactions => {
      dayTransactions.forEach(transaction => {
        if (transaction.type === 'entrada') {
          totalEntradas += transaction.amount;
          if (transaction.paymentMethod === 'tarjeta') {
            entradasTarjeta += transaction.amount;
          } else if (transaction.paymentMethod === 'efectivo') {
            entradasEfectivo += transaction.amount;
          }
        } else {
          totalSalidas += transaction.amount;
        }
      });
    });

    const totalGastosFijos = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalImpuestos = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalCuentasPendientes = bills
      .filter(bill => bill.status !== 'pagada')
      .reduce((sum, bill) => sum + bill.amount, 0);

    return {
      entradas: totalEntradas,
      salidas: totalSalidas,
      entradasTarjeta,
      entradasEfectivo,
      gastosFijos: totalGastosFijos,
      impuestos: totalImpuestos,
      cuentasPendientes: totalCuentasPendientes,
      balance: totalEntradas - totalSalidas - totalGastosFijos - totalImpuestos - totalCuentasPendientes
    };
  };

  const monthTotals = getMonthTotals();

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'pagada':
        return 'bg-green-50 border-green-300';
      case 'vencida':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-yellow-50 border-yellow-300';
    }
  };

  const getBillStatusText = (status: string) => {
    switch (status) {
      case 'pagada':
        return 'Pagada';
      case 'vencida':
        return 'Vencida';
      default:
        return 'Pendiente';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square rounded-xl p-3 bg-gray-50" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const { entradas, salidas } = getDayTotals(day);
      const hasTransactions = entradas > 0 || salidas > 0;

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            aspect-square rounded-xl p-3 text-center transition-all cursor-pointer
            ${hasTransactions 
              ? 'bg-blue-50 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg hover:scale-105' 
              : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg hover:scale-105'
            }
          `}
        >
          <div className="font-semibold text-lg text-gray-800">{day}</div>
          <div className="mt-2 text-xs">
            {entradas > 0 && (
              <div className="text-green-600 font-medium">+${entradas.toFixed(0)}</div>
            )}
            {salidas > 0 && (
              <div className="text-red-600 font-medium">-${salidas.toFixed(0)}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            💰 Control Financiero
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Gestiona tus entradas y salidas diarias
          </p>
          
          {/* Botón Dashboard */}
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              Ver Dashboard y Notificaciones
            </Link>
          </div>
        </div>

        {/* SECCIÓN NUEVA - Cuentas a Pagar */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Cuentas a Pagar</h2>
            </div>
            <button
              onClick={() => setShowBillModal(true)}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Lista de Cuentas */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bills.length > 0 ? (
              bills.map((bill) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDate = new Date(bill.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={bill.id}
                    className={`border-2 rounded-xl p-4 transition-all ${getBillStatusColor(bill.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">{bill.creditor}</h3>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              bill.status === 'pagada'
                                ? 'bg-green-200 text-green-800'
                                : bill.status === 'vencida'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {getBillStatusText(bill.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{bill.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-700">
                            <strong>Vencimiento:</strong> {bill.dueDate.toLocaleDateString('es-ES')}
                          </span>
                          {bill.status === 'pendiente' && daysUntilDue >= 0 && (
                            <span className={`flex items-center gap-1 ${daysUntilDue <= 3 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                              <AlertCircle className="w-4 h-4" />
                              {daysUntilDue === 0 ? 'Vence hoy' : `${daysUntilDue} días`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-2xl font-bold text-blue-700">${bill.amount.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBillStatus(bill.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                              bill.status === 'pagada'
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {bill.status === 'pagada' ? 'Marcar Pendiente' : 'Marcar Pagada'}
                          </button>
                          <button
                            onClick={() => deleteBill(bill.id)}
                            className="px-3 py-1 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No hay cuentas a pagar registradas</p>
            )}
          </div>

          {/* Resumen de Cuentas */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 font-semibold mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800">
                ${bills.filter(b => b.status === 'pendiente').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-semibold mb-1">Vencidas</p>
              <p className="text-2xl font-bold text-red-800">
                ${bills.filter(b => b.status === 'vencida').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-semibold mb-1">Pagadas</p>
              <p className="text-2xl font-bold text-green-800">
                ${bills.filter(b => b.status === 'pagada').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* SECCIONES - Gastos Fijos e Impuestos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gastos Fijos */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Receipt className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Gastos Fijos</h2>
              </div>
              <button
                onClick={() => setShowFixedExpenseModal(true)}
                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {fixedExpenses.length > 0 ? (
                fixedExpenses.map((expense, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{expense.description}</span>
                    <span className="text-purple-700 font-bold text-lg">${expense.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No hay gastos fijos registrados</p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Gastos Fijos:</span>
                <span className="text-2xl font-bold text-purple-700">${monthTotals.gastosFijos.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Impuestos */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Impuestos</h2>
              </div>
              <button
                onClick={() => setShowTaxModal(true)}
                className="p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {taxes.length > 0 ? (
                taxes.map((tax, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{tax.description}</span>
                    <span className="text-orange-700 font-bold text-lg">${tax.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No hay impuestos registrados</p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Impuestos:</span>
                <span className="text-2xl font-bold text-orange-700">${monthTotals.impuestos.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card - Calendario */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 border border-gray-200 mb-8">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <button
              onClick={handlePrevMonth}
              className="p-3 rounded-xl hover:bg-blue-50 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
                {currentMonth} {currentYear}
              </h2>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-3 rounded-xl hover:bg-blue-50 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-8">
            {/* Day Headers */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-bold text-gray-700 py-2 text-sm sm:text-base">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {renderCalendar()}
          </div>
        </div>

        {/* Summary Cards - ACTUALIZADAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* Entradas en Tarjeta */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 sm:p-6 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-cyan-700" />
              <div className="text-cyan-700 font-semibold">Entradas Tarjeta</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-800">
              ${monthTotals.entradasTarjeta.toFixed(2)}
            </div>
          </div>

          {/* Entradas en Efectivo */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <div className="text-emerald-700 font-semibold">Entradas Efectivo</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800">
              ${monthTotals.entradasEfectivo.toFixed(2)}
            </div>
          </div>
          
          {/* Total Entradas */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 border border-green-200">
            <div className="text-green-700 font-semibold mb-2">Total Entradas</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-800">
              ${monthTotals.entradas.toFixed(2)}
            </div>
          </div>
          
          {/* Salidas Diarias */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 border border-red-200">
            <div className="text-red-700 font-semibold mb-2">Salidas Diarias</div>
            <div className="text-2xl sm:text-3xl font-bold text-red-800">
              ${monthTotals.salidas.toFixed(2)}
            </div>
          </div>

          {/* Cuentas Pendientes */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 sm:p-6 border border-yellow-200">
            <div className="text-yellow-700 font-semibold mb-2">Cuentas Pendientes</div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-800">
              ${monthTotals.cuentasPendientes.toFixed(2)}
            </div>
          </div>
          
          {/* Balance Final */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-200">
            <div className="text-blue-700 font-semibold mb-2">Balance Final</div>
            <div className={`text-2xl sm:text-3xl font-bold ${monthTotals.balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              ${monthTotals.balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-base sm:text-lg">✨ Haz clic en cualquier día para registrar movimientos</p>
        </div>
      </div>

      {/* Modal - Transacciones Diarias */}
      {showModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Día {selectedDay} - {currentMonth}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Transaction List */}
            <div className="mb-6 max-h-40 overflow-y-auto">
              {getDayTransactions(selectedDay).length > 0 ? (
                <div className="space-y-2">
                  {getDayTransactions(selectedDay).map((transaction, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl ${
                        transaction.type === 'entrada' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-600">{transaction.description}</span>
                          {transaction.paymentMethod && (
                            <div className="flex items-center gap-1 mt-1">
                              {transaction.paymentMethod === 'tarjeta' ? (
                                <CreditCard className="w-3 h-3 text-cyan-600" />
                              ) : (
                                <Banknote className="w-3 h-3 text-emerald-600" />
                              )}
                              <span className="text-xs text-gray-500 capitalize">{transaction.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                        <span className={`font-bold ${
                          transaction.type === 'entrada' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {transaction.type === 'entrada' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay transacciones registradas</p>
              )}
            </div>

            {/* Add Transaction Form */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTransactionType('entrada')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    transactionType === 'entrada'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Entrada
                </button>
                <button
                  onClick={() => setTransactionType('salida')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    transactionType === 'salida'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Salida
                </button>
              </div>

              {/* Método de Pago - Solo para Entradas */}
              {transactionType === 'entrada' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-cyan-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Tarjeta
                  </button>
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'efectivo'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    Efectivo
                  </button>
                </div>
              )}

              <input
                type="number"
                placeholder="Monto"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />

              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />

              <button
                onClick={handleAddTransaction}
                disabled={!amount}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Agregar Transacción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Cuentas a Pagar */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Agregar Cuenta a Pagar</h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Acreedor (ej: Proveedor, Banco)"
                value={newBill.creditor}
                onChange={(e) => setNewBill({...newBill, creditor: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />

              <input
                type="number"
                placeholder="Monto"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />

              <input
                type="date"
                placeholder="Fecha de Vencimiento"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={newBill.description}
                onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />

              <button
                onClick={handleAddBill}
                disabled={!newBill.creditor || !newBill.amount || !newBill.dueDate}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Agregar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Gastos Fijos */}
      {showFixedExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Agregar Gasto Fijo</h3>
              <button
                onClick={() => setShowFixedExpenseModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Descripción (ej: Alquiler, Salarios)"
                value={newFixedExpense.description}
                onChange={(e) => setNewFixedExpense({...newFixedExpense, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              />

              <input
                type="number"
                placeholder="Monto"
                value={newFixedExpense.amount}
                onChange={(e) => setNewFixedExpense({...newFixedExpense, amount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg"
              />

              <button
                onClick={handleAddFixedExpense}
                disabled={!newFixedExpense.amount || !newFixedExpense.description}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Agregar Gasto Fijo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Impuestos */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Agregar Impuesto</h3>
              <button
                onClick={() => setShowTaxModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Descripción (ej: IVA, ISR)"
                value={newTax.description}
                onChange={(e) => setNewTax({...newTax, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
              />

              <input
                type="number"
                placeholder="Monto"
                value={newTax.amount}
                onChange={(e) => setNewTax({...newTax, amount: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg"
              />

              <button
                onClick={handleAddTax}
                disabled={!newTax.amount || !newTax.description}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Agregar Impuesto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
