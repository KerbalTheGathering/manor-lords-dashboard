import React, { useState, useRef, useEffect } from 'react';
import { MedievalCard } from '../components/MedievalCard';
import { useMCP } from '../hooks/useMCP';
import { colors } from '../theme/tokens';
import type { SettlementData } from '../types/settlement';

interface Props {
  data: SettlementData;
}

const SUGGESTIONS = [
  'How should I prioritize my next buildings?',
  'Should I expand farming or focus on industry?',
  'What is the biggest threat to my settlement?',
  'How can I improve my approval rating?',
  'Analyze my military readiness.',
];

export function StrategyConsole({ data }: Props) {
  const { messages, isLoading, sendMessage, clearMessages } = useMCP(data.id);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl text-parchment">Strategy Console</h2>
        <button
          onClick={clearMessages}
          className="btn-medieval text-sm"
        >
          Clear Scroll
        </button>
      </div>

      {/* Chat area */}
      <MedievalCard className="flex-1 flex flex-col min-h-0">
        <div ref={scrollRef} className="scroll-container flex-1 overflow-y-auto max-h-[500px] space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">&#128220;</div>
              <p className="font-medieval text-lg text-dark-brown mb-2">
                Your Steward Awaits
              </p>
              <p className="text-sm text-slate font-medieval mb-6">
                Ask for strategic counsel about your settlement. The steward has full knowledge
                of your current resources, military strength, and settlement status.
              </p>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="block w-full text-left px-4 py-2 rounded text-sm font-medieval hover:bg-light-tan transition-colors"
                    style={{ border: `1px solid ${colors.mediumBrown}30` }}
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-medium-brown text-parchment'
                    : ''
                }`}
                style={
                  msg.role === 'assistant'
                    ? {
                        backgroundColor: colors.lightTan,
                        border: `1px solid ${colors.mediumBrown}40`,
                        fontStyle: 'italic',
                      }
                    : undefined
                }
              >
                {msg.role === 'assistant' && (
                  <div className="text-xs text-warm-gold font-medieval font-semibold mb-1">
                    The Steward
                  </div>
                )}
                <div className="font-medieval text-sm whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: colors.lightTan,
                  border: `1px solid ${colors.mediumBrown}40`,
                }}
              >
                <div className="text-xs text-warm-gold font-medieval font-semibold mb-1">
                  The Steward
                </div>
                <div className="font-medieval text-sm italic text-slate animate-pulse">
                  The steward considers your question...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="mt-4 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Seek counsel from your steward..."
            className="flex-1 p-3 rounded font-medieval text-sm resize-none"
            style={{
              backgroundColor: colors.lightTan,
              border: `1px solid ${colors.mediumBrown}`,
              color: colors.darkBrown,
              minHeight: '48px',
              maxHeight: '120px',
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn-seal self-end disabled:opacity-50"
            title="Send"
          >
            &#10148;
          </button>
        </div>
      </MedievalCard>
    </div>
  );
}
