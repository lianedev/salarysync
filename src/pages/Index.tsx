
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Users, FileText, DollarSign } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('payroll_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('payroll_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('payroll_user');
    localStorage.removeItem('employees');
  };

  if (isLoggedIn) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Kenya Payroll Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your payroll processing with accurate PAYE, NSSF, NHIF, and Housing Levy calculations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Features */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-4">
                  <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Accurate Calculations</h3>
                  <p className="text-sm text-gray-600">PAYE, NSSF, NHIF & Housing Levy</p>
                </Card>
                <Card className="text-center p-4">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Employee Management</h3>
                  <p className="text-sm text-gray-600">Add and manage your staff</p>
                </Card>
                <Card className="text-center p-4">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Detailed Reports</h3>
                  <p className="text-sm text-gray-600">Comprehensive payroll reports</p>
                </Card>
                <Card className="text-center p-4">
                  <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">KRA Compliant</h3>
                  <p className="text-sm text-gray-600">Following latest tax regulations</p>
                </Card>
              </div>
            </div>

            {/* Auth Forms */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              {showSignup ? (
                <SignupForm 
                  onSignup={handleLogin}
                  onSwitchToLogin={() => setShowSignup(false)}
                />
              ) : (
                <LoginForm 
                  onLogin={handleLogin}
                  onSwitchToSignup={() => setShowSignup(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
