import { useState, useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import { apiClient } from "@/lib/api";
import ChatToggleButton from "./ChatToggleButton";
import ChatWindow from "./ChatWindow";

export default function ChatbotAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("Guest");

  // Get actual logged-in user (same logic as AIAssistant page)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiClient.getCurrentUser();
        // Set firstName for greeting display
        setFirstname(user.firstName || "Guest");
        // Set username for backend
        setUsername(user.userName || "");
        // Set userId
        setUserId(user.id || "");
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        // Fallback to Guest if not logged in
        setFirstname("Guest");
        setUsername("");
        setUserId("");
      }
    };

    fetchCurrentUser();
  }, []);

  const { messages, isLoading, sendMessage } = useChatbot(userId, username, firstname);

  return (
    <>
      <ChatToggleButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        isOpen={isChatOpen}
      />

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
