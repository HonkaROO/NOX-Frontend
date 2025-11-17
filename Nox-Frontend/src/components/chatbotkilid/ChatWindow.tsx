import { motion } from "framer-motion";
import type { ChatMessage } from "../../lib/api/ChatBot/chatbotService";
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
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4,
      }}
      className="fixed bottom-24 right-6 h-[500px] w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
    >
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </motion.div>
  );
}
