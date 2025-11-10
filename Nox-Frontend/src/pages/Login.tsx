import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-login-bg">
      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/NpaxLogo.png" 
            alt="N-PAX Logo" 
            className="h-12 sm:h-16 w-auto"
          />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-black font-light">
            Sign in to continue your onboarding journey
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-5">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-black mb-1.5"
              >
                Email Adress
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your company email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:font-light"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-black mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:font-light"
                  required
                />
                
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border border-black rounded bg-white checked:bg-black checked:border-black focus:ring-2 focus:ring-primary"
                />
                <label 
                  htmlFor="remember" 
                  className="ml-2 text-sm text-black font-light"
                >
                  Remember me
                </label>
              </div>
              <a 
                href="#" 
                className="text-sm text-primary font-light hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
            onClick={() => navigate("/dashboard")}
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-4 text-center text-sm">
            <span className="text-black font-light">New employee? </span>
            <a 
              href="#" 
              className="text-primary font-medium hover:underline"
            >
              Create your account
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-sm text-black font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 15 4" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0.0732231 1.66423C-0.0244074 1.76186 -0.0244074 1.92015 0.0732231 2.01778L1.66421 3.60877C1.76184 3.7064 1.92014 3.7064 2.01777 3.60877C2.1154 3.51114 2.1154 3.35285 2.01777 3.25522L0.603554 1.841L2.01777 0.42679C2.1154 0.329159 2.1154 0.170868 2.01777 0.0732365C1.92014 -0.0243946 1.76184 -0.0243946 1.66421 0.0732365L0.0732231 1.66423ZM14.25 1.841V1.591L0.25 1.591V1.841V2.091L14.25 2.091V1.841Z" 
                fill="black"
              />
            </svg>
            Back to Home
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
