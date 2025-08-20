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

-- Update the authenticate_employee function to use hashed passwords
CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id text, emp_password text)
RETURNS TABLE(employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    emp_record RECORD;
BEGIN
    -- Find employee by employee_id and verify hashed password
    SELECT * INTO emp_record 
    FROM public.employees 
    WHERE employee_id = emp_id 
    AND public.verify_password(emp_password, COALESCE(password, ''));
    
    -- If employee found and password verified, return their data (without password)
    IF FOUND THEN
        -- Remove password from the returned data for security
        SELECT 
            id, employee_id, first_name, last_name, email, phone_number, 
            position, department, basic_salary, house_allowance, 
            transport_allowance, medical_allowance, other_allowances,
            created_at, updated_at
        INTO emp_record
        FROM public.employees 
        WHERE employee_id = emp_id;
        
        RETURN QUERY SELECT row_to_json(emp_record);
    ELSE
        -- Return empty result if not found or password incorrect
        RETURN;
    END IF;
END;
$function$

-- Hash existing plaintext passwords (this will only affect passwords that aren't already hashed)
UPDATE public.employees 
SET password = public.hash_password(COALESCE(password, 'temp123'))
WHERE password IS NULL OR length(password) < 50; -- Assume hashed passwords are longer than 50 chars

-- Update default password for new employees to be hashed
ALTER TABLE public.employees 
ALTER COLUMN password SET DEFAULT public.hash_password('temp123');