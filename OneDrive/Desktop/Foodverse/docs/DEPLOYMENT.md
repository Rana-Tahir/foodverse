# Foodverse Deployment Guide

This guide outlines the steps to deploy Foodverse to production using **Vercel** (hosting) and **Supabase** (database & authentication).

---

## 1. Supabase Production Setup

1. **Create a Supabase Project**:
   - Go to [Supabase Dashboard](https://app.supabase.com) and create a new project.
   - Choose a secure database password and select the region closest to your users (e.g., Frankfurt or Singapore for South Asia).

2. **Obtain API Keys**:
   - Navigate to **Project Settings > API**.
   - Copy your `Project URL`, `anon / public key`, and `service_role key`.

3. **Apply Database Migrations**:
   - Run all migrations from `supabase/migrations/` in order (001 through 010) via the Supabase SQL Editor or Supabase CLI:
     ```bash
     supabase link --project-ref your-project-ref
     supabase db push
     ```
   - Verify that all tables (`profiles`, `addresses`, `restaurants`, `rider_profiles`, `menu_categories`, `menu_items`, `orders`, `order_items`, `order_status_history`, `delivery_assignments`, `reviews`, `admin_audit_log`) are successfully created with Row Level Security (RLS) enabled.

---

## 2. Vercel Deployment

1. **Connect Repository**:
   - Import your GitHub repository into [Vercel](https://vercel.com).
   - Select the `main` branch as the production branch.

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Configure Environment Variables**:
   In your Vercel project settings under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., `https://foodverse.vercel.app`)

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build and deploy your application.

---

## 3. Post-Deployment Verification

1. **Smoke Tests**:
   - Verify user registration and login (`/auth/login`, `/auth/signup`).
   - Test restaurant discovery and search on the homepage (`/`).
   - Place a test order through cart and checkout (`/checkout`).
   - Test restaurant owner dashboard (`/restaurant/dashboard`).
   - Test rider workflow (`/rider/dashboard`).
   - Test administrator dashboard (`/admin/dashboard`).
   - Test support chatbot widget interaction.

2. **Monitoring**:
   - Check Vercel deployment logs for any runtime errors.
   - Monitor Supabase database health and connection pooling in the Supabase dashboard.
