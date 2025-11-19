import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function HeaderLayout({ children }: LayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{
        background:
          "radial-gradient(ellipse at top right, #ffe4e6 0%, #ccfbf1 100%)",
        minHeight: "100vh",
      }}>
      {/* Header */}
      <header className="bg-white/40 border-b border-white/20 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/NpaxLogo.png" alt="N-PAX Logo" className="w-30 h-8" />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-black">
                John Doe
              </span>
              <span className="text-[10px] font-light text-black">
                Super Admin
              </span>
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-2 pt-3">{children}</main>

      {/* AI Assistant Button (Bottom Right) */}
      {/* <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold">ASK NOXY</span>
      </button> */}
    </div>
  );
}
