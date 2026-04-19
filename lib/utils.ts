import { AppSettings } from './types'

export const DEFAULT_SETTINGS: AppSettings = {
  suggestionPrompt: '', // empty = use default from prompts.ts
  chatPrompt: '',
  contextWindowSize: 5,
  refreshInterval: 30,
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem('meetingAssistantSettings')
    if (!stored) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('meetingAssistantSettings', JSON.stringify(settings))
}

export function formatTimestamp(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function getIntentColor(intent: string): string {
  const map: Record<string, string> = {
    Interview: '#ffa040',
    Sales: '#00d4ff',
    'Technical Discussion': '#7c6aff',
    Brainstorming: '#00ff87',
    Casual: '#ff6b9d',
  }
  return map[intent] || '#888'
}

export function getSuggestionTypeIcon(type: string): string {
  const map: Record<string, string> = {
    question: '❓',
    talking_point: '💡',
    answer: '✅',
    fact_check: '🔍',
    clarification: '🗣️',
  }
  return map[type] || '•'
}

export function getSuggestionTypeColor(type: string): string {
  const map: Record<string, string> = {
    question: '#00d4ff',
    talking_point: '#7c6aff',
    answer: '#00ff87',
    fact_check: '#ffa040',
    clarification: '#ff6b9d',
  }
  return map[type] || '#888'
}

export function cleanJSON(raw: string): string {
  return raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
}
