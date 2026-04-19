export interface TranscriptChunk {
  id: string
  text: string
  timestamp: number
}

export type SuggestionType =
  | 'question'
  | 'talking_point'
  | 'answer'
  | 'fact_check'
  | 'clarification'

export interface Suggestion {
  type: SuggestionType
  text: string
  confidence: number
}

export interface SuggestionBatch {
  batchId: string
  items: Suggestion[]
  timestamp: number
  intent: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface AppSettings {
  suggestionPrompt: string
  chatPrompt: string
  contextWindowSize: number
  refreshInterval: number
}

export type MeetingIntent =
  | 'Interview'
  | 'Sales'
  | 'Technical Discussion'
  | 'Brainstorming'
  | 'Casual'
