-- Fix security issue: set search_path in the authentication function
CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id TEXT, emp_password TEXT)
RETURNS TABLE(employee_data JSON)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    emp_record RECORD;
BEGIN
    -- Find employee by employee_id and password
    SELECT * INTO emp_record 
    FROM public.employees 
    WHERE employee_id = emp_id AND password = emp_password;
    
    -- If employee found, return their data
    IF FOUND THEN
        RETURN QUERY SELECT row_to_json(emp_record);
    ELSE
        -- Return empty result if not found
        RETURN;
    END IF;
END;
$$;