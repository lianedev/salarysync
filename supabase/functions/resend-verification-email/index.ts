
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendVerificationRequest {
  email: string;
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
    const { email }: ResendVerificationRequest = await req.json();
    console.log(`Resending verification email to: ${email}`);

    if (!email) {
      throw new Error('Email is required');
    }

    // Get the origin from the request to determine the correct redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://testpayrol.netlify.app';
    const redirectUrl = `${origin}/`;

    console.log(`Using redirect URL: ${redirectUrl}`);

    // Resend the verification email
    const { error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error resending verification email:', error);
      throw new Error(`Failed to resend verification email: ${error.message}`);
    }

    console.log('Verification email resent successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email resent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in resend-verification-email function:", error);
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
