# Multi-Agent Job Search System

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <a href="https://x.com/santifer"><img src="docs/hero-banner.jpg" alt="Multi-Agent Job Search System" width="800"></a>
</p>

<p align="center">
  <strong>The AI-Powered Career Command Center.</strong><br>
  <em>Stop applying to hundreds of jobs. Start evaluating which few are worth your time.</em><br>
  Companies use AI to filter you. <strong>Now you have AI to filter them.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <a href="https://discord.gg/8pRpHETxa4"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white" alt="Discord"></a>
</p>

---

<p align="center">
  <img src="docs/demo.gif" alt="Multi-Agent Job Search System Demo" width="800">
</p>

<p align="center"><strong>940+ job listings evaluated · 150+ personalized CVs · 1 dream role landed</strong></p>

<p align="center"><a href="https://discord.gg/8pRpHETxa4"><img src="https://img.shields.io/badge/Join_the_community-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a></p>

## 🚀 What Is This?

**Multi-Agent Job Search System** turns any AI coding CLI into a high-octane job search command center. Instead of manually tracking applications in a spreadsheet, you get an autonomous pipeline that acts as your personal elite recruiter.

- **Evaluates Fit (A-G Scoring):** 10 weighted dimensions + a new **Legitimacy Check (Ghost Job Detection)**.
- **Generates Premium CVs:** Tailors every line of your resume to the job description using modern typography and ATS-optimized design.
- **Scans Portals Automatically:** Greenhouse, Ashby, Lever, and custom company pages, extraction with zero terminal cost.
- **Deep Research:** Investigates company culture, layoffs, funding, and reputation before you even hit 'Apply'.
- **Interview Intelligence:** Builds a **STAR+Reflection Story Bank** that gets smarter with every evaluation.

> [!IMPORTANT]
> **This is NOT a spray-and-pray tool.** It is a surgical filter. The system strongly recommends against applying to anything scoring below 4.0/5. Your time is your most valuable asset—don't waste it on low-fit roles.

---

## ✨ Features

| Mode | Command (subcommand / hyphen) | Description |
|:---|:---|:---|
| **Pipeline** | `/majs pipeline` / `/majs-pipeline` | Process an inbox of potential job URLs in one go. |
| **Evaluate** | `/majs oferta` / `/majs-evaluate` | Deep A-G scoring of a JD (Match, Gaps, Comp, Strategy, Legitimacy). |
| **PDF CV** | `/majs pdf` / `/majs-pdf` | Generate a perfectly tailored, ATS-ready PDF resume. |
| **Scanner** | `/majs scan` / `/majs-scan` | Auto-discover new roles across 45+ pre-configured AI companies. |
| **Dashboard** | `npm run dashboard` | Launch the Go-powered Terminal UI to browse your pipeline. |
| **Research** | `/majs deep` / `/majs-deep` | Deep-dive into company health, team sentiment, and layoffs. |
| **Interview** | `/majs interview-prep` | STAR+R story mapping and company-specific tactical reports. |
| **Outreach** | `/majs contacto` / `/majs-contact` | Draft personalized LinkedIn/Cold-email messages that actually get replies. |
| **Batch** | `/majs batch` / `/majs-batch` | Process 10+ jobs in parallel using sub-agent workers (`claude -p`). |
| **Patterns** | `/majs patterns` / `/majs-patterns` | Analyze rejection trends to hyper-target your search. |
| **Follow-up** | `/majs followup` / `/majs-followup` | Automated cadence tracker so you never forget to bump a recruiter. |
| **Latex** | `/majs latex` / `/majs-latex` | Export your tailored CV as project-ready LaTeX/Overleaf code. |
| **Training** | `/majs training` / `/majs-training` | Evaluate courses or certs against your actual career goals. |
| **Project** | `/majs project` / `/majs-project` | Audit portfolio project ideas for maximum impact on your next role. |

---

## 🌍 Multi-language Support

The system and all its evaluation modes are natively available in 6 languages:

