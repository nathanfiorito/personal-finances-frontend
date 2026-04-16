import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { AppShell } from "@/components/layout/AppShell";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TransactionsPage from "@/pages/TransactionsPage";
import CardsPage from "@/pages/CardsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import ReportsPage from "@/pages/ReportsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "cards", element: <CardsPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "reports", element: <ReportsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
