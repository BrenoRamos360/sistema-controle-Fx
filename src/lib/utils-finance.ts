// Utilidades para formateo de fechas y moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return new Intl.DateFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(monthString: string): number {
  const [year, month] = monthString.split('-');
  return new Date(parseInt(year), parseInt(month), 0).getDate();
}

export function getMonthDates(monthString: string): string[] {
  const daysInMonth = getDaysInMonth(monthString);
  const dates: string[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    dates.push(`${monthString}-${dayStr}`);
  }
  
  return dates;
}

export function getPreviousMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  date.setMonth(date.getMonth() - 1);
  
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}

export function getNextMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  date.setMonth(date.getMonth() + 1);
  
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateFormat('es-ES', { weekday: 'long' }).format(date);
}
