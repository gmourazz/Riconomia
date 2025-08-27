import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value) {
  if (isNaN(value) || !isFinite(value)) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatPercent(value, precision = 2) {
    if (isNaN(value) || !isFinite(value)) return "0,00%";
    const factor = Math.pow(10, precision);
    const roundedValue = Math.round(value * 100 * factor) / factor;
    return `${roundedValue.toFixed(precision).replace('.', ',')}%`;
}

export function parseNumber(str) {
    if (typeof str !== 'string') return typeof str === 'number' ? str : NaN;
    const cleaned = str.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(cleaned);
};