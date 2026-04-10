import { createClient } from "@/lib/supabase/server";
import { CategoryOut } from "@/lib/api";
import { CategoryList } from "@/components/categories/CategoryList";

async function fetchCategories(jwt: string): Promise<CategoryOut[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const jwt = session?.access_token ?? "";
  const categories = await fetchCategories(jwt);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Categories</h1>
        <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">
          Manage expense categories
        </p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  );
}
