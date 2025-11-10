import { useRef, useState } from "react";
import { Mic, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "@/components/layout/HeaderLayout";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      name: "NOXY",
      status: "Online",
      greeting: "Hello! I'm Noxy. What can I do for you today?",
      response: `I can help you with:
Government requirement (SSS,PhilHealth,Pag-IBIG)
Department-specific orientation
Company policies and procedures`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      // User message would be added here
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <HeaderLayout>
    <div className="flex-1 bg-[#F2FAFF] flex flex-col">
      {/* Header */}
      

      {/* Main Content */}
      <div className="px-6 py-6">
        <p className="text-sm text-gray-600 mb-1">Welcome back, John Doe</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            {/* Bot Header */}
            <div className="bg-white rounded p-4 w-full max-w-3xl">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
                  alt="Bot"
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-black">
                      {message.name}
                    </h3>
                    <div className="w-1.5 h-1.5 bg-[#46CA09] rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {message.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Greeting Message */}
            <div className="flex gap-3 items-start">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a80da972d2ab2de4bf02adfbd8bf2d7f2c8a0235?width=48"
                alt="Message"
                className="w-6 h-6 mt-1"
              />
              <div className="bg-[#AACAFF] rounded px-3 py-2 max-w-xs">
                <p className="text-xs text-black font-light leading-5">
                  {message.greeting}
                </p>
              </div>
            </div>

            {/* Response Message */}
            <div className="bg-[#AACAFF] rounded p-4 w-full max-w-2xl">
              <p className="text-xs text-black font-light leading-5 whitespace-pre-line">
                {message.response}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#F2FAFF] p-6 border-t border-gray-200">
        <div className="bg-[#EBEDFF] rounded px-4 py-3 flex items-center gap-3 max-w-3xl">
          <input
            ref={inputRef}
            type="text"
            placeholder="Need help? Ask Noxy...."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent text-xs text-gray-400 placeholder-gray-400 outline-none"
          />
          <button className="p-2 hover:bg-white hover:bg-opacity-30 rounded transition-colors">
            <Mic size={18} className="text-gray-500" />
          </button>
          <button
            onClick={handleSend}
            className="p-2 hover:bg-white hover:bg-opacity-30 rounded transition-colors"
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
