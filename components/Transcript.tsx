'use client'

import { useEffect, useRef, memo } from 'react'
import { TranscriptChunk } from '@/lib/types'
import { formatTimestamp } from '@/lib/utils'
import { clsx } from 'clsx'

interface TranscriptProps {
  chunks: TranscriptChunk[]
  isRecording: boolean
}

const Transcript = memo(({ chunks, isRecording }: TranscriptProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chunks])

  return (
    <div className="glass-panel flex flex-col h-full group">
      {/* Header */}
      <div className="px-6 h-14 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-2 h-2 rounded-full",
            isRecording ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-slate-700"
          )} />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
            Neural Transcript
          </h2>
        </div>
        {chunks.length > 0 && (
          <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-0.5 rounded leading-none">
            {chunks.length} SEGS
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-hide">
        {chunks.length === 0 && (
          <EmptyState isRecording={isRecording} />
        )}

        {chunks.map((chunk, idx) => {
          const isLast = idx === chunks.length - 1
          return (
            <div key={chunk.id} className="animate-slide-up group/line">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                <time className="text-[10px] font-mono text-indigo-400/50 tabular-nums">
                  {formatTimestamp(chunk.timestamp)}
                </time>
              </div>
              
              <div
                className={clsx(
                  "relative pl-4 leading-relaxed transition-all duration-500",
                  isLast 
                    ? "text-slate-100 font-medium" 
                    : "text-slate-400 font-normal grayscale-[0.5]"
                )}
              >
                <div className={clsx(
                  "absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-500",
                  isLast ? "bg-indigo-500" : "bg-white/5"
                )} />
                <p className="text-sm font-sans tracking-tight leading-7">
                  {chunk.text}
                </p>
              </div>
            </div>
          )
        })}

        {/* Neural Activity Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 pl-4 py-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-3 rounded-full bg-indigo-500/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-500/50 uppercase italic">
              Processing Audio Stream...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer Stats */}
      {chunks.length > 0 && (
        <div className="px-6 h-10 flex items-center gap-6 border-t border-white/5 bg-white/[0.01] text-[10px] font-medium text-slate-500 uppercase tracking-[0.1em]">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-indigo-400/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Word Count:
            </span>
            <span className="text-slate-300">
              {Math.round(chunks.map(c => c.text.split(' ').length).reduce((a, b) => a + b, 0))}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-indigo-400/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Duration:
            </span>
            <span className="text-slate-300">
              {Math.round((Date.now() - chunks[0].timestamp) / 60000)} MIN
            </span>
          </div>
        </div>
      )}
    </div>
  )
})

Transcript.displayName = 'Transcript'

export default Transcript

function EmptyState({ isRecording }: { isRecording: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
        <span className="text-3xl grayscale opacity-40">🎙️</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-300 mb-2">
        {isRecording ? 'Listening to Ambient Audio' : 'Waiting for Input'}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
        {isRecording
          ? 'Deep neural networks are analyzing the conversation stream...'
          : 'Activate the microphone to begin real-time meeting intelligence'}
      </p>
      
      {!isRecording && (
        <div className="mt-8 px-4 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
          <p className="text-[9px] font-bold tracking-[0.2em] text-indigo-400/60 uppercase">
            30s Buffer Cycle Enabled
          </p>
        </div>
      )}
    </div>
  )
}

