export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F97316",
  Transport: "#3B82F6",
  Housing: "#8B5CF6",
  Health: "#EF4444",
  Education: "#06B6D4",
  Entertainment: "#F59E0B",
  Clothing: "#EC4899",
  Services: "#6B7280",
  Pets: "#10B981",
  Others: "#A3A3A3",
};

const FALLBACK_COLORS = [
  "#F97316", "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4",
  "#F59E0B", "#EC4899", "#6B7280", "#10B981", "#A3A3A3",
  "#84CC16", "#14B8A6", "#6366F1", "#F43F5E", "#0EA5E9",
];

export function getCategoryColor(category: string, index?: number): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  if (index !== undefined) return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  // Deterministic color from string hash
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}
