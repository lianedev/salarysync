
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ConfirmEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already verified and redirect
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        setIsVerified(true);
        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully. Redirecting...",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    checkUserStatus();

    // Listen for auth state changes (email verification)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          setIsVerified(true);
          toast({
            title: "Email Verified!",
            description: "Your email has been verified successfully. Redirecting...",
          });
          
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="h-12 w-12 md:h-16 md:w-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {isVerified ? (
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
            ) : (
              <Mail className="h-6 w-6 md:h-8 md:w-8 text-white" />
            )}
          </div>
          <CardTitle className="text-xl md:text-2xl">
            {isVerified ? "Email Verified!" : "Check Your Email"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm md:text-base">
            {isVerified 
              ? "Your account has been verified successfully. You'll be redirected shortly."
              : "We've sent you a verification link. Click the link in your email to verify your account and complete registration."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1 text-sm md:text-base">Verification Email Sent!</h3>
                  <p className="text-xs md:text-sm text-blue-800">
                    Please check your email and click the verification link to complete your account setup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1 text-sm md:text-base">Account Verified!</h3>
                  <p className="text-xs md:text-sm text-green-800">
                    Your account has been successfully verified. Redirecting to home page...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-xs md:text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
