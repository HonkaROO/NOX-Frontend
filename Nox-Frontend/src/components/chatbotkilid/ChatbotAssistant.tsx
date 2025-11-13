import { useState, useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import { apiClient } from "@/lib/api";
import ChatToggleButton from "./ChatToggleButton";
import ChatWindow from "./ChatWindow";

export default function ChatbotAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [username, setUsername] = useState<string>("Guest");

  // Get actual logged-in user (same logic as AIAssistant page)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiClient.getCurrentUser();
        // Use firstName or userName as username for chatbot
        setUsername(user.firstName || user.userName || "Guest");
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        // Fallback to Guest if not logged in
        setUsername("Guest");
      }
    };

    fetchCurrentUser();
  }, []);

  const { messages, isLoading, sendMessage } = useChatbot(username);

  return (
    <>
      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />

      {isChatOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
