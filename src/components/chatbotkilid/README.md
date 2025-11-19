# Chatbot Components

This directory contains the refactored chatbot components for the mini chatbot assistant.

## Component Structure

```
chatbotkilid/
├── ChatbotAssistant.tsx      # Main container component
├── ChatToggleButton.tsx       # Floating "ASK NOXY" button
├── ChatWindow.tsx             # Chat window container
├── ChatHeader.tsx             # Chat header with close button
├── ChatMessages.tsx           # Message list with auto-scroll
├── ChatMessage.tsx            # Individual message component
├── ChatLoadingIndicator.tsx   # Loading animation
└── ChatInput.tsx              # Input field with send button
```

## User-Specific Chat Synchronization

### How It Works

Both the **mini chatbot** (`ChatbotAssistant`) and the **AI Assistant page** (`AIAssistant.tsx`) use the **same `useChatbot` hook**, which:

1. **Fetches the current logged-in user** using `apiClient.getCurrentUser()`
2. **Uses the user's firstName or userName** as the chatbot username
3. **Stores conversations in localStorage** with a user-specific key: `chat_history_{username}`
4. **Automatically loads saved messages** when the user opens either interface
5. **Syncs messages in real-time** because both use the same storage key

### Automatic Synchronization

✅ **Chat messages persist** across page refreshes
✅ **Conversations sync** between mini chatbot and AI Assistant page
✅ **User-specific** - each user has their own conversation history
✅ **Conversation ID tracked** for backend context

### Storage Key Format

```typescript
localStorage.setItem(`chat_history_${username}`, JSON.stringify({
  messages: [...],
  conversationId: 123,
  lastUpdated: "2025-01-13T..."
}));
```

## Usage

```tsx
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

// In your layout or page
function Layout() {
  return (
    <>
      {/* Your page content */}
      <ChatbotAssistant />
    </>
  );
}
```

## Key Features

- **User Authentication**: Fetches real user data via `apiClient.getCurrentUser()`
- **Persistent Storage**: Uses localStorage to save chat history per user
- **Auto-sync**: Both mini chat and full page use same data source
- **Guest Fallback**: Falls back to "Guest" if user is not logged in
- **Real-time Updates**: State management ensures UI updates instantly

## Related Files

- **Hook**: `src/hooks/useChatbot.ts` - Shared chatbot logic
- **Service**: `src/lib/api/chatbotService.ts` - API communication
- **Page**: `src/pages/AIAssistant.tsx` - Full AI Assistant page

## Notes

- The username is fetched on component mount using the same pattern as AIAssistant.tsx
- If the user switches accounts, the chat history will automatically load for the new user
- Guest users won't have persistent storage (by design in useChatbot hook)
