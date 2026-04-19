# 🧠 MeetingMind — Real-Time AI Meeting Assistant

A context-aware AI co-pilot that listens to live meetings, detects intent, and generates actionable typed suggestions in real time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎤 Live transcription | Groq Whisper Large V3, chunked every 30s via MediaRecorder |
| ⚡ Smart suggestions | 3 typed suggestions (question / answer / talking point / fact-check / clarification) per batch |
| 🎯 Intent detection | Classifies meeting as Interview / Sales / Technical / Brainstorming / Casual — adapts suggestions |
| 📊 Confidence scores | Each suggestion has a 0–100% confidence score |
| 💬 Streaming chat | Click any suggestion → get a full streamed AI response with full meeting context |
| 📤 JSON export | Export complete session: transcript + suggestions + chat with timestamps |
| ⚙️ Settings panel | Edit suggestion & chat prompts, context window size, refresh interval — persisted in localStorage |

---

## 🏗️ Architecture

```
Browser
  └── MediaRecorder API (30s chunks)
        └── POST /api/transcribe  ──→  Groq Whisper Large V3
              └── TranscriptChunk[] appended to state

Every 30s (on chunk completion):
  POST /api/suggestions
    ├── Step 1: Intent detection  ──→  LLaMA 3.3 70B (max 10 tokens)
    └── Step 2: Suggestion gen   ──→  LLaMA 3.3 70B (structured JSON)

On suggestion click:
  POST /api/chat  ──→  LLaMA 3.3 70B (streamed)
```

### 3-Column Layout

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Live Transcript │  AI Suggestions  │  Chat Panel      │
│                  │                  │                  │
│  Scrolling text  │  3 typed cards   │  Streamed chat   │
│  per chunk       │  per 30s batch   │  with context    │
│  with timestamps │  + history       │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🧠 Prompt Strategy

### 1. Sliding Window Context

Instead of sending the full transcript on every API call (expensive, slow, hits token limits), we use a sliding window of the last N chunks:

```ts
const context = transcript.slice(-contextWindowSize) // default: 5 chunks ≈ 2.5 min
```

**Tradeoff:** Smaller window = lower latency + lower cost. Larger window = better long-range context. 5 chunks is the sweet spot for most meeting types.

### 2. Intent Detection (Two-Stage Pipeline)

Before generating suggestions, we classify the conversation type:

```
Interview | Sales | Technical Discussion | Brainstorming | Casual
```

This uses a separate cheap API call (max_tokens: 10) and adapts the suggestion prompt. An interview should prioritize "answer" types; a technical discussion should prioritize "clarification" and "fact_check". Generic prompts without intent produce generic output.

### 3. Typed Suggestion Diversity

Every batch enforces structural diversity — each of the 3 suggestions must be a **different type**:

- `question` — A smart follow-up to ask right now
- `talking_point` — Something relevant to raise or reinforce
- `answer` — A concise answer to something asked in the meeting
- `fact_check` — A correction or important caveat
- `clarification` — Something that needs unpacking

This prevents the model from returning 3 near-identical suggestions.

### 4. Confidence Scores

The model assigns a 0.0–1.0 confidence score to each suggestion based on how grounded it is in the recent conversation. This is surfaced as a visual bar in the UI so users can instantly see which suggestions are most relevant.

### 5. Chat: Full Context vs. Sliding Window

Suggestions use sliding window (speed). Chat uses the **full transcript** (depth). When a user clicks a suggestion and asks a follow-up, they want the most informed response possible — latency matters less than quality here.

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/meeting-assistant
cd meeting-assistant
npm install
```

### 2. Set up env

```bash
cp .env.local.example .env.local
# Add your Groq API key: https://console.groq.com/keys
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Navigate to **API Keys**
4. Create a new key
5. Paste into `.env.local`

---

## 📁 Project Structure

```
meeting-assistant/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts   # Groq Whisper endpoint
│   │   ├── suggestions/route.ts  # Intent + suggestions pipeline
│   │   └── chat/route.ts         # Streaming chat endpoint
│   ├── globals.css               # Design tokens + animations
│   ├── layout.tsx
│   └── page.tsx                  # Orchestrator: state + recording
│
├── components/
│   ├── Header.tsx                # Record controls, intent badge, actions
│   ├── Transcript.tsx            # Live scrolling transcript
│   ├── Suggestions.tsx           # Typed suggestion cards + batch history
│   ├── Chat.tsx                  # Streaming chat panel
│   └── Settings.tsx              # Editable prompts + engine config
│
└── lib/
    ├── types.ts                  # TypeScript interfaces
    ├── groq.ts                   # Groq client singleton + model config
    ├── prompts.ts                # All prompts with {{placeholder}} system
    └── utils.ts                  # Settings persistence, formatters, colors
```

---

## ⚙️ Settings (Editable at Runtime)

All settings are persisted in `localStorage`:

| Setting | Default | Description |
|---|---|---|
| Suggestion Prompt | Built-in | Full prompt with {{intent}} + {{context}} |
| Chat Prompt | Built-in | System prompt with {{suggestion}} + {{full_context}} |
| Context Window | 5 chunks | How many recent chunks to send to AI |
| Refresh Interval | 30s | How often to chunk audio + generate suggestions |

---

## ⚡ Latency Optimizations

- **Parallel API calls** where possible (intent detection is cheap + fast)
- **Skeleton loading UI** — never blocks user interaction
- **Streaming chat** — first token appears in ~300ms
- **Sliding window** — keeps prompt size bounded regardless of meeting length
- **Audio size check** — skips near-empty blobs before sending to Whisper

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables
- **AI:** Groq SDK (Whisper Large V3 + LLaMA 3.3 70B)
- **Audio:** Web MediaRecorder API
- **Streaming:** ReadableStream + TextDecoder
- **State:** React hooks (no external state library needed)
- **Persistence:** localStorage (settings only; transcript is session-only by design)

---

## 🎯 Design Decisions & Tradeoffs

**Why Groq?** Ultra-low latency inference. For a real-time assistant, a 300ms suggestion feels alive; a 3s suggestion feels dead.

**Why sliding window over full transcript?** Full transcript grows unboundedly. At 1 hour of meeting, you'd be sending 10,000+ tokens per suggestions call. Sliding window keeps it at ~500 tokens regardless of length, with no meaningful loss of recency.

**Why two-stage intent + suggestion?** A single call with "also detect intent" is unreliable — the model sometimes forgets to return one or mixes it into the JSON. Two focused calls are more predictable, and intent detection is so cheap (10 tokens) it adds under 100ms.

**Why typed suggestions over free-form?** Typed suggestions give users instant visual scanning — they can see at a glance "there's an answer here and a question there." Free-form suggestions all look the same and slow down decision-making during live meetings.
#   T w i n M i n d - - - L i v e - S u g g e s t i o n s - A s s i g n m e n t  
 