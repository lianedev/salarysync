
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
  onSignup: (user: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSignup, onSwitchToLogin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // First, send OTP email using our custom function
      console.log("Sending OTP email for signup:", formData.email);
      
      const { data: otpData, error: otpError } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: formData.email,
          type: 'signup'
        }
      });

      console.log("OTP email response:", { otpData, otpError });

      if (otpError) {
        toast({
          title: "Failed to Send Verification Code",
          description: otpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!otpData?.success) {
        toast({
          title: "Failed to Send Verification Code",
          description: otpData?.error || "Unknown error occurred",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store signup data temporarily for after verification
      sessionStorage.setItem('pending_signup', JSON.stringify({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,
      }));

      toast({
        title: "Verification Code Sent",
        description: `Please check your email for the 6-digit verification code to complete registration.`,
      });
      
      // Store email for the verification page
      sessionStorage.setItem('signup_email', formData.email);
      navigate("/confirm-email");

    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>Start managing your payroll today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending Verification Code..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
