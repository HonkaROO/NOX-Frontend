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
      <header className="bg-white/30 border-b border-white/20 px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/NpaxLogo.png" alt="N-PAX Logo" className="w-30 h-8" />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-black">
                John Doe
              </span>
              <span className="text-[10px] font-light text-black">HR</span>
            </div>
          </div>
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-2 pt-3">{children}</main>
    </div>
  );
}
