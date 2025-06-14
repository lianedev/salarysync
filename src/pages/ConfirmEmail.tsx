
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  // Pre-populate email from signup process
  useEffect(() => {
    const signupEmail = sessionStorage.getItem('signup_email');
    if (signupEmail) {
      setEmail(signupEmail);
      // Clear it from session storage
      sessionStorage.removeItem('signup_email');
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
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
      console.log("Sending OTP to:", email);
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: email,
          type: otpSent ? 'resend' : 'signup'
        }
      });

      console.log("Send OTP response:", { data, error });

      if (error) {
        toast({
          title: "Failed to Send Code",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.success) {
        setOtpSent(true);
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the 6-digit verification code.",
        });
      } else {
        throw new Error(data?.error || "Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Unexpected error during OTP send:", error);
      toast({
        title: "Failed to Send Code",
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
      console.log("Verifying OTP:", { email, otp });
      
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email: email,
          otpCode: otp
        }
      });

      console.log("OTP verification response:", { data, error });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.success) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified successfully. Redirecting to dashboard...",
        });
        
        // Refresh the auth session to get the updated user
        await supabase.auth.refreshSession();
        
        // Small delay to show success message, then redirect
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(data?.error || "Verification failed");
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
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email to receive a 6-digit verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Code Sent!</h3>
                    <p className="text-sm text-green-800">
                      We've sent a 6-digit verification code to <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="otp">6-Digit Verification Code</Label>
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
                disabled={verifyingOtp || otp.length !== 6}
              >
                {verifyingOtp ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm"
                >
                  {loading ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </div>
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
