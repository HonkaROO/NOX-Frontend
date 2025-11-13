import { useRef, useState, useEffect } from "react";
import { Mic, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useChatbot } from "@/hooks/useChatbot";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState<string>("Guest");

  // Get actual logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiClient.getCurrentUser();
        // Use email as username for chatbot
        setUsername(user.firstName || user.userName || "Guest");
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        // Fallback to Guest if not logged in
        setUsername("Guest");
      }
    };

    fetchCurrentUser();
  }, []);

  const { messages, isLoading, error, sendMessage, clearChat, conversationId } =
    useChatbot(username);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue);
      setInputValue("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <HeaderLayout>
      <div className="flex-1 bg-[#F2FAFF] flex flex-col border border-[#e3e3ff] rounded-xl shadow-lg">
        {/* Header */}

        {/* Main Content */}
        <div className="px-6 py-6 flex flex-col h-[80vh]">
          <div className="flex justify-between">
            <p className="text-sm text-gray-600 mb-1">
              Welcome back, {username}
            </p>
            <Button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to start a new conversation? This will clear your current chat."
                  )
                )
                  clearChat();
              }}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
            >
              New Chat
            </Button>
          </div>
          {/* Navigation Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              Dashboard
            </button>
            <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              AI Assistant
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              Profile
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id || index}>
                {message.sender === "bot" ? (
                  <>
                    {/* Bot Header - Only show once at the top */}
                    {index === 0 && (
                      <div className="bg-white rounded p-4 w-full max-w-full mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src="RealNoxyIcon.png"
                            alt="Bot"
                            className="w-9 h-9 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-black">
                                NOXY
                              </h3>
                              <div className="w-1.5 h-1.5 bg-[#46CA09] rounded-full"></div>
                            </div>
                            <p className="text-md text-gray-400 mt-0.5">
                              Online
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bot Message */}
                    <div className="flex gap-3 items-start">
                      <img
                        src="RealNoxyIcon.png"
                        alt="Message"
                        className="w-6 h-6 mt-1"
                      />
                      <div className="bg-[#AACAFF] rounded px-3 py-2 max-w-2xl">
                        <p className="text-xl text-black font-medium leading-7.5 whitespace-pre-line">
                          <Linkify
                            componentDecorator={(
                              decoratedHref,
                              decoratedText,
                              key
                            ) => (
                              <a
                                href={decoratedHref}
                                key={key}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline hover:text-blue-900"
                              >
                                {decoratedText}
                              </a>
                            )}
                          >
                            {message.message}
                          </Linkify>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* User Message */
                  <div className="flex gap-3 items-start justify-end">
                    <div className="bg-indigo-600 rounded px-3 py-2 max-w-2xl">
                      <p className="text-xl text-white font-medium leading-7.5">
                        {message.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <img
                  src="RealNoxyIcon.png"
                  alt="Message"
                  className="w-6 h-6 mt-1"
                />
                <div className="bg-[#AACAFF] rounded px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-xs text-center">{error}</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-[#F2FAFF] p-6 border-t border-gray-200">
            <div className="bg-[#EBEDFF] rounded px-4 py-3 flex items-center gap-3 max-w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Need help? Ask Noxy...."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isLoading && handleSend()
                }
                disabled={isLoading}
                className="flex-1 bg-transparent text-lg text-gray-700 placeholder-gray-400 outline-none disabled:opacity-50"
              />
              <button
                className="p-2 hover:bg-white hover:bg-opacity-30 rounded transition-colors"
                disabled={isLoading}
              >
                <Mic size={18} className="text-gray-500" />
              </button>
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 hover:bg-white hover:bg-opacity-30 rounded transition-colors disabled:opacity-50"
              >
                <Send size={18} className="text-[#2E15D0]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
