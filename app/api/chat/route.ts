import { NextRequest } from 'next/server'
import { getGroqClient, GROQ_MODELS } from '@/lib/groq'
import { DEFAULT_CHAT_PROMPT, buildChatPrompt } from '@/lib/prompts'
import { ChatMessage, TranscriptChunk } from '@/lib/types'
import { withRetries, handleGroqError } from '@/lib/api-helper'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      suggestion,
      fullContext,
      chatHistory = [],
      customPrompt,
    }: {
      suggestion: string
      fullContext: TranscriptChunk[]
      chatHistory: ChatMessage[]
      customPrompt?: string
    } = body

    const groq = getGroqClient()
    const contextText = fullContext.map((c) => c.text).join('\n')

    const systemContent = buildChatPrompt(
      customPrompt || DEFAULT_CHAT_PROMPT,
      suggestion,
      contextText
    )

    // Build messages: system + history (excluding timestamps for API)
    const messages = [
      { role: 'system' as const, content: systemContent },
      ...chatHistory.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Wrap the initial stream connection in retries
    const stream = await withRetries(async () => {
      return await groq.chat.completions.create({
        model: GROQ_MODELS.chat,
        messages,
        max_tokens: 700,
        temperature: 0.7,
        stream: true,
      })
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (err) {
          console.error('[Chat Stream Error]', err)
          // We can't retry halfway through a stream easily, so we just close
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error: any) {
    const formatted = handleGroqError(error, '/api/chat')
    return new Response(JSON.stringify({ error: formatted.error }), {
      status: formatted.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
