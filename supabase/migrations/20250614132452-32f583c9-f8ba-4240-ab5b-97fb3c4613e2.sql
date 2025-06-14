
-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  employee_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  house_allowance DECIMAL(10,2) NOT NULL DEFAULT 0,
  transport_allowance DECIMAL(10,2) NOT NULL DEFAULT 0,
  medical_allowance DECIMAL(10,2) NOT NULL DEFAULT 0,
  other_allowances DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own employees" 
  ON public.employees 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employees" 
  ON public.employees 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employees" 
  ON public.employees 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employees" 
  ON public.employees 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint for employee_id per user
CREATE UNIQUE INDEX employees_user_employee_id_key ON public.employees(user_id, employee_id);
