-- Fix foreign key constraint to allow user deletion with cascade
-- Drop the existing foreign key constraint
ALTER TABLE public.employees 
DROP CONSTRAINT IF EXISTS employees_user_id_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.employees 
ADD CONSTRAINT employees_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Also fix other tables with user_id
ALTER TABLE public.time_entries 
DROP CONSTRAINT IF EXISTS time_entries_user_id_fkey;

ALTER TABLE public.time_entries 
ADD CONSTRAINT time_entries_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE public.leave_requests 
DROP CONSTRAINT IF EXISTS leave_requests_user_id_fkey;

ALTER TABLE public.leave_requests 
ADD CONSTRAINT leave_requests_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;