- **English** (`modes/`)
- **German** (`modes/de/`) - DACH-specific vocabulary (13. Monatsgehalt, Kündigungsfrist).
- **French** (`modes/fr/`) - Francophone specifics (CDI/CDD, SYNTEC, CSE).
- **Japanese** (`modes/ja/`) - Japan-specific terms (正社員, 業務委託, 36協定).
- **Portuguese (BR)** (`modes/pt/`)
- **Russian** (`modes/ru/`)

---

## 🛠️ Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Ashishku1502/Multi-Agent-Job-Search-System.git
cd Multi-Agent-Job-Search-System && npm install
npx playwright install chromium   # Required for PDF & Scraping

# 2. Check setup
npm run doctor                     # Validates all your local prerequisites

# 3. Configure (Critical)
cp config/profile.example.yml config/profile.yml  # Your personal details
cp templates/portals.example.yml portals.yml       # Companies to scan

# 4. Canonical CV
# Create cv.md in the root directory. This is the source of truth for all AI evals.

# 5. Open your Agent
claude      # or 'gemini' if using Gemini CLI
```

### 🤖 Gemini CLI & OpenCode Support

Multi-Agent Job Search System is 100% cross-platform. If you prefer Gemini CLI:

```bash
# Install & Auth
npm install -g @google/gemini-cli && gemini auth

# Use hyphenated commands
/majs-evaluate URL_OR_JD
/majs-scan
/majs-pdf
```

---

## 📜 The Data Contract

To keep your system updatable without losing your data, we maintain a strict boundary:

- **User Layer (NEVER auto-updated):** `cv.md`, `config/profile.yml`, `modes/_profile.md`, `portals.yml`, `data/*`, `reports/*`. Your personalizations live here.
- **System Layer (Auto-updatable):** `modes/oferta.md`, `CLAUDE.md`, `*.mjs` scripts, `dashboard/*`. Don't put user data here!

---

## 🏗️ Project Structure

```bash
├── cv.md                        # YOUR canonical CV (Markdown)
├── config/                      # User profile and personalization
├── data/                        # [GITIGNORED] Application tracker and history
├── modes/                       # The 15+ skill modes (Logic & Prompts)
│   ├── de/, fr/, ja/, ru/, pt/  # Native language packs
├── reports/                     # [GITIGNORED] Detailed A-G evaluation reports
├── interview-prep/              # Story Bank and company-specific intel
├── dashboard/                   # Go + Bubble Tea TUI
├── templates/                   # HTML/LaTeX CV templates and state configs
├── fonts/                       # Premium typography (Space Grotesk, DM Sans)
├── package.json                 # Node.js dependencies
└── portals.yml                  # Search queries and target company list
```

---

## 🛡️ Posting Legitimacy (Block G)

This system provides a built-in **Ghost Job Detection** engine. It analyzes:
1. **Freshness:** Is the posting genuinely new or just auto-reposted?
2. **Hiring Signals:** Does the company have recent layoffs or hiring freezes? (WebSearch verified).
3. **JD Quality:** Is it specific or generic boilerplate?
4. **Market Context:** Is the role typical for the company's current stage?

---

## 🚀 Tech Stack

- **Agents:** Claude Code / Gemini CLI / OpenCode
- **Scraping:** Playwright (API-first, zero-token cost where possible)
- **PDF Engine:** Puppeteer + HTML/CSS (ATS-optimized)
- **TUI Dashboard:** Go + Bubble Tea + Lipgloss (Catppuccin Mocha theme)
- **Orchestration:** Node.js (ESM)

---

## 🤝 Community & Support

- **Discord:** [Join the conversation](https://discord.gg/8pRpHETxa4)
- **Author:** Santiago — Head of Applied AI. [santifer.io](https://santifer.io)
- **Contribute:** See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## ⚖️ Disclaimer

**This is a local, open-source tool — NOT a hosted service.** 
You control your data. You control the AI. You comply with 3rd-party Terms of Service.
Always review AI-generated content before submitting. Evaluations are recommendations, not truth.

See [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) for full details.

---

<p align="center">
  Generated with ❤️ by the Multi-Agent Job Search System community.<br>
  <strong>Good luck on your search.</strong>
</p>
