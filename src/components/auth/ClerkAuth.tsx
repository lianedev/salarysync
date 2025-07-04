
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClerkAuth = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">
          {showSignUp ? "Create Your Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {showSignUp ? "Start calculating payroll in minutes" : "Access your payroll dashboard"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <SignedOut>
          {showSignUp ? (
            <div className="space-y-4">
              <SignUp 
                fallbackRedirectUrl="/"
                signInUrl="#"
                afterSignUpUrl="/"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <SignIn 
                fallbackRedirectUrl="/"
                signUpUrl="#"
                afterSignInUrl="/"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          )}
        </SignedOut>
        <SignedIn>
          <div className="text-center">
            <p className="text-gray-600 mb-4">You are signed in!</p>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </CardContent>
    </Card>
  );
};

export default ClerkAuth;
