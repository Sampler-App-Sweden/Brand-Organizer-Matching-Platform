#!/bin/bash

# Deploy all Supabase Edge Functions
# Usage: ./deploy.sh [function-name] or ./deploy.sh all

set -e

echo "🚀 Deploying Supabase Edge Functions..."

if [ "$1" == "all" ] || [ -z "$1" ]; then
  echo "📦 Deploying all functions..."

  echo "  → Deploying generate-matches..."
  supabase functions deploy generate-matches

  echo "  → Deploying send-email..."
  supabase functions deploy send-email

  echo "  → Deploying process-payment..."
  supabase functions deploy process-payment

  echo "✅ All functions deployed successfully!"
else
  echo "📦 Deploying $1..."
  supabase functions deploy "$1"
  echo "✅ Function $1 deployed successfully!"
fi

echo ""
echo "🔍 View logs with: supabase functions logs [function-name]"
echo "🌐 Functions are live at: https://[your-project].supabase.co/functions/v1/[function-name]"
