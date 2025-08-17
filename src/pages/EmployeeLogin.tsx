import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EmployeeLoginForm from "@/components/auth/EmployeeLoginForm";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Check if employee is already logged in
    const savedEmployee = localStorage.getItem('employee_session');
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
      navigate('/employee-dashboard');
    }
  }, [navigate]);

  const handleEmployeeLogin = (employeeData: any) => {
    setEmployee(employeeData);
    // Store employee session in localStorage
    localStorage.setItem('employee_session', JSON.stringify(employeeData));
    // Navigate to employee dashboard
    navigate('/employee-dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div
  className="min-h-screen bg-[url('https://images.pexels.com/photos/225502/pexels-photo-225502.jpeg')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className=" text-3xl font-bold tracking-tight bg-gradient-to-r from-[hsl(250,92%,60%)] to-[hsl(250,54%,54%)] bg-clip-text text-transparent">Employee Portal</h1>
          <p className="text-gray-200">Sign in with your employee credentials</p>
        </div>
        
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Employee Login</CardTitle>
            <CardDescription className="text-center">
              Enter your employee ID and assigned password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeLoginForm onLogin={handleEmployeeLogin} />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className=" bg-white text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;