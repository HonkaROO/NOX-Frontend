import { useState, useEffect, useCallback } from 'react';
import { chatbotService, type ChatMessage, type ChatResponse } from '@/lib/api/chatbotService';

const STORAGE_KEY_PREFIX = 'chat_history_';

export const useChatbot = (username: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      message: "Hello! I'm Noxy. What can I do for you today?\n\nI can help you with:\nGovernment requirement (SSS, PhilHealth, Pag-IBIG)\nDepartment-specific orientation\nCompany policies and procedures",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from localStorage on mount or when username changes
  useEffect(() => {
    if (username && username !== "Guest") {
      const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          setMessages(savedData.messages || []);
          setConversationId(savedData.conversationId);
        } catch (err) {
          console.error('Failed to load saved messages:', err);
        }
      }
    }
  }, [username]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (username && username !== "Guest" && messages.length > 0) {
      const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
      const dataToSave = {
        messages,
        conversationId,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [messages, conversationId, username]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: messageText,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send to backend
      const response: ChatResponse = await chatbotService.sendMessage(
        username,
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
        sender: 'bot',
        message: response.Noxy,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message from bot
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [username, conversationId]);

  const clearChat = useCallback(() => {
    const defaultMessages = [
      {
        id: 1,
        sender: 'bot' as const,
        message: "Hello! I'm Noxy. What can I do for you today?\n\nI can help you with:\nGovernment requirement (SSS, PhilHealth, Pag-IBIG)\nDepartment-specific orientation\nCompany policies and procedures",
        timestamp: new Date().toISOString(),
      },
    ];
    
    setMessages(defaultMessages);
    setConversationId(undefined);
    setError(null);

    // Clear from localStorage
    if (username && username !== "Guest") {
      const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
      localStorage.removeItem(storageKey);
    }
  }, [username]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    conversationId,
  };
};