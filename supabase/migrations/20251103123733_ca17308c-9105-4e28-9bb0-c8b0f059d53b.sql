-- Create a trigger function to automatically hash passwords
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

-- Create trigger for INSERT operations
CREATE TRIGGER hash_password_on_insert
  BEFORE INSERT ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_employee_password();

-- Create trigger for UPDATE operations
CREATE TRIGGER hash_password_on_update
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  WHEN (OLD.password IS DISTINCT FROM NEW.password)
  EXECUTE FUNCTION public.hash_employee_password();