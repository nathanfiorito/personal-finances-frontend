export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#F97316",
  Transporte:  "#3B82F6",
  Moradia:     "#8B5CF6",
  Saúde:       "#EF4444",
  Educação:    "#06B6D4",
  Lazer:       "#F59E0B",
  Vestuário:   "#EC4899",
  Serviços:    "#6B7280",
  Pets:        "#10B981",
  Outros:      "#A3A3A3",
};

export const FALLBACK_COLORS = [
  "#F97316","#3B82F6","#8B5CF6","#EF4444",
  "#06B6D4","#F59E0B","#EC4899","#6B7280","#10B981","#A3A3A3",
];

export function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}
