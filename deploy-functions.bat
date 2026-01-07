@echo off
REM Supabase Edge Functions Deployment Script
REM Deploy all edge functions or a specific one
REM Usage: deploy-functions.bat [function-name] or deploy-functions.bat all

echo Setting Supabase access token...
set SUPABASE_ACCESS_TOKEN=sbp_ca1cec491850f301a93ff4008035d7df16d1ad1b

if "%1"=="" goto deploy_all
if "%1"=="all" goto deploy_all
goto deploy_single

:deploy_all
echo.
echo Deploying all edge functions...
echo.

echo [1/9] Deploying admin-operations...
npx supabase functions deploy admin-operations --project-ref cbqoveptykptzlkahamd

echo [2/9] Deploying ai-assistant...
npx supabase functions deploy ai-assistant --project-ref cbqoveptykptzlkahamd

echo [3/9] Deploying export-data...
npx supabase functions deploy export-data --project-ref cbqoveptykptzlkahamd

echo [4/9] Deploying generate-matches...
npx supabase functions deploy generate-matches --project-ref cbqoveptykptzlkahamd

echo [5/9] Deploying get-storage-config...
npx supabase functions deploy get-storage-config --project-ref cbqoveptykptzlkahamd

echo [6/9] Deploying process-payment...
npx supabase functions deploy process-payment --project-ref cbqoveptykptzlkahamd

echo [7/9] Deploying send-email...
npx supabase functions deploy send-email --project-ref cbqoveptykptzlkahamd

echo [8/9] Deploying track-analytics...
npx supabase functions deploy track-analytics --project-ref cbqoveptykptzlkahamd

echo [9/9] Deploying upload-file...
npx supabase functions deploy upload-file --project-ref cbqoveptykptzlkahamd

echo.
echo ===============================================
echo All functions deployed successfully!
echo ===============================================
echo Functions are available at:
echo https://cbqoveptykptzlkahamd.supabase.co/functions/v1/[function-name]
echo.
goto end

:deploy_single
echo.
echo Deploying %1 function...
npx supabase functions deploy %1 --project-ref cbqoveptykptzlkahamd
echo.
echo ===============================================
echo Function %1 deployed successfully!
echo ===============================================
echo Available at:
echo https://cbqoveptykptzlkahamd.supabase.co/functions/v1/%1
echo.
goto end

:end
pause
