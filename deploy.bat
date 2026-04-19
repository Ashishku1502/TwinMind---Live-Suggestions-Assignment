@echo off
echo ========================================================
echo 🚀 MeetingMind AI Assistant - Vercel Deployment Script
echo ========================================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
    echo ✅ Vercel CLI installed
) else (
    echo ✅ Vercel CLI already installed
)

echo.
echo 🔐 Step 1: Login to Vercel
echo This will open your browser for authentication...
echo.

call vercel login

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Login failed. Please try again.
    pause
    exit /b 1
)

echo.
echo ✅ Login successful!
echo.
echo 🚀 Step 2: Deploying to Vercel...
echo.

call vercel --yes

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed. Please check the error above.
    pause
    exit /b 1
)

echo.
echo ✅ Initial deployment successful!
echo.
echo 🔑 Step 3: Adding Environment Variable
echo You need to add your GROQ_API_KEY manually:
echo.
echo Run this command:
echo   vercel env add GROQ_API_KEY production
echo.
echo When prompted, paste this key:
echo   [YOUR_GROQ_API_KEY]
echo.
echo Then also add it for preview and development:
echo   vercel env add GROQ_API_KEY preview
echo   vercel env add GROQ_API_KEY development
echo.
echo After adding the environment variables, run:
echo   vercel --prod
echo.
echo 🎉 Your app will be live!
echo.
pause
