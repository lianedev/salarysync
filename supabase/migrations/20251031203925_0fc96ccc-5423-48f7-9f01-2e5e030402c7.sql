-- Enable RLS on new tables
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for otp_rate_limits (service role only, not accessible by users)
CREATE POLICY "Service role can manage rate limits"
ON public.otp_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS policies for employee_sessions (users should not access this directly)
CREATE POLICY "Service role can manage sessions"
ON public.employee_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);