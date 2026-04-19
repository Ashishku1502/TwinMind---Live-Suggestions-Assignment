'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TranscriptChunk, SuggestionBatch, ChatMessage, Suggestion, AppSettings } from '@/lib/types'
import { loadSettings, saveSettings } from '@/lib/utils'
import Transcript from '@/components/Transcript'
import Suggestions from '@/components/Suggestions'
import Chat from '@/components/Chat'
import Settings from '@/components/Settings'
import Header from '@/components/Header'

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptChunk[]>([])
  const [suggestionBatches, setSuggestionBatches] = useState<SuggestionBatch[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [currentIntent, setCurrentIntent] = useState<string>('—')
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isChatStreaming, setIsChatStreaming] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(loadSettings())
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const chunkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const suggestionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Tracks active recorder instances so stopRecording can safely stop them
  const activeRecordersRef = useRef<Set<MediaRecorder>>(new Set())
  const isRecordingRef = useRef(false)
  const transcriptRef = useRef<TranscriptChunk[]>([])
  const settingsRef = useRef<AppSettings>(settings)

  // Keep refs in sync with state
  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const appendTranscript = useCallback((text: string) => {
    if (!text.trim()) return
    const chunk: TranscriptChunk = {
      id: uuidv4(),
      text: text.trim(),
      timestamp: Date.now(),
    }
    setTranscript((prev) => [...prev, chunk])
  }, [])

  // Each call creates one self-contained recorder for one chunk window.
  // Uses settingsRef so it always reads the latest interval value.
  const recordChunk = useCallback(() => {
    if (!streamRef.current || !isRecordingRef.current) return

    const chunkDuration = (settingsRef.current.refreshInterval || 30) * 1000
    const localChunks: BlobPart[] = []
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(streamRef.current, { mimeType })
    } catch {
      return
    }

    activeRecordersRef.current.add(recorder)

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data)
    }

    recorder.onstop = async () => {
      activeRecordersRef.current.delete(recorder)
      const blob = new Blob(localChunks, { type: mimeType })
      if (blob.size < 1000) return // skip near-empty blobs

      const formData = new FormData()
      formData.append('audio', blob, 'chunk.webm')

      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
        if (!res.ok) return
        const data = await res.json()
        if (data.text) appendTranscript(data.text)
      } catch (err) {
        console.error('Transcription error:', err)
      }
    }

    recorder.start()

    // Stop this recorder after chunkDuration — only if still in recording state
    setTimeout(() => {
      if (recorder.state === 'recording') recorder.stop()
    }, chunkDuration)
  }, [appendTranscript])

  const fetchSuggestions = useCallback(async () => {
    const chunks = transcriptRef.current
    if (chunks.length === 0) return

    setIsLoadingSuggestions(true)
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chunks,
          customPrompt: settingsRef.current.suggestionPrompt || undefined,
          contextWindowSize: settingsRef.current.contextWindowSize,
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.suggestions?.length > 0) {
        const batch: SuggestionBatch = {
          batchId: uuidv4(),
          items: data.suggestions,
          timestamp: Date.now(),
          intent: data.intent || 'Casual',
        }
        setSuggestionBatches((prev) => [batch, ...prev])
        setCurrentIntent(data.intent || 'Casual')
      }
    } catch (err) {
      console.error('Suggestions error:', err)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      isRecordingRef.current = true
      setIsRecording(true)
      setRecordingStartTime(Date.now())

      const chunkDuration = (settingsRef.current.refreshInterval || 30) * 1000

      // Start first chunk immediately
      recordChunk()

      // Schedule subsequent chunks at each interval
      chunkIntervalRef.current = setInterval(recordChunk, chunkDuration)

      // Fetch suggestions on the same cadence (offset by half interval so
      // suggestions fire after transcript has been updated)
      suggestionIntervalRef.current = setInterval(fetchSuggestions, chunkDuration)

      // Start recording timer

    } catch (err) {
      isRecordingRef.current = false
      const msg = err instanceof Error ? err.message : 'Microphone access denied'
      setError(msg)
    }
  }, [recordChunk, fetchSuggestions])

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false

    // Stop all active recorders
    activeRecordersRef.current.forEach((r) => {
      if (r.state === 'recording') r.stop()
    })

    // Stop all mic tracks
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    // Clear all intervals
    if (chunkIntervalRef.current) { clearInterval(chunkIntervalRef.current); chunkIntervalRef.current = null }
    if (suggestionIntervalRef.current) { clearInterval(suggestionIntervalRef.current); suggestionIntervalRef.current = null }
    
    setRecordingStartTime(null)
    setIsRecording(false)

    // Final suggestions fetch after stopping
    if (transcriptRef.current.length > 0) fetchSuggestions()
  }, [fetchSuggestions])

  const sendChatMessage = useCallback(
    async (message: string, currentMessages: ChatMessage[]) => {
      setIsChatStreaming(true)

      const assistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: Date.now() }
      setChatMessages((prev) => [...prev, assistantMsg])

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            suggestion: activeSuggestion?.text || message,
            fullContext: transcriptRef.current,
            chatHistory: currentMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            customPrompt: settingsRef.current.chatPrompt || undefined,
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: 'Request failed' }))
          throw new Error(errData.error || `Server error ${res.status}`)
        }
        if (!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          setChatMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText }
            return updated
          })
        }
      } catch (err) {
        console.error('Chat error:', err)
        const errorMsg = err instanceof Error ? err.message : 'Sorry, something went wrong. Please try again.'
        setChatMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: errorMsg,
          }
          return updated
        })
      } finally {
        setIsChatStreaming(false)
      }
    },
    [activeSuggestion]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      setActiveSuggestion(suggestion)
      const userMsg: ChatMessage = {
        role: 'user',
        content: `Tell me more about this suggestion: "${suggestion.text}"`,
        timestamp: Date.now(),
      }
      setChatMessages((prev) => {
        const updated = [...prev, userMsg]
        // Trigger AI response with the updated message list
        sendChatMessage(userMsg.content, updated)
        return updated
      })
    },
    [sendChatMessage]
  )

  const handleChatSend = useCallback(
    (message: string) => {
      const userMsg: ChatMessage = { role: 'user', content: message, timestamp: Date.now() }
      setChatMessages((prev) => {
        const updated = [...prev, userMsg]
        sendChatMessage(message, updated)
        return updated
      })
    },
    [sendChatMessage]
  )

  const handleExport = useCallback(() => {
    if (transcript.length === 0 && suggestionBatches.length === 0 && chatMessages.length === 0) return
    const data = {
      exportedAt: new Date().toISOString(),
      meetingIntent: currentIntent,
      transcript,
      suggestions: suggestionBatches,
      chat: chatMessages,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [transcript, suggestionBatches, chatMessages, currentIntent])

  const handleSettingsSave = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
    setShowSettings(false)
  }, [])

  const handleClearAll = useCallback(() => {
    setTranscript([])
    setSuggestionBatches([])
    setChatMessages([])
    setActiveSuggestion(null)
    setCurrentIntent('—')
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Memoized component props to prevent re-renders on every clock tick (setRecordingTime)
  const memoizedTranscript = useMemo(() => transcript, [transcript])
  const memoizedSuggestionBatches = useMemo(() => suggestionBatches, [suggestionBatches])
  const memoizedChatMessages = useMemo(() => chatMessages, [chatMessages])

  return (
    <main className="flex flex-col h-screen overflow-hidden noise-bg">
      <Header
        isRecording={isRecording}
        recordingStartTime={recordingStartTime}
        currentIntent={currentIntent}
        onStart={startRecording}
        onStop={stopRecording}
        onExport={handleExport}
        onClear={handleClearAll}
        onSettings={() => setShowSettings(true)}
        transcriptCount={transcript.length}
        error={error}
      />

      {/* Main Intelligent Workspace */}
      <div className="dashboard-grid flex-1">
        <div className="h-full overflow-hidden p-1">
          <Transcript chunks={memoizedTranscript} isRecording={isRecording} />
        </div>
        
        <div className="h-full overflow-hidden p-1">
          <Suggestions
            batches={memoizedSuggestionBatches}
            isLoading={isLoadingSuggestions}
            currentIntent={currentIntent}
            onSuggestionClick={handleSuggestionClick}
            activeSuggestion={activeSuggestion}
          />
        </div>

        <div className="h-full overflow-hidden p-1">
          <Chat
            messages={memoizedChatMessages}
            isStreaming={isChatStreaming}
            activeSuggestion={activeSuggestion}
            onSend={handleChatSend}
          />
        </div>
      </div>

      {showSettings && (
        <Settings
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Neural Background Gradients */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>
    </main>
  )
}
