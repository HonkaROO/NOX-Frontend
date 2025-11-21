import { type ReactNode } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AdminHeader({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-linear-to-br from-[#ffe4e6] to-[#ccfbf1] min-h-screen">
      <header className="bg-white/30 border-b border-white/20 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/NpaxLogo.png"
              alt="N-PAX Logo"
              className="w-24 md:w-30 h-6 md:h-8"
            />
            <h1 className="font-bold text-lg md:text-xl text-blue-900 ml-2 md:ml-5">
              ADMIN
            </h1>
          </div>
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-2 md:p-4 pt-2 md:pt-3">
        {children}
      </main>
    </div>
  );
}
