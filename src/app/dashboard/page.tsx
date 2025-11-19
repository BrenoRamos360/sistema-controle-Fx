'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Bell, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function Dashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simular dados do mes atual (em producao viria do estado global ou API)
  const monthData = {
    entradas: 15000,
    salidas: 3500,
    gastosFijos: 4000,
    impuestos: 2000,
    entradasTarjeta: 9000,
    entradasEfectivo: 6000,
    cuentasPendientes: 2500,
    cuentasVencidas: 800,
    balance: 3000
  };

  // Dados para graficos (ultimos 7 dias)
  const weekData = [
    { day: 'Lun', entradas: 2000, salidas: 500 },
    { day: 'Mar', entradas: 1800, salidas: 600 },
    { day: 'Mié', entradas: 2200, salidas: 450 },
    { day: 'Jue', entradas: 1900, salidas: 550 },
    { day: 'Vie', entradas: 2500, salidas: 700 },
    { day: 'Sáb', entradas: 2300, salidas: 400 },
    { day: 'Dom', entradas: 2300, salidas: 300 }
  ];

  const maxValue = Math.max(...weekData.map(d => Math.max(d.entradas, d.salidas)));

  // Generar notificaciones automaticas
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Alerta si balance es negativo
    if (monthData.balance < 0) {
      newNotifications.push({
        id: '1',
        type: 'error',
        title: 'Balance Negativo',
        message: `Tu balance actual es de $${monthData.balance.toFixed(2)}. Revisa tus gastos.`,
        timestamp: new Date(),
        read: false
      });
    }

    // Alerta si balance es positivo
    if (monthData.balance > 0) {
      newNotifications.push({
        id: '2',
        type: 'success',
        title: 'Balance Positivo',
        message: `¡Excelente! Tu balance es de $${monthData.balance.toFixed(2)}.`,
        timestamp: new Date(),
        read: false
      });
    }

    // Alerta si gastos fijos son altos
    if (monthData.gastosFijos > monthData.entradas * 0.3) {
      newNotifications.push({
        id: '3',
        type: 'warning',
        title: 'Gastos Fijos Elevados',
        message: `Tus gastos fijos ($${monthData.gastosFijos}) representan más del 30% de tus entradas.`,
        timestamp: new Date(),
        read: false
      });
    }

    // Alerta si impuestos son altos
    if (monthData.impuestos > monthData.entradas * 0.2) {
      newNotifications.push({
        id: '4',
        type: 'warning',
        title: 'Impuestos Elevados',
        message: `Tus impuestos ($${monthData.impuestos}) representan más del 20% de tus entradas.`,
        timestamp: new Date(),
        read: false
      });
    }

    // Alerta de cuentas vencidas
    if (monthData.cuentasVencidas > 0) {
      newNotifications.push({
        id: '5',
        type: 'error',
        title: 'Cuentas Vencidas',
        message: `Tienes $${monthData.cuentasVencidas.toFixed(2)} en cuentas vencidas. ¡Paga urgente!`,
        timestamp: new Date(),
        read: false
      });
    }

    // Alerta de cuentas pendientes altas
    if (monthData.cuentasPendientes > monthData.entradas * 0.25) {
      newNotifications.push({
        id: '6',
        type: 'warning',
        title: 'Cuentas Pendientes Elevadas',
        message: `Tienes $${monthData.cuentasPendientes.toFixed(2)} en cuentas pendientes (más del 25% de tus entradas).`,
        timestamp: new Date(),
        read: false
      });
    }

    // Recordatorio de fin de mes
    const today = new Date();
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    
    if (daysLeft <= 5) {
      newNotifications.push({
        id: '7',
        type: 'info',
        title: 'Fin de Mes Próximo',
        message: `Quedan ${daysLeft} días para finalizar el mes. Revisa tus pendientes y cuentas a pagar.`,
        timestamp: new Date(),
        read: false
      });
    }

    setNotifications(newNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Bell className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              📊 Dashboard Financiero
            </h1>
            <p className="text-lg text-gray-600">
              Análisis completo de tus finanzas
            </p>
          </div>

          {/* Botón de Notificaciones */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Panel de Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">Notificaciones</h3>
                </div>
                <div className="p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 rounded-xl mb-2 border cursor-pointer transition-all hover:shadow-md ${
                          notif.read ? 'bg-gray-50 border-gray-200 opacity-60' : getNotificationColor(notif.type)
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notif.type)}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{notif.title}</h4>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notif.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No hay notificaciones</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón Volver al Calendario */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl font-semibold text-gray-700"
          >
            <Calendar className="w-5 h-5" />
            Volver al Calendario
          </Link>
        </div>

        {/* Cards de Resumen - ACTUALIZADOS CON CUENTAS A PAGAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Entradas */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-sm font-semibold text-green-700">+12%</span>
            </div>
            <h3 className="text-green-700 font-semibold mb-2">Total Entradas</h3>
            <p className="text-3xl font-bold text-green-800">${monthData.entradas.toFixed(2)}</p>
            <div className="mt-3 text-sm text-green-600">
              <p>Tarjeta: ${monthData.entradasTarjeta.toFixed(2)}</p>
              <p>Efectivo: ${monthData.entradasEfectivo.toFixed(2)}</p>
            </div>
          </div>

          {/* Total Salidas */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <span className="text-sm font-semibold text-red-700">-5%</span>
            </div>
            <h3 className="text-red-700 font-semibold mb-2">Salidas Diarias</h3>
            <p className="text-3xl font-bold text-red-800">${monthData.salidas.toFixed(2)}</p>
            <p className="mt-3 text-sm text-red-600">Gastos operativos del mes</p>
          </div>

          {/* Gastos Fijos */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Fijos</span>
            </div>
            <h3 className="text-purple-700 font-semibold mb-2">Gastos Fijos</h3>
            <p className="text-3xl font-bold text-purple-800">${monthData.gastosFijos.toFixed(2)}</p>
            <p className="mt-3 text-sm text-purple-600">
              {((monthData.gastosFijos / monthData.entradas) * 100).toFixed(1)}% de entradas
            </p>
          </div>

          {/* Impuestos */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Impuestos</span>
            </div>
            <h3 className="text-orange-700 font-semibold mb-2">Total Impuestos</h3>
            <p className="text-3xl font-bold text-orange-800">${monthData.impuestos.toFixed(2)}</p>
            <p className="mt-3 text-sm text-orange-600">
              {((monthData.impuestos / monthData.entradas) * 100).toFixed(1)}% de entradas
            </p>
          </div>

          {/* Cuentas a Pagar - NUEVO */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Pendientes</span>
            </div>
            <h3 className="text-yellow-700 font-semibold mb-2">Cuentas a Pagar</h3>
            <p className="text-3xl font-bold text-yellow-800">${monthData.cuentasPendientes.toFixed(2)}</p>
            <div className="mt-3 text-sm">
              <p className="text-yellow-600">Pendientes: ${monthData.cuentasPendientes.toFixed(2)}</p>
              {monthData.cuentasVencidas > 0 && (
                <p className="text-red-600 font-bold">Vencidas: ${monthData.cuentasVencidas.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - Últimos 7 Días */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Movimientos de la Semana</h2>
          </div>

          <div className="space-y-4">
            {weekData.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                  <span>{day.day}</span>
                  <div className="flex gap-4">
                    <span className="text-green-600">+${day.entradas}</span>
                    <span className="text-red-600">-${day.salidas}</span>
                  </div>
                </div>
                <div className="flex gap-2 h-8">
                  {/* Barra de Entradas */}
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-lg transition-all duration-500"
                      style={{ width: `${(day.entradas / maxValue) * 100}%` }}
                    />
                  </div>
                  {/* Barra de Salidas */}
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-lg transition-all duration-500"
                      style={{ width: `${(day.salidas / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Salidas</span>
            </div>
          </div>
        </div>

        {/* Balance Final Destacado */}
        <div className={`rounded-3xl shadow-2xl p-8 border-2 ${
          monthData.balance >= 0 
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300' 
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
        }`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Balance Final del Mes</h2>
            <p className={`text-6xl font-bold mb-4 ${
              monthData.balance >= 0 ? 'text-blue-800' : 'text-red-800'
            }`}>
              ${monthData.balance.toFixed(2)}
            </p>
            <p className="text-lg text-gray-600 mb-4">
              {monthData.balance >= 0 
                ? '¡Excelente gestión financiera!' 
                : 'Revisa tus gastos para mejorar el balance'}
            </p>
            {monthData.cuentasPendientes > 0 && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-xl">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ Recuerda: Tienes ${monthData.cuentasPendientes.toFixed(2)} en cuentas pendientes de pago
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
