'use client'

import { useState } from 'react'
import { AppSettings } from '@/lib/types'
import { DEFAULT_SUGGESTION_PROMPT, DEFAULT_CHAT_PROMPT } from '@/lib/prompts'
import { clsx } from 'clsx'

interface SettingsProps {
  settings: AppSettings
  onSave: (settings: AppSettings) => void
  onClose: () => void
}

type TabId = 'prompts' | 'engine' | 'about'

export default function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [local, setLocal] = useState<AppSettings>({ ...settings })
  const [activeTab, setActiveTab] = useState<TabId>('prompts')

  const handleReset = (field: 'suggestionPrompt' | 'chatPrompt') => {
    setLocal((prev) => ({
      ...prev,
      [field]: '',
    }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] animate-fade-in"
      />

      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl px-4 animate-scale-in">
        <div className="panel flex flex-col max-h-[85vh] overflow-hidden shadow-3xl shadow-indigo-500/10 border-white/10 ring-1 ring-white/5">
          {/* Header */}
          <div className="panel-header flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shadow-inner shadow-indigo-500/5">
                ⚙️
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">System Configuration</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Precision Tuning Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-6 border-b border-white/5 bg-white/[0.01]">
            {(['prompts', 'engine', 'about'] as TabId[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
            {activeTab === 'prompts' && (
              <div className="space-y-8 animate-slide-up">
                <PromptField
                  label="Contextual Intelligence Engine"
                  description="Defines how the AI interprets meeting intent and generates proactive suggestions."
                  value={local.suggestionPrompt}
                  placeholder={DEFAULT_SUGGESTION_PROMPT}
                  onChange={(v) => setLocal((p) => ({ ...p, suggestionPrompt: v }))}
                  onReset={() => handleReset('suggestionPrompt')}
                  tag="SUGGESTIONS"
                />
                <PromptField
                  label="Interactive Agent Protocol"
                  description="Configures the primary behavior of the chat assistant during real-time queries."
                  value={local.chatPrompt}
                  placeholder={DEFAULT_CHAT_PROMPT}
                  onChange={(v) => setLocal((p) => ({ ...p, chatPrompt: v }))}
                  onReset={() => handleReset('chatPrompt')}
                  tag="CONVERSATION"
                />
              </div>
            )}

            {activeTab === 'engine' && (
              <div className="space-y-10 animate-slide-up">
                <SliderField
                  label="Neural Context Depth"
                  description="Number of recent transcript fragments analyzed. Higher values improve coherence but increase latency."
                  value={local.contextWindowSize}
                  min={1}
                  max={15}
                  onChange={(v) => setLocal((p) => ({ ...p, contextWindowSize: v }))}
                  unit="Fragments"
                />
                <SliderField
                  label="Analysis Cycle Frequency"
                  description="The interval at which audio is processed and intelligence is generated."
                  value={local.refreshInterval}
                  min={15}
                  max={120}
                  step={5}
                  onChange={(v) => setLocal((p) => ({ ...p, refreshInterval: v }))}
                  unit="Seconds"
                />

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    💡
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 mb-1 tracking-tight">System Recommendation</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      For optimal performance, maintain context at <span className="text-indigo-300 font-mono">5</span> fragments and cycles at <span className="text-indigo-300 font-mono">30s</span>. This configuration balances inference tokens and real-time responsiveness.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6 animate-slide-up">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-widest opacity-80">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Neural Architecture
                  </h4>
                  <p className="text-[13px] text-slate-400 leading-relaxed mb-6 font-medium">
                    MeetingMind leverages a proprietary sliding-window heuristic to maintain semantic relevance across extended sessions. Our distributed inference pipelines run asynchronously, ensuring the UI remains fluid even during peak cognitive loads.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <InfoRow label="Transcription Layer" value="Groq · Whisper L3" />
                    <InfoRow label="Cognitive Core" value="Groq · LLaMA 3.3 70B" />
                    <InfoRow label="Ingestion Engine" value="Native MediaRecorder" />
                    <InfoRow label="Transport Layer" value="Vercel AI Streaming" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex gap-3">
                  <span className="text-emerald-400 mt-0.5">🚀</span>
                  <p className="text-[11px] text-emerald-400/80 leading-relaxed font-medium">
                    Verified Deployment: <span className="font-mono text-[9px] px-1.5 py-0.5 bg-emerald-400/10 rounded">SYSTEM_STABLE_v1.0.4</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Config ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all"
              >
                DISCARD
              </button>
              <button
                onClick={() => onSave(local)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all"
              >
                APPLY CHANGES
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function PromptField({
  label,
  description,
  value,
  placeholder,
  onChange,
  onReset,
  tag
}: {
  label: string
  description: string
  value: string
  placeholder: string
  onChange: (v: string) => void
  onReset: () => void
  tag: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/10 tracking-widest uppercase">
            {tag}
          </span>
          <h3 className="text-xs font-bold text-white tracking-tight">{label}</h3>
        </div>
        <button
          onClick={onReset}
          className="text-[9px] font-bold text-slate-500 hover:text-indigo-400 tracking-widest uppercase transition-colors"
        >
          Factory Reset
        </button>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        {description}
      </p>
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`System default sequence active...\n\n${placeholder.slice(0, 120)}…`}
          className="w-full min-h-[140px] bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-[11px] font-mono leading-relaxed text-indigo-100 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/10 transition-all resize-none"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-indigo-500/20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function SliderField({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
}: {
  label: string
  description: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  unit: string
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight uppercase tracking-[0.1em]">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-indigo-400 font-mono tracking-tighter">{value}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        {description}
      </p>
      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-900 border border-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
        />
        <div className="flex justify-between mt-2 pt-1 text-[9px] font-bold text-slate-600 font-mono tracking-widest uppercase">
          <span>{min} <span className="opacity-50">{unit}</span></span>
          <span>{max} <span className="opacity-50">{unit}</span></span>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.01] border border-white/5 group hover:bg-white/[0.02] transition-colors">
      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-mono text-indigo-300 tracking-tight">
        {value}
      </span>
    </div>
  )
}
