import { NextRequest, NextResponse } from 'next/server'
import { getGroqClient, GROQ_MODELS } from '@/lib/groq'
import { withRetries, handleGroqError } from '@/lib/api-helper'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const groq = getGroqClient()

    // Wrap transcription in retries to handle rate limits
    const transcription = await withRetries(async () => {
      return await groq.audio.transcriptions.create({
        file: audioFile,
        model: GROQ_MODELS.transcription,
        response_format: 'json',
        language: 'en',
      })
    })

    const text = transcription.text?.trim()

    if (!text) {
      return NextResponse.json({ text: '' })
    }

    return NextResponse.json({ text })
  } catch (error: any) {
    const formatted = handleGroqError(error, '/api/transcribe')
    return NextResponse.json({ error: formatted.error }, { status: formatted.status })
  }
}
