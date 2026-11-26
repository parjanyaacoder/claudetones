#!/bin/bash
set -e

echo ""
echo "🎵 Installing claudetones for Claude Code..."
echo ""

if ! command -v claude &> /dev/null; then
  echo "❌ Error: 'claude' CLI not found in your PATH."
  echo "Please make sure Claude Code is installed first:"
  echo "  npm install -g @anthropic-ai/claude-code"
  exit 1
fi

echo "📦 Adding marketplace (parjanyaacoder/claudetones)..."
claude plugin marketplace add parjanyaacoder/claudetones

echo "🎧 Installing plugin (claudetones)..."
claude plugin install claudetones

echo ""
echo "✅ claudetones successfully installed!"
echo "Next time you launch 'claude', you will hear your acoustic feedback."
echo "Audition live soundboards: https://claudetones.vercel.app"
echo ""
