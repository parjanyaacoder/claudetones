# claudetones — Clips

The sound library. Each clip is a file in `sounds/` tagged with one or more **moods**
and a **tier** (`free` or `paid`). An event (see `EVENTS.md`) asks for a mood; at play
time claudetones picks a **random** entitled clip tagged with that mood. So:

- **Free vs. paid:** only `free` clips play until `/claudetones unlock` stores a license; then a `paid` clip replaces its free sibling for the same mood.
- **Many clips, one mood:** tag several clips the same way → they rotate at random.
- **Adding a clip later:** drop the file in `sounds/`, add a row below with its mood(s) and tier. It instantly becomes eligible for every event that accepts that mood — no code change. *That tag is the "which event does this belong to" decision.*
- A clip can carry several moods and play across several events (e.g. a `sad` clip serves `error` and `oops`).

## Mood vocabulary (the single source of truth)

This list is the glue between `EVENTS.md` and this file. Tag every clip with one or more.

| Mood | Feeling / use | Example events |
|---|---|---|
| `boot` | power-on, "I'm awake" nostalgia | `session_start` |
| `think` | contemplative, working, waiting | `reasoning` |
| `ponder` | long wait, still thinking | `long_reasoning` |
| `type` | keystrokes, shell work | `terminal_command` |
| `ring` | phone/notification ring — the popUpi signature | `tool_call` |
| `error` | something broke | `error` |
| `reward` | success, win, task complete | `done` |
| `sad` | disappointment, caught-wrong | `error`, `oops` |

Reserved for later packs (the classifier may tag these; no live event uses them yet):
`shutdown`, `hype`, `alert`, `destructive`, `whoosh`, `connect`, `kaching`, `scratch`,
`pop`, `meme`.

## In the box (the MVP — the 7 universal events, 1 free + 1 paid each)

| File | What it is | Moods | Tier | Plays for |
|---|---|---|---|---|
| `sounds/launch.wav` | ascending chime | `boot` | 🆓 free | `session_start` |
| `sounds/windows-xp-startup.mp3` | Windows XP startup | `boot` | 💎 paid | `session_start` |
| `sounds/ring.wav` | soft blip / phone ring | `think`, `ring` | 🆓 free | `reasoning`, `tool_call` |
| `sounds/c418-stranger-think.mp3` | C418 — strange, contemplative | `think` | 💎 paid | `reasoning` |
| `sounds/timer.mp3` | clock tick | `ponder` | 🆓 free | `long_reasoning` |
| `sounds/jeopardy-themelq.mp3` | Jeopardy thinking music | `ponder` | 💎 paid | `long_reasoning` |
| `sounds/keyboard-click.mp3` | keyboard click | `type` | 🆓 free | `terminal_command` |
| `sounds/counter-strike-ok-lets-go.mp3` | CS "OK let's go" | `type` | 💎 paid | `terminal_command` |
| `sounds/metal-gear-alert.mp3` | Metal Gear `!` alert | `ring` | 💎 paid | `tool_call` |
| `sounds/error.wav` | clean error sting | `error` | 🆓 free | `error` |
| `sounds/fahhhhhhhhhhhhhh.mp3` | "fahhh" shock meme | `error`, `sad` | 💎 paid | `error`, `oops` |
| `sounds/ding-sound-effect-1.mp3` | success ding | `reward` | 🆓 free | `done` |
| `sounds/gta-san-andreas-mission-complete.mp3` | GTA mission complete | `reward` | 💎 paid | `done` |
| `sounds/tf_nemesis.mp3` | dramatic/sad sting | `sad` | 🆓 free | `oops` |

## Wishlist — sourcing ideas by mood

Grab these yourself (myinstants, Voicy, soundboard sites) for personal use, drop into
`sounds/`, then add a row above with the mood + tier shown. Names are just pointers to
the vibe. New clips flow straight into themed Pro packs.

| Mood | Clip ideas |
|---|---|
| `boot` | Nokia power-on tone · PlayStation 2 boot |
| `think` | Winnie-the-Pooh "think, think, think" tune |
| `ponder` | elevator music · dial-tone hum |
| `type` | typewriter clack · mechanical-keyboard burst |
| `ring` | Nokia/landline ring · UPI-payment jingle |
| `error` | Windows XP error chord · harsh buzzer |
| `reward` | Mario coin / 1-up · Zelda puzzle-solved · "Oh Toodles" |
| `sad` | sad trombone (womp womp) · Price-is-Right losing horn |

---

### How selection works
1. An event resolves its **accepted moods** (priority order, from `EVENTS.md`).
2. Collect the **entitled** clips for the first mood: `free` only, or `free`+`paid` when Pro is unlocked; a `paid` clip wins over its free sibling.
3. Pick one at **random** and play it. If none, fall through to the next accepted mood.
4. `/claudetones` mutes everything; the manual `/oops` plays even while muted.
