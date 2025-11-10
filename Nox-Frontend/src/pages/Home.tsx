import AuthHeader from "@/components/layout/AuthHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  return (
    <AuthHeader>
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      {/* Main Content Area */}
      <div className="relative border-t border-brand-blue bg-brand-light-bg min-h-[calc(100vh-50px)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-14 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-[48px] font-bold leading-tight">
                  <span className="text-brand-blue">Smart Onboarding</span>
                  <br />
                  <span className="text-brand-dark-text">
                    Made Simple
                  </span>
                </h1>

                <p className="mt-5 text-[15px] font-light leading-5 text-brand-medium-text max-w-md">
                  Experience smarter onboarding with AI-powered assistant. Get
                  personalized guidance on requirements, orientation, and
                  policies — all in one intelligent platform
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 lg:gap-9">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-brand-dark-text">
                    95%
                  </div>
                  <div className="text-[14px] font-light text-black mt-0.5">
                    Faster Onboarding
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-brand-dark-text">
                    24/7
                  </div>
                  <div className="text-[14px] font-light text-black mt-0.5">
                    AI Assistance
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-brand-dark-text">
                    100%
                  </div>
                  <div className="text-[14px] font-light text-black mt-0.5">
                    Compliance Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Chat Interface */}
            <div className="w-full max-w-md lg:max-w-none mx-auto">
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="bg-brand-chat-purple px-6 py-3 flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
                      alt="NOXY Bot"
                      className="w-9 h-9 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-brand-green-status rounded-full border border-white"></div>
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-black">
                      NOXY
                    </div>
                    <div className="text-[12px] text-gray-500">
                      Online
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-3 min-h-60">
                  <div className="flex items-start gap-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/a80da972d2ab2de4bf02adfbd8bf2d7f2c8a0235?width=48"
                      alt="Bot"
                      className="w-6 h-6 mt-0.5"
                    />
                    <div className="bg-brand-chat-blue rounded-md px-3 py-2 max-w-[85%]">
                      <p className="text-[14px] font-light leading-5 text-black">
                        Hello! I'm Noxy. What can I do for you today?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/a80da972d2ab2de4bf02adfbd8bf2d7f2c8a0235?width=48"
                      alt="Bot"
                      className="w-6 h-6 mt-0.5"
                    />
                    <div className="bg-brand-chat-blue rounded-md px-3 py-2.5 max-w-[85%]">
                      <p className="text-[14px] font-light leading-5 text-black whitespace-pre-line">
                        I can help you with:
                        {"\n"}Government requirement (SSS,PhilHealth,Pag-IBIG)
                        {"\n"}Department-specific orientation
                        {"\n"}Company policies and procedures
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="px-4 pb-4">
                  <div className="bg-brand-chat-purple rounded-md px-4 py-2.5 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ready to start your onboarding journey?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] font-light text-brand-light-text placeholder-brand-light-text outline-none"
                    />
                    <button
                      className="shrink-0 p-1.5 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                      aria-label="Send message"
                    >
                      <svg
                        className="w-4 h-4 text-white transform rotate-90"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End Right Column */}
          </div>
        </div>
      </div>
    </div>
</AuthHeader>
  );
}
