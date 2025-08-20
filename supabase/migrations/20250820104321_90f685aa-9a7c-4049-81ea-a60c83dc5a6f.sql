-- Remove the overly permissive RLS policy that exposes all employee data
DROP POLICY IF EXISTS "Allow employee authentication" ON public.employees;

-- The existing "Users can view their own employees" policy will handle proper data isolation
-- No need to create new policies as the user-specific ones already exist