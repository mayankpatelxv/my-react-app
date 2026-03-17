# OAuth Setup Guide for BizBuddy

## Overview
BizBuddy now supports Google and Facebook OAuth login in addition to email/password authentication.

## What's Been Implemented

### 1. Frontend Changes
- **LoginPage.js**: Added Google and Facebook login buttons with handlers
- **LoginPage.css**: Added styles for social login buttons and divider
- **supabaseClient.js**: Added OAuth functions:
  - `signInWithGoogle()` - Initiates Google OAuth flow
  - `signInWithFacebook()` - Initiates Facebook OAuth flow
  - `handleOAuthCallback()` - Processes OAuth response and syncs with users_data table
- **App.js**: Updated to detect and handle OAuth callbacks

### 2. How It Works
1. User clicks "Google" or "Facebook" button
2. User is redirected to provider's OAuth page
3. After authentication, user is redirected back to `/my-react-app/dashboard`
4. App detects OAuth callback and creates/updates user in `users_data` table
5. User is logged in and redirected to dashboard

## Supabase Configuration Required

### Step 1: Enable Google OAuth

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `wgnvnlhklwanqzcusxxv`
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to configure
5. Enable the provider
6. Add these settings:
   - **Redirect URL**: Copy the provided Supabase redirect URL
   - **Site URL**: `http://localhost:3000/my-react-app`
   - **Redirect URLs**: Add `http://localhost:3000/my-react-app/dashboard`

7. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: Add the Supabase redirect URL from step 6
   - Copy **Client ID** and **Client Secret**
   
8. Paste Client ID and Client Secret in Supabase Google provider settings
9. Click **Save**

### Step 2: Enable Facebook OAuth

1. In Supabase Dashboard, find **Facebook** provider
2. Enable the provider
3. Add these settings:
   - **Redirect URL**: Copy the provided Supabase redirect URL
   - **Site URL**: `http://localhost:3000/my-react-app`
   - **Redirect URLs**: Add `http://localhost:3000/my-react-app/dashboard`

4. Get Facebook OAuth credentials:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or select existing
   - Add **Facebook Login** product
   - Go to **Settings** → **Basic**
   - Copy **App ID** and **App Secret**
   - In **Facebook Login** → **Settings**:
     - Valid OAuth Redirect URIs: Add the Supabase redirect URL from step 3
   
5. Paste App ID and App Secret in Supabase Facebook provider settings
6. Click **Save**

### Step 3: Update Supabase Site URL (Important!)

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000/my-react-app`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/my-react-app/dashboard`
   - `http://localhost:3000/my-react-app/login`

## Testing OAuth Login

1. Make sure your development server is running:
   ```bash
   cd my-react-app
   npm start
   ```

2. Navigate to: `http://localhost:3000/my-react-app/login`

3. Click "Google" or "Facebook" button

4. Complete authentication on provider's page

5. You should be redirected back to dashboard and logged in

## Production Deployment

When deploying to production:

1. Update OAuth provider settings with production URLs
2. Update Supabase Site URL and Redirect URLs with production domain
3. Update Google/Facebook OAuth settings with production redirect URIs
4. Update the redirect URL in `supabaseClient.js`:
   ```javascript
   redirectTo: `https://yourdomain.com/my-react-app/dashboard`
   ```

## Troubleshooting

### OAuth redirect not working
- Check that Site URL and Redirect URLs are correctly configured in Supabase
- Verify OAuth provider redirect URIs match Supabase redirect URL
- Check browser console for errors

### User not created in users_data table
- Check Supabase logs in Dashboard → Logs
- Verify `handleOAuthCallback()` function is being called
- Check that users_data table has correct permissions

### "Invalid redirect URL" error
- Ensure the redirect URL in code matches what's configured in Supabase
- Check that OAuth provider has the correct redirect URI

## Database Schema

OAuth users are stored in the same `users_data` table with:
- `email`: User's email from OAuth provider
- `name`: Full name from OAuth provider
- `first_name`: Given name (if available)
- `last_name`: Family name (if available)
- `auth_token`: Set to 'OAUTH_USER' to identify OAuth users
- `password_hashed`: Set to true

## Security Notes

- OAuth users cannot use email/password login (auth_token is 'OAUTH_USER')
- Email/password users can be migrated to OAuth if they use the same email
- All authentication is handled securely by Supabase Auth
- No passwords are stored for OAuth users
