export interface ChatMessage {
  id?: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp?: string;
}

export interface ChatResponse {
  User: string;
  Noxy: string;
  conversation_id?: number;
}

export interface ConversationHistory {
  conversation_id: number;
  started_at: string;
  messages: Array<{
    sender: string;
    message: string;
    sent_at: string;
  }>;
}

export class ChatbotService {
  private baseURL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8000';

  constructor() {}

  /**
   * Send a message to the chatbot
   */
  async sendMessage(username: string, userId: string, message: string, conversationId?: number): Promise<ChatResponse> {
    console.log('[DEBUG] Sending chat request:', { username, userId, message });

    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        userId,
        message,
      }),
    });

    console.log('[DEBUG] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Chat API error:', errorText);
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Response data:', data);
    return data;
  }

  /**
   * Get conversation history for a user
   */
  async getHistory(userId: string): Promise<ConversationHistory[]> {
    const response = await fetch(`${this.baseURL}/history/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`History API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const chatbotService = new ChatbotService();