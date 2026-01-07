@echo off
REM Supabase Edge Functions Deployment Script

echo Setting Supabase access token...
set SUPABASE_ACCESS_TOKEN=sbp_ca1cec491850f301a93ff4008035d7df16d1ad1b

echo Deploying upload-file function...
npx supabase functions deploy upload-file --project-ref cbqoveptykptzlkahamd

echo.
echo Deployment complete!
echo The upload-file function should now be available at:
echo https://cbqoveptykptzlkahamd.supabase.co/functions/v1/upload-file

pause
