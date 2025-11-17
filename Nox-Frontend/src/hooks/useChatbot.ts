import { useState, useEffect, useCallback } from "react";
import {
  chatbotService,
  type ChatMessage,
  type ChatResponse,
} from "@/lib/api/chatbotService";

const STORAGE_KEY_PREFIX = "chat_history_";

export const useChatbot = (userId: string, username: string, firstname?: string) => {
  const getGreetingMessage = (name: string) => {
    const displayName = name && name !== "Guest" ? name : "";
    return `Hello${
      displayName ? ` ${displayName}` : ""
    }! I'm Noxy. What can I do for you today?\n\nI can help you with:\nGovernment requirement (SSS, PhilHealth, Pag-IBIG)\nDepartment-specific orientation\nCompany policies and procedures`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      message: getGreetingMessage(firstname || username),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [conversationId, setConversationId] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from localStorage on mount or when userId changes
  useEffect(() => {
    if (userId && userId !== "Guest") {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          setMessages(savedData.messages || []);
          setConversationId(savedData.conversationId);
        } catch (err) {
          console.error("Failed to load saved messages:", err);
        }
      } else {
        // No saved messages, update the initial greeting with the firstname
        setMessages([
          {
            id: 1,
            sender: "bot",
            message: getGreetingMessage(firstname || username),
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } else {
      // Username is Guest or empty, update greeting
      setMessages([
        {
          id: 1,
          sender: "bot",
          message: getGreetingMessage(firstname || username),
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [userId, username, firstname]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (userId && userId !== "Guest" && messages.length > 0) {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const dataToSave = {
        messages,
        conversationId,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [messages, conversationId, userId]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: "user",
        message: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Send to backend
        const response: ChatResponse = await chatbotService.sendMessage(
          username,
          userId,
          messageText,
          conversationId
        );

        // Update conversation ID if first message
        if (!conversationId && response.conversation_id) {
          setConversationId(response.conversation_id);
        }

        // Add bot response
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: "bot",
          message: response.Noxy,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");

        // Add error message from bot
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: "bot",
          message: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [username, userId, conversationId]
  );

  const clearChat = useCallback(() => {
    const defaultMessages = [
      {
        id: 1,
        sender: "bot" as const,
        message:
          getGreetingMessage(firstname || username),
        timestamp: new Date().toISOString(),
      },
    ];

    setMessages(defaultMessages);
    setConversationId(undefined);
    setError(null);

    // Clear from localStorage
    if (userId && userId !== "Guest") {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      localStorage.removeItem(storageKey);
    }
  }, [username, userId, firstname]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    conversationId,
  };
};
