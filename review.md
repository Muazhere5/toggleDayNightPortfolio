# Vercel Deployment Cheat Sheet

## 1. Environment Variables Checklist
Copy and paste the exact keys below into your Vercel Project Settings (Settings > Environment Variables) before deploying. Ensure you add the corresponding secret values from your local `.env.local` file.

### Firebase Configuration
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

### EmailJS Setup
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

---

## 2. Build & Framework Configuration

Vercel will automatically detect most settings, but you should verify these during the project setup phase:

- **Framework Preset**: `Next.js` (Vercel will auto-detect this).
- **Build Command**: `npm run build` (This maps to `next build` in your `package.json`).
- **Install Command**: `npm install` (Standard npm install).
- **Node.js Version**: `20.x` (Recommended by Vercel; ensure this is selected in Settings > General > Node.js Version).

---

## 3. 🚨 Deployment Safety Reminder
Before pushing any final changes to your remote repository, ensure your `.env.local` file is explicitly listed in your `.gitignore` file (which we verified earlier with `.env*`). 

**Never commit your actual secret values to GitHub!** Vercel handles securely injecting these variables during the build process via the dashboard configuration you complete in Step 1.
