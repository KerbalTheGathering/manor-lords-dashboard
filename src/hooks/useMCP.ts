import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/settlement';

export function useMCP(settlementId: string = 'default') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        let response: string;
        if (window.electronAPI) {
          response = await window.electronAPI.chatWithClaude(content, settlementId);
        } else {
          // Fallback for browser-only dev mode
          response =
            'The steward is unavailable in browser-only mode. Launch via Electron to enable AI counsel. In the meantime, your settlement prospers with 147 souls and a treasury of 245 Regional Wealth.';
        }

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-response`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          content: 'The steward has encountered an error and cannot respond at this time.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
      setIsLoading(false);
    },
    [settlementId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
