-- Update the authenticate_employee function to use hashed passwords
CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id text, emp_password text)
RETURNS TABLE(employee_data json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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