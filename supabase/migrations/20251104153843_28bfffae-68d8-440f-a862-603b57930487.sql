-- First, let's check and recreate the triggers to ensure they're working
DROP TRIGGER IF EXISTS hash_password_on_insert ON public.employees;
DROP TRIGGER IF EXISTS hash_password_on_update ON public.employees;

-- Recreate the trigger function with better logging
CREATE OR REPLACE FUNCTION public.hash_employee_password()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only hash if password is provided and not already hashed
  -- Bcrypt hashes are always 60 characters long
  IF NEW.password IS NOT NULL AND LENGTH(NEW.password) < 60 THEN
    NEW.password := public.hash_password(NEW.password);
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER hash_password_on_insert
  BEFORE INSERT ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_employee_password();

CREATE TRIGGER hash_password_on_update
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  WHEN (OLD.password IS DISTINCT FROM NEW.password)
  EXECUTE FUNCTION public.hash_employee_password();

-- Now hash the unhashed password for the existing employee
UPDATE public.employees 
SET password = public.hash_password(password)
WHERE password IS NOT NULL 
  AND LENGTH(password) < 60;