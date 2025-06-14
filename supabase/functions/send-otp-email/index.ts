
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  type: 'signup' | 'resend';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type }: SendOTPRequest = await req.json();
    console.log(`Sending OTP email to: ${email}, type: ${type}`);

    if (!email) {
      throw new Error('Email is required');
    }

    // Generate 6-digit OTP
    const otpCode = generateOTP();
    console.log(`Generated OTP: ${otpCode} for email: ${email}`);

    // Store OTP in database
    const { data: otpData, error: otpError } = await supabase
      .from('email_verifications')
      .insert({
        email: email,
        otp_code: otpCode,
        verified: false
      })
      .select()
      .single();

    if (otpError) {
      console.error('Error storing OTP:', otpError);
      throw new Error(`Failed to store OTP: ${otpError.message}`);
    }

    console.log('OTP stored successfully:', otpData);

    // Send email with OTP
    const emailResponse = await resend.emails.send({
      from: "Kenya Payroll Hub <onboarding@resend.dev>",
      to: [email],
      subject: "Your Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Kenya Payroll Hub</h1>
            <h2 style="color: #374151; margin-bottom: 20px;">Email Verification</h2>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Your verification code is:
            </p>
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 8px;">
              ${otpCode}
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you didn't request this verification code, please ignore this email.</p>
            <p style="margin-top: 20px;">
              <strong>Kenya Payroll Hub</strong><br>
              Streamline your payroll processing with precision.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP sent successfully",
      otpId: otpData.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
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
