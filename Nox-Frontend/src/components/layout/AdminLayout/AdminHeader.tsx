import { type ReactNode } from "react";

import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AdminHeader({ children }: LayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
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
            onClick={() => navigate('/login')}
             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Logout
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-2 pt-3">{children}</main>
    </div>
  );
}
