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
Because there are two environments (Frontend and Backend), you need to install the dependencies for both.

1. Install Frontend dependencies (at root):
```bash
npm install
```
2. Install Backend dependencies:
```bash
cd backend
npm install
```

---

## 🚀 3. Initial Build & Startup

Sometimes, the NestJS compiler cache triggers "Cannot find module 'dist/main'" errors during development. To prevent this, build the backend manually the first time:

1. **Build the Backend**
```bash
cd backend
npm run build
```

2. **Run Everything Together!**
Head back to the root folder. The `concurrently` script inside `package.json` allows you to spin up **both** the Next.js UI and the NestJS Backend using a single command:
```bash
cd ..
npm run dev
```

*This will start your backend API on `http://localhost:3003` and the frontend UI on `http://localhost:3000`. Open `http://localhost:3000` in your browser to log in.*
