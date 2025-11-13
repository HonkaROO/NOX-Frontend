import type { ChatMessage } from "../../lib/api/chatbotService";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onClose,
}: ChatWindowProps) {
  return (
    <div className="fixed bottom-24 right-6 h-[500px] w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn z-50">
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
