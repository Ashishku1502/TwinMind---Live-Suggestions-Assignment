#!/bin/bash

echo "🚀 MeetingMind AI Assistant - Vercel Deployment Script"
echo "======================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🔐 Step 1: Login to Vercel"
echo "This will open your browser for authentication..."
echo ""

vercel login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi

echo ""
echo "✅ Login successful!"
echo ""
echo "🚀 Step 2: Deploying to Vercel..."
echo ""

vercel --yes

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check the error above."
    exit 1
fi

echo ""
echo "✅ Initial deployment successful!"
echo ""
echo "🔑 Step 3: Adding Environment Variable"
echo "You need to add your GROQ_API_KEY manually:"
echo ""
echo "Run this command:"
echo "  vercel env add GROQ_API_KEY production"
echo ""
echo "When prompted, paste this key:"
echo "  [YOUR_GROQ_API_KEY]"
echo ""
echo "Then also add it for preview and development:"
echo "  vercel env add GROQ_API_KEY preview"
echo "  vercel env add GROQ_API_KEY development"
echo ""
echo "After adding the environment variables, run:"
echo "  vercel --prod"
echo ""
echo "🎉 Your app will be live!"
