import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setIsLoading(true);

    try {
      const userData = await login(email, password);

      // Navigate based on role
      if (userData.roles?.includes("SuperAdmin")) {
        navigate("/SuperAdminDashboard");
      } else if (userData.roles?.includes("Admin")) {
        navigate("/HrOverview");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setHasError(true);

      // Show appropriate error message based on error type
      if (err.response?.status === 401) {
        toast.error("Unauthorized", {
          description:
            "Invalid email or password. Please check your credentials and try again.",
        });
      } else if (err.response?.status === 404) {
        toast.error("Account Not Found", {
          description: "No account exists with this email address.",
        });
      } else {
        toast.error("Login Failed", {
          description: "An error occurred during login. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <img
        src="/loginBG.png"
        alt="login background"
        className="w-full h-full absolute inset-0 object-cover"
      />
      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 min-h-screen relative">
        <div className="w-full max-w-md">
          {/* Logo */}

          {/* Login Form Card */}
            <Card className="shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-white">
                  <div className="flex justify-center mb-8">
                    <img
                      src="/NpaxLogo.png"
                      alt="N-PAX Logo"
                      className="h-12 sm:h-16 w-auto"
                    />
                  </div>
                  Welcome Back
                </CardTitle>
                <p className="text-sm text-white/70 font-light mt-2">
                  Sign in to continue your onboarding journey
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setHasError(false);
                      }}
                      placeholder="Enter your company email"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
                        hasError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:border-white/40"
                      }`}
                      required
                    />
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setHasError(false);
                        }}
                        placeholder="Enter your password"
                        className={`pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
                          hasError
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "focus-visible:border-white/40"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white/60" />
                        ) : (
                          <Eye className="h-4 w-4 text-white/60" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border border-white/30 rounded bg-white/10 checked:bg-white checked:border-white focus:ring-2 focus:ring-white/50"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-light cursor-pointer text-white/80"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-white/80 font-light hover:text-white hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  {/* Submit Button */}
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                <CardFooter className="items-center justify-center mt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center text-sm text-white/80 font-medium hover:text-white hover:underline bg-transparent border-none cursor-pointer"
                  >
                    <MoveLeft />
                    <p className="ml-2">Back to Home</p>
                  </button>
                </CardFooter>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
