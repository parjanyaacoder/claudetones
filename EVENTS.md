# claudetones — Events

The seven events every developer hits in a session, plus one manual button. An event
does **not** name a file — it asks for one or more **moods**. At play time we pick a
random *entitled* clip tagged with a matching mood (see `CLIPS.md`): the free clip by
default, and the paid clip instead once Pro is unlocked. A new clip joins an event
just by carrying its mood.

- **Moods** are the shared vocabulary between this file and `CLIPS.md` — defined once in `CLIPS.md`.
- **Accepted moods** are listed in priority order: if no entitled clip of the first mood exists, fall back to the next.
- **Tier:** `free` ships in the mod; `paid` activates after `/claudetones unlock <key>`.
- **Frequency** matters more than anything: a sound on a *very frequent* event becomes noise fast. `terminal_command` and `tool_call` fire constantly, so they play at a lower gain (`GAIN` in `logic.ts`) — and everything is killable with `/claudetones`.

## The 7 universal events

| # | Event key | Engine hook | Fires when | Frequency | Accepted moods | 🆓 Free | 💎 Pro |
|---|---|---|---|---|---|---|---|
| 1 | `session_start` | `session.start` | a session opens | once/session | `boot` | `launch.wav` | `windows-xp-startup.mp3` |
| 2 | `reasoning` | `turn.start` | Claude begins working on your turn | frequent | `think` | `ring.wav` | `c418-stranger-think.mp3` |
| 3 | `long_reasoning` | `turn.start` + 8s timer | a turn is still going after 8s | occasional | `ponder` | `timer.mp3` | `jeopardy-themelq.mp3` |
| 4 | `terminal_command` | `tool.call {tool: Bash}` | a shell command runs | **very frequent** | `type` | `keyboard-click.mp3` | `counter-strike-ok-lets-go.mp3` |
| 5 | `tool_call` | `tool.call` (any other tool) | a non-Bash tool runs | **very frequent** | `ring` | `ring.wav` | `metal-gear-alert.mp3` |
| 6 | `error` | `tool.call` → result `isError` | a tool/command fails | occasional | `error`, `sad` | `error.wav` | `fahhhhhhhhhhhhhh.mp3` |
| 7 | `done` | `turn.complete` | Claude finishes its reply | frequent | `reward` | `ding-sound-effect-1.mp3` | `gta-san-andreas-mission-complete.mp3` |

## Manual (you fire them — a slash command)

| Event key | Trigger | Fires when | Accepted moods | 🆓 Free | 💎 Pro |
|---|---|---|---|---|---|
| `oops` | `/oops` | you caught Claude being wrong | `sad` | `tf_nemesis.mp3` | `fahhhhhhhhhhhhhh.mp3` |

## Commands

| Command | What it does |
|---|---|
| `/claudetones` | toggle mute on/off (persists across sessions) |
| `/claudetones unlock <key>` | verify a key and activate the Pro pack |
| `/oops` | play the sad sound, even while muted |

---

### Notes
- **Choosing free vs. paid:** with Pro locked only `free` clips are eligible; once `/claudetones unlock` stores a license, a `paid` clip wins over its free sibling for the same mood.
- **`long_reasoning`** is scheduled from `turn.start` with `$.clock.after(8000)` and cancelled on `turn.complete` / `turn.abort`, so the tick only lands on a genuinely slow turn.
- **Never wired:** `turn.step`, `prompt.edit` — they fire constantly.
- **Deliberately quiet:** `terminal_command` (gain 0.5) and `tool_call` (gain 0.55). Everything else plays at 1.
