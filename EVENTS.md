# poptunes — Events

Every place poptunes *can* play a sound. An event does **not** name a file — it asks
for one or more **moods**. At play time we pick a random clip tagged with a matching
mood (see `CLIPS.md`). So a single event can have many apt clips and rotate between
them, and a new clip joins an event just by carrying its mood.

- **Moods** are the shared vocabulary between this file and `CLIPS.md` — defined once in `CLIPS.md`.
- **Accepted moods** are listed in priority order: if no clip of the first mood exists, fall back to the next.
- **Status:** `LIVE` = wired in the mod — it plays as soon as a clip carries one of its moods (silent until then) · `PLANNED` = not wired yet.
- **Frequency** matters more than anything: a sound on a *very frequent* event becomes noise fast. Keep those pools empty (or use `/poptunes` to mute) until you want them. All sound is killable with `/poptunes`.

## Lifecycle — the session

| Event key | Engine hook | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `boot` | `session.start` | Claude Code launches | once/session | `boot` | **LIVE** |
| `shutdown` | `session.end` | you quit / session ends | once/session | `shutdown`, `boot` | **LIVE** |
| `compact` | `session.compact` | context is compacted (the "memory wipe") | rare | `whoosh` | **LIVE** |

## Your input

| Event key | Engine hook | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `submit` | `prompt.submit` | you send a prompt | frequent | `hype` | PLANNED |
| `mention` | `prompt.mention` | you @-mention a file/agent | occasional | `pop` | PLANNED *(maybe skip)* |

## Claude working & replying

| Event key | Engine hook | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `think` | `turn.start` | Claude begins working on your turn | frequent | `think` | **LIVE** |
| `done` | `turn.complete` | Claude finishes its reply | frequent | `reward` | **LIVE** |
| `interrupt` | `turn.abort` | you stop Claude (Esc) | occasional | `scratch`, `sad` | **LIVE** |
| `permission` | `tool.check` | a permission prompt appears | occasional | `alert` | **LIVE** |

## Tool calls

| Event key | Engine hook | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `tool` | `tool.call` | any tool call begins | **very frequent** | `ring` | **LIVE** |
| `error` | `tool.call` → result `isError` | a tool/command fails | occasional | `error`, `sad` | **LIVE** |
| `edit` | `tool.call {tool: Edit/Write}` | a file is edited | frequent | `type` | PLANNED |
| `search` | `tool.call {tool: WebSearch}` | a web search runs | occasional | `connect` | PLANNED |

## Smart (inspect the Bash command / result text)

| Event key | How detected | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `commit` | Bash cmd matches `git commit` | a commit lands | occasional | `kaching`, `reward` | PLANNED |
| `push` | Bash cmd matches `git push` | a push goes out | occasional | `whoosh`, `hype` | PLANNED |
| `tests-pass` | test cmd result success | tests go green | occasional | `reward` | PLANNED |
| `tests-fail` | test cmd result failure | tests go red | occasional | `sad` | PLANNED |
| `danger` | Bash cmd matches destructive pattern (`rm -rf`, force-push…) | a risky command runs | rare | `alert`, `destructive` | PLANNED |

## Agents

| Event key | Engine hook | Fires when | Frequency | Accepted moods | Status |
|---|---|---|---|---|---|
| `spawn` | `agent.spawn` | a subagent/worker launches | occasional | `hype` | PLANNED |

## Manual (you fire them — a slash command)

| Event key | Trigger | Fires when | Accepted moods | Status |
|---|---|---|---|---|
| `oops` | `/oops` | you caught Claude being wrong | `sad` | **LIVE** |
| `soundboard` | `/siuuu`, `/bruh`, `/areybhai`, … | on demand | `meme` | PLANNED |

---

### Notes on frequency (so it stays fun, not maddening)
- **Never wire:** `turn.step`, `prompt.edit` — they fire constantly.
- **Wired but hold the clips:** `tool`, `think`, `done` fire a lot. They're wired, but keep their mood pools empty (no `ring`/`think`/`reward` clip, or mute) until you actually want them — otherwise it's a wall of sound.
- **Safe to fill now:** `boot`, `shutdown`, `error`, `oops`, `interrupt`, `compact`, `permission` — rare enough to delight.
