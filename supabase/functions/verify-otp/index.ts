
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otpCode }: VerifyOTPRequest = await req.json();
    console.log(`Verifying OTP for email: ${email}, code: ${otpCode}`);

    if (!email || !otpCode) {
      throw new Error('Email and OTP code are required');
    }

    // Find the OTP record
    const { data: otpRecord, error: findError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !otpRecord) {
      console.error('OTP verification failed:', findError);
      throw new Error('Invalid or expired OTP code');
    }

    console.log('Found valid OTP record:', otpRecord);

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP record:', updateError);
      throw new Error('Failed to verify OTP');
    }

    // Create or confirm user in Supabase Auth
    let authResult;
    
    // Try to find existing user first
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === email);

    if (existingUser && !existingUser.email_confirmed_at) {
      // Confirm existing unconfirmed user
      const { data: confirmData, error: confirmError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { email_confirm: true }
      );
      
      if (confirmError) {
        console.error('Error confirming user:', confirmError);
        throw new Error('Failed to confirm user');
      }
      
      authResult = confirmData;
      console.log('User confirmed successfully');
    } else if (!existingUser) {
      // This shouldn't happen in normal flow, but handle it gracefully
      throw new Error('User not found. Please sign up first.');
    } else {
      // User already confirmed
      authResult = { user: existingUser };
      console.log('User already confirmed');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email verified successfully",
      user: authResult.user 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
