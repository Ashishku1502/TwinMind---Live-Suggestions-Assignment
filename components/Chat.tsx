'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { ChatMessage, Suggestion } from '@/lib/types'
import { formatTimestamp, getSuggestionTypeColor, getSuggestionTypeIcon } from '@/lib/utils'
import { clsx } from 'clsx'

interface ChatProps {
  messages: ChatMessage[]
  isStreaming: boolean
  activeSuggestion: Suggestion | null
  onSend: (message: string) => void
}

function Chat({ messages, isStreaming, activeSuggestion, onSend }: ChatProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    onSend(text)
    if (textareaRef.current) textareaRef.current.style.height = '44px'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    const el = e.target
    el.style.height = '44px'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="font-semibold tracking-tight text-white">AI Intelligence</span>
        </div>
        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {messages.length} messages
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Active suggestion context banner */}
      {activeSuggestion && (
        <div className="px-5 py-3 border-b border-white/5 bg-indigo-500/5 flex items-start gap-3 animate-slide-up">
          <span className="text-base mt-0.5">
            {getSuggestionTypeIcon(activeSuggestion.type)}
          </span>
          <div className="flex-1 min-width-0">
            <div
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5"
              style={{ color: getSuggestionTypeColor(activeSuggestion.type) }}
            >
              Context Bound · {activeSuggestion.type.replace('_', ' ')}
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 italic">
              &quot;{activeSuggestion.text}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        {messages.length === 0 && <EmptyState hasActiveSuggestion={!!activeSuggestion} />}

        {messages.map((msg, idx) => (
          <MessageBubble 
            key={idx} 
            message={msg} 
            isLast={idx === messages.length - 1} 
            isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'} 
          />
        ))}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="relative group">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              activeSuggestion
                ? 'Ask about this suggestion…'
                : 'Ask anything about the meeting…'
            }
            disabled={isStreaming}
            rows={1}
            className={clsx(
              "w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-14 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none min-h-[48px] max-h-[160px]",
              isStreaming && "opacity-50 cursor-not-allowed"
            )}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className={clsx(
              "absolute right-2.5 bottom-2.5 w-9 h-9 rounded-lg flex items-center justify-center transition-all",
              !input.trim() || isStreaming 
                ? "bg-white/5 text-slate-600 cursor-not-allowed" 
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
            )}
          >
            {isStreaming ? (
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 rounded-full bg-current animate-bounce" />
              </div>
            ) : (
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            )}
          </button>
        </div>
        <div className="mt-2.5 px-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> to send
            </span>
          </div>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-1 h-1 rounded-full bg-current animate-ping" />
              Neural processing...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isLast,
  isStreaming,
}: {
  message: ChatMessage
  isLast: boolean
  isStreaming: boolean
}) {
  const isUser = message.role === 'user'

  return (
    <div
      className={clsx(
        "flex flex-col group animate-slide-up",
        isUser ? "items-end" : "items-start"
      )}
    >
      {/* Role & Timestamp */}
      <div
        className={clsx(
          "flex items-center gap-2 mb-1.5 px-1 text-[10px] font-bold tracking-wider uppercase transition-opacity duration-300",
          isUser ? "text-indigo-400/70" : "text-emerald-400/70"
        )}
      >
        <span>{isUser ? 'Neural Command' : 'Aetherius-AI'}</span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span className="text-slate-600 font-mono tracking-normal">{formatTimestamp(message.timestamp)}</span>
      </div>

      {/* Bubble */}
      <div
        className={clsx(
          "max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed relative",
          isUser 
            ? "bg-indigo-600/20 border border-indigo-500/20 text-indigo-50 rounded-tr-none shadow-lg shadow-indigo-500/5" 
            : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none"
        )}
      >
        <div className="relative z-10">
          {message.content}
          {isStreaming && isLast && (
            <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1.5 animate-pulse vertical-middle rounded-full" />
          )}
        </div>
        
        {/* Glow effect for user messages */}
        {isUser && (
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-2xl -z-0 opacity-50" />
        )}
      </div>
    </div>
  )
}

function EmptyState({ hasActiveSuggestion }: { hasActiveSuggestion: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="relative w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl shadow-2xl">
          🧠
        </div>
      </div>
      
      <h3 className="text-white font-semibold mb-2 tracking-tight">Interactive Knowledge Engine</h3>
      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
        {hasActiveSuggestion
          ? 'Deep-dive into the selected insight with contextual queries'
          : 'Query the collective intelligence of this meeting in real-time'}
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-2 w-full max-w-[240px]">
        <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-500 text-left hover:bg-white/[0.04] transition-colors cursor-default">
          &quot;What were the main blockers mentioned?&quot;
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-500 text-left hover:bg-white/[0.04] transition-colors cursor-default">
          &quot;Summarize the next steps for the team.&quot;
        </div>
      </div>
    </div>
  )
}
export default memo(Chat)
