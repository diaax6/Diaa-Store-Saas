import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `DS-${year}-${rand}`
}

export function generateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `c${timestamp}${random}`
}

export function formatPrice(price: number | null | undefined, currency = 'EGP'): string {
  if (!price && price !== 0) return 'اتصل بنا'
  return `${price.toLocaleString('ar-EG')} ج.م`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const TENANT_STATUS_LABELS: Record<string, string> = {
  TRIAL:     'تجريبي',
  ACTIVE:    'نشط',
  SUSPENDED: 'موقوف',
  CANCELLED: 'ملغي',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING:  'في الانتظار',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
}
