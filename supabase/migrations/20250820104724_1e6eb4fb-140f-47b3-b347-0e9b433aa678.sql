-- Hash existing plaintext passwords (only affects passwords that aren't already hashed)
-- Hashed passwords are typically much longer than plaintext ones
UPDATE public.employees 
SET password = public.hash_password(COALESCE(password, 'temp123'))
WHERE password IS NULL OR length(password) < 50;