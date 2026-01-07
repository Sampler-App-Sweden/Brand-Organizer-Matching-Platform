# Supabase Edge Functions Deployment Script
# Run this script with PowerShell
# Usage: .\deploy-functions.ps1 [function-name] or .\deploy-functions.ps1 all

param(
    [string]$FunctionName = "all"
)

Write-Host "Setting Supabase access token..." -ForegroundColor Green
$env:SUPABASE_ACCESS_TOKEN = "sbp_ca1cec491850f301a93ff4008035d7df16d1ad1b"

if ($FunctionName -eq "all" -or $FunctionName -eq "") {
    Write-Host ""
    Write-Host "Deploying all edge functions..." -ForegroundColor Yellow
    Write-Host ""

    Write-Host "[1/9] Deploying admin-operations..." -ForegroundColor Cyan
    npx supabase functions deploy admin-operations --project-ref cbqoveptykptzlkahamd

    Write-Host "[2/9] Deploying ai-assistant..." -ForegroundColor Cyan
    npx supabase functions deploy ai-assistant --project-ref cbqoveptykptzlkahamd

    Write-Host "[3/9] Deploying export-data..." -ForegroundColor Cyan
    npx supabase functions deploy export-data --project-ref cbqoveptykptzlkahamd

    Write-Host "[4/9] Deploying generate-matches..." -ForegroundColor Cyan
    npx supabase functions deploy generate-matches --project-ref cbqoveptykptzlkahamd

    Write-Host "[5/9] Deploying get-storage-config..." -ForegroundColor Cyan
    npx supabase functions deploy get-storage-config --project-ref cbqoveptykptzlkahamd

    Write-Host "[6/9] Deploying process-payment..." -ForegroundColor Cyan
    npx supabase functions deploy process-payment --project-ref cbqoveptykptzlkahamd

    Write-Host "[7/9] Deploying send-email..." -ForegroundColor Cyan
    npx supabase functions deploy send-email --project-ref cbqoveptykptzlkahamd

    Write-Host "[8/9] Deploying track-analytics..." -ForegroundColor Cyan
    npx supabase functions deploy track-analytics --project-ref cbqoveptykptzlkahamd

    Write-Host "[9/9] Deploying upload-file..." -ForegroundColor Cyan
    npx supabase functions deploy upload-file --project-ref cbqoveptykptzlkahamd

    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "All functions deployed successfully!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Functions are available at:" -ForegroundColor Cyan
    Write-Host "https://cbqoveptykptzlkahamd.supabase.co/functions/v1/[function-name]" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deploying $FunctionName function..." -ForegroundColor Yellow
    npx supabase functions deploy $FunctionName --project-ref cbqoveptykptzlkahamd

    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Function $FunctionName deployed successfully!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "Available at:" -ForegroundColor Cyan
    Write-Host "https://cbqoveptykptzlkahamd.supabase.co/functions/v1/$FunctionName" -ForegroundColor Cyan
}
