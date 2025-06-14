
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompleteSignupRequest {
  email: string;
  password: string;
  companyName: string;
  phoneNumber: string;
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
    const { email, password, companyName, phoneNumber }: CompleteSignupRequest = await req.json();
    console.log(`Completing signup for: ${email}`);

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Create the user account (without email confirmation requirement)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Mark email as confirmed since we verified via OTP
      user_metadata: {
        company_name: companyName,
        phone_number: phoneNumber,
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    console.log('User created successfully:', authData.user?.id);

    // Mark the email verification as used/completed
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('email', email)
      .eq('verified', true); // Only update already verified records

    if (updateError) {
      console.warn('Warning: Could not update email verification record:', updateError);
      // Don't fail the signup if this fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account created successfully",
      user: authData.user
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in complete-signup function:", error);
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
