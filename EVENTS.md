# claudetones — Expanded Event Architecture

Acoustic feedback for modern Claude Code agent workflows: core session lifecycle,
Model Context Protocol (MCP), agent skills, subagent swarms, plugins, permissions,
testing, security guards, and context memory.

All audio clips are sourced **100% exclusively from [Myinstants](https://www.myinstants.com)**.

---

## 1. Core Lifecycle & Thinking

| # | Event key | Engine trigger | Description | Accepted moods | Clip options |
|---|---|---|---|---|---|
| 1 | `session_start` | `session.start` | Session initializes | `boot` | `launch.wav`, `windows-xp-startup.mp3` |
| 2 | `reasoning` | `turn.start` | Claude begins prompt analysis | `think` | `ring.wav`, `c418-stranger-think.mp3` |
| 3 | `long_reasoning` | `turn.start + 8s` | Turn thinking exceeds 8s | `ponder` | `timer.mp3`, `jeopardy-themelq.mp3` |
| 4 | `terminal_command`| `tool.call {Bash}` | Shell command execution | `type` | `keyboard-click.mp3`, `counter-strike-ok-lets-go.mp3` |
| 5 | `file_edit` | `tool.call {Edit/Write}`| Code mutation & patch | `switch`, `ring`| `pro-tool-call.mp3`, `switch-sound.mp3` |
| 6 | `file_read` | `tool.call {View/Glob}` | File inspection & reading | `type`, `ring`| `mouse-click-sound-fx.mp3` |
| 7 | `tool_call` | `tool.call {other}` | Standard tool invocation | `ring` | `ring.wav` |
| 8 | `web_search` | `tool.call {WebSearch/fetch}` | Live internet search | `connect`, `type` | `dialup.mp3` |
| 9 | `turn_abort` | User cancels turn (Esc) | Turn interrupted / aborted | `scratch`, `sad` | `braking-car-sound-effect-drift-brake.mp3` |
| 10 | `error` | `tool.call -> isError`| Execution error or failure | `error`, `sad` | `error.wav`, `metal-gear-alert.mp3`, `fahhhhhhhhhhhhhh.mp3` |
| 11 | `done` | `turn.complete` | Reply finished & verified | `reward` | `ding-sound-effect-1.mp3`, `gta-san-andreas-mission-complete.mp3` |

---

## 2. Agentic, MCP, and Extensibility Matrix

| # | Event key | Engine trigger | Description | Accepted moods | Clip options |
|---|---|---|---|---|---|
| 12 | `mcp_connect` | Session MCP connect | MCP server attached | `connect` | `the-bluetooth-device-its-connected-succesfull.mp3`, `success-chime.mp3` |
| 13 | `mcp_tool_call` | `tool.call {mcp__*}` | External MCP tool run | `magic`, `ring` | `magic-reveal-audio.mp3`, `switch-sound.mp3` |
| 14 | `skill_invoke` | `tool.call {Skill}` | Agent skill activated | `magic`, `hype` | `fairy-sparkle.mp3` |
| 15 | `plugin_install`| `command.run {plugin}`| Plugin / Marketplace add | `level`, `reward` | `levelup.mp3` |
| 16 | `permission_request`| `permission.request`| Interactive confirmation | `bell`, `alert` | `door-bell-sound-effect.mp3`, `discord-notification.mp3` |
| 17 | `subagent_spawn`| `tool.call {Agent/swarm}`| Subagent spawned | `teleport`, `whoosh`| `dbz-teleport.mp3` |
| 18 | `context_compact`| `PreCompact` / `/compact`| Memory token pruning | `kaching`, `pop` | `mario_coin_sound.mp3` |
| 19 | `oops` | `/oops` | Hallucination catch | `sad` | `tf_nemesis.mp3` |

---

## 3. Developer Workflows, Testing & Guardrails

| # | Event key | Engine trigger | Description | Accepted moods | Clip options |
|---|---|---|---|---|---|
| 20 | `git_commit` | `tool.call {git commit}`| Git commit landed | `pop`, `reward` | `confetti-pop-sound-effect.mp3` |
| 21 | `git_push` | `tool.call {git push}` | Pushing commits to remote | `hype`, `whoosh` | `punch-sound-effect-meme.mp3` |
| 22 | `package_install` | `npm i / pip install / cargo add` | Installing dependencies | `kaching`, `level` | `subway-surfers-coin-collect.mp3` |
| 23 | `test_pass` | Test runner exits 0 | Unit/integration tests pass | `reward` | `roblox-old-winning-sound-effect.mp3` |
| 24 | `test_fail` | Test runner fails | Unit/integration tests fail | `sad`, `error` | `the-price-is-right-losing-horn.mp3` |
| 25 | `dangerous_command` | `rm -rf`, `DROP TABLE`, force push | Risky/destructive shell command | `destructive`, `alert` | `nuclear-alarm-siren.mp3` |
| 26 | `security_alert` | Touching `.env` or credentials | Sensitive key/secret touched | `alert`, `destructive` | `metal-gear-alert.mp3` |

---

## Commands

| Command | Action |
|---|---|
| `/claudetones` | Toggle mute on/off |
| `/claudetones pause` | Pause playback |
| `/claudetones play` | Resume playback |
| `/claudetones stop` | Stop active sound |
| `/claudetones test [event]` | Audition any event sound (e.g. `test_pass`, `web_search`, `dangerous_command`) |
| `/claudetones status` | Show active session and playback state |
| `/claudetones log` | Show running telemetry, parallel collision drops, and preemption |
| `/claudetones clear-log` | Clear the local telemetry log |
| `/oops` | Play the hallucination buster sound |
