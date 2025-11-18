import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AuthHeader({ children }: LayoutProps) {
  const navigate = useNavigate();
  return (
    <div>
      <header className=" sticky top-0 z-50  flex items-center justify-between px-6 md:px-14 py-3 bg-card shadow-sm">
        <img
          src="/NpaxLogo.png"
          alt="N PAX Logo"
          className="h-7 md:h-8 w-auto"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent/10 hover:text-foreground hover:border-accent font-medium transition-all duration-200"
          >
            Login
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 font-medium transition-all duration-200">
            Contact Support
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
