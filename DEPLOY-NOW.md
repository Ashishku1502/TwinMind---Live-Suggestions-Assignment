# 🚀 Deploy to Vercel NOW

## Quick Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/meeting-assistant.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `meeting-assistant` repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

### Step 3: Add Environment Variable

**CRITICAL:** After deployment, add your API key:

1. Go to your project dashboard on Vercel
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `[YOUR_GROQ_API_KEY]`
   - **Environments:** Production, Preview, Development
4. Click **"Save"**
5. Go to **Deployments** → Click **"..."** → **"Redeploy"**

### Step 4: Test Your Live App

Your app will be live at: `https://your-project-name.vercel.app`

1. Visit the URL
2. Click "START RECORDING"
3. Allow microphone access
4. Start speaking!

---

## Alternative: Deploy Without GitHub

If you don't want to use GitHub:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the meeting-assistant folder
cd meeting-assistant
vercel

# Follow the prompts, then add environment variable:
vercel env add GROQ_API_KEY production

# Paste your API key when prompted

# Deploy to production
vercel --prod
```

---

## ✅ Your app is now live!

**Features working:**
- ✅ Real-time transcription
- ✅ AI suggestions every 30s
- ✅ Intent detection
- ✅ Interactive chat
- ✅ Export meeting data

**Share your live URL with anyone!**
