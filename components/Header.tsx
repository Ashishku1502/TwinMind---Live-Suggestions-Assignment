'use client'

import React, { memo } from 'react'
import { getIntentColor } from '@/lib/utils'
import { clsx } from 'clsx'

interface HeaderProps {
  isRecording: boolean
  recordingStartTime: number | null
  currentIntent: string
  onStart: () => void
  onStop: () => void
  onExport: () => void
  onClear: () => void
  onSettings: () => void
  transcriptCount: number
  error: string | null
}

function Header({
  isRecording,
  recordingStartTime,
  currentIntent,
  onStart,
  onStop,
  onExport,
  onClear,
  onSettings,
  transcriptCount,
  error,
}: HeaderProps) {
  const intentColor = getIntentColor(currentIntent)

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-slate-950/40 backdrop-blur-md relative z-50">
      {/* Branding */}
      <div className="flex items-center gap-4 group cursor-default">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
          🧠
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            MeetingMind
          </h1>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-400 uppercase">
            Pro Neural Co-Pilot
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={isRecording ? onStop : onStart}
            className={clsx(
              'glow-button flex items-center gap-3 px-6 h-11 rounded-full text-sm font-bold tracking-wide transition-all border',
              isRecording 
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-lg shadow-rose-500/10' 
                : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5'
            )}
          >
            {isRecording ? (
              <>
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-pulse" />
                <span>STOP · <LiveTimer startTime={recordingStartTime} /></span>
              </>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 rec-pulse" />
                <span>START LISTENING</span>
              </>
            )}
          </button>

          {currentIntent !== '—' && (
            <div 
              className="px-4 h-8 flex items-center rounded-full text-[10px] font-bold tracking-widest uppercase border"
              style={{ 
                borderColor: `${intentColor}50`, 
                backgroundColor: `${intentColor}15`,
                color: intentColor 
              }}
            >
              {currentIntent}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-tighter">
            {transcriptCount} segments
          </span>
        </div>
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-2">
        <IconButton onClick={onSettings} title="Settings">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </IconButton>
        <IconButton onClick={onExport} title="Export Session" disabled={transcriptCount === 0}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </IconButton>
        <IconButton onClick={onClear} title="Reset All" disabled={transcriptCount === 0}>
          <svg className="w-4 h-4 text-rose-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </IconButton>
      </div>

      {/* Error Bar */}
      {error && (
        <div className="absolute left-0 right-0 top-full bg-rose-500/20 border-b border-rose-500/30 px-8 py-2 text-xs font-medium text-rose-300 backdrop-blur-sm animate-slide-up flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}
    </header>
  )
}

function IconButton({
  onClick,
  title,
  disabled,
  children,
}: {
  onClick: () => void
  title: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 transition-all hover:bg-white/10 active:scale-95",
        disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {children}
    </button>
  )
}

function LiveTimer({ startTime }: { startTime: number | null }) {
  const [elapsed, setElapsed] = React.useState('00:00')

  React.useEffect(() => {
    if (!startTime) {
      setElapsed('00:00')
      return
    }

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000)
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      setElapsed(`${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return <>{elapsed}</>
}

export default memo(Header)
