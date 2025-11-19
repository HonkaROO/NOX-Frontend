import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function HeaderLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-linear-to-tl from-[#ffe4e6] to-[#ccfbf1]">
      {/* Header */}
      <header className="border-bpro px-6 py-4 shadow-sm bg-white/40 backdrop-blur-xl border border-white/20">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
            src="/NpaxLogo.png"
            alt="N PAX Logo"
            className="h-7 md:h-8 w-auto transition-transform hover:scale-105"
          />

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent/10 hover:text-foreground font-medium transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4 pt-6 ">{children}</main>
    </div>
  );
}
