# Deploy to Vercel

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - In project settings, go to "Environment Variables"
   - Add: `GROQ_API_KEY` = `[YOUR_GROQ_API_KEY]`
   - Apply to: Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd meeting-assistant
   vercel
   ```

4. **Add Environment Variable**:
   ```bash
   vercel env add GROQ_API_KEY
   ```
   Paste your API key when prompted.

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Important Notes

- **Environment Variables**: Make sure `GROQ_API_KEY` is set in Vercel dashboard
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)
- **Framework**: Next.js 14.2.5

## Microphone Access

The app requires microphone access. Make sure:
- Your domain uses HTTPS (Vercel provides this automatically)
- Users grant microphone permission when prompted

## Post-Deployment

After deployment:
1. Visit your Vercel URL
2. Click "START RECORDING"
3. Allow microphone access
4. Start speaking to test transcription

Your app is now live! 🎉
