# poptunes — Clips

The sound library. Each clip is a file in `sounds/` tagged with one or more **moods**.
An event (see `EVENTS.md`) asks for a mood; at play time poptunes picks a **random**
clip tagged with that mood. So:

- **Many clips, one event:** tag several clips with the same mood → they rotate at random.
- **Adding a clip later:** drop the file in `sounds/`, add a row below with its mood(s). It instantly becomes eligible for every event that accepts that mood — no code change. *That tag is the "which event does this belong to" decision.*
- A clip can carry several moods and play across several events (e.g. a sad clip serves `error`, `interrupt`, `tests-fail`, and `oops`).

## Mood vocabulary (the single source of truth)

This list is the glue between `EVENTS.md` and this file. Tag every clip with one or more.

| Mood | Feeling / use | Example events |
|---|---|---|
| `boot` | power-on, "I'm awake" nostalgia | `boot`, `shutdown` |
| `shutdown` | power-off, winding down | `shutdown` |
| `ring` | phone/notification ring — the popUpi signature | `tool` |
| `hype` | let's-go, excitement, launch | `submit`, `push`, `spawn` |
| `reward` | success, win, task complete | `done`, `commit`, `tests-pass` |
| `sad` | disappointment, failure, caught-wrong | `error`, `interrupt`, `tests-fail`, `oops` |
| `error` | something broke (harsher than `sad`) | `error` |
| `think` | contemplative, working, waiting | `think` |
| `alert` | attention needed | `permission`, `danger` |
| `destructive` | danger, big warning | `danger` |
| `whoosh` | transition, reset, wipe | `compact`, `push` |
| `type` | keystrokes, writing | `edit` |
| `connect` | reaching out to the world | `search` |
| `kaching` | money / payoff | `commit` |
| `scratch` | abrupt stop | `interrupt` |
| `pop` | tiny acknowledgement blip | `mention` |
| `meme` | generic funny reaction (manual soundboard) | `soundboard` |

## In the box (files we have)

| File | What it is | Moods | ~Length | Plays for |
|---|---|---|---|---|
| `sounds/launch.wav` | placeholder ascending chime | `boot` | 0.4s | `boot` |
| `sounds/ring.wav` | placeholder phone ring-ring | `ring` | 0.9s | `tool` |
| `sounds/fahhhhhhhhhhhhhh.mp3` | "fahhh" shock meme | `error`, `sad` | ~2s | `error` (+ `interrupt`, `tests-fail`) |
| `sounds/tf_nemesis.mp3` | dramatic/sad sting | `sad` | ~2s | `oops` (+ `interrupt`, `tests-fail`) |

> The two `.wav`s are placeholders — replace with real clips carrying the same mood.

## Wishlist — sourcing ideas by mood

Grab these yourself (myinstants, Voicy, soundboard sites) for personal use, drop into
`sounds/`, then add a row above with the mood shown. Names are just pointers to the vibe.

| Mood | Clip ideas |
|---|---|
| `boot` | Nokia power-on tone · Windows XP startup · PlayStation 2 boot |
| `shutdown` | Nokia power-off · Windows XP shutdown |
| `ring` | classic Nokia/landline ring · a UPI-payment-style jingle |
| `hype` | Mario "let's-a-go" · stadium crowd roar · "Siuuu" (Ronaldo) · "Arey bhai bhai bhai" |
| `reward` | Mario coin / 1-up · Zelda puzzle-solved · Mickey Mouse "Oh Toodles" line · a clean success ding |
| `sad` | sad trombone (womp womp) · Price-is-Right losing horn · "fahhh" · "Eh eh eh ehhhh" (fail) |
| `error` | Windows XP error chord · harsh buzzer |
| `think` | the contemplative Winnie-the-Pooh "think, think, think" tune · Jeopardy thinking music |
| `alert` | doorbell · knock-knock · soft notification ding |
| `destructive` | air-raid siren · dramatic "danger" sting |
| `whoosh` | reset/transition whoosh · tape-rewind |
| `type` | typewriter clack · mechanical-keyboard burst |
| `connect` | dial-up modem handshake |
| `kaching` | cash-register ka-ching · coin drop |
| `scratch` | vinyl record scratch |
| `pop` | bubble pop |
| `meme` | your whole screenshot board — "Siuuu", "Bruh", "Duck", "Get outtt", "Hey Prabhuuu", "Malik thoda galti", etc. (one `/command` each) |

---

### How selection will work (planned)
1. An event resolves its **accepted moods** (priority order, from `EVENTS.md`).
2. Collect every in-box clip tagged with the first accepted mood.
3. Pick one at **random** and play it. If none, fall through to the next accepted mood.
4. `/poptunes` mutes everything; manual `/`-commands play even while muted.

> Today the mod uses a fixed one-clip-per-event map. This random+mood system is the
> upgrade these two files specify — when we build it, these tables are the spec.
