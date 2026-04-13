import { serverFetch } from "@/lib/api/server";
import type { Category } from "@/lib/types";
import { CategoryList } from "@/components/categories/CategoryList";

export default async function CategoriesPage() {
  const categories = await serverFetch<Category[]>("/api/v2/categories") ?? [];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Categories</h1>
      <CategoryList categories={categories} />
    </div>
  );
}
