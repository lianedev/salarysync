
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Users, FileText, DollarSign, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    // Check if we have auth tokens in the URL hash (from email confirmation)
    const handleAuthFromUrl = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Authentication Error",
          description: "There was an issue with your authentication. Please try logging in again.",
          variant: "destructive",
        });
      } else if (data.session) {
        console.log('User authenticated from URL:', data.session.user);
        setUser(data.session.user);
        toast({
          title: "Welcome!",
          description: "Your email has been verified and you've been logged in successfully.",
        });
      }
      
      setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome back!",
              description: "You've been logged in successfully.",
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Handle auth from URL or check existing session
    handleAuthFromUrl();

    return () => subscription.unsubscribe();
  }, []);

  // Clean up URL hash after processing auth tokens
  useEffect(() => {
    if (user && window.location.hash) {
      // Clean up the URL hash after successful authentication
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const handleLogin = (userData: any) => {
    console.log('Login handler called with:', userData);
    setUser(userData);
  };

  const handleSignup = (userData: any) => {
    console.log('Signup handler called with:', userData);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
        setUser(null);
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
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
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Navigation 
        onLoginClick={() => setShowSignup(false)}
        onSignupClick={() => setShowSignup(true)}
      />
      
      {/* Hero Section with Modern Background */}
      <div className="relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-60 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-32 w-56 h-56 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass mb-8 border">
              <Shield className="h-5 w-5 mr-3 text-primary" />
              <span className="text-primary font-semibold">KRA Compliant & Enterprise Secure</span>
            </div>
            
            <h1 className="text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-foreground">Kenya's Most</span>
              <br />
              <span className="gradient-text">Advanced Payroll</span>
              <br />
              <span className="text-foreground">Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your payroll operations with AI-powered precision. Calculate PAYE, NSSF, NHIF, 
              and Housing Levy with complete accuracy while ensuring regulatory compliance.
            </p>
            
            
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Left - Enhanced Features */}
            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              {/* Modern Features Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="card-modern glass border-border/50 group">
                  <CardHeader className="pb-6">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow transition-all duration-300" 
                         style={{ background: 'var(--gradient-primary)' }}>
                      <Calculator className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-card-foreground">AI-Powered Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Advanced algorithms ensure 99.9% accuracy in PAYE, NSSF, NHIF & Housing Levy calculations with real-time KRA updates.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-modern glass border-border/50 group">
                  <CardHeader className="pb-6">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow transition-all duration-300" 
                         style={{ background: 'var(--gradient-accent)' }}>
                      <Users className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-card-foreground">Smart Team Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Manage unlimited employees with intelligent profiles, automated salary structures, and real-time attendance tracking.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-modern glass border-border/50 group">
                  <CardHeader className="pb-6">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow transition-all duration-300" 
                         style={{ background: 'var(--gradient-primary)' }}>
                      <FileText className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-card-foreground">Intelligent Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Generate detailed insights with comprehensive reports, cost analysis, and predictive financial planning tools.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-modern glass border-border/50 group">
                  <CardHeader className="pb-6">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-glow transition-all duration-300" 
                         style={{ background: 'var(--gradient-accent)' }}>
                      <Shield className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl text-card-foreground">Enterprise Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Bank-grade encryption with automated compliance monitoring and real-time regulatory updates.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Trust Indicators */}
              <Card className="glass border-border/50 p-10" style={{ background: 'var(--gradient-accent)/10' }}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-card-foreground mb-3">Trusted by 1,000+ Companies</h3>
                  <p className="text-muted-foreground text-lg">Leading businesses choose our platform for mission-critical payroll</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">99.99%</div>
                    <div className="text-muted-foreground font-medium">Calculation Accuracy</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-accent">75%</div>
                    <div className="text-muted-foreground font-medium">Time Reduction</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-muted-foreground font-medium">Expert Support</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right - Modern Auth Card */}
            <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="sticky top-8">
                <Card className="glass border-border/50 shadow-[var(--shadow-elegant)]">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl text-card-foreground">
                      {showSignup ? "Join the Future" : "Welcome Back"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                      {showSignup ? "Transform your payroll in minutes" : "Access your intelligent dashboard"}
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
          </div>

          {/* Modern Benefits Section */}
          <div className="mt-32 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Industry Leaders Choose Us</h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
              Experience the next generation of payroll management with enterprise-grade features
            </p>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  icon: Clock, 
                  title: "10x Faster", 
                  description: "Process entire payroll in minutes, not hours",
                  gradient: "var(--gradient-primary)"
                },
                { 
                  icon: CheckCircle, 
                  title: "Zero Errors", 
                  description: "AI-verified calculations with audit trails",
                  gradient: "var(--gradient-accent)"
                },
                { 
                  icon: Shield, 
                  title: "Auto-Compliance", 
                  description: "Real-time KRA regulation updates",
                  gradient: "var(--gradient-primary)"
                },
                { 
                  icon: DollarSign, 
                  title: "Cost Savings", 
                  description: "Reduce payroll costs by up to 80%",
                  gradient: "var(--gradient-accent)"
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div 
                    className="h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:animate-glow transition-all duration-300"
                    style={{ background: benefit.gradient }}
                  >
                    <benefit.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Portal Section */}
          <div className="mt-32 animate-fade-in">
            <Card className="glass border-border/50 p-12 text-center max-w-4xl mx-auto" style={{ background: 'var(--gradient-primary)/5' }}>
              <div className="h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-8" 
                   style={{ background: 'var(--gradient-primary)' }}>
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-card-foreground mb-4">Employee Portal</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Access your personal dashboard to view salary details, download pay slips, and manage your profile.
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/employee-login'}
              >
                Employee Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
