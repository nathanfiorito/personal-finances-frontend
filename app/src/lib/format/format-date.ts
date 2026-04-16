import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const DEFAULT_LOCALE = ptBR;

export function formatDate(iso: string, pattern = "dd/MM/yyyy"): string {
  return format(parseISO(iso), pattern, { locale: DEFAULT_LOCALE });
}

export function formatDateTime(iso: string, pattern = "dd/MM/yyyy HH:mm"): string {
  return format(parseISO(iso), pattern, { locale: DEFAULT_LOCALE });
}

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
