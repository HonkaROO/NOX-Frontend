import Linkify from "react-linkify";
import type { ChatMessage as ChatMessageType } from "../../lib/api/ChatBot/chatbotService";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <img
          src="/RealNoxyIcon.png"
          alt="Noxy"
          className="w-8 h-8 rounded-full shrink-0"
        />
      )}
      <div
        className={`text-sm rounded-lg p-3 max-w-[75%] whitespace-pre-line break-words overflow-wrap ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white text-slate-700 border border-slate-200"
        }`}
      >
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a
              href={decoratedHref}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:opacity-80 break-all ${
                isUser ? "text-blue-200" : "text-blue-700 hover:text-blue-900"
              }`}
            >
              {decoratedText}
            </a>
          )}
        >
          {message.message}
        </Linkify>
      </div>
    </div>
  );
}
