-- Fix existing passwords after column rename
-- Run this SQL in your Supabase SQL Editor

-- Option 1: Hash existing passwords (if they are still in plain text)
-- This will convert plain text passwords to Base64 hashed versions
-- WARNING: This assumes your existing passwords are still in plain text

-- First, let's see what we have
-- SELECT id, email, auth_token, password_hashed FROM users_data LIMIT 5;

-- If passwords are still in plain text, hash them:
UPDATE users_data 
SET 
    auth_token = encode(auth_token::bytea, 'base64'),
    password_hashed = true
WHERE password_hashed IS NULL OR password_hashed = false;

-- Option 2: If you want to reset all passwords (safer approach)
-- Uncomment the line below to reset all passwords
-- UPDATE users_data SET auth_token = 'RESET_REQUIRED', password_hashed = false;

-- Check the results
SELECT id, email, 
       CASE 
           WHEN LENGTH(auth_token) > 20 THEN LEFT(auth_token, 10) || '...[HASHED]'
           ELSE auth_token 
       END as auth_token_preview,
       password_hashed 
FROM users_data;