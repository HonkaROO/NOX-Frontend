import { useState } from "react";

export default function ChatbotAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* AI Assistant Button (Bottom Right) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-700 to-indigo-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full shadow-lg transition-all flex flex-col items-center justify-center text-white"
      >
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
          alt="Bot"
          className="w-9 h-9 rounded-full"
        />
        <span className="text-[10px] font-semibold">ASK NOXY</span>
      </button>
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-semibold">Noxy Assistant</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 h-60">
            <div className="flex items-start gap-3">
              <img
                src="RealNoxyIcon.png"
                alt="Noxy"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="text-sm text-slate-700 bg-slate-100 rounded-lg p-2 w-fit max-w-[75%]">
                Hello! 👋 How can I help you today?
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 flex items-center p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}