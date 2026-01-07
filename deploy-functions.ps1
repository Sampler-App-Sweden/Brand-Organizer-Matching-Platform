# Supabase Edge Functions Deployment Script
# Run this script with PowerShell

Write-Host "Setting Supabase access token..." -ForegroundColor Green
$env:SUPABASE_ACCESS_TOKEN = "sbp_ca1cec491850f301a93ff4008035d7df16d1ad1b"

Write-Host "Deploying upload-file function..." -ForegroundColor Green
npx supabase functions deploy upload-file --project-ref cbqoveptykptzlkahamd

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "The upload-file function should now be available at:" -ForegroundColor Cyan
Write-Host "https://cbqoveptykptzlkahamd.supabase.co/functions/v1/upload-file" -ForegroundColor Cyan
