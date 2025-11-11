import { useNavigate } from "react-router-dom";
import {type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AuthHeader({children}: LayoutProps) {
  const navigate = useNavigate();
    return (
<div>
    <header className="relative z-10 flex items-center justify-between px-6 md:px-14 py-3 bg-white">
            <img
              src="/NpaxLogo.png"
              alt="N PAX Logo"
              className="h-7 md:h-8 w-auto"
            />
    
            <div className="flex items-center gap-3">
              
              <button
              onClick={() => navigate('/login')}
               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Login
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              Contact Support
            </button>
            </div>
          </header>
          <main>{children}</main>
</div>

    );
    }