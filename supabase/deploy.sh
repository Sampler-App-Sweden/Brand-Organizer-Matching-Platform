#!/bin/bash

# Deploy all Supabase Edge Functions
# Usage: ./deploy.sh [function-name] or ./deploy.sh all

set -e

echo "🚀 Deploying Supabase Edge Functions..."

if [ "$1" == "all" ] || [ -z "$1" ]; then
  echo "📦 Deploying all functions..."
  echo ""

  echo "[1/9] → Deploying admin-operations..."
  supabase functions deploy admin-operations

  echo "[2/9] → Deploying ai-assistant..."
  supabase functions deploy ai-assistant

  echo "[3/9] → Deploying export-data..."
  supabase functions deploy export-data

  echo "[4/9] → Deploying generate-matches..."
  supabase functions deploy generate-matches

  echo "[5/9] → Deploying get-storage-config..."
  supabase functions deploy get-storage-config

  echo "[6/9] → Deploying process-payment..."
  supabase functions deploy process-payment

  echo "[7/9] → Deploying send-email..."
  supabase functions deploy send-email

  echo "[8/9] → Deploying track-analytics..."
  supabase functions deploy track-analytics

  echo "[9/9] → Deploying upload-file..."
  supabase functions deploy upload-file

  echo ""
  echo "✅ All 9 functions deployed successfully!"
else
  echo "📦 Deploying $1..."
  supabase functions deploy "$1"
  echo "✅ Function $1 deployed successfully!"
fi

echo ""
echo "🔍 View logs with: supabase functions logs [function-name]"
echo "🌐 Functions are live at: https://cbqoveptykptzlkahamd.supabase.co/functions/v1/[function-name]"
