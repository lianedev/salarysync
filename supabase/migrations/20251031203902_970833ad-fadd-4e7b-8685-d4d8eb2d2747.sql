-- Drop the old authenticate_employee function
DROP FUNCTION IF EXISTS public.authenticate_employee(text, text);

-- Create table to track OTP rate limiting
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or email
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(identifier)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_identifier ON public.otp_rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_window ON public.otp_rate_limits(window_start);

-- Create table for employee JWT sessions
CREATE TABLE IF NOT EXISTS public.employee_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_accessed timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_employee_sessions_token ON public.employee_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_employee_sessions_employee ON public.employee_sessions(employee_id);

-- Function to generate secure random token
CREATE OR REPLACE FUNCTION public.generate_employee_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  token text;
BEGIN
  -- Generate a secure random token (32 bytes = 64 hex characters)
  token := encode(gen_random_bytes(32), 'hex');
  RETURN token;
END;
$$;

-- Updated authenticate_employee function to return JWT token
CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id text, emp_password text)
RETURNS TABLE(token text, employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    emp_record RECORD;
    session_token text;
    token_hash_value text;
BEGIN
    -- Find employee by employee_id and verify hashed password
    SELECT * INTO emp_record 
    FROM public.employees 
    WHERE employee_id = emp_id 
    AND public.verify_password(emp_password, COALESCE(password, ''));
    
    -- If employee found and password verified, create session
    IF FOUND THEN
        -- Generate secure token
        session_token := public.generate_employee_token();
        token_hash_value := encode(digest(session_token, 'sha256'), 'hex');
        
        -- Store session in database (expires in 8 hours)
        INSERT INTO public.employee_sessions (employee_id, token_hash, expires_at)
        VALUES (emp_record.id, token_hash_value, now() + interval '8 hours');
        
        -- Return token and sanitized employee data (without password)
        RETURN QUERY SELECT 
            session_token,
            row_to_json(t)
        FROM (
            SELECT 
                id, employee_id, first_name, last_name, email, phone_number, 
                position, department, basic_salary, house_allowance, 
                transport_allowance, medical_allowance, other_allowances,
                created_at, updated_at
            FROM public.employees 
            WHERE id = emp_record.id
        ) t;
    ELSE
        -- Return empty result if not found or password incorrect
        RETURN;
    END IF;
END;
$$;

-- Function to validate employee token and return employee data
CREATE OR REPLACE FUNCTION public.validate_employee_token(session_token text)
RETURNS TABLE(employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    token_hash_value text;
    session_record RECORD;
BEGIN
    -- Hash the provided token
    token_hash_value := encode(digest(session_token, 'sha256'), 'hex');
    
    -- Find valid session
    SELECT * INTO session_record
    FROM public.employee_sessions
    WHERE token_hash = token_hash_value
    AND expires_at > now();
    
    IF FOUND THEN
        -- Update last accessed time
        UPDATE public.employee_sessions
        SET last_accessed = now()
        WHERE id = session_record.id;
        
        -- Return employee data (without password)
        RETURN QUERY SELECT row_to_json(t)
        FROM (
            SELECT 
                id, employee_id, first_name, last_name, email, phone_number, 
                position, department, basic_salary, house_allowance, 
                transport_allowance, medical_allowance, other_allowances,
                created_at, updated_at
            FROM public.employees 
            WHERE id = session_record.employee_id
        ) t;
    ELSE
        -- Return empty if token invalid or expired
        RETURN;
    END IF;
END;
$$;

-- Function to logout employee (invalidate token)
CREATE OR REPLACE FUNCTION public.logout_employee_token(session_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    token_hash_value text;
BEGIN
    token_hash_value := encode(digest(session_token, 'sha256'), 'hex');
    
    DELETE FROM public.employee_sessions
    WHERE token_hash = token_hash_value;
    
    RETURN FOUND;
END;
$$;