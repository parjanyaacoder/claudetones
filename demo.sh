#!/usr/bin/env bash
# poptunes demo reel — walks a full Claude Code session from launch to quit,
# playing each event's current clip in order. It mirrors the mood->clip mapping in
# hooks/logic.ts, so it shows exactly what you'd hear live — including which events
# are still silent (no clip for their mood yet).
#
# Run it:        bash ~/Desktop/poptunes/demo.sh
# In a new tab:  bash ~/Desktop/poptunes/demo.sh --new-window
set -u

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
P="$DIR/sounds"

# Re-launch the demo in a fresh Terminal window, if asked.
if [[ "${1:-}" == "--new-window" || "${1:-}" == "--new-tab" ]]; then
  osascript -e "tell application \"Terminal\" to do script \"bash '$DIR/demo.sh'\"" \
            -e 'tell application "Terminal" to activate' >/dev/null
  exit 0
fi

step() { printf '\n\033[1m%s\033[0m\n' "$1"; }   # bold header
sub()  { printf '   \033[2m%s\033[0m\n' "$1"; }   # dim detail
pause() { sleep "${1:-0.6}"; }

play() { # play <file>
  local f="$P/$1"
  if [[ -f "$f" ]]; then afplay "$f"; else sub "🔇 (file missing: $1)"; fi
}
silent() { sub "🔇 silent — add a '$1' clip to hear this (see CLIPS.md)"; }

clear
cat <<'BANNER'
  ============================================
     poptunes  —  demo reel
     popUpi, but for Claude Code
  ============================================
BANNER
pause 0.8

step "1 . You open a terminal tab and type:   \$ claude"
sub  "event: boot   (session.start)"
play launch.wav
pause

step "2 . You type a prompt and hit enter"
sub  "event: submit   (prompt.submit)"
silent hype
pause

step "3 . Claude starts thinking"
sub  "event: think   (turn.start)"
silent think
pause

step "4 . Claude runs tools -- ring on every call"
sub  "event: tool   (tool.call)"
play ring.wav; pause 0.2; play ring.wav; pause 0.2; play ring.wav
pause

step "5 . A command fails"
sub  "event: error   (tool.call -> isError)"
play fahhhhhhhhhhhhhh.mp3
pause

step "6 . Claude finishes its reply"
sub  "event: done   (turn.complete)"
silent reward
pause

step "7 . You catch Claude being wrong:   /oops"
sub  "event: oops   (random 'sad' clip)"
SAD=(fahhhhhhhhhhhhhh.mp3 tf_nemesis.mp3)
play "${SAD[RANDOM % ${#SAD[@]}]}"
pause

step "8 . You quit the session"
sub  "event: shutdown   (session.end -> no 'shutdown' clip, falls back to 'boot')"
play launch.wav
pause

printf '\n\033[1m[done] demo complete\033[0m\n'
sub "Silent steps just need a clip tagged with that mood. Drop files in sounds/, tag them in hooks/logic.ts."
