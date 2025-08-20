-- Install pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a secure function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password_text, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password_text TEXT, hashed_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hashed_password = crypt(password_text, hashed_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;