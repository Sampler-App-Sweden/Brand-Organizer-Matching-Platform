# Supabase Edge Functions Deployment Script
# Run this script with PowerShell
# Usage: .\deploy-functions.ps1 [function-name] or .\deploy-functions.ps1 all

param(
    [string]$FunctionName = "all"
)

Write-Host "Setting Supabase access token..." -ForegroundColor Green
# Set your SUPABASE_ACCESS_TOKEN environment variable before running this script
# Example: $env:SUPABASE_ACCESS_TOKEN = "your_token_here"
if (-not $env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "ERROR: SUPABASE_ACCESS_TOKEN environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it before running this script." -ForegroundColor Yellow
    exit 1
}

if ($FunctionName -eq "all" -or $FunctionName -eq "") {
    Write-Host ""
    Write-Host "Deploying all edge functions..." -ForegroundColor Yellow
    Write-Host ""

    Write-Host "[1/9] Deploying admin-operations..." -ForegroundColor Cyan
    npx supabase functions deploy admin-operations --project-ref YOUR_PROJECT_REF

    Write-Host "[2/9] Deploying ai-assistant..." -ForegroundColor Cyan
    npx supabase functions deploy ai-assistant --project-ref YOUR_PROJECT_REF

    Write-Host "[3/9] Deploying export-data..." -ForegroundColor Cyan
    npx supabase functions deploy export-data --project-ref YOUR_PROJECT_REF

    Write-Host "[4/9] Deploying generate-matches..." -ForegroundColor Cyan
    npx supabase functions deploy generate-matches --project-ref YOUR_PROJECT_REF

    Write-Host "[5/9] Deploying get-storage-config..." -ForegroundColor Cyan
    npx supabase functions deploy get-storage-config --project-ref YOUR_PROJECT_REF

    Write-Host "[6/9] Deploying process-payment..." -ForegroundColor Cyan
    npx supabase functions deploy process-payment --project-ref YOUR_PROJECT_REF

    Write-Host "[7/9] Deploying send-email..." -ForegroundColor Cyan
    npx supabase functions deploy send-email --project-ref YOUR_PROJECT_REF

    Write-Host "[8/9] Deploying track-analytics..." -ForegroundColor Cyan
    npx supabase functions deploy track-analytics --project-ref YOUR_PROJECT_REF

    Write-Host "[9/9] Deploying upload-file..." -ForegroundColor Cyan
    npx supabase functions deploy upload-file --project-ref YOUR_PROJECT_REF

    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "All functions deployed successfully!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Functions are available at:" -ForegroundColor Cyan
    Write-Host "https://YOUR_PROJECT_REF.supabase.co/functions/v1/[function-name]" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deploying $FunctionName function..." -ForegroundColor Yellow
    npx supabase functions deploy $FunctionName --project-ref YOUR_PROJECT_REF

    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Function $FunctionName deployed successfully!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Available at:" -ForegroundColor Cyan
    Write-Host "https://YOUR_PROJECT_REF.supabase.co/functions/v1/$FunctionName" -ForegroundColor Cyan
}
