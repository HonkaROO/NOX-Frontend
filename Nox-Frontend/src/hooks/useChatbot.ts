import { useState, useEffect, useCallback } from 'react';
import { chatbotService, type ChatMessage, type ChatResponse } from '@/lib/api/chatbotService';

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

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatbotService.getHistory(username);
        if (history && history.length > 0) {
          const latestConvo = history[0];
          setConversationId(latestConvo.conversation_id);
          
          const formattedMessages: ChatMessage[] = latestConvo.messages.map((msg, idx) => ({
            id: idx,
            sender: msg.sender.toLowerCase() === 'noxy' ? 'bot' : 'user',
            message: msg.message,
            timestamp: msg.sent_at,
          }));
          
          if (formattedMessages.length > 0) {
            setMessages(formattedMessages);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // Keep default welcome message if history fails
      }
    };

    if (username) {
      loadHistory();
    }
  }, [username]);

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
    setMessages([
      {
        id: 1,
        sender: 'bot',
        message: "Hello! I'm Noxy. What can I do for you today?\n\nI can help you with:\nGovernment requirement (SSS, PhilHealth, Pag-IBIG)\nDepartment-specific orientation\nCompany policies and procedures",
        timestamp: new Date().toISOString(),
      },
    ]);
    setConversationId(undefined);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};