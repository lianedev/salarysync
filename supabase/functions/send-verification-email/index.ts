
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendVerificationRequest {
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
    const { email, password, companyName, phoneNumber }: SendVerificationRequest = await req.json();
    console.log(`Creating user and sending verification email to: ${email}`);

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get the origin from the request to determine the correct redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://testpayrol.netlify.app';
    const redirectUrl = `${origin}/`;

    console.log(`Using redirect URL: ${redirectUrl}`);

    // Create user with email confirmation required
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: false, // Require email confirmation
      user_metadata: {
        company_name: companyName,
        phone_number: phoneNumber,
      },
      // Set the email redirect URL
      email_redirect_to: redirectUrl
    });

    if (authError) {
      console.error('Error creating user:', authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    console.log('User created successfully, verification email sent automatically');

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent successfully",
      user: authData.user
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
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
