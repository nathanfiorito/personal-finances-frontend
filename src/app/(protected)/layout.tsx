import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
