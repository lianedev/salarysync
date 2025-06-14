
-- Create a table to store OTP codes
CREATE TABLE public.email_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN NOT NULL DEFAULT false
);

-- Add Row Level Security
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to verify their own OTP
CREATE POLICY "Users can verify their own OTP" 
  ON public.email_verifications 
  FOR SELECT 
  USING (email = auth.jwt() ->> 'email' OR user_id = auth.uid());

-- Create policy for inserting OTP codes (public access needed for signup)
CREATE POLICY "Anyone can create OTP codes" 
  ON public.email_verifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for updating verification status
CREATE POLICY "Users can update their own verification" 
  ON public.email_verifications 
  FOR UPDATE 
  USING (email = auth.jwt() ->> 'email' OR user_id = auth.uid());
