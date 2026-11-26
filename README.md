<div align="center">

# 🎵 claudetones

### Give your Claude Code sessions a soundtrack.

A lightweight, zero-config plugin for **Claude Code** that plays subtle, contextual audio cues at every beat of your workflow — from launch chimes to thinking tickers, test error stings, and victory fanfares.

[![Live Demo](https://img.shields.io/badge/Live_Soundboard-claudetones.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://claudetones.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-f97316?style=for-the-badge)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue?style=for-the-badge)](https://github.com/parjanyaacoder/claudetones/pulls)

<br/>

**[Audition the Interactive Soundboard →](https://claudetones.vercel.app/)**

</div>

---

## ⚡ Quick Install

Install in a single command using Claude Code's native plugin manager:

```bash
claude plugin marketplace add parjanyaacoder/claudetones && claude plugin install claudetones
```

Alternatively, install via the 1-line bootstrap script:

```bash
curl -fsSL https://claudetones.vercel.app/install.sh | bash
```

That's it. Next time you start `claude`, you'll hear the startup chime.

---

## 🎧 The 7 Universal Audio Cues

claudetones automatically maps to Claude Code's session lifecycle without blocking your tools or slowing down responses:

| # | Event | Trigger | Built-in Cue | What it feels like |
|:---:|---|---|---|---|
| **1** | `session_start` | `session.start` | **Launch Chime** | Gentle ascending power-on tone |
| **2** | `reasoning` | `turn.start` | **Soft Blip** | Subtle blip when Claude begins a turn |
| **3** | `long_reasoning` | `turn.start + 8s` | **Ponder Ticker** | Clock tick when a turn takes deep thinking |
| **4** | `terminal_command` | `tool.call (Bash)` | **Mechanical Click** | Tactical feedback on every shell execution |
| **5** | `tool_call` | `tool.call (File/Edit)` | **Alert Pulse** | Crisp ping on file inspections and edits |
| **6** | `error` | `tool.call → isError` | **Sad Trombone** | Audible fail sting the moment a test/cmd breaks |
| **7** | `done` | `turn.complete` | **Level Complete** | Satisfying victory fanfare when the reply is ready |

---

## 🎮 Slash Commands

Control audio directly from inside any Claude Code session:

| Command | Action |
|---|---|
| `/claudetones` | Toggle mute on or off (persists across sessions) |
| `/claudetones test [event]` | Audition any event sound on demand (e.g. `/claudetones test done`) |
| `/claudetones status` | Check if audio is currently active or muted |
| `/oops` | Caught Claude hallucinating? Plays the dramatic fail sound even when muted |

---

## 🛠️ BYOS — Bring Your Own Sounds

Want your own sound effects (Windows XP, retro 8-bit games, or custom meme drops)?

You can drop any personal `.mp3` or `.wav` file into the `sounds/` directory and map its mood in [`hooks/logic.ts`](hooks/logic.ts):

```bash
# Drop your audio file into sounds/
cp ~/my-custom-sound.mp3 ~/.claude/plugins/claudetones/sounds/

# Test it in Claude Code:
/claudetones test done
```

All audio is played locally through your operating system's native audio layer with zero latency.

---

## ⚡ Architecture & Design Philosophy

- **Zero Latency**: Sounds are dispatched asynchronously (`fire-and-forget`) via Claude Code's native `$.audio.play` API. It will never block the model or pause a tool call.
- **100% Offline**: Zero external network calls, no cloud telemetry, and no account required.
- **Fail-Open**: If your system's audio device is disconnected or busy, hooks catch silently and let Claude continue working uninterrupted.
- **Smart Volume Levels**: Constant per-tool rings play at half-gain so they remain pleasant background feedback rather than jarring distractions.

---

## 🧪 Testing

```bash
claude plugin test .
```

Runs the built-in test suite verifying event priority fallbacks, random clip rotation, gain clamping, and command argument parsing.

---

## 🤝 Contributing

Sound packs, theme ideas, and PRs are warmly welcome! If you have clean CC0 sound effects you'd like added to the default rotation, feel free to open an issue or submit a pull request.

---

## 📄 License

[MIT](LICENSE) © [Parjanya Shukla](https://github.com/parjanyaacoder)
