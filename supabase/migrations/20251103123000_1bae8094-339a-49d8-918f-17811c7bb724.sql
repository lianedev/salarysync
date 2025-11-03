-- Fix all functions to use pgcrypto functions from extensions schema
CREATE OR REPLACE FUNCTION public.hash_password(password_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN extensions.crypt(password_text, extensions.gen_salt('bf', 10));
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_password(password_text text, hashed_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN hashed_password = extensions.crypt(password_text, hashed_password);
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_employee_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  token text;
BEGIN
  token := encode(extensions.gen_random_bytes(32), 'hex');
  RETURN token;
END;
$$;

CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id text, emp_password text)
RETURNS TABLE(token text, employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    emp_record RECORD;
    session_token text;
    token_hash_value text;
BEGIN
    SELECT * INTO emp_record 
    FROM public.employees 
    WHERE employee_id = emp_id 
      AND public.verify_password(emp_password, COALESCE(password, ''));

    IF FOUND THEN
        session_token := public.generate_employee_token();
        token_hash_value := encode(extensions.digest(session_token, 'sha256'), 'hex');

        INSERT INTO public.employee_sessions (employee_id, token_hash, expires_at)
        VALUES (emp_record.id, token_hash_value, now() + interval '8 hours');

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
        RETURN;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_employee_token(session_token text)
RETURNS TABLE(employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    token_hash_value text;
    session_record RECORD;
BEGIN
    token_hash_value := encode(extensions.digest(session_token, 'sha256'), 'hex');

    SELECT * INTO session_record
    FROM public.employee_sessions
    WHERE token_hash = token_hash_value
      AND expires_at > now();

    IF FOUND THEN
        UPDATE public.employee_sessions
        SET last_accessed = now()
        WHERE id = session_record.id;

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
        RETURN;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.logout_employee_token(session_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    token_hash_value text;
BEGIN
    token_hash_value := encode(extensions.digest(session_token, 'sha256'), 'hex');

    DELETE FROM public.employee_sessions
    WHERE token_hash = token_hash_value;

    RETURN FOUND;
END;
$$;

-- Now hash all existing plain-text passwords
UPDATE public.employees 
SET password = public.hash_password(password)
WHERE password IS NOT NULL 
  AND LENGTH(password) < 60;