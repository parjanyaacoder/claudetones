#!/usr/bin/env bash
# claudetones demo reel — walks a session through the 7 universal events in order,
# playing each event's current Free clip. It mirrors the mood->clip mapping in
# hooks/logic.ts, so it shows exactly what you'd hear live. Pass --pro to hear the
# 💎 Pro clips instead (the ones /claudetones unlock turns on).
#
# Run it:        bash ~/Desktop/claudetones/demo.sh
# Pro clips:     bash ~/Desktop/claudetones/demo.sh --pro
# In a new tab:  bash ~/Desktop/claudetones/demo.sh --new-window
set -u

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
P="$DIR/sounds"

MODE=free
case "${1:-}" in
  --pro) MODE=pro ;;
  --new-window|--new-tab)
    osascript -e "tell application \"Terminal\" to do script \"bash '$DIR/demo.sh'\"" \
              -e 'tell application "Terminal" to activate' >/dev/null
    exit 0 ;;
esac

step() { printf '\n\033[1m%s\033[0m\n' "$1"; }   # bold header
sub()  { printf '   \033[2m%s\033[0m\n' "$1"; }   # dim detail
pause() { sleep "${1:-0.6}"; }

# play <free-file> <pro-file>
play() {
  local f="$P/$1"
  [[ "$MODE" == pro ]] && f="$P/$2"
  if [[ -f "$f" ]]; then afplay "$f"; else sub "🔇 (file missing: $(basename "$f"))"; fi
}

clear
cat <<BANNER
  ============================================
     claudetones  —  demo reel  [${MODE}]
     the 7 universal events
  ============================================
BANNER
pause 0.8

step "1 . A session opens"
sub  "event: session_start   (session.start)"
play launch.wav windows-xp-startup.mp3
pause

step "2 . Claude starts thinking"
sub  "event: reasoning   (turn.start)"
play ring.wav c418-stranger-think.mp3
pause

step "3 . ...and is still thinking 8s later"
sub  "event: long_reasoning   (turn.start + 8s timer)"
play timer.mp3 jeopardy-themelq.mp3
pause

step "4 . A shell command runs"
sub  "event: terminal_command   (tool.call {tool: Bash})"
play keyboard-click.mp3 counter-strike-ok-lets-go.mp3
pause

step "5 . Any other tool runs"
sub  "event: tool_call   (tool.call)"
play ring.wav metal-gear-alert.mp3
pause

step "6 . A command fails"
sub  "event: error   (tool.call -> isError)"
play error.wav fahhhhhhhhhhhhhh.mp3
pause

step "7 . Claude finishes its reply"
sub  "event: done   (turn.complete)"
play ding-sound-effect-1.mp3 gta-san-andreas-mission-complete.mp3
pause

step "8 . You catch Claude being wrong:   /oops"
sub  "event: oops   (manual)"
play tf_nemesis.mp3 fahhhhhhhhhhhhhh.mp3
pause

printf '\n\033[1m[done] demo complete\033[0m\n'
sub "Free clips ship in the mod; Pro clips turn on with: /claudetones unlock CLAUDETONES-XXXX-YYYY"
