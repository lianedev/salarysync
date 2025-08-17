-- Add password field to employees table for employee authentication
ALTER TABLE public.employees 
ADD COLUMN password TEXT;

-- Create index on employee_id for faster lookups during login
CREATE INDEX idx_employees_employee_id ON public.employees(employee_id);

-- Create a function to handle employee authentication
CREATE OR REPLACE FUNCTION public.authenticate_employee(emp_id TEXT, emp_password TEXT)
RETURNS TABLE(employee_data JSON)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create RLS policy to allow employees to authenticate
CREATE POLICY "Allow employee authentication" 
ON public.employees 
FOR SELECT 
USING (true);