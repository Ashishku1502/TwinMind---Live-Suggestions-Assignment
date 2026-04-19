import { NextRequest, NextResponse } from 'next/server'
import { getGroqClient, GROQ_MODELS } from '@/lib/groq'
import {
  DEFAULT_SUGGESTION_PROMPT,
  INTENT_DETECTION_PROMPT,
  buildSuggestionPrompt,
} from '@/lib/prompts'
import { TranscriptChunk } from '@/lib/types'
import { cleanJSON } from '@/lib/utils'
import { withRetries, handleGroqError } from '@/lib/api-helper'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      chunks,
      customPrompt,
      contextWindowSize = 5,
    }: {
      chunks: TranscriptChunk[]
      customPrompt?: string
      contextWindowSize?: number
    } = body

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({ suggestions: [], intent: 'Casual' })
    }

    const groq = getGroqClient()

    // Use sliding window
    const window = chunks.slice(-contextWindowSize)
    const contextText = window.map((c) => c.text).join('\n')

    // ── Step 1: Intent detection (with retries) ──────────────────────────
    const intentPrompt = INTENT_DETECTION_PROMPT.replace('{{context}}', contextText)

    const intentRes = await withRetries(async () => {
      return await groq.chat.completions.create({
        model: GROQ_MODELS.chat,
        messages: [{ role: 'user', content: intentPrompt }],
        max_tokens: 10,
        temperature: 0.1,
      })
    })

    const intent = intentRes.choices[0]?.message?.content?.trim() || 'Casual'

    // ── Step 2: Generate suggestions with resolved intent (with retries) ────────────────────
    const prompt = buildSuggestionPrompt(
      customPrompt || DEFAULT_SUGGESTION_PROMPT,
      intent,
      contextText
    )

    const suggestionsResult = await withRetries(async () => {
      return await groq.chat.completions.create({
        model: GROQ_MODELS.chat,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.75,
      })
    })

    const raw = suggestionsResult.choices[0]?.message?.content || '[]'
    const cleaned = cleanJSON(raw)

    let suggestions = []
    try {
      suggestions = JSON.parse(cleaned)
    } catch {
      console.error('[/api/suggestions] JSON parse failed:', cleaned)
      suggestions = []
    }

    // Validate and sanitize
    suggestions = suggestions
      .filter((s: unknown): s is { type: string; text: string; confidence: number } =>
        typeof s === 'object' &&
        s !== null &&
        'type' in s &&
        'text' in s
      )
      .slice(0, 3)
      .map((s: { type: string; text: string; confidence?: number }) => ({
        type: s.type,
        text: s.text,
        confidence: typeof s.confidence === 'number' ? Math.min(1, Math.max(0, s.confidence)) : 0.8,
      }))

    return NextResponse.json({ suggestions, intent })
  } catch (error: any) {
    const formatted = handleGroqError(error, '/api/suggestions')
    return NextResponse.json({ error: formatted.error }, { status: formatted.status })
  }
}
