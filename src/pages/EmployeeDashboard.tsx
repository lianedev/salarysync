import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Clock, Calendar, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    // Validate token and fetch employee data
    const validateSession = async () => {
      const token = localStorage.getItem('employee_token');
      if (!token) {
        navigate('/employee-login');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('validate_employee_token', {
          session_token: token
        });

        if (error || !data || data.length === 0) {
          // Invalid or expired token
          localStorage.removeItem('employee_token');
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate('/employee-login');
          return;
        }

        const employeeData = typeof data[0].employee_data === 'string'
          ? JSON.parse(data[0].employee_data)
          : data[0].employee_data;
        
        setEmployee(employeeData);
      } catch (error) {
        localStorage.removeItem('employee_token');
        navigate('/employee-login');
      }
    };

    validateSession();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('employee_token');
    if (token) {
      // Invalidate token on server
      await supabase.rpc('logout_employee_token', {
        session_token: token
      });
    }
    
    localStorage.removeItem('employee_token');
    setEmployee(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/employee-login');
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const totalSalary = (
    parseFloat(employee.basic_salary || 0) +
    parseFloat(employee.house_allowance || 0) +
    parseFloat(employee.transport_allowance || 0) +
    parseFloat(employee.medical_allowance || 0) +
    parseFloat(employee.other_allowances || 0)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {employee.first_name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Information */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg">{employee.first_name} {employee.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                <Badge variant="secondary">{employee.employee_id}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{employee.phone_number}</p>
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p className="text-lg font-semibold">{employee.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <Badge variant="outline">{employee.department}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Basic Salary</span>
                <span>${employee.basic_salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">House Allowance</span>
                <span>${employee.house_allowance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transport</span>
                <span>${employee.transport_allowance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Medical</span>
                <span>${employee.medical_allowance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Other</span>
                <span>${employee.other_allowances}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Salary</span>
                  <span>${totalSalary}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and actions available to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <span>Clock In/Out</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>View Schedule</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Pay Stubs</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <User className="h-6 w-6" />
                  <span>Update Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;