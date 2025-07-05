
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Users, FileText, DollarSign, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleSignup = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (user) {
    const userData = {
      id: user.id,
      email: user.email || '',
      companyName: user.user_metadata?.company_name || 'Your Company',
      phoneNumber: user.user_metadata?.phone_number || '',
    };
    
    return <Dashboard user={userData} onLogout={handleLogout} />;
  }

  // Show landing page with auth forms if not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Navigation 
        onLoginClick={() => setShowSignup(false)}
        onSignupClick={() => setShowSignup(true)}
      />
      
      {/* Hero Section with Geometric Background */}
      <div className="relative overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              KRA Compliant & Secure
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Kenya's Premier
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Payroll Calculator
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline your payroll processing with precision. Calculate PAYE, NSSF, NHIF, and Housing Levy 
              with complete accuracy and regulatory compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => setShowSignup(true)}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowSignup(false)}
                className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left - Key Features */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Precise Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Automated PAYE, NSSF, NHIF & Housing Levy calculations following latest KRA guidelines.</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Team Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Efficiently manage unlimited employees with detailed profiles and salary structures.</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Smart Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Generate comprehensive payroll reports and summaries for better financial planning.</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">100% Compliant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Stay compliant with the latest Kenyan tax regulations and statutory requirements.</p>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Indicators */}
              <Card className="border-0 bg-gradient-to-r from-blue-50 to-emerald-50 p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by 500+ Kenyan Businesses</h3>
                  <p className="text-gray-600">Join companies who've simplified their payroll processing</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                    <div className="text-gray-600">Accuracy Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">2hrs</div>
                    <div className="text-gray-600">Time Saved Weekly</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600">Support Available</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right - Auth Forms */}
            <div className="lg:col-span-1">
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm sticky top-8">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">
                    {showSignup ? "Create Your Account" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {showSignup ? "Start calculating payroll in minutes" : "Access your payroll dashboard"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  {showSignup ? (
                    <SignupForm 
                      onSignup={handleSignup}
                      onSwitchToLogin={() => setShowSignup(false)}
                    />
                  ) : (
                    <LoginForm 
                      onLogin={handleLogin}
                      onSwitchToSignup={() => setShowSignup(true)}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose Kenya Payroll Hub?</h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Clock, title: "Save Time", description: "Reduce payroll processing from hours to minutes" },
                { icon: CheckCircle, title: "Error-Free", description: "Eliminate manual calculation errors completely" },
                { icon: Shield, title: "Stay Compliant", description: "Always up-to-date with KRA regulations" },
                { icon: DollarSign, title: "Cost Effective", description: "More affordable than hiring payroll specialists" }
              ].map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
