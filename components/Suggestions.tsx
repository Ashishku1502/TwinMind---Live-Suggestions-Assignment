'use client'

import { memo } from 'react'
import { SuggestionBatch, Suggestion } from '@/lib/types'
import { formatTimestamp, getIntentColor, getSuggestionTypeColor, getSuggestionTypeIcon } from '@/lib/utils'
import { clsx } from 'clsx'

interface SuggestionsProps {
  batches: SuggestionBatch[]
  isLoading: boolean
  currentIntent: string
  onSuggestionClick: (suggestion: Suggestion) => void
  activeSuggestion: Suggestion | null
}

const Suggestions = memo(({
  batches,
  isLoading,
  currentIntent,
  onSuggestionClick,
  activeSuggestion,
}: SuggestionsProps) => {
  const latestBatch = batches[0] || null
  const historyBatches = batches.slice(1)

  return (
    <div className="glass-panel flex flex-col h-full group">
      {/* Header */}
      <div className="px-6 h-14 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
            AI Suggestions
          </h2>
        </div>
        {currentIntent !== '—' && (
          <span 
            className="px-3 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border"
            style={{ 
              borderColor: `${getIntentColor(currentIntent)}50`, 
              backgroundColor: `${getIntentColor(currentIntent)}15`,
              color: getIntentColor(currentIntent) 
            }}
          >
            {currentIntent}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
        {/* Analyzing / Loading State */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
                Neural Analysis in Progress...
              </span>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5" />
            ))}
          </div>
        )}

        {/* Latest Results */}
        {!isLoading && latestBatch && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
              <div className="text-[9px] font-bold tracking-[0.15em] text-slate-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Latest Insights · {formatTimestamp(latestBatch.timestamp)}
              </div>
            </div>
            
            <div className="grid gap-3">
              {latestBatch.items.map((suggestion, idx) => (
                <SuggestionCard
                  key={idx}
                  suggestion={suggestion}
                  isActive={activeSuggestion?.text === suggestion.text}
                  onClick={() => onSuggestionClick(suggestion)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && batches.length === 0 && <EmptyState />}

        {/* Archive / History */}
        {historyBatches.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
              <span className="text-[9px] font-bold tracking-[0.15em] text-slate-600 uppercase">
                Insight Archive
              </span>
            </div>
            
            <div className="space-y-8">
              {historyBatches.map((batch) => (
                <div key={batch.batchId} className="space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
                    <span className="uppercase tracking-widest">{batch.intent} Mode</span>
                    <span>{formatTimestamp(batch.timestamp)}</span>
                  </div>
                  <div className="grid gap-2">
                    {batch.items.map((suggestion, idx) => (
                      <SuggestionCard
                        key={idx}
                        suggestion={suggestion}
                        isActive={activeSuggestion?.text === suggestion.text}
                        onClick={() => onSuggestionClick(suggestion)}
                        dimmed
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

Suggestions.displayName = 'Suggestions'

export default Suggestions

function SuggestionCard({
  suggestion,
  isActive,
  onClick,
  dimmed = false,
}: {
  suggestion: Suggestion
  isActive: boolean
  onClick: () => void
  dimmed?: boolean
}) {
  const typeColor = getSuggestionTypeColor(suggestion.type)
  const typeIcon = getSuggestionTypeIcon(suggestion.type)

  return (
    <div
      onClick={onClick}
      className={clsx(
        "group/card relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
        isActive 
          ? "bg-white/[0.04] border-white/10 shadow-lg shadow-black/20" 
          : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10",
        dimmed && !isActive && "opacity-40 hover:opacity-100 scale-95 hover:scale-100"
      )}
    >
      {/* Type-based Accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover/card:opacity-100 transition-opacity"
        style={{ backgroundColor: typeColor }}
      />
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 pl-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{typeIcon}</span>
          <span 
            className="text-[9px] font-bold tracking-[0.1em] uppercase"
            style={{ color: typeColor }}
          >
            {suggestion.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-500">
            {Math.round((suggestion.confidence || 0.8) * 100)}% CONF
          </span>
        </div>
      </div>

      {/* Content */}
      <p className={clsx(
        "text-sm leading-relaxed mb-4 pl-1 transition-colors",
        isActive ? "text-slate-50 font-medium" : "text-slate-300"
      )}>
        {suggestion.text}
      </p>

      {/* Confidence Tracker */}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden ml-1">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${(suggestion.confidence || 0.8) * 100}%`,
            backgroundColor: typeColor,
            opacity: isActive ? 0.8 : 0.3
          }}
        />
      </div>
      
      {/* Interaction Indicator */}
      <div className={clsx(
        "absolute right-2 bottom-6 text-[10px] text-indigo-400 font-bold opacity-0 transition-all duration-300 translate-x-4",
        "group-hover/card:opacity-100 group-hover/card:translate-x-0"
      )}>
        ACTIVATE →
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/10 scale-0 group-hover:scale-150 transition-transform duration-500" />
        <span className="text-3xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">⚡</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-300 mb-2">
        Awaiting Conversational Context
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">
        Intelligent meeting insights, talking points, and fact-checks will materialize here automatically.
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {['question', 'talking_point', 'answer', 'fact_check'].map(type => (
          <span key={type} className="px-2 py-1 rounded-md bg-white/[0.02] border border-white/5 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
            {type.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  )
}

