import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth/use-auth";

export function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  if (isAuthenticated) {
    const next = searchParams.get("next");
    return <Navigate to={next ?? "/"} replace />;
  }

  return <Outlet />;
}
