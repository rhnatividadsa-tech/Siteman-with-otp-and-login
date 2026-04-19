# BayaniHub Site Manager Dashboard

This repository contains the integrated full-stack codebase for the BayaniHub Site Manager Dashboard. It consists of a **Next.js frontend** for the dashboard UI and a custom **NestJS backend** that handles Nodemailer verification codes and Supabase Administrative password resets.

---

## ⚙️ 1. Environment Setup
Before running the project, you need to configure your environment variables for both the frontend and backend.

### Frontend Credentials (`/.env.local`)
Create a `.env.local` file directly inside the root folder (`site-manager-updated-main/`) and input your Supabase details:
```env
# /site-manager-updated-main/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003
```

### Backend Credentials (`/backend/.env`)
Create a `.env` file inside the `backend/` folder. This holds your administrative keys and your email provider setup (for Nodemailer):
```env
# /site-manager-updated-main/backend/.env
PORT=3003
NODE_ENV=development

# Supabase Secure Keys
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-secret-service-role-key>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_JWT_SECRET=<your-jwt-secret>

# Origins allowed to talk to the backend
CORS_ORIGINS=http://localhost:3000,http://localhost:3002

# Nodemailer Credentials (Needed for OTP emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
```

---

## 📦 2. Installation

This project has two separate environments. Install dependencies for both:

### Step 1: Install Root Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 🚀 3. Running the Project

### First Time Setup
Before running the project, build the backend once:
```bash
cd backend
npm run build
cd ..
```

### Start Development Servers
Run both frontend and backend with a single command from the root folder:
```bash
npm run dev
```

**What this does:**
- ✅ Starts **Next.js frontend** on `http://localhost:3000`
- ✅ Starts **NestJS backend** on `http://localhost:3003`
- ✅ Both servers watch for file changes and auto-reload
- ✅ Both run simultaneously in the same terminal

Visit `http://localhost:3000` in your browser to access the dashboard.

### Stopping the Servers
Press `Ctrl+C` in the terminal to stop both servers.

### Restarting After Closing
Simply run from the root folder again:
```bash
npm run dev
```

---

## ⚠️ Troubleshooting

### Port 3003 Already in Use
If you see `Error: listen EADDRINUSE: address already in use :::3003`, run:
```bash
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
```
Then restart with `npm run dev`.

### Don't Run Backend Separately
While `npm run dev` is running from the root folder, **don't** run anything in the backend folder. The backend is already started by the root dev command. Running it separately will cause a port conflict.
