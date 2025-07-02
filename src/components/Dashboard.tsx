import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Users, Calculator, BarChart3, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import EmployeeList from "./EmployeeList";
import AddEmployeeModal from "./AddEmployeeModal";
import PayrollCalculator from "./PayrollCalculator";
import Analytics from "./Analytics";
import AttendanceTracking from "./AttendanceTracking";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: any) => {
    try {
      // Debug logging
      console.log('Current user:', user);
      console.log('Employee data being inserted:', employeeData);
      console.log('User ID being used:', user?.id);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      if (!session || !session.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add employees.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('employees')
        .insert([{
          user_id: session.user.id, // Use session.user.id instead of user.id
          employee_id: employeeData.employeeId,
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone_number: employeeData.phoneNumber,
          position: employeeData.position,
          department: employeeData.department,
          basic_salary: employeeData.basicSalary,
          house_allowance: employeeData.houseAllowance,
          transport_allowance: employeeData.transportAllowance,
          medical_allowance: employeeData.medicalAllowance,
          other_allowances: employeeData.otherAllowances,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding employee:', error);
        toast({
          title: "Error",
          description: `Failed to add employee: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match the expected format
      const transformedEmployee = {
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
        employeeId: data.employee_id,
        phoneNumber: data.phone_number,
        basicSalary: parseFloat(String(data.basic_salary || '0')),
        houseAllowance: parseFloat(String(data.house_allowance || '0')),
        transportAllowance: parseFloat(String(data.transport_allowance || '0')),
        medicalAllowance: parseFloat(String(data.medical_allowance || '0')),
        otherAllowances: parseFloat(String(data.other_allowances || '0')),
      };

      setEmployees(prev => [transformedEmployee, ...prev]);
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateEmployee = async (updatedEmployee: any) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          employee_id: updatedEmployee.employeeId,
          first_name: updatedEmployee.firstName,
          last_name: updatedEmployee.lastName,
          email: updatedEmployee.email,
          phone_number: updatedEmployee.phoneNumber,
          position: updatedEmployee.position,
          department: updatedEmployee.department,
          basic_salary: updatedEmployee.basicSalary,
          house_allowance: updatedEmployee.houseAllowance,
          transport_allowance: updatedEmployee.transportAllowance,
          medical_allowance: updatedEmployee.medicalAllowance,
          other_allowances: updatedEmployee.otherAllowances,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedEmployee.id);

      if (error) {
        console.error('Error updating employee:', error);
        toast({
          title: "Error",
          description: "Failed to update employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(prev => prev.map((emp: any) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      toast({
        title: "Success",
        description: "Employee updated successfully!",
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(prev => prev.filter((emp: any) => emp.id !== employeeId));
      toast({
        title: "Success",
        description: "Employee deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Transform database employees to match expected format
  const transformedEmployees = employees.map((emp: any) => ({
    ...emp,
    firstName: emp.first_name || emp.firstName,
    lastName: emp.last_name || emp.lastName,
    employeeId: emp.employee_id || emp.employeeId,
    phoneNumber: emp.phone_number || emp.phoneNumber,
    basicSalary: parseFloat(String(emp.basic_salary || emp.basicSalary || '0')),
    houseAllowance: parseFloat(String(emp.house_allowance || emp.houseAllowance || '0')),
    transportAllowance: parseFloat(String(emp.transport_allowance || emp.transportAllowance || '0')),
    medicalAllowance: parseFloat(String(emp.medical_allowance || emp.medicalAllowance || '0')),
    otherAllowances: parseFloat(String(emp.other_allowances || emp.otherAllowances || '0')),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SalarySync
              </h1>
              <p className="text-gray-600">Welcome back, {user.companyName}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-1 py-8 ">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{transformedEmployees.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active employees in your system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gross Salary</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    KSh {transformedEmployees.reduce((total: number, emp: any) => total + (emp.basicSalary || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Combined basic salaries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Company</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.companyName}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered company
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <AddEmployeeModal onAddEmployee={addEmployee} />
                <Button onClick={() => setActiveTab("calculator")} variant="outline" className="flex items-center gap-1">
                  <Calculator className="p-0.5" />
                  Calculate Payroll
                </Button>
                <Button onClick={() => setActiveTab("analytics")} variant="outline" className="flex items-center gap-1">
                  <BarChart3 className="p-0.5" />
                  View Analytics
                </Button>
                <Button onClick={() => setActiveTab("attendance")} variant="outline" className="flex items-center gap-1">
                  <Clock className="p-0.5" />
                  Track Attendance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p>Loading employees...</p>
                </CardContent>
              </Card>
            ) : (
              <EmployeeList 
                employees={transformedEmployees}
                onUpdateEmployee={updateEmployee}
                onDeleteEmployee={deleteEmployee}
              />
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <PayrollCalculator 
              employees={transformedEmployees} 
              onSwitchToAddEmployee={() => {}} // No longer needed since we use modal
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics employees={transformedEmployees} />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracking employees={transformedEmployees} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
