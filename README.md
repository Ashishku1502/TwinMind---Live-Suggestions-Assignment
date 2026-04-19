<div align="center">

<br />

# 🧠 MeetingMind

### Real-Time AI Meeting Assistant

> *A context-aware AI co-pilot that listens, understands, and acts — so you can focus on the conversation.*

<br />

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Groq](https://img.shields.io/badge/Powered%20by-Groq-orange?style=flat-square)](https://groq.com/)
[![LLaMA](https://img.shields.io/badge/LLaMA-3.3%2070B-blue?style=flat-square)](https://llama.meta.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

![MeetingMind Demo](https://via.placeholder.com/900x480/0f172a/38bdf8?text=MeetingMind+—+Live+Demo+Screenshot)

<br />

</div>

---

## ✨ What It Does

MeetingMind transcribes your meeting live, detects the conversation's intent, and surfaces **3 typed, confidence-scored AI suggestions every 30 seconds** — questions to ask, talking points to raise, answers to give, and facts to check. Click any suggestion to open a streaming AI chat with full meeting context.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🎤 **Live Transcription** | Groq Whisper Large V3, chunked every 30s via the MediaRecorder API |
| ⚡ **Smart Suggestions** | 3 typed suggestions per batch — always structurally diverse |
| 🎯 **Intent Detection** | Auto-classifies as Interview / Sales / Technical / Brainstorming / Casual and adapts suggestions |
| 📊 **Confidence Scores** | Every suggestion carries a 0–100% confidence score, visualised as a bar |
| 💬 **Streaming Chat** | Click any suggestion → full streamed AI response with complete meeting context |
| 📤 **JSON Export** | One-click export: full transcript + suggestions + chat history with timestamps |
| ⚙️ **Live Settings** | Edit prompts, context window size, and refresh interval at runtime — persisted in `localStorage` |

---

## 🏗️ Architecture

```
Browser
  └── MediaRecorder API  (30-second chunks)
        └── POST /api/transcribe  ──→  Groq Whisper Large V3
              └── TranscriptChunk[] appended to React state

Every 30s (on chunk completion):
  POST /api/suggestions
    ├── Step 1: Intent Detection  ──→  LLaMA 3.3 70B  (max 10 tokens, ~100ms)
    └── Step 2: Suggestion Gen    ──→  LLaMA 3.3 70B  (structured JSON)

On suggestion click:
  POST /api/chat  ──→  LLaMA 3.3 70B  (streamed, full transcript context)
```

### 3-Column Layout

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Live Transcript │  AI Suggestions  │  Chat Panel      │
│                  │                  │                  │
│  Scrolling text  │  3 typed cards   │  Streamed chat   │
│  per chunk       │  per 30s batch   │  with context    │
│  with timestamps │  + batch history │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🧠 Prompt Engineering

### 1 — Sliding Window Context

Instead of sending the full (ever-growing) transcript on every call, a sliding window of the last **N chunks** is used:

```ts
const context = transcript.slice(-contextWindowSize) // default: 5 chunks ≈ 2.5 min
```

> **Tradeoff:** Smaller window → lower latency + lower cost. Larger window → better long-range context. 5 chunks is the sweet spot for most meeting types.

### 2 — Two-Stage Intent Detection

A cheap, focused API call (max 10 tokens) classifies the meeting **before** generating suggestions:

```
Interview | Sales | Technical Discussion | Brainstorming | Casual
```

A single call asking the model to "also detect intent" is unreliable — the model sometimes forgets or bleeds it into the JSON. Two focused calls are more predictable, and intent detection adds under **100ms** of latency.

### 3 — Typed Suggestion Diversity

Every batch enforces structural variety — each of the 3 suggestions must be a **different type**:

| Type | Description |
|---|---|
| `question` | A smart follow-up to ask right now |
| `talking_point` | Something relevant to raise or reinforce |
| `answer` | A concise answer to something asked in the meeting |
| `fact_check` | A correction or important caveat |
| `clarification` | Something that needs unpacking |

### 4 — Chat Uses Full Context

Suggestions use the **sliding window** (speed). Chat uses the **full transcript** (depth). When a user drills into a suggestion, latency matters less than the quality of the response.

---

## 📁 Project Structure

```
meeting-assistant/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts     # Groq Whisper endpoint
│   │   ├── suggestions/route.ts    # Intent + suggestions pipeline
│   │   └── chat/route.ts           # Streaming chat endpoint
│   ├── globals.css                 # Design tokens + animations
│   ├── layout.tsx
│   └── page.tsx                    # Orchestrator: state + recording logic
│
├── components/
│   ├── Header.tsx                  # Record controls, intent badge, actions
│   ├── Transcript.tsx              # Live scrolling transcript
│   ├── Suggestions.tsx             # Typed suggestion cards + batch history
│   ├── Chat.tsx                    # Streaming chat panel
│   └── Settings.tsx                # Editable prompts + engine config
│
└── lib/
    ├── types.ts                    # TypeScript interfaces
    ├── groq.ts                     # Groq client singleton + model config
    ├── prompts.ts                  # All prompts with {{placeholder}} system
    └── utils.ts                    # Settings persistence, formatters, helpers
```

---

## ⚙️ Runtime Settings

All settings are persisted in `localStorage` and editable without restarting the app:

| Setting | Default | Description |
|---|---|---|
| Suggestion Prompt | Built-in | Full prompt template with `{{intent}}` + `{{context}}` |
| Chat Prompt | Built-in | System prompt with `{{suggestion}}` + `{{full_context}}` |
| Context Window | 5 chunks | How many recent chunks to include in suggestion calls |
| Refresh Interval | 30s | How often to chunk audio and generate new suggestions |

---

## ⚡ Performance Optimisations

- **Parallel API calls** — intent detection runs concurrently wherever possible
- **Skeleton loading UI** — never blocks user interaction while waiting for suggestions
- **Streaming chat** — first token appears in ~300ms
- **Bounded prompt size** — sliding window keeps token count constant regardless of meeting length
- **Audio size guard** — near-empty blobs are skipped before sending to Whisper

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS variables |
| AI Inference | Groq SDK — Whisper Large V3 + LLaMA 3.3 70B |
| Audio Capture | Web MediaRecorder API |
| Streaming | `ReadableStream` + `TextDecoder` |
| State | React hooks (no external library) |
| Persistence | `localStorage` (settings only; transcript is session-scoped by design) |

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/meeting-assistant
cd meeting-assistant
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> **Get a key:** [console.groq.com](https://console.groq.com) → Sign up → API Keys → Create new key

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start a meeting.

---

## 🎯 Design Decisions

**Why Groq?**
Ultra-low latency inference. A 300ms suggestion feels alive during a live meeting; a 3s suggestion feels dead. Groq's speed is non-negotiable for this use case.

**Why sliding window instead of full transcript?**
At an hour-long meeting, sending the full transcript on every suggestion call would mean 10,000+ tokens per request. The sliding window keeps it at ~500 tokens with no meaningful loss of recency.

**Why two separate stages for intent + suggestions?**
A single combined call is unreliable — models tend to merge or drop the structured intent field. Two focused calls are more predictable, and intent detection is so cheap it adds under 100ms.

**Why typed suggestions over free-form?**
Typed suggestions give users instant visual scanning — at a glance, you can see "there's an answer here and a question there." Free-form suggestions all look the same and slow down decision-making in a live, time-pressured context.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ⚡ by [Ashish Kumar](https://ashishdev-portfolio.vly.site)

</div>
