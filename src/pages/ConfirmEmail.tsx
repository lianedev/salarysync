
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting to resend confirmation email to:", email);
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      console.log("Resend response:", { data, error });

      if (error) {
        toast({
          title: "Resend Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResent(true);
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your email for the confirmation link and 6-digit code.",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error during resend:", error);
      toast({
        title: "Resend Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      toast({
        title: "Missing Information",
        description: "Please enter both your email and the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setVerifyingOtp(true);

    try {
      console.log("Attempting to verify OTP:", { email, otp });
      
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup'
      });

      console.log("OTP verification response:", { data, error });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Confirmed!",
          description: "Your account has been verified successfully.",
        });
        // Redirect to dashboard or home page
        navigate("/");
      }
    } catch (error: any) {
      console.error("Unexpected error during OTP verification:", error);
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setVerifyingOtp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Confirm Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a confirmation link and 6-digit code to your email. Use either method to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Two Ways to Confirm:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Click the confirmation link in your email, OR</li>
              <li>Enter the 6-digit code below</li>
            </ol>
          </div>

          {/* OTP Verification Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-for-otp">Email Address</Label>
              <Input
                id="email-for-otp"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="otp">6-Digit Code</Label>
              <div className="flex justify-center mt-2">
                <InputOTP
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button 
              onClick={handleVerifyOtp} 
              className="w-full" 
              disabled={verifyingOtp || !email || otp.length !== 6}
            >
              {verifyingOtp ? "Verifying..." : "Verify Code"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or resend email
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the email? Check your spam folder or resend it below.
            </p>
          </div>

          {resent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Email Sent!</h3>
              <p className="text-sm text-green-700">
                A new confirmation email has been sent to {email}. 
                Please check your inbox and spam folder.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setResent(false)}
              >
                Send Another Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResendConfirmation} className="space-y-4">
              <Button type="submit" className="w-full" disabled={loading} variant="outline">
                {loading ? "Sending..." : "Resend Confirmation Email"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
